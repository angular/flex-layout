/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, NgZone} from '@angular/core';

import { ɵgetDOM as getDom, DOCUMENT } from '@angular/platform-browser';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

// RxJS Operators used by the classes...
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {MediaChange} from './media-change';

/**
 * EventHandler callback with the mediaQuery [range] activates or deactivates
 */
export interface MediaQueryListListener {
  // Function with MediaQueryList argument
  (mql: MediaQueryList): void;
}

/**
 * EventDispatcher for a specific mediaQuery [range]
 */
export interface MediaQueryList {
  readonly matches: boolean;
readonly media: string;
addListener(listener: MediaQueryListListener): void;
removeListener(listener: MediaQueryListListener): void;
}


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
  /**
   * Private global registry for all dynamically-created, injected style tags
   * @see prepare(query)
   */
  private ALL_STYLES: any = {};

  constructor(protected _zone: NgZone, @Inject(DOCUMENT) protected _document: any) {
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

    return this._observable$
      .filter((change: MediaChange) => {
        return mediaQuery ? (change.mediaQuery === mediaQuery) : true;
      });
  }

  /**
   * Based on the BreakPointRegistry provider, register internal listeners for each unique
   * mediaQuery. Each listener emits specific MediaChange data to observers
   */
  registerQuery(mediaQuery: string | string[]) {
    let list = this.normalizeQuery(mediaQuery);

    if (list.length > 0) {
      this.prepareQueryCSS(list);

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
   * Call matchMedia() to build a MediaQueryList; which
   * supports 0..n listeners for activation/deactivation
   */
  protected _buildMQL(query: string): MediaQueryList {
    let canListen = (typeof matchMedia != 'undefined');
    if (canListen) {
      canListen = !!matchMedia('all').addListener;
    }
    return canListen ? matchMedia(query) : <MediaQueryList>{
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
  private prepareQueryCSS(mediaQueries: string[]): void {
    let list = mediaQueries.filter(it => !this.ALL_STYLES[it]);
    if (list.length > 0) {
      let query = list.join(", ");
      try {
        let style = getDom().createElement('style');

        getDom().setAttribute(style, 'type', 'text/css');
        if (!style['styleSheet']) {
          let cssText = `/*
	  @angular/flex-layout - workaround for possible browser quirk with mediaQuery listeners
	  see http://bit.ly/2sd4HMP
	*/
	@media ${query} {.fx-query-test{ }}`;
          getDom().appendChild(style, getDom().createTextNode(cssText));
        }

        getDom().appendChild(this._document.head, style);

        // Store in private global registry
        list.forEach(mq => this.ALL_STYLES[mq] = style);

      } catch (e) {
        console.error(e);
      }
    }
  }
	/**
	 * Always convert to unique list of queries; for iteration in ::registerQuery()
	 */
  private normalizeQuery(mediaQuery: string | string[]): string[] {
    return (typeof mediaQuery === 'undefined') ? [] :
      (typeof mediaQuery === 'string') ? [mediaQuery] : this.unique(mediaQuery as string[]);
  }

	/**
	 * Filter duplicate mediaQueries in the list
	 */
  private unique(list: string[]): string[] {
    let seen = {};
    return list.filter(item => {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }
}
