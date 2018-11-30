/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Inject, Injectable, NgZone, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

import {MediaChange} from '../media-change';

/**
 * MediaMonitor configures listeners to mediaQuery changes and publishes an Observable facade to
 * convert mediaQuery change callbacks to subscriber notifications. These notifications will be
 * performed within the ng Zone to trigger change detections and component updates.
 *
 * NOTE: both mediaQuery activations and de-activations are announced in notifications
 */
@Injectable({providedIn: 'root'})
export class MatchMedia {
  protected _registry = new Map<string, MediaQueryList>();
  protected _source = new BehaviorSubject<MediaChange>(new MediaChange(true));
  protected _observable$ = this._source.asObservable();

  constructor(protected _zone: NgZone,
              @Inject(PLATFORM_ID) protected _platformId: Object,
              @Inject(DOCUMENT) protected _document: any) {
  }

  /**
   * For the specified mediaQuery?
   */
  isActive(mediaQuery: string): boolean {
    const mql = this._registry.get(mediaQuery);
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
      filter(change => (mediaQuery ? (change.mediaQuery === mediaQuery) : true))
    );
  }

  /**
   * Based on the BreakPointRegistry provider, register internal listeners for each unique
   * mediaQuery. Each listener emits specific MediaChange data to observers
   */
  registerQuery(mediaQuery: string | string[]) {
    const list = Array.isArray(mediaQuery) ? Array.from(new Set(mediaQuery)) : [mediaQuery];

    if (list.length > 0) {
      buildQueryCss(list, this._document);
    }

    list.forEach(query => {
      const onMQLEvent = (e: MediaQueryListEvent) => {
        this._zone.run(() => this._source.next(new MediaChange(e.matches, query)));
      };

      let mql = this._registry.get(query);

      if (!mql) {
        mql = this._buildMQL(query);
        mql.addListener(onMQLEvent);
        this._registry.set(query, mql);
      }

      if (mql.matches) {
        onMQLEvent(mql as unknown as MediaQueryListEvent);
      }
    });
  }

  /**
   * Call window.matchMedia() to build a MediaQueryList; which
   * supports 0..n listeners for activation/deactivation
   */
  protected _buildMQL(query: string): MediaQueryList {
    return constructMql(query, isPlatformBrowser(this._platformId));
  }
}

/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
const ALL_STYLES: {[key: string]: any} = {};

/**
 * For Webkit engines that only trigger the MediaQueryList Listener
 * when there is at least one CSS selector for the respective media query.
 *
 * @param mediaQueries
 * @param _document
 */
function buildQueryCss(mediaQueries: string[], _document: Document) {
  const list = mediaQueries.filter(it => !ALL_STYLES[it]);
  if (list.length > 0) {
    const query = list.join(', ');

    try {
      const styleEl = _document.createElement('style');

      styleEl.setAttribute('type', 'text/css');
      if (!(styleEl as any).styleSheet) {
        const cssText = `
/*
  @angular/flex-layout - workaround for possible browser quirk with mediaQuery listeners
  see http://bit.ly/2sd4HMP
*/
@media ${query} {.fx-query-test{ }}
` ;
        styleEl.appendChild(_document.createTextNode(cssText));
      }

      _document.head!.appendChild(styleEl);

      // Store in private global registry
      list.forEach(mq => ALL_STYLES[mq] = styleEl);

    } catch (e) {
      console.error(e);
    }
  }
}

function constructMql(query: string, isBrowser: boolean): MediaQueryList {
  const canListen = isBrowser && !!(<any>window).matchMedia('all').addListener;

  return canListen ? (<any>window).matchMedia(query) : {
    matches: query === 'all' || query === '',
    media: query,
    addListener: () => {
    },
    removeListener: () => {
    }
  } as unknown as MediaQueryList;
}
