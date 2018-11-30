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

import {BreakPoint} from '../breakpoints/break-point';
import {BreakPointRegistry} from '../breakpoints/break-point-registry';
import {MatchMedia} from '../match-media/match-media';
import {MediaChange} from '../media-change';
import {mergeAlias} from '../add-alias';


/**
 * MediaMonitor uses the MatchMedia service to observe mediaQuery changes (both activations and
 * deactivations). These changes are are published as MediaChange notifications.
 *
 * Note: all notifications will be performed within the
 * ng Zone to trigger change detections and component updates.
 *
 * It is the MediaMonitor that:
 *  - auto registers all known breakpoints
 *  - injects alias information into each raw MediaChange event
 *  - provides accessor to the currently active BreakPoint
 *  - publish list of overlapping BreakPoint(s); used by ResponsiveActivation
 */
@Injectable({providedIn: 'root'})
export class MediaMonitor {
  constructor(private _breakpoints: BreakPointRegistry, private _matchMedia: MatchMedia) {
    this._registerBreakpoints();
  }

  /**
   * Read-only accessor to the list of breakpoints configured in the BreakPointRegistry provider
   */
  get breakpoints(): BreakPoint[] {
    return [...this._breakpoints.items];
  }

  get activeOverlaps(): BreakPoint[] {
    return this._breakpoints.overlappings
      .reverse()
      .filter(bp => this._matchMedia.isActive(bp.mediaQuery));
  }

  get active(): BreakPoint | null {
    const items = this.breakpoints.reverse();
    const first = items.find(bp => bp.alias !== '' && this._matchMedia.isActive(bp.mediaQuery));
    return first || null;
  }

  /**
   * For the specified mediaQuery alias, is the mediaQuery range active?
   */
  isActive(alias: string): boolean {
    const bp = this._breakpoints.findByAlias(alias) || this._breakpoints.findByQuery(alias);
    return this._matchMedia.isActive(bp ? bp.mediaQuery : alias);
  }

  /**
   * External observers can watch for all (or a specific) mql changes.
   * If specific breakpoint is observed, only return *activated* events
   * otherwise return all events for BOTH activated + deactivated changes.
   */
  observe(alias: string = ''): Observable<MediaChange> {
    const bp = this._breakpoints.findByAlias(alias) || this._breakpoints.findByQuery(alias);
    const hasAlias = (change: MediaChange) => (bp ? change.mqAlias !== '' : true);
    // Note: the raw MediaChange events [from MatchMedia] do not contain important alias information

    const media$ = this._matchMedia.observe(bp ? bp.mediaQuery : alias);
    return media$.pipe(
      map(change => mergeAlias(change, bp)),
      filter(hasAlias)
    );
  }

  /**
   * Immediate calls to matchMedia() to establish listeners
   * and prepare for immediate subscription notifications
   */
  private _registerBreakpoints() {
    const queries = this._breakpoints.sortedItems.map(bp => bp.mediaQuery);
    this._matchMedia.registerQuery(queries);
  }
}
