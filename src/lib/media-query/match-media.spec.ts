/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Observable} from 'rxjs/Observable';

import {TestBed, inject, async} from '@angular/core/testing';

import {MediaChange} from './media-change';
import {BreakPoint} from './breakpoints/break-point';
import {MockMatchMedia} from './mock/mock-match-media';
import {DEFAULT_BREAKPOINTS_PROVIDER} from './breakpoints/break-points-provider';
import {BreakPointRegistry} from './breakpoints/break-point-registry';
import {MatchMedia} from './match-media';
import {ObservableMedia} from './observable-media';
import {OBSERVABLE_MEDIA_PROVIDER} from './observable-media-provider';

describe('match-media', () => {
  let matchMedia: MockMatchMedia;

  beforeEach(() => {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [
        BreakPointRegistry,           // Registry of known/used BreakPoint(s)
        DEFAULT_BREAKPOINTS_PROVIDER, // Supports developer overrides of list of known breakpoints
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });

  // Single async inject to save references; which are used in all tests below
  beforeEach(async(inject([MatchMedia], (service) => {
    matchMedia = service;      // inject only to manually activate mediaQuery ranges
  })));
  afterEach(() => {
    matchMedia.clearAll();
  });

  it('can observe the initial, default activation for mediaQuery == "all". ', () => {
    let current: MediaChange;
    let subscription = matchMedia
        .observe()
        .subscribe((change: MediaChange) => {
          current = change;
        });
    expect(current.mediaQuery).toEqual('all');

    subscription.unsubscribe();
  });

  it('can observe all mediaQuery activations', () => {
    let current: MediaChange;
    let query1 = 'screen and (min-width: 610px) and (max-width: 620px)';
    let query2 = '(min-width: 730px) and (max-width: 950px)';

    matchMedia.registerQuery(query1);
    matchMedia.registerQuery(query2);

    let media$ = matchMedia.observe();
    let subscription = media$.subscribe((change: MediaChange) => {
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
    let current: MediaChange = undefined, activated;
    let query1 = 'screen and (min-width: 610px) and (max-width: 620px)';
    let query2 = '(min-width: 730px) and (max-width: 950px)';

    matchMedia.registerQuery([query1, query2]);

    let subscription = matchMedia.observe(query1).subscribe((change: MediaChange) => {
      current = change;
    });
    expect(current).toBeUndefined();   // no notification for the default, active mediaQuery

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
  let mediaQuery$: Observable<MediaChange>;

  beforeEach(() => {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [
        DEFAULT_BREAKPOINTS_PROVIDER,  // Supports developer overrides of list of known breakpoints
        BreakPointRegistry,   // Registry of known/used BreakPoint(s)
        OBSERVABLE_MEDIA_PROVIDER,  // injectable `media$` matchMedia observable
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });

  // Single async inject to save references; which are used in all tests below
  beforeEach(async(inject(
      [ObservableMedia, MatchMedia, BreakPointRegistry],
      (_media$, _matchMedia, _breakPoints) => {
        matchMedia = _matchMedia;      // inject only to manually activate mediaQuery ranges
        breakPoints = _breakPoints;
        mediaQuery$ = _media$;

        // Quick register all breakpoint mediaQueries
        breakPoints.items.forEach((bp: BreakPoint) => {
          matchMedia.observe(bp.mediaQuery);
        });
      })));
  afterEach(() => {
    matchMedia.clearAll();
  });

  it('can observe an existing activation', () => {
    let current: MediaChange = undefined;
    let bp = breakPoints.findByAlias('md');
    matchMedia.activate(bp.mediaQuery);
    let subscription = mediaQuery$.subscribe((change: MediaChange) => {
      current = change;
    });

    expect(current.mediaQuery).toEqual(bp.mediaQuery);

    subscription.unsubscribe();
  });

  it('can observe the initial, default activation for mediaQuery == "all". ', () => {
    let current: MediaChange;
    let subscription = mediaQuery$.subscribe((change: MediaChange) => {
      current = change;
    });
    expect(current.mediaQuery).toEqual('all');

    subscription.unsubscribe();
  });

  it('can observe custom mediaQuery ranges', () => {
    let current: MediaChange;
    let customQuery = 'screen and (min-width: 610px) and (max-width: 620px';
    let subscription = mediaQuery$.subscribe((change: MediaChange) => {
      current = change;
    });

    let activated = matchMedia.activate(customQuery);
    expect(activated).toEqual(true);
    expect(current.mediaQuery).toEqual(customQuery);

    subscription.unsubscribe();
  });

  it('can observe registered breakpoint activations', () => {
    let current: MediaChange;
    let bp = breakPoints.findByAlias('md');
    let subscription = mediaQuery$.subscribe((change: MediaChange) => {
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
    let subscription = mediaQuery$.subscribe((change: MediaChange) => {
      if (change.matches) {
        ++activationCount;
      } else {
        ++deactivationCount;
      }
    });

    matchMedia.activate(breakPoints.findByAlias('md').mediaQuery);
    matchMedia.activate(breakPoints.findByAlias('gt-md').mediaQuery);

    // 'all' mediaQuery is already active; total count should be (3)

    expect(activationCount).toEqual(2);
    expect(deactivationCount).toEqual(0);

    subscription.unsubscribe();
  });

});
