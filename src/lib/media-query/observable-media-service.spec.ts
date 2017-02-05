/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {TestBed, inject, async} from '@angular/core/testing';

import {BreakPointRegistry} from './breakpoints/break-point-registry';
import {MediaChange} from './media-change';
import {MockMatchMedia} from './mock/mock-match-media';
import {MatchMedia} from './match-media';
import {ObservableMedia, MediaService} from './observable-media-service';
import {BREAKPOINTS, RAW_DEFAULTS} from './breakpoints/break-points';

describe('match-media-observable-provider', () => {
  let findMediaQuery = (alias) => {
    let mediaQuery;
    RAW_DEFAULTS.forEach(bp => {
      if (bp.alias === alias) {
        mediaQuery = bp.mediaQuery;
      }
    });
    return mediaQuery;
  };
  beforeEach(() => {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [
        BreakPointRegistry,   // Registry of known/used BreakPoint(s)
        {provide: BREAKPOINTS, useValue: RAW_DEFAULTS},
        {provide: MatchMedia, useClass: MockMatchMedia},
        {
          provide: ObservableMedia,
          useClass: MediaService,
          deps: [MatchMedia, BreakPointRegistry]
        }
      ]
    });
  });

  it('can supports the `.isActive()` API', async(inject(
      [ObservableMedia, MatchMedia],
      (media, matchMedia) => {
        expect(media).toBeDefined();

        // Activate mediaQuery associated with 'md' alias
        matchMedia.activate('md');
        expect(media.isActive('md')).toBeTruthy();

        matchMedia.activate('lg');
        expect(media.isActive('lg')).toBeTruthy();
        expect(media.isActive('md')).toBeFalsy();

      })));

  it('can supports RxJS operators', inject(
      [ObservableMedia, MatchMedia],
      (mediaService, matchMedia) => {
        let count = 0,
            subscription = mediaService
                .asObservable()
                .filter(change => change.mqAlias == 'md')
                .map(change => change.mqAlias)
                .subscribe((alias) => {
                  count += 1;
                });

        // Activate mediaQuery associated with 'md' alias
        matchMedia.activate('sm');
        expect(count).toEqual(0);

        matchMedia.activate('md');
        expect(count).toEqual(1);

        matchMedia.activate('lg');
        expect(count).toEqual(1);

        matchMedia.activate('md');
        expect(count).toEqual(2);

        matchMedia.activate('gt-md');
        matchMedia.activate('gt-lg');
        matchMedia.activate('invalid');
        expect(count).toEqual(2);

        subscription.unsubscribe();
      }));

  it('can can subscribe to built-in mediaQueries', async(inject(
      [ObservableMedia, MatchMedia],
      (media$, matchMedia) => {
        let current: MediaChange;

        expect(media$).toBeDefined();

        let subscription = media$.subscribe((change: MediaChange) => {
          current = change;
        });

        // Confirm initial match is for 'all'
        expect(current).toBeDefined();
        expect(current.matches).toBeTruthy();
        expect(current.mediaQuery).toEqual("all");

        try {
          matchMedia.autoRegisterQueries = false;

          // Activate mediaQuery associated with 'md' alias
          matchMedia.activate('md');
          expect(current.mediaQuery).toEqual(findMediaQuery('md'));

          matchMedia.activate('gt-lg');
          expect(current.mediaQuery).toEqual(findMediaQuery('gt-lg'));

          matchMedia.activate('unknown');
          expect(current.mediaQuery).toEqual(findMediaQuery('gt-lg'));

        } finally {
          matchMedia.autoRegisterQueries = true;
          subscription.unsubscribe();
        }
      })));

  it('can `.unsubscribe()` properly', async(inject(
      [ObservableMedia, MatchMedia],
      (media, matchMedia) => {
        let current: MediaChange;
        let subscription = media.subscribe((change: MediaChange) => {
          current = change;
        });

        // Activate mediaQuery associated with 'md' alias
        matchMedia.activate('md');
        expect(current.mediaQuery).toEqual(findMediaQuery('md'));

        // Un-subscribe
        subscription.unsubscribe();

        matchMedia.activate('lg');
        expect(current.mqAlias).toBe('md');

        matchMedia.activate('xs');
        expect(current.mqAlias).toBe('md');
      })));

});

