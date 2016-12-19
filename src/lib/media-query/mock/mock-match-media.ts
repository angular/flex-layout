import {Injectable, NgZone} from '@angular/core';
import {MatchMedia} from '../match-media';
import {BreakPointRegistry} from '../breakpoints/break-point-registry';

/**
 * MockMatchMedia mocks calls to the Window API matchMedia with a build of a simulated
 * MockMediaQueryListener. Methods are available to simulate an activation of a mediaQuery
 * range and to clearAll mediaQuery listeners.
 */
@Injectable()
export class MockMatchMedia extends MatchMedia {

  constructor(_zone:NgZone, private _breakpoints:BreakPointRegistry ){
    super(_zone);
    this._actives = [ ];
  }

  /**
   * Easy method to clear all listeners for all mediaQueries
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
  activate(mediaQuery:string, useOverlaps:boolean = false):boolean {
    if ( !this.isActive(mediaQuery) ) {
      this._deactivateAll();

      this._registerMediaQuery(mediaQuery);
      this._activateWithOverlaps(mediaQuery, useOverlaps);
    }

    return this.hasActivated;
  }


  /**
   * Manually activate any overlapping mediaQueries to simulate
   * similar functionality in the window.matchMedia()
   *
   *   "md"    active == true
   *   "gt-sm" active == true
   *   "sm"    active == false
   *   "gt-xs" active == true
   *   "xs"    active == false
   *
   */
  private _activateWithOverlaps(mediaQuery:string, useOverlaps:boolean) {
    if ( useOverlaps) {
      let bp  = this._breakpoints.findByQuery(mediaQuery);
      switch( bp ? bp.alias : 'unknown') {
        case "xl" :   this._activateByAlias('gt-lg');
        case "lg" :   this._activateByAlias('gt-md');
        case "md" :   this._activateByAlias('gt-sm');
        case "sm" :   this._activateByAlias('gt-xs');   break;
        default   :   break;
      }
    }
    // Activate last since the responsiveActivation is watching *this* mediaQuery
    this._activateByQuery( mediaQuery );
  }

  /**
   *
   */
  private _activateByAlias( alias ) {
    let bp = this._breakpoints.findByAlias(alias);
    if ( bp ) {
      alias = bp.mediaQuery;
    }
    this._activateByQuery( alias );
  }

  /**
   *
   */
  private _activateByQuery(mediaQuery) {
    let mql = <MockMediaQueryList> this._registry.get(mediaQuery);
    if ( mql ) {
      this._actives.push( mql.activate() );
    }
    return this.hasActivated;
  }

  /**
   * Deactivate all current Mock MQLs
   */
  private _deactivateAll() {
    if ( this._actives.length ) {
      // Deactivate all current MQLs and reset the buffer
      this._actives.map( it => it.deactivate() );
      this._actives = [ ];
    }
    return this;
  }

  /**
   * Insure the mediaQuery is registered with MatchMedia
   */
  private _registerMediaQuery(mediaQuery) {
    if ( !this._registry.has(mediaQuery) ) {
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
    return (this._actives.length > 0)
  }

  private _actives : MockMediaQueryList[] = [ ];
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



