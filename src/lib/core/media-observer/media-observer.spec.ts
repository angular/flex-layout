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
import {BREAKPOINT} from '../tokens/breakpoint-token';
import {MockMatchMedia, MockMatchMediaProvider} from '../match-media/mock/mock-match-media';
import {DEFAULT_CONFIG, LAYOUT_CONFIG} from '../tokens/library-config';

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

        matchMedia.clearAll();
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
        matchMedia.clearAll();
      }));

    it('can subscribe to built-in mediaQueries', inject(
      [MediaObserver, MatchMedia],
      (mediaObserver: MediaObserver, matchMedia: MockMatchMedia) => {
        let current: MediaChange = new MediaChange(true);
        let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
          current = change;
        });

        expect(mediaObserver).toBeDefined();

        // Confirm initial match is for 'all'
        expect(current).toBeDefined();
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

          matchMedia.clearAll();
        }
      }));

    it('can `.unsubscribe()` properly', inject(
      [MediaObserver, MatchMedia],
      (mediaObserver: MediaObserver, matchMedia: MockMatchMedia) => {
        let current: MediaChange = new MediaChange(true);
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

        matchMedia.clearAll();
      }));

    it('can observe a startup activation of XS', inject(
      [MediaObserver, MatchMedia],
      (mediaObserver: MediaObserver, matchMedia: MockMatchMedia) => {
        let current: MediaChange = new MediaChange(true);
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

        matchMedia.clearAll();
      }));
  });

  describe('with custom BreakPoints', () => {
    const gtXsMediaQuery = 'screen and (min-width:120px) and (orientation:landscape)';
    const superXLQuery = 'screen and (min-width:10000px)';
    const smMediaQuery = 'screen and (min-width: 600px) and (max-width: 959px)';

    const CUSTOM_BREAKPOINTS = [
      {alias: 'slate.xl', priority: 11000, mediaQuery: superXLQuery},
      {alias: 'tablet-gt-xs', priority: 110, mediaQuery: gtXsMediaQuery},
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
        let current: MediaChange = new MediaChange(true);
        let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
          current = change;
        });

        // Activate mediaQuery associated with 'md' alias
        matchMedia.activate('sm');
        expect(current.mediaQuery).toEqual(smMediaQuery);

        // MediaObserver will not announce print events
        // unless a printAlias layout has been configured.
        matchMedia.activate('slate.xl');
        expect(current.mediaQuery).toEqual(superXLQuery);

        matchMedia.activate('tablet-gt-xs');
        expect(current.mqAlias).toBe('tablet-gt-xs');
        expect(current.mediaQuery).toBe(gtXsMediaQuery);

        subscription.unsubscribe();
        matchMedia.clearAll();
      }));
  });

  describe('with layout "print" configured', () => {
     const mdMediaQuery = 'screen and (min-width: 960px) and (max-width: 1279px)';

     beforeEach(() => {
       // Configure testbed to prepare services
       TestBed.configureTestingModule({
         providers: [
           MockMatchMediaProvider,
           {
             provide: LAYOUT_CONFIG,
             useValue: {
               ...DEFAULT_CONFIG,
               ...{ printWithBreakpoints : ['md']}
             }
           }
         ]
       });
     });

     it('can activate when configured with "md" alias', inject(
       [MediaObserver, MatchMedia],
       (mediaObserver: MediaObserver, matchMedia: MockMatchMedia) => {
         let current: MediaChange = new MediaChange(true);
         let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
           current = change;
         });

         try {

           matchMedia.activate('lg');

           // Activate mediaQuery associated with 'md' alias
           matchMedia.activate('print');
           expect(current.mqAlias).toBe('md');
           expect(current.mediaQuery).toEqual(mdMediaQuery);

           matchMedia.activate('sm');
           expect(current.mqAlias).toBe('sm');

         } finally {
           matchMedia.clearAll();
            subscription.unsubscribe();
         }

       }));
   });

  describe('with layout print NOT configured', () => {
     const smMediaQuery = 'screen and (min-width: 600px) and (max-width: 959px)';

     beforeEach(() => {
       // Configure testbed to prepare services
       TestBed.configureTestingModule({
         providers: [
           MockMatchMediaProvider
         ]
       });
     });

     it('will skip print activation without alias', inject(
       [MediaObserver, MatchMedia],
       (mediaObserver: MediaObserver, matchMedia: MockMatchMedia) => {
         let current: MediaChange = new MediaChange(true);
         let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
           current = change;
         });

         try {

           matchMedia.activate('sm');
           expect(current.mqAlias).toBe('sm');

           // Activate mediaQuery associated with 'md' alias
           matchMedia.activate('print');
           expect(current.mqAlias).toBe('sm');
           expect(current.mediaQuery).toEqual(smMediaQuery);

           matchMedia.activate('xl');
           expect(current.mqAlias).toBe('xl');

         } finally {
            subscription.unsubscribe();
            matchMedia.clearAll();
         }

       }));
   });
});
