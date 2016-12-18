import {Injectable, NgZone} from '@angular/core';
import {MatchMedia} from '../match-media';

/**
 * MockMatchMedia mocks calls to the Window API matchMedia with a build of a simulated
 * MockMediaQueryListener. Methods are available to simulate an activation of a mediaQuery
 * range and to clearAll mediaQuery listeners.
 */
@Injectable()
export class MockMatchMedia extends MatchMedia {
  private _active : MockMediaQueryList;

  constructor(_zone:NgZone ){
    super(_zone);
  }

  /**
   * Easy method to clear all listeners for all mediaQuerys
   */
  clearAll() {
    this._registry.forEach((mql:MockMediaQueryList, mediaQuery:string) => {
      mql.destroy();
    });
    this._registry.clear();
  }

  /**
   * Feature to support manual, simulated activation of a mediaQuery.
   */
  activate(mediaQuery:string):boolean {
    if ( this._active ) this._active.deactivate();

    if ( !this._registry.has(mediaQuery) ) {
      this.registerQuery(mediaQuery);
    }

    let mql = <MockMediaQueryList> this._registry.get(mediaQuery);
    this._active = mql.activate();

    return  this._active.matches;
  }

  /**
   * Call window.matchMedia() to build a MediaQueryList; which
   * supports 0..n listeners for activation/deactivation
   */
  protected _buildMQL(query: string): MediaQueryList {
    return new MockMediaQueryList(query);
  }
}

/**
 * Special internal class to simulate a MediaQueryList and
 * - supports manual activation to simulate mediaQuery matching
 * - manages listeners
 */
export class MockMediaQueryList implements MediaQueryList {
  private _isActive : boolean = false;
  private _listeners : Array<MediaQueryListListener> = [ ];

  get matches() : boolean { return this._isActive; }
  get media() : string { return this._mediaQuery; }

  constructor(private _mediaQuery:string) { }

  /**
   *
   */
  destroy() {
    this.deactivate();
    this._listeners = [ ];
  }

  /**
   * Notify all listeners that 'matches === TRUE'
   */
  activate():MockMediaQueryList {
    this._isActive = true;
    this._listeners.forEach((callback) => {
      callback(this);
    });

    return this;
  }

  /**
   * Notify all listeners that 'matches === false'
   */
  deactivate():MockMediaQueryList {
    if ( this._isActive ) {
      this._isActive = false;
      this._listeners.forEach((callback) => {
        callback(this);
      });
    }
    return this;
  }

  /**
   *
   */
  addListener(listener: MediaQueryListListener) {
    if ( this._listeners.indexOf(listener) === -1 ) {
      this._listeners.push(listener);
    }
    if ( this._isActive ) listener(this);
  }

  removeListener(listener: MediaQueryListListener) {  }
}



