/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {TestBed, inject, fakeAsync, tick} from '@angular/core/testing';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

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
  let media$: Observable<MediaChange[]>;
  let mediaObserver: MediaObserver;
  let mediaController: MockMatchMedia;
  const activateQuery = (alias: string, useOverlaps?: boolean) => {
      mediaController.activate(alias, useOverlaps);
      tick(100);  // Since MediaObserver has 50ms debounceTime
  };

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

      media$ = _mediaObserver.asObservable();
    }));

    afterEach(() => {
      mediaController.clearAll();
      mediaController.useOverlaps = false;
    });

    let findMediaQuery: (alias: string) => string = (alias) => {
      const NOT_FOUND = `${alias} not found`;
      return knownBreakPoints.reduce((mediaQuery: string | null, bp) => {
        return mediaQuery ?? ((bp.alias === alias) ? bp.mediaQuery : null);
      }, null) as string ?? NOT_FOUND;
    };
    it('can supports the `.isActive()` API', () => {
      expect(media$).toBeDefined();

      mediaController.autoRegisterQueries = false;
      // Activate mediaQuery associated with 'md' alias
      mediaController.activate('md');
      expect(mediaObserver.isActive('md')).toBeTruthy();

      mediaController.activate('lg');
      expect(mediaObserver.isActive('lg')).toBeTruthy();
      expect(mediaObserver.isActive('md')).toBeFalsy();

      mediaController.clearAll();
    });

    it('can supports RxJS operators', fakeAsync(() => {
      let count = 0,
          onlyMd = (change: MediaChange) => (change.mqAlias == 'md'),
          subscription = media$
              .pipe(switchMap(changes => changes.filter(onlyMd)))
              .subscribe(_ => {
            count += 1;
          });

      // Activate mediaQuery associated with 'md' alias
      activateQuery('sm');
      expect(count).toEqual(0);

      activateQuery('md');
      expect(count).toEqual(1);

      activateQuery('lg');
      expect(count).toEqual(1);

      activateQuery('md');
      expect(count).toEqual(2);

      activateQuery('gt-md');
      activateQuery('gt-lg');
      activateQuery('invalid');
      expect(count).toEqual(2);

      subscription.unsubscribe();
    }));

    it('only gets one substantive update per media change set', fakeAsync(() => {
      let count = 0;
      const subscription = mediaObserver.asObservable()
        .subscribe(_changes => {
          count += 1;
        });

      // Not a duplicate. This is intentional.
      activateQuery('sm', true);
      activateQuery('sm', true);
      expect(count).toEqual(1);

      activateQuery('md', true);
      expect(count).toEqual(2);

      activateQuery('xl', true);
      expect(count).toEqual(3);

      subscription.unsubscribe();
    }));

    it('can subscribe to built-in mediaQueries',  fakeAsync(() => {
      let current: MediaChange[] = [new MediaChange(true)];
      let subscription = media$.subscribe((changes: MediaChange[]) => {
        current = changes;
      });

      expect(media$).toBeDefined();

      tick(100);

      // Confirm initial match is for 'all'
      expect(current).toBeDefined();
      expect(current[0].matches).toBeTruthy();
      expect(current[0].mediaQuery).toEqual('all');

      try {
        // Allow overlapping activations to be announced to observers
        mediaController.autoRegisterQueries = false;
        mediaObserver.filterOverlaps = false;

        // Activate mediaQuery associated with 'md' alias
        activateQuery('md');
        expect(current[0].mediaQuery).toEqual(findMediaQuery('md'));

        activateQuery('gt-lg');
        expect(current[0].mediaQuery).toEqual(findMediaQuery('gt-lg'));
      } finally {
        mediaController.autoRegisterQueries = true;
        subscription.unsubscribe();
      }
    }));

    it('can `.unsubscribe()` properly', fakeAsync(() => {
      let current: MediaChange[] = [new MediaChange(true)];
      let subscription = media$.subscribe((changes: MediaChange[]) => {
        current = changes;
      });

      // Activate mediaQuery associated with 'md' alias
      activateQuery('md');
      expect(current[0].mediaQuery).toEqual(findMediaQuery('md'));

      // Un-subscribe
      subscription.unsubscribe();

      activateQuery('lg');
      expect(current[0].mqAlias).toBe('md');

      activateQuery('xs');
      expect(current[0].mqAlias).toBe('md');

       mediaController.clearAll();
    }));

    it('can observe a startup activation of XS', fakeAsync(() => {
      let current: MediaChange[] = [new MediaChange(true)];
      let subscription = media$.subscribe((changes: MediaChange[]) => {
        current = changes;
      });

      // Activate mediaQuery associated with 'md' alias
      activateQuery('xs');
      expect(current[0].mediaQuery).toEqual(findMediaQuery('xs'));

      // Un-subscribe
      subscription.unsubscribe();

      activateQuery('lg');
      expect(current[0].mqAlias).toBe('xs');

       mediaController.clearAll();
    }));
  });

  describe('with custom BreakPoints', () => {
    const gtXsMediaQuery = 'screen and (min-width:120px) and (orientation:landscape)';
    const superXLQuery = 'screen and (min-width:10000px)';
    const smMediaQuery = 'screen and (min-width: 600px) and (max-width: 959.98px)';

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

          media$ = _mediaObserver.asObservable();
        }));

    afterEach(() => {
      mediaController.clearAll();
    });

    it('can activate custom alias with custom mediaQueries', fakeAsync(() => {
      let current: MediaChange = new MediaChange(true);
      let subscription = mediaObserver.asObservable()
            .subscribe((changes: MediaChange[]) => {
              current = changes[0];
            });

      // Activate mediaQuery associated with 'md' alias
      activateQuery('sm');
      expect(current.mediaQuery).toEqual(smMediaQuery);

      // MediaObserver will not announce print events
      // unless a printAlias layout has been configured.
      activateQuery('slate.xl');
      expect(current.mediaQuery).toEqual(superXLQuery);

      activateQuery('tablet-gt-xs');
      expect(current.mqAlias).toBe('tablet-gt-xs');
      expect(current.mediaQuery).toBe(gtXsMediaQuery);

      subscription.unsubscribe();
    }));
  });

  describe('with layout "print" configured', () => {
    const mdMediaQuery = 'screen and (min-width: 960px) and (max-width: 1279.98px)';

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

      media$ = _mediaObserver.asObservable();
    }));

    it('can activate when configured with "md" alias', fakeAsync(() => {
        let current: MediaChange[] = [new MediaChange(true)];
        let subscription = media$.subscribe((changes: MediaChange[]) => {
          current = changes;
        });

        try {
          activateQuery('lg');

          // Activate mediaQuery associated with 'md' alias
          activateQuery('print');
          expect(current[0].mqAlias).toBe('md');
          expect(current[0].mediaQuery).toEqual(mdMediaQuery);

          activateQuery('sm');
          expect(current[0].mqAlias).toBe('sm');

        } finally {
          subscription.unsubscribe();
        }

      }));
  });

  describe('with layout print NOT configured', () => {
    const smMediaQuery = 'screen and (min-width: 600px) and (max-width: 959.98px)';

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

          media$ = _mediaObserver.asObservable();
        }));

    afterEach(() => {
      mediaController.clearAll();
    });

    it('will skip print activation without alias', fakeAsync(() => {
      let current: MediaChange[] = [new MediaChange(true)];
      let subscription = media$.subscribe((changes: MediaChange[]) => {
        current = changes;
      });

      try {
        activateQuery('sm');
        expect(current[0].mqAlias).toBe('sm');

        // Activate mediaQuery associated with 'md' alias
        activateQuery('print');
        expect(current[0].mqAlias).toBe('sm');
        expect(current[0].mediaQuery).toEqual(smMediaQuery);

        activateQuery('xl');
        expect(current[0].mqAlias).toBe('xl');

      } finally {
        subscription.unsubscribe();
         mediaController.clearAll();
      }

    }));
  });
});
