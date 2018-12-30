/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {TestBed, inject} from '@angular/core/testing';
import {filter, map} from 'rxjs/operators';

import {BreakPoint} from '../breakpoints/break-point';
import {BREAKPOINTS} from '../breakpoints/break-points-token';
import {MatchMedia} from '../match-media/match-media';
import {MediaChange} from '../media-change';
import {MediaObserver} from './media-observer';
import {MockMatchMedia, MockMatchMediaProvider} from '../match-media/mock/mock-match-media';
import {BREAKPOINT} from '../tokens/breakpoint-token';

describe('media-observer', () => {

  describe('with default BreakPoints', () => {
    let knownBreakPoints: BreakPoint[] = [];
    let findMediaQuery: (alias: string) => string = (alias) => {
      const NOT_FOUND = `${alias} not found`;
      return knownBreakPoints.reduce((mediaQuery: string | null, bp) => {
        return mediaQuery || ((bp.alias === alias) ? bp.mediaQuery : null);
      }, null) as string || NOT_FOUND;
    };
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [MockMatchMediaProvider]
      });
    });
    beforeEach(inject([BREAKPOINTS], (breakpoints: BreakPoint[]) => {
      // Cache reference to list for easy testing...
      knownBreakPoints = breakpoints;
    }));

    it('can subscribe to built-in mediaQueries', inject(
        [MediaObserver, MatchMedia],
        (mediaObserver: MediaObserver, matchMedia: MockMatchMedia) => {
          let current: MediaChange = new MediaChange(false, 'unknown');
          let subscription = matchMedia.observe().subscribe((change: MediaChange) => {
            current = change;
          });
          expect(current.matches).toBeTruthy();
          expect(current.mediaQuery).toEqual('all');
          subscription.unsubscribe();

          expect(mediaObserver).toBeDefined();
          current = new MediaChange(true);
          subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
            current = change;
          });

          // Confirm initial match is for 'all'
          expect(current.matches).toBeTruthy();
          expect(current.mediaQuery).toEqual('all');

          try {
            // Allow overlapping activations to be announced to observers
            matchMedia.autoRegisterQueries = false;
            mediaObserver.filterOverlaps = false;

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

        }));

    it('can supports the `.isActive()` API', inject(
        [MediaObserver, MatchMedia],
        (media: MediaObserver, matchMedia: MockMatchMedia) => {
          expect(media).toBeDefined();

          // Activate mediaQuery associated with 'md' alias
          matchMedia.activate('md');
          expect(media.isActive('md')).toBeTruthy();

          matchMedia.activate('lg');
          expect(media.isActive('lg')).toBeTruthy();
          expect(media.isActive('md')).toBeFalsy();

        }));

    it('can supports RxJS operators', inject(
        [MediaObserver, MatchMedia],
        (mediaService: MediaObserver, matchMedia: MockMatchMedia) => {
          let count = 0,
              subscription = mediaService.media$.pipe(
                  filter((change: MediaChange) => change.mqAlias == 'md'),
                  map((change: MediaChange) => change.mqAlias)
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

    it('can `.unsubscribe()` properly', inject(
        [MediaObserver, MatchMedia],
        (mediaObserver: MediaObserver, matchMedia: MockMatchMedia) => {
          let current: MediaChange = new MediaChange();
          let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
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
        }));

    it('can observe a startup activation of XS', inject(
        [MediaObserver, MatchMedia],
        (mediaObserver: MediaObserver, matchMedia: MockMatchMedia) => {
          let current: MediaChange = new MediaChange();
          let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
            current = change;
          });

          // Activate mediaQuery associated with 'md' alias
          matchMedia.activate('xs');
          expect(current.mediaQuery).toEqual(findMediaQuery('xs'));

          // Un-subscribe
          subscription.unsubscribe();

          matchMedia.activate('lg');
          expect(current.mqAlias).toBe('xs');
        }));
  });

  describe('with custom BreakPoints', () => {
    const gtXsMediaQuery = 'screen and (max-width:20px) and (orientations: landscape)';
    const superLgMediaQuery = 'screen and (min-width:10000px)';
    const CUSTOM_BREAKPOINTS = [
      {alias: 'super-xxl', mediaQuery: superLgMediaQuery, priority: 2000},
      {alias: 'tablet-gt-xs', mediaQuery: gtXsMediaQuery, priority: 2000},
    ];

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [
          MockMatchMediaProvider,
          {provide: BREAKPOINT, useValue: CUSTOM_BREAKPOINTS, multi: true},
        ]
      });
    });

    it('can activate custom alias with custom mediaQueries', inject(
        [MediaObserver, MatchMedia],
        (mediaObserver: MediaObserver, matchMedia: MockMatchMedia) => {
          let current: MediaChange = new MediaChange();
          let subscription = mediaObserver
                .media$
                .subscribe((change: MediaChange) => {
                  current = change;
                });

          // Activate mediaQuery associated with 'md' alias
          matchMedia.activate('super-xxl');
          expect(current.mediaQuery).toEqual(superLgMediaQuery);

          matchMedia.activate('tablet-gt-xs');
          expect(current.mqAlias).toBe('tablet-gt-xs');
          expect(current.mediaQuery).toBe(gtXsMediaQuery);

          subscription.unsubscribe();
        }));
  });

});
