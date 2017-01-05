import {OpaqueToken} from '@angular/core';
import {Injectable, NgZone} from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

// RxJS Operators used by the classes...
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {MediaChange} from './media-change';

/**
 * @internal
 * EventHandler callback with the mediaQuery [range] activates or deactivates
 */
export interface MediaQueryListListener {
  // Function with Window's MediaQueryList argument
  (mql: MediaQueryList): void;
}

/**
 * @internal
 * EventDispatcher for a specific mediaQuery [range]
 */
export interface MediaQueryList {
  readonly matches: boolean;
  readonly media: string;
  addListener(listener: MediaQueryListListener): void;
  removeListener(listener: MediaQueryListListener): void;
}

/**
 *  Opaque Token unique to the flex-layout library.
 *  Note: Developers must use this token when building their own custom
 *  `MatchMediaObservableProvider` provider.
 *
 *  @see ./providers/match-media-observable-provider.ts
 */
// tslint:disable-next-line:variable-name
export const MatchMediaObservable: OpaqueToken = new OpaqueToken('fxObservableMatchMedia');


/**
 * MediaMonitor configures listeners to mediaQuery changes and publishes an Observable facade to
 * convert mediaQuery change callbacks to subscriber notifications. These notifications will be
 * performed within the ng Zone to trigger change detections and component updates.
 *
 * NOTE: both mediaQuery activations and de-activations are announced in notifications
 */
@Injectable()
export class MatchMedia {
  protected _registry: Map<string, MediaQueryList>;
  protected _source: BehaviorSubject<MediaChange>;
  protected _observable$: Observable<MediaChange>;

  constructor(protected _zone: NgZone) {
    this._registry = new Map<string, MediaQueryList>();
    this._source = new BehaviorSubject<MediaChange>(new MediaChange(true));
    this._observable$ = this._source.asObservable();
  }

  /**
   * For the specified mediaQuery?
   */
  isActive(mediaQuery: string): boolean {
    if (this._registry.has(mediaQuery)) {
      let mql = this._registry.get(mediaQuery);
      return mql.matches;
    }
    return false;
  }

  /**
   * External observers can watch for all (or a specific) mql changes.
   * Typically used by the MediaQueryAdaptor; optionally available to components
   * who wish to use the MediaMonitor as mediaMonitor$ observable service.
   *
   * NOTE: if a mediaQuery is not specified, then ALL mediaQuery activations will
   *       be announced.
   */
  observe(mediaQuery?: string): Observable<MediaChange> {
    this.registerQuery(mediaQuery);

    return this._observable$.filter((change: MediaChange) => {
      return mediaQuery ? (change.mediaQuery === mediaQuery) : true;
    });
  }

  /**
   * Based on the BreakPointRegistry provider, register internal listeners for each unique
   * mediaQuery. Each listener emits specific MediaChange data to observers
   */
  registerQuery(mediaQuery: string) {
    if (mediaQuery) {
      let mql = this._registry.get(mediaQuery);
      let onMQLEvent = (e: MediaQueryList) => {
        this._zone.run(() => {
          let change = new MediaChange(e.matches, mediaQuery);
          this._source.next(change);
        });
      };

      if (!mql) {
        mql = this._buildMQL(mediaQuery);
        mql.addListener(onMQLEvent);
        this._registry.set(mediaQuery, mql);
      }

      if (mql.matches) {
        onMQLEvent(mql);  // Announce activate range for initial subscribers
      }
    }

  }

  /**
   * Call window.matchMedia() to build a MediaQueryList; which
   * supports 0..n listeners for activation/deactivation
   */
  protected  _buildMQL(query: string): MediaQueryList {
    prepareQueryCSS(query);

    let canListen = !!(<any>window).matchMedia('all').addListener;
    return canListen ? (<any>window).matchMedia(query) : <MediaQueryList>{
          matches: query === 'all' || query === '',
          media: query,
          addListener: () => {
          },
          removeListener: () => {
          }
        };
  }

}

/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
const ALL_STYLES = {};

/**
 * For Webkit engines that only trigger the MediaQueryListListener
 * when there is at least one CSS selector for the respective media query.
 *
 * @param query string The mediaQuery used to create a faux CSS selector
 *
 */
function prepareQueryCSS(query) {
  if (!ALL_STYLES[query]) {
    try {
      let style = document.createElement('style');

      style.setAttribute('type', 'text/css');
      if (!style['styleSheet']) {
        let cssText = `@media ${query} {.fx-query-test{ }}`;
        style.appendChild(document.createTextNode(cssText));
      }

      document.getElementsByTagName('head')[0].appendChild(style);

      // Store in private global registry
      ALL_STYLES[query] = style;

    } catch (e) {
      console.error(e);
    }
  }
}

