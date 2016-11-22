import {BreakPoints, BreakPoint} from "media-query/break-points";

export class MockMediaQueries {
  private _activeMQL  : MockMediaQueryList;
  private _matchMedia : Function;
  private _registry : Map<string, MockMediaQueryList>;

  /**
   *
   */
  constructor(private _breakpoints:BreakPoints) {
    this._matchMedia = window.matchMedia;
    this._registry = new Map();

    window.matchMedia = this.matchMedia.bind(this);
  }

  /**
   *
   */
  activate(query:string) {
    if ( this._registry.has(query) ){
      let mql : MockMediaQueryList = this._registry.get(query);
      if ( mql ) {
        if ( this._activeMQL ) this._activeMQL.deactivate();
        this._activeMQL = mql.activate();
      }
    }
  }

  /**
   *
   */
  destroy() {
    window.matchMedia = this._matchMedia;
    this._registry.forEach((mql:MockMediaQueryList, mediaQuery:string) => {
      mql.deactivate();
    });
    this._registry.clear();
  }

  /**
   * Intercept window.matchMedia() in order to simulate mediaQuery change notifications
   */
  matchMedia(mediaQuery: string) {
    let breakpoint : BreakPoint = this._breakpoints.findBreakpointBy(mediaQuery);
    let mql = new MockMediaQueryList(breakpoint);

    this._registry.set(mediaQuery, mql);
    return mql;
  }

}


class MockMediaQueryList implements MediaQueryList {
  private _isActive : boolean = false;
  private _listeners : Array<MediaQueryListListener> = [ ];

  get matches() : boolean { return this._isActive; }
  get media() : string { return this.breakpoint.mediaQuery; }

  /**
   *
   */
  constructor(public breakpoint:BreakPoint) { }

  /**
   *
   */
  activate():MockMediaQueryList {
    this._isActive = true;
    this._listeners.forEach((callback) => {
      callback(this);
    });

    return this;
  }

  /**
   *
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
