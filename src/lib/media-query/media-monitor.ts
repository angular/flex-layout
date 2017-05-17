/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Injectable} from '@angular/core';

import {BreakPoint} from './breakpoints/break-point';
import {BreakPointRegistry} from './breakpoints/break-point-registry';
import {MatchMedia} from './match-media';
import {MediaChange} from './media-change';

import {mergeAlias} from '../utils/add-alias';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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
@Injectable()
export class MediaMonitor {
  constructor(private _breakpoints: BreakPointRegistry, private _matchMedia: MatchMedia) { }

  get breakpoints(): BreakPoint[] {
    return this._breakpoints.items;
  }

  get activeOverlaps(): BreakPoint[] {
    return this._breakpoints.activeOverlaps;
  }

  get active() : BreakPoint {
    return this._breakpoints.active;
  }

  isActive(alias: string): boolean {
    return this._breakpoints.isActive(alias);
  };

  /**
   * External observers can watch for all (or a specific) mql changes.
   * If specific breakpoint is observed, only return *activated* events
   * otherwise return all events for BOTH activated + deactivated changes.
   */
  observe(alias?: string): Observable<MediaChange> {
    let bp = this._breakpoints.findByAlias(alias) || this._breakpoints.findByQuery(alias);
    let hasAlias = (change: MediaChange) => (bp ? change.mqAlias !== "" : true);

    // Note: the raw MediaChange events [from MatchMedia] do not contain important alias information
    //       so these must be dynamically added...
    return this._matchMedia
        .observe(bp ? bp.mediaQuery : alias)
        .map(change => mergeAlias(change, bp))
        .filter(hasAlias);
  }

}
