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
    this._registerBreakPoints();
    this.media$ = this._buildObservable();
  }

  /**
   * Test if specified query/alias is active.
   */
  isActive(alias: string): boolean {
    return this.mediaWatcher.isActive(this._toMediaQuery(alias));
  }

  // ************************************************
  // Internal Methods
  // ************************************************

  /**
   * Register all the mediaQueries registered in the BreakPointRegistry
   * This is needed so subscribers can be auto-notified of all standard, registered
   * mediaQuery activations
   */
  private _registerBreakPoints() {
    const queries = this.breakpoints.sortedItems.map(bp => bp.mediaQuery);
    this.mediaWatcher.registerQuery(queries);
  }

  /**
   * Prepare internal observable
   *
   * NOTE: the raw MediaChange events [from MatchMedia] do not
   *       contain important alias information; as such this info
   *       must be injected into the MediaChange
   */
  private _buildObservable() {
    const excludeOverlaps = (change: MediaChange) => {
      const bp = this.breakpoints.findByQuery(change.mediaQuery);
      return !bp ? true : !(this.filterOverlaps && bp.overlapping);
    };

    /**
     * Only pass/announce activations (not de-activations)
     * Inject associated (if any) alias information into the MediaChange event
     * Exclude mediaQuery activations for overlapping mQs. List bounded mQ ranges only
     */
    return this.mediaWatcher.observe()
      .pipe(
        filter(change => change.matches),
        filter(excludeOverlaps),
        map((change: MediaChange) =>
          mergeAlias(change, this._findByQuery(change.mediaQuery))
        )
      );
  }

  /**
   * Breakpoint locator by alias
   */
  private _findByAlias(alias: string) {
    return this.breakpoints.findByAlias(alias);
  }

  /**
   * Breakpoint locator by mediaQuery
   */
  private _findByQuery(query: string) {
    return this.breakpoints.findByQuery(query);
  }

  /**
   * Find associated breakpoint (if any)
   */
  private _toMediaQuery(query: string) {
    const bp = this._findByAlias(query) || this._findByQuery(query);
    return bp ? bp.mediaQuery : query;
  }
}
