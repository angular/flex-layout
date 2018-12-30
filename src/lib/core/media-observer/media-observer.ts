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

import {BreakPointRegistry} from '../breakpoints/break-point-registry';
import {MediaChange} from '../media-change';
import {MatchMedia} from '../match-media/match-media';
import {mergeAlias} from '../add-alias';

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
 * `.media$` with syntax like mediaObserver.media$.map(....).
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
 *    constructor(mediaObserver: MediaObserver) {
 *      const onChange = (change: MediaChange) => {
 *        this.status = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
 *      };
 *
 *      // Subscribe directly or access observable to use filter/map operators
 *      // e.g. mediaObserver.media$.subscribe(onChange);
 *
 *      mediaObserver.media$()
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
  readonly media$: Observable<MediaChange>;

  constructor(private breakpoints: BreakPointRegistry, private mediaWatcher: MatchMedia) {
    this.media$ = this.watchActivations();
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
    const excludeOverlaps = (change: MediaChange) => {
      const bp = locator.findByQuery(change.mediaQuery);
      return !bp ? true : !(this.filterOverlaps && bp.overlapping);
    };

    /**
     * Only pass/announce activations (not de-activations)
     * Inject associated (if any) alias information into the MediaChange event
     * Exclude mediaQuery activations for overlapping mQs. List bounded mQ ranges only
     */
    return this.mediaWatcher.observe(mqList)
        .pipe(
            filter(change => change.matches),
            filter(excludeOverlaps),
            map((change: MediaChange) => {
              return mergeAlias(change, locator.findByQuery(change.mediaQuery));
            })
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
}
