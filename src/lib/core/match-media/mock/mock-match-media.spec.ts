/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TestBed, inject} from '@angular/core/testing';

import {MatchMedia} from '../../match-media/match-media';
import {MediaChange} from '../../media-change';
import {BreakPoint} from '../../breakpoints/break-point';
import {MockMatchMedia, MockMatchMediaProvider} from './mock-match-media';
import {BreakPointRegistry} from '../../breakpoints/break-point-registry';

describe('mock-match-media', () => {
  let breakPoints: BreakPointRegistry;
  let mediaController: MockMatchMedia;

  beforeEach(() => {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [MockMatchMediaProvider]
    });
  });

  beforeEach(inject([MatchMedia, BreakPointRegistry],
  (_matchMedia: MockMatchMedia, _breakPoints: BreakPointRegistry) => {
    mediaController = _matchMedia;
    breakPoints = _breakPoints;

    breakPoints.items.forEach((bp: BreakPoint) => {
      mediaController.observe([bp.mediaQuery]);
    });
  }));

  afterEach(() => {
    mediaController.clearAll();
  });

  it('can observe custom mediaQuery ranges', () => {
    let current: MediaChange = new MediaChange();
    let customQuery = 'screen and (min-width: 610px) and (max-width: 620px';
    let subscription = mediaController.observe([customQuery])
        .subscribe((change: MediaChange) => {
          current = change;
        });

    let activated = mediaController.activate(customQuery);
    expect(activated).toEqual(true);
    expect(current.mediaQuery).toEqual(customQuery);

    subscription.unsubscribe();
  });

  it('can observe a media query change for each breakpoint', () => {
    let current: MediaChange;
    let subscription = mediaController.observe().subscribe((change: MediaChange) => {
      current = change;
    });

    breakPoints.items.forEach((bp: BreakPoint) => {
      mediaController.activate(bp.mediaQuery);
      expect(current).not.toBeFalsy();
      expect(current.mediaQuery).toEqual(bp.mediaQuery);
    });

    subscription.unsubscribe();
  });

  it('can observe ALL media query changes', () => {
    let current: MediaChange = new MediaChange(),
        mqcGtSM: MediaChange = new MediaChange(),
        bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    let subscription = mediaController.observe().subscribe((change: MediaChange) => {
      current = change;
    });

    mediaController.activate(bpGtSM!.mediaQuery);

    expect(current).not.toBeFalsy();
    expect(current.mediaQuery).toEqual(bpGtSM!.mediaQuery);
    expect(mediaController.isActive(bpGtSM!.mediaQuery)).toBeTruthy();

    mqcGtSM = current;

    mediaController.activate(bpLg!.mediaQuery);
    expect(current.mediaQuery).not.toEqual(mqcGtSM.mediaQuery);
    expect(mediaController.isActive(bpLg!.mediaQuery)).toBeTruthy();
    expect(mediaController.isActive(bpGtSM!.mediaQuery)).toBeFalsy();

    subscription.unsubscribe();
  });

  it('can observe only a specific media query changes', () => {
    let current: MediaChange = new MediaChange(),
        bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');
    let subscription = mediaController
        .observe([bpLg!.mediaQuery])
        .subscribe((change: MediaChange) => {
          current = change;
        });

    expect(current.matches).toBeTruthy(); // Match 'all'

    mediaController.activate(bpGtSM!.mediaQuery);

    expect(current.matches).toBeTruthy();

    mediaController.activate(bpLg!.mediaQuery);
    expect(current).toBeTruthy();
    expect(current.mediaQuery).toEqual(bpLg!.mediaQuery);
    expect(mediaController.isActive(bpLg!.mediaQuery)).toBeTruthy();

    subscription.unsubscribe();
  });

  it('can observe both activation and deactivation changes', () => {
    let activates = 0, deactivates = 0;
    let bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    // By default the 'all' is initially active.
    let subscription = mediaController.observe().subscribe((change: MediaChange) => {
      if (change.matches) {
        ++activates;
      } else {
        ++deactivates;
      }
    });

    expect(activates).toEqual(1);

    mediaController.activate(bpGtSM!.mediaQuery);
    expect(activates).toEqual(2);
    expect(deactivates).toEqual(0);

    mediaController.activate(bpLg!.mediaQuery);
    expect(activates).toEqual(3);
    expect(deactivates).toEqual(1);

    mediaController.activate(bpGtSM!.mediaQuery);
    expect(activates).toEqual(4);
    expect(deactivates).toEqual(2);

    subscription.unsubscribe();
  });

  it('can observe both activated & deactivated changes for specific mediaQueries', () => {
    let activates = 0, deactivates = 0;
    let bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    let subscription = mediaController
        .observe([bpGtSM!.mediaQuery], true)
        .subscribe((change: MediaChange) => {
          if (change.matches) {
            ++activates;
          } else {
            ++deactivates;
          }
        });

    expect(activates).toEqual(0);   // from alias == '' == 'all'
    mediaController.activate(bpGtSM!.mediaQuery);
    expect(activates).toEqual(1);
    expect(deactivates).toEqual(0);

    mediaController.activate(bpLg!.mediaQuery);
    expect(activates).toEqual(1);
    expect(deactivates).toEqual(1);

    mediaController.activate(bpGtSM!.mediaQuery);
    expect(activates).toEqual(2);
    expect(deactivates).toEqual(1);

    subscription.unsubscribe();
  });

  it('can onMediaChange with either a mediaQuery or an alias', () => {
    let activates = 0;
    let bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    let subscription = mediaController.observe().subscribe((change: MediaChange) => {
      if (change.matches) {
        ++activates;
      }
    });

    expect(activates).toEqual(1);   // from alias == '' == 'all'
    mediaController.activate(bpGtSM!.mediaQuery);
    expect(activates).toEqual(2);

    mediaController.activate(bpLg!.mediaQuery);
    expect(activates).toEqual(3);

    mediaController.activate(bpGtSM!.mediaQuery);
    expect(activates).toEqual(4);

    mediaController.activate(bpLg!.mediaQuery);
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
    let subscription = mediaController.observe().subscribe(() => {
    });

    mediaController.activate(bpGtSm!.mediaQuery);
    expect(mediaController.isActive(bpGtSm!.mediaQuery)).toBeTruthy();
    expect(mediaController.isActive(bpLg!.mediaQuery)).toBeFalsy();

    mediaController.activate(bpLg!.mediaQuery);
    expect(mediaController.isActive(bpGtSm!.mediaQuery)).toBeFalsy();
    expect(mediaController.isActive(bpLg!.mediaQuery)).toBeTruthy();

    mediaController.activate(bpGtSm!.mediaQuery);
    expect(mediaController.isActive(bpXs!.mediaQuery)).toBeFalsy();
    expect(mediaController.isActive(bpGtXs!.mediaQuery)).toBeFalsy();
    expect(mediaController.isActive(bpSm!.mediaQuery)).toBeFalsy();
    expect(mediaController.isActive(bpGtSm!.mediaQuery)).toBeTruthy();
    expect(mediaController.isActive(bpMd!.mediaQuery)).toBeFalsy();
    expect(mediaController.isActive(bpGtMd!.mediaQuery)).toBeFalsy();
    expect(mediaController.isActive(bpLg!.mediaQuery)).toBeFalsy();

    subscription.unsubscribe();
  });

  it('can observe a startup activation of XS', () => {
    let current: MediaChange = new MediaChange(),
        bpXS = breakPoints.findByAlias('xs');

    mediaController.activate(bpXS!.mediaQuery);
    let subscription = mediaController.observe([bpXS!.mediaQuery])
        .subscribe((change: MediaChange) => {
          current = change;
        });

    expect(current).toBeTruthy();
    expect(current.mediaQuery).toEqual(bpXS!.mediaQuery);
    expect(mediaController.isActive(bpXS!.mediaQuery)).toBeTruthy();

    subscription.unsubscribe();
  });
});
