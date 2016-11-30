// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

import {BreakPoint, BreakPoints} from './break-points';
import {MediaQueryList, MediaQueryListFactory} from './media-query-factory';

// ****************************************************************
// Exported Types and Interfaces
// ****************************************************************

/**
 * Class instances emitted [to observers] for each mql notification
 */
export class MediaQueryChange {
  constructor(
      public matches: boolean,     // Is the mq currently activated
      public mqAlias: string,      // e.g.   gt-sm, md, gt-lg
      public suffix: string = '',  // e.g.   GtSM, Md, GtLg
      public mediaQuery: string = "all",    // e.g.   screen and (min-width: 600px) and (max-width: 959px)
      public value: string = '',    // @Input value associated for the current mq
      public property: string = undefined     // base property associated with the change
  ) {}
}

// ****************************************************************
// ****************************************************************

/**
 * MediaQueries configures listeners to mediaQuery changes and publishes an Observable facade to convert
 * mediaQuery change callbacks to subscriber notifications. These notifications will be performed within the
 * ng Zone to trigger change detections and component updates.
 */
@Injectable()
export class MediaQueries {
  private _mqls: any = {};
  private _breakpoints: BreakPoints;
  private _source: BehaviorSubject<MediaQueryChange>;
  private _announcer: Observable<MediaQueryChange>;
  private _runFn: (fn: () => any) => any;

  /**
   * Constructor
   */
  constructor(breakpoints: BreakPoints, zone?: NgZone) {
    this._breakpoints = breakpoints;
    this._source = new BehaviorSubject<MediaQueryChange>(new MediaQueryChange(true, ''));
    this._announcer = this._source.asObservable();

    this._configureZone(zone);
    this._prepareWatchers(breakpoints);
  }

  /**
   * Read-only accessor to the list of breakpoints configured in the BreakPoints provider
   */
  get breakpoints(): BreakPoint[] {
    return [...this._breakpoints.registry];
  }

  get activeOverlaps(): BreakPoint[] {
    let items: BreakPoint[] = this._breakpoints.overlappings.reverse();
    return items.filter((bp: BreakPoint) => {
      return this._mqls[bp.mediaQuery].matches;
    })
  }

  get active(): BreakPoint {
    let found = null, items = this.breakpoints.reverse();
    items.forEach(bp => {
      if (bp.alias !== '') {
        let mql = this._mqls[bp.mediaQuery];
        if (mql.matches && !found)
          found = bp;
      }
    });

    let first = this.breakpoints[0];
    return found || (this._mqls[first.mediaQuery].matches ? first : null);
  }

  /**
   * For the specified mediaQuery alias, is the mediaQuery range active?
   */
  isActive(alias: string): boolean {
    let bp = this._breakpoints.findByAlias(alias);
    if (bp) {
      let mql = this._mqls[bp.mediaQuery];
      if (mql.matches)
        return true;
    }
    return false;
  }

  /**
   * External observers can watch for all (or a specific) mql changes.
   * Typically used by the MediaQueryAdaptor; optionally available to components
   * who wish to use the MediaQueries as $mdMedia service
   */
  observe(alias?: string): Observable<MediaQueryChange> {
    return this._announcer.filter(e => {
      return !alias ? (e.matches === true) : (e.mqAlias === alias);
    });
  }

  /**
   * Prepare `run` function used to notify subscribers [about mediaQuery changes] and trigger
   * change detection.
   */
  private _configureZone(zone?: NgZone) {
    // Execute within ng2 zone from change detection, etc.
    this._runFn = (callback) => {
      if (zone) {
        zone.run(callback);
      }
      else {
        callback();
      }
    };
  }

  /**
   * Based on the BreakPoints provider, register internal listeners for the specified ranges
   */
  private _prepareWatchers(ranges: BreakPoints) {

    ranges.registry.forEach((it: BreakPoint) => {
      let mql = this._mqls[it.mediaQuery];
      if (!mql) {
        mql = MediaQueryListFactory.instanceOf((it.mediaQuery));

        // Each listener uses a shared eventHandler: which emits specific data to observers
        // Cache this permanent listener

        mql.addListener(this._onMQLEvent.bind(this, it));
        this._mqls[it.mediaQuery] = mql;

        if (mql.matches) {
          // Announce activate range for initial subscribers
          this._onMQLEvent(it, mql);
        }
      }
    });
  }

  /**
   * On each mlq event, emit a special MediaQueryChange to all subscribers
   */
  private _onMQLEvent(breakpoint: BreakPoint, mql: MediaQueryList) {

    this._runFn(() => {
      // console.log(`mq[ ${breakpoint.alias} ]: active = ${mql.matches}, mediaQuery = ${breakpoint.mediaQuery} `);
      let change = new MediaQueryChange(mql.matches, breakpoint.alias, breakpoint.suffix, breakpoint.mediaQuery);
      this._source.next(change);
    })
  }
}
