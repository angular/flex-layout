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
  let knownBreakPoints: BreakPoint[] = [];
  let mediaObserver: MediaObserver;
  let mediaController: MockMatchMedia;

  describe('with default BreakPoints', () => {
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [MockMatchMediaProvider]
      });
    });

    beforeEach(inject([MediaObserver, MatchMedia, BREAKPOINTS],
        (_mediaObserver: MediaObserver, _mediaController: MockMatchMedia, breakpoints: BreakPoint[]) => { // tslint:disable-line:max-line-length
      knownBreakPoints = breakpoints;
      mediaObserver = _mediaObserver;
      mediaController = _mediaController;
    }));

    afterEach(() => {
      mediaController.clearAll();
    });

    let findMediaQuery: (alias: string) => string = (alias) => {
      const NOT_FOUND = `${alias} not found`;
      return knownBreakPoints.reduce((mediaQuery: string | null, bp) => {
        return mediaQuery || ((bp.alias === alias) ? bp.mediaQuery : null);
      }, null) as string || NOT_FOUND;
    };
    it('can supports the `.isActive()` API', () => {
      expect(mediaObserver).toBeDefined();

      // Activate mediaQuery associated with 'md' alias
      mediaController.activate('md');
      expect(mediaObserver.isActive('md')).toBeTruthy();

      mediaController.activate('lg');
      expect(mediaObserver.isActive('lg')).toBeTruthy();
      expect(mediaObserver.isActive('md')).toBeFalsy();

      mediaController.clearAll();
    });

    it('can supports RxJS operators', () => {
      let count = 0,
          subscription = mediaObserver.media$.pipe(
              filter((change: MediaChange) => change.mqAlias == 'md'),
              map((change: MediaChange) => change.mqAlias)
          ).subscribe(_ => {
            count += 1;
          });

      // Activate mediaQuery associated with 'md' alias
      mediaController.activate('sm');
      expect(count).toEqual(0);

      mediaController.activate('md');
      expect(count).toEqual(1);

      mediaController.activate('lg');
      expect(count).toEqual(1);

      mediaController.activate('md');
      expect(count).toEqual(2);

      mediaController.activate('gt-md');
      mediaController.activate('gt-lg');
      mediaController.activate('invalid');
      expect(count).toEqual(2);

      subscription.unsubscribe();
      mediaController.clearAll();
    });

    it('can subscribe to built-in mediaQueries', () => {
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
        mediaController.autoRegisterQueries = false;
        mediaObserver.filterOverlaps = false;

        // Activate mediaQuery associated with 'md' alias
        mediaController.activate('md');
        expect(current.mediaQuery).toEqual(findMediaQuery('md'));

        mediaController.activate('gt-lg');
        expect(current.mediaQuery).toEqual(findMediaQuery('gt-lg'));

        mediaController.activate('unknown');
        expect(current.mediaQuery).toEqual(findMediaQuery('gt-lg'));

      } finally {
        mediaController.autoRegisterQueries = true;
        subscription.unsubscribe();

        mediaController.clearAll();
      }
    });

    it('can `.unsubscribe()` properly', () => {
      let current: MediaChange = new MediaChange(true);
      let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
        current = change;
      });

      // Activate mediaQuery associated with 'md' alias
      mediaController.activate('md');
      expect(current.mediaQuery).toEqual(findMediaQuery('md'));

      // Un-subscribe
      subscription.unsubscribe();

      mediaController.activate('lg');
      expect(current.mqAlias).toBe('md');

      mediaController.activate('xs');
      expect(current.mqAlias).toBe('md');

       mediaController.clearAll();
    });

    it('can observe a startup activation of XS', () => {
      let current: MediaChange = new MediaChange(true);
      let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
        current = change;
      });

      // Activate mediaQuery associated with 'md' alias
      mediaController.activate('xs');
      expect(current.mediaQuery).toEqual(findMediaQuery('xs'));

      // Un-subscribe
      subscription.unsubscribe();

      mediaController.activate('lg');
      expect(current.mqAlias).toBe('xs');

       mediaController.clearAll();
    });
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

    beforeEach(inject([MediaObserver, MatchMedia, BREAKPOINTS],
        (_mediaObserver: MediaObserver, _mediaController: MockMatchMedia, breakpoints: BreakPoint[]) => { // tslint:disable-line:max-line-length
          knownBreakPoints = breakpoints;
          mediaObserver = _mediaObserver;
          mediaController = _mediaController;
        }));

    afterEach(() => {
      mediaController.clearAll();
    });

    it('can activate custom alias with custom mediaQueries', () => {
      let current: MediaChange = new MediaChange(true);
      let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
        current = change;
      });

      // Activate mediaQuery associated with 'md' alias
      mediaController.activate('sm');
      expect(current.mediaQuery).toEqual(smMediaQuery);

      // MediaObserver will not announce print events
      // unless a printAlias layout has been configured.
      mediaController.activate('slate.xl');
      expect(current.mediaQuery).toEqual(superXLQuery);

      mediaController.activate('tablet-gt-xs');
      expect(current.mqAlias).toBe('tablet-gt-xs');
      expect(current.mediaQuery).toBe(gtXsMediaQuery);

      subscription.unsubscribe();
       mediaController.clearAll();
    });
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
              ...{printWithBreakpoints: ['md']}
            }
          }
        ]
      });
    });

    beforeEach(inject([MediaObserver, MatchMedia, BREAKPOINTS],
    (_mediaObserver: MediaObserver, _mediaController: MockMatchMedia, breakpoints: BreakPoint[]) => { // tslint:disable-line:max-line-length
      knownBreakPoints = breakpoints;
      mediaObserver = _mediaObserver;
      mediaController = _mediaController;
    }));

    it('can activate when configured with "md" alias', () => {
        let current: MediaChange = new MediaChange(true);
        let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
          current = change;
        });

        try {

          mediaController.activate('lg');

          // Activate mediaQuery associated with 'md' alias
          mediaController.activate('print');
          expect(current.mqAlias).toBe('md');
          expect(current.mediaQuery).toEqual(mdMediaQuery);

          mediaController.activate('sm');
          expect(current.mqAlias).toBe('sm');

        } finally {
           mediaController.clearAll();
          subscription.unsubscribe();
        }

      });
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

    beforeEach(inject([MediaObserver, MatchMedia, BREAKPOINTS],
        (_mediaObserver: MediaObserver, _mediaController: MockMatchMedia, breakpoints: BreakPoint[]) => { // tslint:disable-line:max-line-length
          knownBreakPoints = breakpoints;
          mediaObserver = _mediaObserver;
          mediaController = _mediaController;
        }));

    afterEach(() => {
      mediaController.clearAll();
    });

    it('will skip print activation without alias', () => {
      let current: MediaChange = new MediaChange(true);
      let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
        current = change;
      });

      try {

        mediaController.activate('sm');
        expect(current.mqAlias).toBe('sm');

        // Activate mediaQuery associated with 'md' alias
        mediaController.activate('print');
        expect(current.mqAlias).toBe('sm');
        expect(current.mediaQuery).toEqual(smMediaQuery);

        mediaController.activate('xl');
        expect(current.mqAlias).toBe('xl');

      } finally {
        subscription.unsubscribe();
         mediaController.clearAll();
      }

    });
  });
});
