/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {TestBed, inject} from '@angular/core/testing';

import {MediaChange} from '../media-change';
import {MockMatchMedia, MockMatchMediaProvider} from './mock/mock-match-media';
import {BreakPointRegistry} from '../breakpoints/break-point-registry';
import {MatchMedia} from './match-media';
import {MediaObserver} from '../media-observer/media-observer';

describe('match-media', () => {
  let matchMedia: MockMatchMedia;

  beforeEach(() => {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [MockMatchMediaProvider]
    });
  });

  beforeEach(inject([MatchMedia], (service: MockMatchMedia) => {
    matchMedia = service;      // inject only to manually activate mediaQuery ranges
  }));
  afterEach(() => {
    matchMedia.clearAll();
  });

  it('can observe the initial, default activation for mediaQuery == "all". ', () => {
    let current: MediaChange = new MediaChange();
    let subscription = matchMedia
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
    let subscription = matchMedia.observe(queries).subscribe((change: MediaChange) => {
      current = change;
    });

    expect(current.mediaQuery).toEqual('all');    // default mediaQuery is active
    let activated = matchMedia.activate(query1);    // simulate mediaQuery change to Query1
    expect(activated).toEqual(true);
    expect(current.mediaQuery).toEqual(query1);
    expect(matchMedia.isActive(query1)).toBeTruthy();

    activated = matchMedia.activate(query2);        // simulate mediaQuery change to Query2
    expect(activated).toEqual(true);
    expect(current.mediaQuery).toEqual(query2);   // confirm no notification
    expect(matchMedia.isActive(query2)).toBeTruthy();

    subscription.unsubscribe();
  });

  it('can observe an array of custom mediaQuery ranges', () => {
    let current: MediaChange = new MediaChange(), activated;
    let query1 = 'screen and (min-width: 610px) and (max-width: 620px)';
    let query2 = '(min-width: 730px) and (max-width: 950px)';

    matchMedia.registerQuery([query1, query2]);

    let subscription = matchMedia.observe([query1], true).subscribe((change: MediaChange) => {
      current = change;
    });

    activated = matchMedia.activate(query1);   // simulate mediaQuery change
    expect(activated).toEqual(true);
    expect(current.mediaQuery).toEqual(query1);
    expect(matchMedia.isActive(query1)).toBeTruthy();

    activated = matchMedia.activate(query2);   // simulate mediaQuery change
    expect(activated).toEqual(true);
    expect(matchMedia.isActive(query2)).toBeTruthy();

    expect(current.mediaQuery).not.toEqual(query2);   // confirm no notification
    expect(current.mediaQuery).toEqual(query1);

    subscription.unsubscribe();
  });

});

describe('match-media-observable', () => {
  let breakPoints: BreakPointRegistry;
  let matchMedia: MockMatchMedia;
  let mediaObserver: MediaObserver;

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
        matchMedia = _matchMedia;      // inject only to manually activate mediaQuery ranges
        breakPoints = _breakPoints;
        mediaObserver = _mediaObserver;
      }));
  afterEach(() => {
    matchMedia.clearAll();
  });

  it('can observe an existing activation', () => {
    let current: MediaChange = new MediaChange();
    let bp = breakPoints.findByAlias('md')!;
    matchMedia.activate(bp.mediaQuery);
    let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
      current = change;
    });

    expect(current.mediaQuery).toEqual(bp.mediaQuery);
    subscription.unsubscribe();
  });

  it('can observe the initial, default activation for mediaQuery == "all". ', () => {
    let current: MediaChange = new MediaChange();
    let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
      current = change;
    });

    expect(current.mediaQuery).toEqual('all');
    subscription.unsubscribe();
  });

  it('can observe custom mediaQuery ranges', () => {
    let current: MediaChange = new MediaChange();
    let customQuery = 'screen and (min-width: 610px) and (max-width: 620px)';
    let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
      current = change;
    });

    matchMedia.useOverlaps = true;
    let activated = matchMedia.activate(customQuery);
    expect(activated).toEqual(true);
    expect(current.mediaQuery).toEqual(customQuery);

    subscription.unsubscribe();
  });

  it('can observe registered breakpoint activations', () => {
    let current: MediaChange = new MediaChange();
    let bp = breakPoints.findByAlias('md') !;
    let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
      current = change;
    });

    let activated = matchMedia.activate(bp.mediaQuery);
    expect(activated).toEqual(true);

    expect(current.mediaQuery).toEqual(bp.mediaQuery);

    subscription.unsubscribe();
  });

  /**
   * Only the ObservableMedia ignores de-activations;
   * MediaMonitor and MatchMedia report both activations and de-activations!
   */
  it('ignores mediaQuery de-activations', () => {
    let activationCount = 0;
    let deactivationCount = 0;

    mediaObserver.filterOverlaps = false;
    let subscription = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.matches) {
        ++activationCount;
      } else {
        ++deactivationCount;
      }
    });

    matchMedia.activate(breakPoints.findByAlias('md')!.mediaQuery);
    matchMedia.activate(breakPoints.findByAlias('gt-md')!.mediaQuery);

    // 'all' mediaQuery is already active; total count should be (3)
    expect(activationCount).toEqual(3);
    expect(deactivationCount).toEqual(0);

    subscription.unsubscribe();
  });

});
