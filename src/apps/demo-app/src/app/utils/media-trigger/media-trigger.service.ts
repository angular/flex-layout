/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {
  MediaChange,
  MatchMedia,
  BreakPointRegistry,
  sortChangesByPriority,
  OptionalBreakPoint,
  mergeAlias
} from '@angular/flex-layout';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {Subscription} from 'rxjs/internal/Subscription';
import {take} from 'rxjs/operators';

/**
 * Class
 */
@Injectable({providedIn: 'root'})
export class MediaTriggerService {

  constructor(
      protected breakpoints: BreakPointRegistry,
      protected matchMedia: MatchMedia,
      @Inject(PLATFORM_ID) protected _platformId: Object,
      @Inject(DOCUMENT) protected _document: any) {
  }

  /**
   * Manually activate range of breakpoints
   * @param list array of mediaQuery or alias strings
   */
  activate(list: string[]) {
    list = list.map(it => it.trim()); // trim queries

    this.saveActivations();
    this.deactivateAll();
    this.setActivations(list);

    this.prepareAutoRestore();
  }

  /**
   * Restore original, 'real' breakpoints and emit events
   * to trigger stream notification
   */
  restore() {
    if (this.originalActivations.length > 0) {
      const extractQuery = (change: MediaChange) => change.mediaQuery;
      const list = this.originalActivations.map(extractQuery);

      try {
        this.deactivateAll();
        this.restoreRegistryMatches();
        this.setActivations(list);

      } finally {
        this.originalRegistry = null;
        this.originalActivations = [];
        if (this.resizeSubscription) {
          this.resizeSubscription.unsubscribe();
        }
      }
    }
  }

  // ************************************************
  // Internal Methods
  // ************************************************

  /**
   * Whenever window resizes, immediately auto-restore original
   * activations (if we are simulating activations)
   */
  private prepareAutoRestore() {
    if (isPlatformBrowser(this._platformId) && this._document) {
      const resize$ = fromEvent(window, 'resize').pipe(take(1));
      this.resizeSubscription = resize$.subscribe(this.restore.bind(this));
    }
  }

  /**
   * Notify all matchMedia subscribers of de-activations
   *
   * Note: we must force 'matches' updates for
   *       future matchMedia::activation lookups
   */
  private deactivateAll() {
    const list = this.currentActivations;

    this.forceRegistryMatches(list, false);
    this.simulateMediaChanges(list, false);
  }

  /**
   * Cache current activations as sorted, prioritized list of MediaChanges
   */
  private saveActivations() {
    if (this.originalActivations.length === 0) {
      const toMediaChange = (query) => new MediaChange(true, query);
      const mergeMQAlias = (change: MediaChange) => {
        let bp: OptionalBreakPoint = this.breakpoints.findByQuery(change.mediaQuery);
        return mergeAlias(change, bp);
      };

      this.originalRegistry = this.matchMedia['_registry'] as Map<string, MediaQueryList>;
      this.originalActivations = this.currentActivations
          .map(toMediaChange)
          .map(mergeMQAlias)
          .sort(sortChangesByPriority);

    }
  }

  /**
   * Force set manual activations for specified mediaQuery list
   */
  private setActivations(list: string[]) {
    if (!!this.originalRegistry) {
      this.forceRegistryMatches(list, true);
    }
    this.simulateMediaChanges(list);
  }

  /**
   * For specified mediaQuery list manually simulate activations or deactivations
   */
  private simulateMediaChanges(queries: string[], matches = true) {
    const toMediaQuery = (query: string) => {
      const locator = this.breakpoints;
      const bp = locator.findByAlias(query) || locator.findByQuery(query);
      return bp ? bp.mediaQuery : query;
    };
    const emitChangeEvent = (query: string) => this.emitChangeEvent(matches, query);

    queries.map(toMediaQuery).forEach(emitChangeEvent);
  }

  // ****************************************************************
  // 'Pierce-the-veil' to get access to special, read-only artifacts
  // ****************************************************************

  /**
   * Replace current registry with simulated registry...
   * Note: this is required since MediaQueryList::matches is 'readOnly'
   */
  forceRegistryMatches(queries: string[], match: boolean) {
    const registry = new Map<string, MediaQueryList>();
    queries.forEach(query => {
      registry.set(query, {matches: match} as MediaQueryList);
    });

    this.matchMedia['_registry'] = registry;
  }

  /**
   * Restore original, 'true' registry
   */
  restoreRegistryMatches() {
    this.matchMedia['_registry'] = this.originalRegistry as Map<string, MediaQueryList>;
    this.originalRegistry = null;
  }

  /**
   * Manually emit a MediaChange event via the MatchMedia to MediaMarshaller and MediaObserver
   */
  emitChangeEvent(matches: boolean, query: string) {
    const source = this.matchMedia['_source'] as BehaviorSubject<MediaChange>;
    source.next(new MediaChange(matches, query));
  }

  private get currentActivations() {
    return this.matchMedia.activations;
  }

  private originalActivations: MediaChange[] = [];
  private originalRegistry: Map<string, MediaQueryList> | null;

  private resizeSubscription: Subscription;
}

