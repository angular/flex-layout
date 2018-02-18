/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Inject, Injectable, NgZone, PLATFORM_ID} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {MatchMedia} from '../match-media';
import {BreakPointRegistry} from '../breakpoints/break-point-registry';

/**
 * MockMatchMedia mocks calls to the Window API matchMedia with a build of a simulated
 * MockMediaQueryListener. Methods are available to simulate an activation of a mediaQuery
 * range and to clearAll mediaQuery listeners.
 */
@Injectable()
export class MockMatchMedia extends MatchMedia {

  /** Special flag used to test BreakPoint registrations with MatchMedia */
  autoRegisterQueries = true;

  /**
   * Allow fallback to overlapping mediaQueries to determine
   * activatedInput(s).
   */
  useOverlaps = false;

  constructor(_zone: NgZone,
              @Inject(PLATFORM_ID) _platformId: Object,
              @Inject(DOCUMENT) _document: any,
              private _breakpoints: BreakPointRegistry) {
    super(_zone, _platformId, _document);
    this._actives = [];
  }

  /** Easy method to clear all listeners for all mediaQueries */
  clearAll() {
    this._registry.forEach((mql: MockMediaQueryList, _) => {
      mql.destroy();
    });
    this._registry.clear();
    this.useOverlaps = false;
  }

  /** Feature to support manual, simulated activation of a mediaQuery. */
  activate(mediaQuery: string, useOverlaps = false): boolean {
    useOverlaps = useOverlaps || this.useOverlaps;
    mediaQuery = this._validateQuery(mediaQuery);

    if (useOverlaps || !this.isActive(mediaQuery)) {
      this._deactivateAll();

      this._registerMediaQuery(mediaQuery);
      this._activateWithOverlaps(mediaQuery, useOverlaps);
    }

    return this.hasActivated;
  }

  /** Converts an optional mediaQuery alias to a specific, valid mediaQuery */
  _validateQuery(queryOrAlias) {
    let bp = this._breakpoints.findByAlias(queryOrAlias);
    if (bp) {
      queryOrAlias = bp.mediaQuery;
    }
    return queryOrAlias;
  }

  /**
   * Manually activate any overlapping mediaQueries to simulate
   * similar functionality in the window.matchMedia()
   */
  private _activateWithOverlaps(mediaQuery: string, useOverlaps: boolean): boolean {
    if (useOverlaps) {
      let bp = this._breakpoints.findByQuery(mediaQuery);
      let alias = bp ? bp.alias : 'unknown';

      // Simulate activation of overlapping lt-<XXX> ranges
      switch (alias) {
        case 'lg'   :
          this._activateByAlias('lt-xl');
          break;
        case 'md'   :
          this._activateByAlias('lt-xl, lt-lg');
          break;
        case 'sm'   :
          this._activateByAlias('lt-xl, lt-lg, lt-md');
          break;
        case 'xs'   :
          this._activateByAlias('lt-xl, lt-lg, lt-md, lt-sm');
          break;
      }

      // Simulate activate of overlapping gt-<xxxx> mediaQuery ranges
      switch (alias) {
        case 'xl'   :
          this._activateByAlias('gt-lg, gt-md, gt-sm, gt-xs');
          break;
        case 'lg'   :
          this._activateByAlias('gt-md, gt-sm, gt-xs');
          break;
        case 'md'   :
          this._activateByAlias('gt-sm, gt-xs');
          break;
        case 'sm'   :
          this._activateByAlias('gt-xs');
          break;
      }
    }
    // Activate last since the responsiveActivation is watching *this* mediaQuery
    return this._activateByQuery(mediaQuery);
  }

  /**
   *
   */
  private _activateByAlias(aliases) {
    let activate = (alias) => {
      let bp = this._breakpoints.findByAlias(alias);
      this._activateByQuery(bp ? bp.mediaQuery : alias);
    };
    aliases.split(',').forEach(alias => activate(alias.trim()));
  }

  /**
   *
   */
  private _activateByQuery(mediaQuery) {
    let mql = <MockMediaQueryList> this._registry.get(mediaQuery);
    let alreadyAdded = this._actives.reduce((found, it) => {
      return found || (mql && (it.media === mql.media));
    }, false);

    if (mql && !alreadyAdded) {
      this._actives.push(mql.activate());
    }
    return this.hasActivated;
  }

  /** Deactivate all current Mock MQLs */
  private _deactivateAll() {
    if (this._actives.length) {
      // Deactivate all current MQLs and reset the buffer
      for (const it of this._actives) {
        it.deactivate();
      }
      this._actives = [];
    }
    return this;
  }

  /** Insure the mediaQuery is registered with MatchMedia */
  private _registerMediaQuery(mediaQuery) {
    if (!this._registry.has(mediaQuery) && this.autoRegisterQueries) {
      this.registerQuery(mediaQuery);
    }
  }

  /**
   * Call window.matchMedia() to build a MediaQueryList; which
   * supports 0..n listeners for activation/deactivation
   */
  protected _buildMQL(query: string): MediaQueryList {
    return new MockMediaQueryList(query);
  }

  protected get hasActivated() {
    return (this._actives.length > 0);
  }

  private _actives: MockMediaQueryList[] = [];
}

/**
 * Special internal class to simulate a MediaQueryList and
 * - supports manual activation to simulate mediaQuery matching
 * - manages listeners
 */
export class MockMediaQueryList implements MediaQueryList {
  private _isActive = false;
  private _listeners: MediaQueryListListener[] = [];

  get matches(): boolean {
    return this._isActive;
  }

  get media(): string {
    return this._mediaQuery;
  }

  constructor(private _mediaQuery: string) {}

  /**
   * Destroy the current list by deactivating the
   * listeners and clearing the internal list
   */
  destroy() {
    this.deactivate();
    this._listeners = [];
  }

  /** Notify all listeners that 'matches === TRUE' */
  activate(): MockMediaQueryList {
    if (!this._isActive) {
      this._isActive = true;
      this._listeners.forEach((callback) => {
        callback(this);
      });
    }
    return this;
  }

  /** Notify all listeners that 'matches === false' */
  deactivate(): MockMediaQueryList {
    if (this._isActive) {
      this._isActive = false;
      this._listeners.forEach((callback) => {
        callback(this);
      });
    }
    return this;
  }

  /** Add a listener to our internal list to activate later */
  addListener(listener: MediaQueryListListener) {
    if (this._listeners.indexOf(listener) === -1) {
      this._listeners.push(listener);
    }
    if (this._isActive) {
      listener(this);
    }
  }

  /** Don't need to remove listeners in the testing environment */
  removeListener(_: MediaQueryListListener) {
  }
}

/**
 * Pre-configured provider for MockMatchMedia
 */
export const MockMatchMediaProvider = {  // tslint:disable-line:variable-name
  provide: MatchMedia,
  useClass: MockMatchMedia
};


