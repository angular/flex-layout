/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

import {fromEvent, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';

import {mergeAlias} from '../add-alias';
import {MediaChange} from '../media-change';
import {MatchMedia} from '../match-media/match-media';
import {BreakPointRegistry, OptionalBreakPoint} from '../breakpoints/break-point-registry';
import {sortDescendingPriority} from '../utils/sort';
import {LAYOUT_CONFIG, LayoutConfigOptions} from '../tokens/library-config';

/**
 * Class
 */
@Injectable({providedIn: 'root'})
export class MediaTrigger {

  constructor(
      protected breakpoints: BreakPointRegistry,
      protected matchMedia: MatchMedia,
      @Inject(LAYOUT_CONFIG) protected layoutConfig: LayoutConfigOptions,
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
    if (this.hasCachedRegistryMatches) {
      const extractQuery = (change: MediaChange) => change.mediaQuery;
      const list = this.originalActivations.map(extractQuery);
      try {

        this.deactivateAll();
        this.restoreRegistryMatches();
        this.setActivations(list);

      } finally {
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
    const isBrowser = isPlatformBrowser(this._platformId) && this._document;
    const enableAutoRestore = isBrowser && this.layoutConfig.mediaTriggerAutoRestore;

    if (enableAutoRestore) {
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
    if (!this.hasCachedRegistryMatches) {
      const toMediaChange = (query: string) => new MediaChange(true, query);
      const mergeMQAlias = (change: MediaChange) => {
        const bp: OptionalBreakPoint = this.breakpoints.findByQuery(change.mediaQuery);
        return mergeAlias(change, bp);
      };

      this.originalActivations = this.currentActivations
          .map(toMediaChange)
          .map(mergeMQAlias)
          .sort(sortDescendingPriority);

      this.cacheRegistryMatches();
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

  /**
   * Replace current registry with simulated registry...
   * Note: this is required since MediaQueryList::matches is 'readOnly'
   */
  private forceRegistryMatches(queries: string[], matches: boolean) {
    const registry = new Map<string, MediaQueryList>();
    queries.forEach(query => {
      registry.set(query, {matches: matches} as MediaQueryList);
    });

    this.matchMedia.registry = registry;
  }

  /**
   * Save current MatchMedia::registry items.
   */
  private cacheRegistryMatches() {
    const target = this.originalRegistry;

    target.clear();
    this.matchMedia.registry.forEach((value: MediaQueryList, key: string) => {
      target.set(key, value);
    });
    this.hasCachedRegistryMatches = true;
  }

  /**
   * Restore original, 'true' registry
   */
  private restoreRegistryMatches() {
    const target = this.matchMedia.registry;

    target.clear();
    this.originalRegistry.forEach((value: MediaQueryList, key: string) => {
      target.set(key, value);
    });

    this.originalRegistry.clear();
    this.hasCachedRegistryMatches = false;
  }

  /**
   * Manually emit a MediaChange event via the MatchMedia to MediaMarshaller and MediaObserver
   */
  private emitChangeEvent(matches: boolean, query: string) {
    this.matchMedia.source.next(new MediaChange(matches, query));
  }

  private get currentActivations(): string[] {
    return this.matchMedia.activations;
  }

  private hasCachedRegistryMatches = false;
  private originalActivations: MediaChange[] = [];
  private originalRegistry: Map<string, MediaQueryList> = new Map<string, MediaQueryList>();

  private resizeSubscription!: Subscription;
}

