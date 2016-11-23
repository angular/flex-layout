import {BreakPoints, BreakPoint} from "media-query/break-points";

export class MockMediaQueries {
  private _breakpoints : BreakPoints;
  private _registry : Map<string, MockMediaQueryList>;
  private _activeMQL  : MockMediaQueryList;
  private _matchMediaFn : (mediaQuery: string) => MediaQueryList;

  /**
   *
   */
  constructor(breakpoints:BreakPoints = null) {
    this._breakpoints = breakpoints;
    this._registry = new Map();
    this._matchMediaFn = window.matchMedia;

    window.matchMedia = this.matchMedia.bind(this);
  }

  /**
   *
   */
  init(breakpoints:BreakPoints) {
    this._breakpoints = breakpoints;
    breakpoints.registry.forEach( (bp:BreakPoint) => {
      this.matchMedia(bp.mediaQuery);
    });
    return this;
  }

  /**
   * Can only activate ranges registered with the BreakPoints list
   */
  activate(query:string):MockMediaQueryList {
    if ( !this._registry.has(query) ) {
      throw new Error(`Unknown mediaQuery: ${query}`);
    }

    let mql : MockMediaQueryList = this._registry.get(query);
    if ( mql ) {
      if ( this._activeMQL ) this._activeMQL.deactivate();
      this._activeMQL = mql.activate();
    }

    return this._activeMQL;
  }

  /**
   *
   */
  destroy() {
    window.matchMedia = this._matchMediaFn; // Restore original window API

    this._registry.forEach((mql:MockMediaQueryList, mediaQuery:string) => {
      mql.destroy();
    });
    this._registry.clear();
  }

  /**
   * Intercept window.matchMedia() in order to simulate mediaQuery change notifications
   */
  matchMedia(mediaQuery: string):MockMediaQueryList {
    let mql = this._registry.get(mediaQuery);
    if ( !mql ) {
      let breakpoint : BreakPoint = this._breakpoints.findByQuery(mediaQuery);
      if ( breakpoint ) {
        mql = new MockMediaQueryList(breakpoint);
        this._registry.set(mediaQuery, mql);
      }
    }
    return mql;
  }


}


export class MockMediaQueryList implements MediaQueryList {
  private _isActive : boolean = false;
  private _listeners : Array<MediaQueryListListener> = [ ];
  public  breakpoint : BreakPoint;

  get matches() : boolean { return this._isActive; }
  get media() : string { return this.breakpoint.mediaQuery; }

  /**
   *
   */
  constructor(breakpoint:BreakPoint|string) {
    let source : BreakPoint;
    if (typeof breakpoint == 'string') {
      source = {
        mediaQuery : <string> breakpoint,
        overlapping : false,
        suffix : '',
        alias : ''
      };
    }

    this.breakpoint = source || <BreakPoint> breakpoint;
  }

  /**
   *
   */
  destroy() {
    this.deactivate();

    this.breakpoint = null;
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
