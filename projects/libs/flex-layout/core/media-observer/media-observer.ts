/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Injectable, OnDestroy} from '@angular/core';
import {Subject, asapScheduler, Observable, of} from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    switchMap,
    takeUntil,
} from 'rxjs/operators';

import {mergeAlias} from '../add-alias';
import {MediaChange} from '../media-change';
import {MatchMedia} from '../match-media/match-media';
import {PrintHook} from '../media-marshaller/print-hook';
import {BreakPointRegistry, OptionalBreakPoint} from '../breakpoints/break-point-registry';

import {sortDescendingPriority} from '../utils/sort';
import {coerceArray} from '../utils/array';


/**
 * MediaObserver enables applications to listen for 1..n mediaQuery activations and to determine
 * if a mediaQuery is currently activated.
 *
 * Since a breakpoint change will first deactivate 1...n mediaQueries and then possibly activate
 * 1..n mediaQueries, the MediaObserver will debounce notifications and report ALL *activations*
 * in 1 event notification. The reported activations will be sorted in descending priority order.
 *
 * This class uses the BreakPoint Registry to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and
 * those fields will be ''.
 *
 * Note: Developers should note that only mediaChange activations (not de-activations)
 *       are announced by the MediaObserver.
 *
 *  @usage
 *
 *  // RxJS
 *  import { filter } from 'rxjs/operators';
 *  import { MediaObserver } from 'ng-flex-layout';
 *
 *  @Component({ ... })
 *  export class AppComponent {
 *    status: string = '';
 *
 *    constructor(mediaObserver: MediaObserver) {
 *      const media$ = mediaObserver.asObservable().pipe(
 *        filter((changes: MediaChange[]) => true)   // silly noop filter
 *      );
 *
 *      media$.subscribe((changes: MediaChange[]) => {
 *        let status = '';
 *        changes.forEach( change => {
 *          status += `'${change.mqAlias}' = (${change.mediaQuery}) <br/>` ;
 *        });
 *        this.status = status;
 *     });
 *
 *    }
 *  }
 */
@Injectable({providedIn: 'root'})
export class MediaObserver implements OnDestroy {
    /** Filter MediaChange notifications for overlapping breakpoints */
    filterOverlaps = false;

    constructor(protected breakpoints: BreakPointRegistry,
        protected matchMedia: MatchMedia,
        protected hook: PrintHook) {
        this._media$ = this.watchActivations();
    }

    /**
   * Completes the active subject, signalling to all complete for all
   * MediaObserver subscribers
   */
    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    // ************************************************
    // Public Methods
    // ************************************************

    /**
   * Observe changes to current activation 'list'
   */
    asObservable(): Observable<MediaChange[]> {
        return this._media$;
    }

    /**
   * Allow programmatic query to determine if one or more media query/alias match
   * the current viewport size.
   * @param value One or more media queries (or aliases) to check.
   * @returns Whether any of the media queries match.
   */
    isActive(value: string | string[]): boolean {
        const aliases = splitQueries(coerceArray(value));
        return aliases.some(alias => {
            const query = toMediaQuery(alias, this.breakpoints);
            return query !== null && this.matchMedia.isActive(query);
        });
    }

    // ************************************************
    // Internal Methods
    // ************************************************

    /**
   * Register all the mediaQueries registered in the BreakPointRegistry
   * This is needed so subscribers can be auto-notified of all standard, registered
   * mediaQuery activations
   */
    private watchActivations() {
        const queries = this.breakpoints.items.map(bp => bp.mediaQuery);
        return this.buildObservable(queries);
    }

    /**
   * Only pass/announce activations (not de-activations)
   *
   * Since multiple-mediaQueries can be activation in a cycle,
   * gather all current activations into a single list of changes to observers
   *
   * Inject associated (if any) alias information into the MediaChange event
   * - Exclude mediaQuery activations for overlapping mQs. List bounded mQ ranges only
   * - Exclude print activations that do not have an associated mediaQuery
   *
   * NOTE: the raw MediaChange events [from MatchMedia] do not
   *       contain important alias information; as such this info
   *       must be injected into the MediaChange
   */
    private buildObservable(mqList: string[]): Observable<MediaChange[]> {
        const hasChanges = (changes: MediaChange[]) => {
            const isValidQuery = (change: MediaChange) => (change.mediaQuery.length > 0);
            return (changes.filter(isValidQuery).length > 0);
        };
        const excludeOverlaps = (changes: MediaChange[]) => {
            return !this.filterOverlaps ? changes : changes.filter(change => {
                const bp = this.breakpoints.findByQuery(change.mediaQuery);
                return bp?.overlapping ?? true;
            });
        };
        const ignoreDuplicates = (previous: MediaChange[], current: MediaChange[]): boolean => {
            if (previous.length !== current.length) {
                return false;
            }

            const previousMqs = previous.map(mc => mc.mediaQuery);
            const currentMqs = new Set(current.map(mc => mc.mediaQuery));
            const difference = new Set(previousMqs.filter(mq => !currentMqs.has(mq)));

            return difference.size === 0;
        };

        /**
     */
        return this.matchMedia
            .observe(this.hook.withPrintQuery(mqList))
            .pipe(
                filter((change: MediaChange) => change.matches),
                debounceTime(0, asapScheduler),
                switchMap(_ => of(this.findAllActivations())),
                map(excludeOverlaps),
                filter(hasChanges),
                distinctUntilChanged(ignoreDuplicates),
                takeUntil(this.destroyed$)
            );
    }

    /**
   * Find all current activations and prepare single list of activations
   * sorted by descending priority.
   */
    private findAllActivations(): MediaChange[] {
        const mergeMQAlias = (change: MediaChange) => {
            const bp: OptionalBreakPoint = this.breakpoints.findByQuery(change.mediaQuery);
            return mergeAlias(change, bp);
        };
        const replaceWithPrintAlias = (change: MediaChange) =>
            this.hook.isPrintEvent(change) ? this.hook.updateEvent(change) : change;

        return this.matchMedia
            .activations
            .map(query => new MediaChange(true, query))
            .map(replaceWithPrintAlias)
            .map(mergeMQAlias)
            .sort(sortDescendingPriority);
    }

    private readonly _media$: Observable<MediaChange[]>;
    private readonly destroyed$ = new Subject<void>();
}

/**
 * Find associated breakpoint (if any)
 */
function toMediaQuery(query: string, locator: BreakPointRegistry): string | null {
    const bp = locator.findByAlias(query) ?? locator.findByQuery(query);
    return bp?.mediaQuery ?? null;
}

/**
 * Split each query string into separate query strings if two queries are provided as comma
 * separated.
 */
function splitQueries(queries: string[]): string[] {
    return queries.flatMap(query => query.split(','))
        .map(query => query.trim());
}
