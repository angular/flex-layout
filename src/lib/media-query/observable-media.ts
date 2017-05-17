/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Injectable} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';
import {Observable, Subscribable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import {BreakPointRegistry} from './breakpoints/break-point-registry';

import {MediaChange} from './media-change';
import {MatchMedia} from './match-media';
import {mergeAlias} from './../utils/add-alias';
import {BreakPoint} from './breakpoints/break-point';

/**
 * Base class for MediaService and pseudo-token for
 */
export abstract class ObservableMedia implements Subscribable<MediaChange> {
  abstract isActive(query: string): boolean;

  abstract asObservable(): Observable<MediaChange>;

  abstract subscribe(next?: (value: MediaChange) => void,
                     error?: (error: any) => void,
                     complete?: () => void): Subscription;
}

/**
 * Class internalizes a MatchMedia service and exposes an Subscribable and Observable interface.

 * This an Observable with that exposes a feature to subscribe to mediaQuery
 * changes and a validator method (`isActive(<alias>)`) to test if a mediaQuery (or alias) is
 * currently active.
 *
 * !! Only mediaChange activations (not de-activations) are announced by the ObservableMedia
 *
 * This class uses the BreakPoint Registry to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and
 * those fields will be ''.
 *
 * !! This is not an actual Observable. It is a wrapper of an Observable used to publish additional
 * methods like `isActive(<alias>). To access the Observable and use RxJS operators, use
 * `.asObservable()` with syntax like media.asObservable().map(....).
 *
 *  @usage
 *
 *  // RxJS
 *  import 'rxjs/add/operator/filter';
 *  import { ObservableMedia } from '@angular/flex-layout';
 *
 *  @Component({ ... })
 *  export class AppComponent {
 *    status : string = '';
 *
 *    constructor(  media:ObservableMedia ) {
 *      let onChange = (change:MediaChange) => {
 *        this.status = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
 *      };
 *
 *      // Subscribe directly or access observable to use filter/map operators
 *      // e.g.
 *      //      media.subscribe(onChange);
 *
 *      media.asObservable()
 *        .filter((change:MediaChange) => true)   // silly noop filter
 *        .subscribe(onChange);
 *    }
 *  }
 */
@Injectable()
export class MediaService implements ObservableMedia {

  /**
   * Should we announce gt-<xxx> breakpoint activations ?
   */
  public filterOverlaps = true;

  /**
   * Constructor
   */
  constructor(private matchMedia: MatchMedia,
              private breakpoints: BreakPointRegistry) {
    this.observable$ = this._buildObservable();
  }


  // ************************************************
  // Public Methods
  // ************************************************

  /**
   * Test if specified query/alias is active.
   */
  isActive(alias): boolean {
    return this.breakpoints.isActive(alias);
  };

  /**
   * Proxy to the Observable subscribe method
   */
  subscribe(next?: (value: MediaChange) => void,
            error?: (error: any) => void,
            complete?: () => void): Subscription {
    return this.observable$.subscribe(next, error, complete);
  };

  /**
   * Access to observable for use with operators like
   * .filter(), .map(), etc.
   */
  asObservable(): Observable<MediaChange> {
    return this.observable$;
  }

  // ************************************************
  // Internal Methods
  // ************************************************

  /**
   * Prepare internal observable
   * NOTE: the raw MediaChange events [from MatchMedia] do not contain important alias information
   * these must be injected into the MediaChange
   */
  private _buildObservable() {
    const self = this;
    // Only pass/announce activations (not de-activations)
    // Inject associated (if any) alias information into the MediaChange event
    // Exclude mediaQuery activations for overlapping mQs. List bounded mQ ranges only
    const activationsOnly = (change: MediaChange) => {
      return change.matches === true;
    };
    const addAliasInformation = (change: MediaChange) => {
      return mergeAlias(change, this.breakpoints.findByQuery(change.mediaQuery));
    };
    const excludeOverlaps = (change: MediaChange) => {
      let bp = this.breakpoints.findByQuery(change.mediaQuery);
      return !bp ? true : !(self.filterOverlaps && bp.overlapping);
    };

    return this.matchMedia.observe()
        .filter(activationsOnly)
        .map(addAliasInformation)
        .filter(excludeOverlaps);
  }



  private observable$: Observable<MediaChange>;
}


