import {BreakPoints, BreakPoint} from "../break-points";

/**
 * MockMediaQueryActivator supports programmatic mediaQuery activation/deactivation to simulate viewport size changes
 * and intercepts the window API: `window.matchMedia()`.
 *
 * Instantiate this class in tests before testing any directives or media-queries dependent code.
 * Use the references to Breakpoints and the MockMediaQueryActivator instance to manually activate a mediaQuery.
 */
export class MockMediaQueryActivator {
  private _breakpoints : BreakPoints;
  private _registry : Map<string, MockMediaQueryList>;
  private _activeMQL : MockMediaQueryList;
  private _matchMediaFn : (mediaQuery: string) => MediaQueryList;

  /**
   *
   */
  constructor(breakpoints:BreakPoints = new BreakPoints()) {
    this._registry = new Map();
    this._interceptAPI();

    this.init( breakpoints );
  }

  /**
   * Support post construction initialization of custom BreakPoints
   */
  init(breakpoints:BreakPoints = new BreakPoints()) {
    this._breakpoints = breakpoints ;
    this._breakpoints.registry.forEach( (bp:BreakPoint) => {
      this.matchMedia(bp.mediaQuery);
    });

    return this;
  }

  /**
   * Can activate using a mediaQuery OR a breakpoint alias (xs, gt-xs, sm, gt-sm, etc.)
   * These are properties in the registered BreakPoints list
   */
  activate(query:string):MockMediaQueryList {
    let breakPoint = this._breakpoints.findByAlias(query);
    if ( breakPoint ) query = breakPoint.mediaQuery;

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
    (<any>window).matchMedia = this._matchMediaFn; // Restore original window API

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
      let breakpoint : BreakPoint = this._breakpoints ? this._breakpoints.findByQuery(mediaQuery)  : null;
      mql = new MockMediaQueryList(breakpoint || mediaQuery);
      this._registry.set(mediaQuery, mql);
    }
    return mql;
  }

  /**
   * Intercept the matchMedia() API call
   */
  private _interceptAPI() {
    this._matchMediaFn = (<any>window).matchMedia;
    (<any>window).matchMedia = this.matchMedia.bind(this);
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
