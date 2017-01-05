// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {TestBed, inject, async} from '@angular/core/testing';

import {MediaChange} from '../media-change';
import {BreakPoint} from '../breakpoints/break-point';
import {MockMatchMedia} from './mock-match-media';
import {BreakPointRegistry} from '../breakpoints/break-point-registry';
import {BreakPointsProvider} from '../providers/break-points-provider';

describe('mock-match-media', () => {
  let breakPoints: BreakPointRegistry;
  let matchMedia: MockMatchMedia;

  beforeEach(() => {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [
        MockMatchMedia,
        BreakPointRegistry,   // Registry of known/used BreakPoint(s)
        BreakPointsProvider,  // Supports developer overrides of list of known breakpoints
      ]
    });
  });
  beforeEach(async(inject([MockMatchMedia, BreakPointRegistry], (_matchMedia_, _breakPoints_) => {
    // Single async inject to save references; which are used in all tests below
    matchMedia = _matchMedia_;
    breakPoints = _breakPoints_;

    breakPoints.items.forEach((bp: BreakPoint) => {
      matchMedia.observe(bp.mediaQuery);
    });
  })));
  afterEach(() => {
    matchMedia.clearAll();
  });

  it('can observe custom mediaQuery ranges', () => {
    let current: MediaChange;
    let customQuery = "screen and (min-width: 610px) and (max-width: 620px";
    let subscription = matchMedia.observe(customQuery)
        .subscribe((change: MediaChange) => {
          current = change;
        });

    let activated = matchMedia.activate(customQuery);
    expect(activated).toEqual(true);
    expect(current.mediaQuery).toEqual(customQuery);

    subscription.unsubscribe();
  });


  it('can observe a media query change for each breakpoint', () => {
    let current: MediaChange;
    let subscription = matchMedia.observe().subscribe((change: MediaChange) => {
      current = change;
    });

    breakPoints.items.forEach((bp: BreakPoint) => {
      matchMedia.activate(bp.mediaQuery);
      expect(current).not.toBeFalsy();
      expect(current.mediaQuery).toEqual(bp.mediaQuery);
    });

    subscription.unsubscribe();
  });

  it('can observe ALL media query changes', () => {
    let current: MediaChange,
        mqcGtSM: MediaChange,
        bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    let subscription = matchMedia.observe().subscribe((change: MediaChange) => {
      current = change;
    });

    matchMedia.activate(bpGtSM.mediaQuery);
    expect(current).not.toBeFalsy();
    expect(current.mediaQuery).toEqual(bpGtSM.mediaQuery);
    expect(matchMedia.isActive(bpGtSM.mediaQuery)).toBeTruthy();

    mqcGtSM = current;

    matchMedia.activate(bpLg.mediaQuery);
    expect(current.mediaQuery).not.toEqual(mqcGtSM.mediaQuery);
    expect(matchMedia.isActive(bpLg.mediaQuery)).toBeTruthy();
    expect(matchMedia.isActive(bpGtSM.mediaQuery)).toBeFalsy();

    subscription.unsubscribe();
  });

  it('can observe only a specific media query changes', () => {
    let current: MediaChange,
        bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    let subscription = matchMedia.observe(bpLg.mediaQuery).subscribe((change: MediaChange) => {
      current = change;
    });

    matchMedia.activate(bpGtSM.mediaQuery);
    expect(current).toBeFalsy();

    matchMedia.activate(bpLg.mediaQuery);
    expect(current).toBeTruthy();
    expect(current.mediaQuery).toEqual(bpLg.mediaQuery);
    expect(matchMedia.isActive(bpLg.mediaQuery)).toBeTruthy();

    subscription.unsubscribe();
  });

  it('can observe both activation and deactivation changes', () => {
    let activates = 0, deactivates = 0;
    let bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    // By default the "all" is initially active.

    let subscription = matchMedia.observe().subscribe((change: MediaChange) => {
      if (change.matches) {
        ++activates;
      } else {
        ++deactivates;
      }
    });

    expect(activates).toEqual(1);

    matchMedia.activate(bpGtSM.mediaQuery);
    expect(activates).toEqual(2);
    expect(deactivates).toEqual(0);

    matchMedia.activate(bpLg.mediaQuery);
    expect(activates).toEqual(3);
    expect(deactivates).toEqual(1);

    matchMedia.activate(bpGtSM.mediaQuery);
    expect(activates).toEqual(4);
    expect(deactivates).toEqual(2);

    subscription.unsubscribe();
  });

  it('can observe both activated & deactivated changes for specific mediaQueries', () => {
    let activates = 0, deactivates = 0;
    let bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    let subscription = matchMedia.observe(bpGtSM.mediaQuery).subscribe((change: MediaChange) => {
      if (change.matches) {
        ++activates;
      } else { ++deactivates; }
    });

    expect(activates).toEqual(0);   // from alias == '' == 'all'

    matchMedia.activate(bpGtSM.mediaQuery);
    expect(activates).toEqual(1);
    expect(deactivates).toEqual(0);

    matchMedia.activate(bpLg.mediaQuery);
    expect(activates).toEqual(1);
    expect(deactivates).toEqual(1);

    matchMedia.activate(bpGtSM.mediaQuery);
    expect(activates).toEqual(2);
    expect(deactivates).toEqual(1);

    subscription.unsubscribe();
  });

  it('can activate with either a mediaQuery or an alias', () => {
    let activates = 0;
    let bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    let subscription = matchMedia.observe().subscribe((change: MediaChange) => {
      if (change.matches) { ++activates; }
    });

    expect(activates).toEqual(1);   // from alias == '' == 'all'

    matchMedia.activate(bpGtSM.mediaQuery);
    expect(activates).toEqual(2);

    matchMedia.activate(bpLg.mediaQuery);
    expect(activates).toEqual(3);

    matchMedia.activate(bpGtSM.mediaQuery);
    expect(activates).toEqual(4);

    matchMedia.activate(bpLg.mediaQuery);
    expect(activates).toEqual(5);

    subscription.unsubscribe();
  });

  it('can check if a range is active', () => {
    let bpXs = breakPoints.findByAlias('xs'),
        bpGtXs = breakPoints.findByAlias('gt-xs'),
        bpSm = breakPoints.findByAlias('sm'),
        bpGtSm = breakPoints.findByAlias('gt-sm'),
        bpMd = breakPoints.findByAlias('md'),
        bpGtMd = breakPoints.findByAlias('gt-md'),
        bpLg = breakPoints.findByAlias('lg');
    let subscription = matchMedia.observe().subscribe(() => {
    });

    matchMedia.activate(bpGtSm.mediaQuery);
    expect(matchMedia.isActive(bpGtSm.mediaQuery)).toBeTruthy();
    expect(matchMedia.isActive(bpLg.mediaQuery)).toBeFalsy();

    matchMedia.activate(bpLg.mediaQuery);
    expect(matchMedia.isActive(bpGtSm.mediaQuery)).toBeFalsy();
    expect(matchMedia.isActive(bpLg.mediaQuery)).toBeTruthy();

    matchMedia.activate(bpGtSm.mediaQuery);
    expect(matchMedia.isActive(bpXs.mediaQuery)).toBeFalsy();
    expect(matchMedia.isActive(bpGtXs.mediaQuery)).toBeFalsy();
    expect(matchMedia.isActive(bpSm.mediaQuery)).toBeFalsy();
    expect(matchMedia.isActive(bpGtSm.mediaQuery)).toBeTruthy();
    expect(matchMedia.isActive(bpMd.mediaQuery)).toBeFalsy();
    expect(matchMedia.isActive(bpGtMd.mediaQuery)).toBeFalsy();
    expect(matchMedia.isActive(bpLg.mediaQuery)).toBeFalsy();

    subscription.unsubscribe();
  });
});
