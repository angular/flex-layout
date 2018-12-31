/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

import {mergeAlias} from '../add-alias';
import {MediaChange} from '../media-change';
import {MatchMedia} from '../match-media/match-media';
import {PrintHook} from '../media-marshaller/print-hook';
import {BreakPointRegistry, OptionalBreakPoint} from '../breakpoints/break-point-registry';

/**
 * Class internalizes a MatchMedia service and exposes an Observable interface.

 * This exposes an Observable with a feature to subscribe to mediaQuery
 * changes and a validator method (`isActive(<alias>)`) to test if a mediaQuery (or alias) is
 * currently active.
 *
 * !! Only mediaChange activations (not de-activations) are announced by the MediaObserver
 *
 * This class uses the BreakPoint Registry to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and
 * those fields will be ''.
 *
 * !! This is not an actual Observable. It is a wrapper of an Observable used to publish additional
 * methods like `isActive(<alias>). To access the Observable and use RxJS operators, use
 * `.media$` with syntax like mediaObserver.asObservable().map(....).
 *
 *  @usage
 *
 *  // RxJS
 *  import { filter } from 'rxjs/operators';
 *  import { MediaObserver } from '@angular/flex-layout';
 *
 *  @Component({ ... })
 *  export class AppComponent {
 *    status: string = '';
 *
 *    constructor(media: MediaObserver) {
 *      const onChange = (change: MediaChange) => {
 *        this.status = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
 *      };
 *
 *      // Subscribe directly or access observable to use filter/map operators
 *      // e.g. media.asObservable().subscribe(onChange);
 *
 *      media.asObservable()
 *        .pipe(
 *          filter((change: MediaChange) => true)   // silly noop filter
 *        ).subscribe(onChange);
 *    }
 *  }
 */
@Injectable({providedIn: 'root'})
export class MediaObserver {
  /**
   * Whether to announce gt-<xxx> breakpoint activations
   */
  filterOverlaps = true;

  /**
   * @deprecated Use `asObservable()` instead.
   * @deletion-target v7.0.0-beta.23
   * @breaking-change 7.0.0-beta.23
   */
  get media$(): Observable<MediaChange> {
    return this._media$;
  }

  constructor(protected breakpoints: BreakPointRegistry,
      protected mediaWatcher: MatchMedia,
      protected hook: PrintHook) {
    this._media$ = this.watchActivations();
  }

  asObservable(): Observable<MediaChange> {
    return this._media$;
  }

  /**
   * Test if specified query/alias is active.
   */
  isActive(alias: string): boolean {
    return this.mediaWatcher.isActive(this.toMediaQuery(alias));
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
   * Prepare internal observable
   *
   * NOTE: the raw MediaChange events [from MatchMedia] do not
   *       contain important alias information; as such this info
   *       must be injected into the MediaChange
   */
  private buildObservable(mqList: string[]): Observable<MediaChange> {
    const locator = this.breakpoints;
    const onlyActivations = (change: MediaChange) => change.matches;
    const excludeUnknown = (change: MediaChange) => change.mediaQuery !== '';
    const excludeCustomPrints = (change: MediaChange) => !change.mediaQuery.startsWith('print');
    const excludeOverlaps = (change: MediaChange) => {
      const bp = locator.findByQuery(change.mediaQuery);
      return !bp ? true : !(this.filterOverlaps && bp.overlapping);
    };
    const replaceWithPrintAlias = (change: MediaChange) => {
      if (this.hook.isPrintEvent(change)) {
        // replace with aliased substitute (if configured)
        return this.hook.updateEvent(change);
      }
      let bp: OptionalBreakPoint = locator.findByQuery(change.mediaQuery);
      return mergeAlias(change, bp);
    };

    /**
     * Only pass/announce activations (not de-activations)
     *
     * Inject associated (if any) alias information into the MediaChange event
     * - Exclude mediaQuery activations for overlapping mQs. List bounded mQ ranges only
     * - Exclude print activations that do not have an associated mediaQuery
     */
    return this.mediaWatcher.observe(this.hook.withPrintQuery(mqList))
        .pipe(
            filter(onlyActivations),
            filter(excludeOverlaps),
            map(replaceWithPrintAlias),
            filter(excludeCustomPrints),
            filter(excludeUnknown)
        );
  }

  /**
   * Find associated breakpoint (if any)
   */
  private toMediaQuery(query: string) {
    const locator = this.breakpoints;
    const bp = locator.findByAlias(query) || locator.findByQuery(query);
    return bp ? bp.mediaQuery : query;
  }

  readonly _media$: Observable<MediaChange>;
}
