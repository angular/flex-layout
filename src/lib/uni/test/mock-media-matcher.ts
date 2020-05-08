/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {MediaMatcher} from '@angular/cdk/layout';
import {Inject, Injectable} from '@angular/core';
import {Platform} from '@angular/cdk/platform';
import {Breakpoint} from '@angular/flex-layout/uni';

import {BPS} from '../src/breakpoint';


@Injectable({providedIn: 'root'})
export class MockMediaMatcher extends MediaMatcher {
  private registry: Map<string, MockMediaQueryList> = new Map();

  constructor(platform: Platform, @Inject(BPS) private readonly bps: Breakpoint[]) {
    super(platform);
  }

  matchMedia(query: string): MediaQueryList {
    const bpName: string = this.bps.find(bp => bp.media === query)?.name ?? '';
    let mediaQueryList = this.registry.get(bpName);
    if (!mediaQueryList) {
      mediaQueryList = new MockMediaQueryList();
      mediaQueryList._media = query;
      mediaQueryList._matches = query === 'all';
      this.registry.set(bpName, mediaQueryList);
    }

    return mediaQueryList;
  }

  activateBp(bp: string) {
    const mediaQueryList = this.registry.get(bp);
    if (!mediaQueryList) {
      return;
    }

    mediaQueryList.activate();
  }

  deactivateBp(bp: string) {
    const mediaQueryList = this.registry.get(bp);
    if (!mediaQueryList) {
      return;
    }

    mediaQueryList.deactivate();
  }
}

export class MockMediaQueryList implements MediaQueryList {
  _matches: boolean = false;
  _media: string = '';
  private _listeners: Array<((this: MediaQueryList, ev: MediaQueryListEvent) => any)> = [];

  get matches(): boolean {
    return this._matches;
  }

  addListener(listener: ((this: MediaQueryList, ev: MediaQueryListEvent) => any)): void {
    this._listeners.push(listener);
  }

  activate() {
    this._matches = true;
    const ev = new MediaQueryListEvent('', {matches: this._matches, media: this._media});
    this._listeners.forEach(cb => cb.call(this, ev));
  }

  deactivate() {
    this._matches = false;
    const ev = new MediaQueryListEvent('', {matches: this._matches, media: this._media});
    this._listeners.forEach(cb => cb.call(this, ev));
  }

  /** Unused methods and properties */
  onchange = null;
  get media(): string { return this._media; }
  removeListener() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent(): boolean { return false; }
}

export const MOCK_PROVIDER = {
  provide: MediaMatcher,
  useClass: MockMediaMatcher
};
