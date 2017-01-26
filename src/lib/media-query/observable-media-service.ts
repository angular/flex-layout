/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {OpaqueToken} from '@angular/core'; // tslint:disable-line:no-unused-variable

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
 *  Opaque Token unique to the flex-layout library.
 *  Note: Developers must use this token when building their own custom
 *  `ObservableMediaServiceProvider` provider.
 *
 *  @see ./providers/match-media-observable-provider.ts
 */
// tslint:disable-next-line:variable-name
export const ObservableMediaService: OpaqueToken = new OpaqueToken('flex-layout-media-service');


/**
 * Class internalizes a MatchMedia service and exposes an Subscribable and Observable interface.

 * This an Observable with that exposes a feature to subscribe to mediaQuery
 * changes and a validator method (`isActive(<alias>)`) to test if a mediaQuery (or alias) is
 * currently active.
 *
 * !! Only mediaChange activations (not de-activations) are announced by the ObservableMediaService
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
 *  import 'rxjs/add/operator/map';
 *
 *  @Component({ ... })
 *  export class AppComponent {
 *    constructor( @Inject(ObservableMediaService) media) {
 *      media.asObservable()
 *        .map( (change:MediaChange) => change.mqAlias == 'md' )
 *        .subscribe((change:MediaChange) => {
 *          console.log( change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "" );
 *        });
 *    }
 *  }
 */
export class MediaService implements Subscribable<MediaChange> {
  private observable$: Observable<MediaChange>;

  constructor(private mediaWatcher: MatchMedia,
              private breakpoints: BreakPointRegistry) {
    this._registerBreakPoints();
    this.observable$ = this._buildObservable();
  }

  /**
   * Test if specified query/alias is active.
   */
  isActive(alias): boolean {
    let query = this._toMediaQuery(alias);
    return this.mediaWatcher.isActive(query);
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
   * Register all the mediaQueries registered in the BreakPointRegistry
   * This is needed so subscribers can be auto-notified of all standard, registered
   * mediaQuery activations
   */
  private _registerBreakPoints() {
    this.breakpoints.items.forEach((bp: BreakPoint) => {
      this.mediaWatcher.registerQuery(bp.mediaQuery);
      return bp;
    });
  }

  /**
   * Prepare internal observable
   * NOTE: the raw MediaChange events [from MatchMedia] do not contain important alias information
   * these must be injected into the MediaChange
   */
  private _buildObservable() {
    return this.mediaWatcher.observe()
        .filter((change: MediaChange) => {
          // Only pass/announce activations (not de-activations)
          return change.matches === true;
        })
        .map((change: MediaChange) => {
          // Inject associated (if any) alias information into the MediaChange event
          return mergeAlias(change, this._findByQuery(change.mediaQuery));
        });
  }

  /**
   * Breakpoint locator by alias
   */
  private _findByAlias(alias) {
    return this.breakpoints.findByAlias(alias);
  };

  /**
   * Breakpoint locator by mediaQuery
   */
  private _findByQuery(query) {
    return this.breakpoints.findByQuery(query);
  };

  /**
   * Find associated breakpoint (if any)
   */
  private _toMediaQuery(query) {
    let bp: BreakPoint = this._findByAlias(query) || this._findByQuery(query);
    return bp ? bp.mediaQuery : query;
  };

}
