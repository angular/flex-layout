/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {TestBed, inject, async} from '@angular/core/testing';

import {filter} from 'rxjs/operator/filter';
import {map} from 'rxjs/operator/map';

import {BreakPoint} from './breakpoints/break-point';
import {BREAKPOINTS} from './breakpoints/break-points-token';
import {BreakPointRegistry} from './breakpoints/break-point-registry';
import {
  DEFAULT_BREAKPOINTS_PROVIDER,
  CUSTOM_BREAKPOINTS_PROVIDER_FACTORY
} from './breakpoints/break-points-provider';

import {MatchMedia} from './match-media';
import {MediaChange} from './media-change';
import {ObservableMedia} from './observable-media';
import {OBSERVABLE_MEDIA_PROVIDER} from './observable-media-provider';
import {MockMatchMediaProvider} from './mock/mock-match-media';

describe('observable-media', () => {
  describe('with default BreakPoints', () => {
    let knownBreakPoints: BreakPoint[] = [];
    let findMediaQuery = (alias) => {
      const NOT_FOUND = `${alias} not found`;
      return knownBreakPoints.reduce((mediaQuery, bp) => {
        return mediaQuery || ((bp.alias === alias) ? bp.mediaQuery : null);
      }, null) || NOT_FOUND;
    };
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [
          DEFAULT_BREAKPOINTS_PROVIDER,
          BreakPointRegistry,   // Registry of known/used BreakPoint(s)
          MockMatchMediaProvider,
          OBSERVABLE_MEDIA_PROVIDER,
        ]
      });
    });
    beforeEach(inject([BREAKPOINTS], (breakpoints: BreakPoint[]) => {
      // Cache reference to list for easy testing...
      knownBreakPoints = breakpoints;
    }));

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
              subscription = map.call(
                  filter.call(
                      mediaService.asObservable(),
                      change => change.mqAlias == 'md'
                  ),
                  change => change.mqAlias
              ).subscribe(_ => {
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

    it('can subscribe to built-in mediaQueries', inject(
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
          expect(current.mediaQuery).toEqual('all');

          try {
            matchMedia.autoRegisterQueries = false;

            // Activate mediaQuery associated with 'md' alias
            matchMedia.activate('md');
            expect(current.mediaQuery).toEqual(findMediaQuery('md'));

            // Allow overlapping activations to be announced to observers
            media$.filterOverlaps = false;

            matchMedia.activate('gt-lg');
            expect(current.mediaQuery).toEqual(findMediaQuery('gt-lg'));

            matchMedia.activate('unknown');
            expect(current.mediaQuery).toEqual(findMediaQuery('gt-lg'));

          } finally {
            matchMedia.autoRegisterQueries = true;
            subscription.unsubscribe();
          }
        }));

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

    it('can observe a startup activation of XS', async(inject(
        [ObservableMedia, MatchMedia],
        (media, matchMedia) => {
          let current: MediaChange;
          let subscription = media.subscribe((change: MediaChange) => {
            current = change;
          });

          // Activate mediaQuery associated with 'md' alias
          matchMedia.activate('xs');
          expect(current.mediaQuery).toEqual(findMediaQuery('xs'));

          // Un-subscribe
          subscription.unsubscribe();

          matchMedia.activate('lg');
          expect(current.mqAlias).toBe('xs');

        })));
  });

  describe('with custom BreakPoints', () => {
    const excludeDefaults = true;
    const gtXsMediaQuery = 'screen and (max-width:20px) and (orientations: landscape)';
    const mdMediaQuery = 'print and (min-width:10000px)';
    const CUSTOM_BREAKPOINTS = [
      {alias: 'print.md', mediaQuery: mdMediaQuery},
      {alias: 'tablet-gt-xs', mediaQuery: gtXsMediaQuery},
    ];

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [
          BreakPointRegistry,   // Registry of known/used BreakPoint(s)
          MockMatchMediaProvider,
          CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(CUSTOM_BREAKPOINTS, {defaults: excludeDefaults}),
          OBSERVABLE_MEDIA_PROVIDER,
        ]
      });
    });

    it('can activate custom alias with custom mediaQueries', async(inject(
        [ObservableMedia, MatchMedia],
        (media, matchMedia) => {
          let current: MediaChange;
          let subscription = media.subscribe((change: MediaChange) => {
            current = change;
          });

          // Activate mediaQuery associated with 'md' alias
          matchMedia.activate('print.md');
          expect(current.mediaQuery).toEqual(mdMediaQuery);

          matchMedia.activate('tablet-gt-xs');
          expect(current.mqAlias).toBe('tablet-gt-xs');
          expect(current.mediaQuery).toBe(gtXsMediaQuery);

          subscription.unsubscribe();
        })));

  });

});

