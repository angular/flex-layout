/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {TestBed, inject} from '@angular/core/testing';
import {BreakPoint} from '@angular/flex-layout/core';
import {Subscription} from 'rxjs';

import {MediaChange} from '../media-change';
import {MockMatchMedia, MockMatchMediaProvider} from './mock/mock-match-media';
import {BreakPointRegistry} from '../breakpoints/break-point-registry';
import {MatchMedia} from './match-media';
import {MediaObserver} from '../media-observer/media-observer';

describe('match-media', () => {
  let breakPoints: BreakPointRegistry;
  let mediaController: MockMatchMedia;

  beforeEach(() => {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [MockMatchMediaProvider]
    });
  });

  beforeEach(inject(
      [MediaObserver, MatchMedia, BreakPointRegistry],
      (_mediaObserver: MediaObserver, _matchMedia: MockMatchMedia,
       _breakPoints: BreakPointRegistry) => {
        breakPoints = _breakPoints;
        mediaController = _matchMedia;      // inject only to manually activate mediaQuery ranges
      }));

  afterEach(() => {
    mediaController.clearAll();
    mediaController.useOverlaps = false;
  });

  it('can observe the initial, default activation for mediaQuery == "all". ', () => {
    let current: MediaChange = new MediaChange();
    let subscription = mediaController
        .observe()
        .subscribe((change: MediaChange) => {
          current = change;
        });

    expect(current.mediaQuery).toEqual('all');
    subscription.unsubscribe();
  });

  it('can observe all mediaQuery activations', () => {
    let current: MediaChange = new MediaChange();
    let query1 = 'screen and (min-width: 610px) and (max-width: 620px)';
    let query2 = '(min-width: 730px) and (max-width: 950px)';

    const queries = [query1, query2];
    let subscription = mediaController.observe(queries).subscribe((change: MediaChange) => {
      current = change;
    });

    expect(current.mediaQuery).toEqual('all');    // default mediaQuery is active
    let activated = mediaController.activate(query1);    // simulate mediaQuery change to Query1
    expect(activated).toEqual(true);
    expect(current.mediaQuery).toEqual(query1);
    expect(mediaController.isActive(query1)).toBeTruthy();

    activated = mediaController.activate(query2);        // simulate mediaQuery change to Query2
    expect(activated).toEqual(true);
    expect(current.mediaQuery).toEqual(query2);   // confirm no notification
    expect(mediaController.isActive(query2)).toBeTruthy();

    subscription.unsubscribe();
  });

  it('can observe an array of custom mediaQuery ranges', () => {
    let current: MediaChange = new MediaChange(), activated;
    let query1 = 'screen and (min-width: 610px) and (max-width: 620px)';
    let query2 = '(min-width: 730px) and (max-width: 950px)';

    mediaController.registerQuery([query1, query2]);

    let subscription = mediaController.observe([query1], true).subscribe((change: MediaChange) => {
      current = change;
    });

    activated = mediaController.activate(query1);   // simulate mediaQuery change
    expect(activated).toEqual(true);
    expect(current.mediaQuery).toEqual(query1);
    expect(mediaController.isActive(query1)).toBeTruthy();

    activated = mediaController.activate(query2);   // simulate mediaQuery change
    expect(activated).toEqual(true);
    expect(mediaController.isActive(query2)).toBeTruthy();

    expect(current.mediaQuery).not.toEqual(query2);   // confirm no notification
    expect(current.mediaQuery).toEqual(query1);

    subscription.unsubscribe();
  });

  describe('match-media-observable', () => {
    const watchMedia = (alias: string, observer: (value: MediaChange) => void): Subscription => {
      return mediaController
          .observe(alias ? [alias] : [])
          .subscribe(observer);
    };

    it('can observe an existing activation', () => {
      let current: MediaChange = new MediaChange();
      let bp = breakPoints.findByAlias('md')!;
      const onChange = (change: MediaChange) => current = change;
      const subscription = watchMedia('md', onChange);

      mediaController.activate(bp.mediaQuery);
      expect(current.mediaQuery).toEqual(bp.mediaQuery);
      subscription.unsubscribe();
    });

    it('can observe the initial, default activation for mediaQuery == "all". ', () => {
      let current: MediaChange = new MediaChange();
      const onChange = (change: MediaChange) => current = change;
      const subscription = watchMedia('', onChange);

      expect(current.mediaQuery).toEqual('all');
      subscription.unsubscribe();
    });

    it('can observe custom mediaQuery ranges', () => {
      let current: MediaChange = new MediaChange();
      const customQuery = 'screen and (min-width: 610px) and (max-width: 620px)';
      const onChange = (change: MediaChange) => current = change;
      const subscription = watchMedia(customQuery, onChange);

      mediaController.useOverlaps = true;
      const activated = mediaController.activate(customQuery);

      expect(activated).toEqual(true);
      expect(current.mediaQuery).toEqual(customQuery);

      subscription.unsubscribe();
    });

    it('can observe registered breakpoint activations', () => {
      let current: MediaChange = new MediaChange();
      const onChange = (change: MediaChange) => current = change;
      const subscription = watchMedia('md', onChange);

      let bp = breakPoints.findByAlias('md') !;
      let activated = mediaController.activate(bp.mediaQuery);

      expect(activated).toEqual(true);
      expect(current.mediaQuery).toEqual(bp.mediaQuery);

      subscription.unsubscribe();
    });

    /**
     * MediaMonitor and MatchMedia report both activations and de-activations!
     * Only the MediaObserver ignores de-activations;
     */
    it('reports mediaQuery de-activations', () => {
      const lookupMediaQuery = (alias: string) => {
        const bp: BreakPoint = breakPoints.findByAlias(alias) as BreakPoint;
        return bp.mediaQuery;
      };
      let activationCount = 0, deactivationCount = 0;
      let subscription = watchMedia('', (change: MediaChange) => {
        if (change.matches) {
          activationCount += 1;
        } else {
          deactivationCount += 1;
        }
      });

      mediaController.activate(lookupMediaQuery('md'));
      mediaController.activate(lookupMediaQuery('gt-md'));
      mediaController.activate(lookupMediaQuery('lg'));

      // 'all' mediaQuery is already active; total count should be (3)
      expect(activationCount).toEqual(4);
      expect(deactivationCount).toEqual(2);

      subscription.unsubscribe();
    });

  });
});

