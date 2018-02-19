/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Inject, Injectable, NgZone, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {filter} from 'rxjs/operators/filter';

import {MediaChange} from './media-change';

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

  constructor(protected _zone: NgZone,
              @Inject(PLATFORM_ID) protected _platformId: Object,
              @Inject(DOCUMENT) protected _document: any) {
    this._registry = new Map<string, MediaQueryList>();
    this._source = new BehaviorSubject<MediaChange>(new MediaChange(true));
    this._observable$ = this._source.asObservable();
  }

  /**
   * For the specified mediaQuery?
   */
  isActive(mediaQuery: string): boolean {
    let mql = this._registry.get(mediaQuery);
    return !!mql ? mql.matches : false;
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
    if (mediaQuery) {
      this.registerQuery(mediaQuery);
    }

    return this._observable$.pipe(
      filter((change: MediaChange) => {
        return mediaQuery ? (change.mediaQuery === mediaQuery) : true;
      })
    );
  }

  /**
   * Based on the BreakPointRegistry provider, register internal listeners for each unique
   * mediaQuery. Each listener emits specific MediaChange data to observers
   */
  registerQuery(mediaQuery: string | string[]) {
    let list = normalizeQuery(mediaQuery);

    if (list.length > 0) {
      this._prepareQueryCSS(list, this._document);

      list.forEach(query => {
        let mql = this._registry.get(query);
        let onMQLEvent = (e: MediaQueryList) => {
          this._zone.run(() => {
            let change = new MediaChange(e.matches, query);
            this._source.next(change);
          });
        };

        if (!mql) {
          mql = this._buildMQL(query);
          mql.addListener(onMQLEvent);
          this._registry.set(query, mql);
        }

        if (mql.matches) {
          onMQLEvent(mql);  // Announce activate range for initial subscribers
        }
      });
    }
  }

  /**
   * Call window.matchMedia() to build a MediaQueryList; which
   * supports 0..n listeners for activation/deactivation
   */
  protected _buildMQL(query: string): MediaQueryList {
    let canListen = isPlatformBrowser(this._platformId) &&
      !!(<any>window).matchMedia('all').addListener;

    return canListen ? (<any>window).matchMedia(query) : <MediaQueryList>{
      matches: query === 'all' || query === '',
      media: query,
      addListener: () => {
      },
      removeListener: () => {
      }
    };
  }

  /**
   * For Webkit engines that only trigger the MediaQueryList Listener
   * when there is at least one CSS selector for the respective media query.
   *
   * @param query string The mediaQuery used to create a faux CSS selector
   *
   */
  protected _prepareQueryCSS(mediaQueries: string[], _document: Document) {
    let list = mediaQueries.filter(it => !ALL_STYLES[it]);
    if (list.length > 0) {
      let query = list.join(', ');

      try {
        let styleEl = _document.createElement('style');

        styleEl.setAttribute('type', 'text/css');
        if (!styleEl['styleSheet']) {
          let cssText = `
/*
  @angular/flex-layout - workaround for possible browser quirk with mediaQuery listeners
  see http://bit.ly/2sd4HMP
*/
@media ${query} {.fx-query-test{ }}
` ;
          styleEl.appendChild(_document.createTextNode(cssText));
        }

        _document.head.appendChild(styleEl);

        // Store in private global registry
        list.forEach(mq => ALL_STYLES[mq] = styleEl);

      } catch (e) {
        console.error(e);
      }
    }
  }
}

/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
const ALL_STYLES = {};

/**
 * Always convert to unique list of queries; for iteration in ::registerQuery()
 */
function normalizeQuery(mediaQuery: string | string[]): string[] {
  return (typeof mediaQuery === 'undefined') ? [] :
      (typeof mediaQuery === 'string') ? [mediaQuery] : unique(mediaQuery as string[]);
}

/**
 * Filter duplicate mediaQueries in the list
 */
function unique(list: string[]): string[] {
  let seen = {};
  return list.filter(item => {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

