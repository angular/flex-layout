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
      public mediaQuery:string = "all",    // e.g.   screen and (min-width: 600px) and (max-width: 959px)
      public value: string = '',    // @Input value associated for the current mq
      public property: string = undefined     // base property associated with the change
      ) {}
}

// ****************************************************************
// ****************************************************************


@Injectable()
export class MediaQueries {
  private _mqls: any = {};
  private _breakpoints: BreakPoints;
  private _source: BehaviorSubject<MediaQueryChange>;
  private _announcer: Observable<MediaQueryChange>;

  /**
   * Constructor
   */
  constructor(breakpoints: BreakPoints, private _zone: NgZone) {
    this._breakpoints = breakpoints;
    this._source = new BehaviorSubject<MediaQueryChange>(new MediaQueryChange(true, ''));
    this._announcer = this._source.asObservable();

    this.prepareWatchers(breakpoints.registry);
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
   * use the MediaQueries as $mdMedia service
   */
  observe(alias?: string): Observable<MediaQueryChange> {
    return this._announcer.filter(e => {
      return !alias ? (e.matches === true) : (e.mqAlias === alias);
    });
  }

  /**
   * Based on the BreakPoints provider, register internal listeners for the specified ranges
   */
  private prepareWatchers(ranges: BreakPoint[]) {
    ranges.forEach((it: BreakPoint) => {
      let mql = this._mqls[it.mediaQuery];
      if (!mql) {
        mql = MediaQueryListFactory.instanceOf((it.mediaQuery));

        // Each listener uses a shared eventHandler: which emits specific data to observers
        // Cache this permanent listener

        mql.addListener(this.onMQLEvent.bind(this, it));
        this._mqls[it.mediaQuery] = mql;

        if (mql.matches) {
          // Announce activate range for initial subscribers
          this.onMQLEvent(it, mql);
        }
      }
    });
  }

  /**
   * On each mlq event, emit a special MediaQueryChange to all subscribers
   */
  private onMQLEvent(breakpoint: BreakPoint, mql: MediaQueryList) {
    // Execute within ng2 zone from change detection, etc.
    this._zone.run(() => {
      console.log(`mq[ ${breakpoint.alias} ]: active = ${mql.matches}, mediaQuery = ${breakpoint.mediaQuery} `);
      this._source.next(new MediaQueryChange(mql.matches, breakpoint.alias, breakpoint.suffix, breakpoint.mediaQuery));
    })
  }
}
