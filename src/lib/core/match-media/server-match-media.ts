/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, NgZone, PLATFORM_ID} from '@angular/core';

import {BreakPoint} from '../breakpoints/break-point';
import {MatchMedia} from './match-media';

/**
 * Special server-only class to simulate a MediaQueryList and
 * - supports manual activation to simulate mediaQuery matching
 * - manages listeners
 */
export class ServerMediaQueryList implements MediaQueryList {
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
  activate(): ServerMediaQueryList {
    if (!this._isActive) {
      this._isActive = true;
      this._listeners.forEach((callback) => {
        const cb: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) = callback!;
        cb.call(null, this);
      });
    }
    return this;
  }

  /** Notify all listeners that 'matches === false' */
  deactivate(): ServerMediaQueryList {
    if (this._isActive) {
      this._isActive = false;
      this._listeners.forEach((callback) => {
        const cb: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) = callback!;
        cb.call(null, this);
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
      const cb: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) = listener!;
      cb.call(null, this);
    }
  }

  /** Don't need to remove listeners in the server environment */
  removeListener(_: EventListenerOrEventListenerObject | null) {
  }

  addEventListener<K extends keyof
    MediaQueryListEventMap>(_: K,
                            __: (this: MediaQueryList,
                                 ev: MediaQueryListEventMap[K]) => any,
                            ___?: boolean | AddEventListenerOptions): void;
  addEventListener(_: string,
                   __: EventListenerOrEventListenerObject,
                   ___?: boolean | AddEventListenerOptions) {
  }

  removeEventListener<K extends keyof
    MediaQueryListEventMap>(_: K,
                            __: (this: MediaQueryList,
                                 ev: MediaQueryListEventMap[K]) => any,
                            ___?: boolean | EventListenerOptions): void;
  removeEventListener(_: string,
                      __: EventListenerOrEventListenerObject,
                      ___?: boolean | EventListenerOptions) {
  }

  dispatchEvent(_: Event): boolean {
    return false;
  }

  onchange: MediaQueryListListener = null;
}

/**
 * Special server-only implementation of MatchMedia that uses the above
 * ServerMediaQueryList as its internal representation
 *
 * Also contains methods to activate and deactivate breakpoints
 */
@Injectable()
export class ServerMatchMedia extends MatchMedia {
  protected _registry: Map<string, ServerMediaQueryList> = new Map();

  constructor(protected _zone: NgZone,
              @Inject(PLATFORM_ID) protected _platformId: Object,
              @Inject(DOCUMENT) protected _document: any) {
    super(_zone, _platformId, _document);
  }

  /** Activate the specified breakpoint if we're on the server, no-op otherwise */
  activateBreakpoint(bp: BreakPoint) {
    const lookupBreakpoint = this._registry.get(bp.mediaQuery);
    if (lookupBreakpoint) {
      lookupBreakpoint.activate();
    }
  }

  /** Deactivate the specified breakpoint if we're on the server, no-op otherwise */
  deactivateBreakpoint(bp: BreakPoint) {
    const lookupBreakpoint = this._registry.get(bp.mediaQuery);
    if (lookupBreakpoint) {
      lookupBreakpoint.deactivate();
    }
  }

  /**
   * Call window.matchMedia() to build a MediaQueryList; which
   * supports 0..n listeners for activation/deactivation
   */
  protected _buildMQL(query: string): ServerMediaQueryList {
    return new ServerMediaQueryList(query);
  }
}

type MediaQueryListListener = ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;
