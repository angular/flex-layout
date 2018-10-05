/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TestBed, inject, async} from '@angular/core/testing';

import {BreakPoint} from '../break-point';
import {DEFAULT_BREAKPOINTS} from './break-points';
import {ORIENTATION_BREAKPOINTS} from './orientation-break-points';
import {BREAKPOINTS} from '../break-points-token';
import {FlexLayoutModule} from '../../../module';

describe('break-point-provider', () => {
  let breakPoints: BreakPoint[];
  let findByAlias = (alias: string): BreakPoint|null => breakPoints.reduce((pos: BreakPoint | null, it) => {
    return pos || ((it.alias == alias) ? it : null);
  }, null);

  describe('with default breakpoints only', () => {
    beforeEach(async(inject([BREAKPOINTS], (bps: BreakPoint[]) => {
      breakPoints = bps;
    })));

    it('has the only standard default breakpoints without internal custom breakpoints', () => {
      const total = DEFAULT_BREAKPOINTS.length;

      expect(breakPoints.length).toEqual(total);
      expect(findByAlias('xs')).toBeDefined();
      expect(findByAlias('web.portrait')).toBeNull();
    });
  });

  describe('with merged custom breakpoints', () => {
    let bpList: BreakPoint[];
    const EXTRAS: BreakPoint[] = [
      {alias: 'lt-ab', mediaQuery: '(max-width: 297px)'},
      {alias: 'cd', mediaQuery: '(min-width: 298px) and (max-width:414px)'}
    ];

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        imports: [FlexLayoutModule.withConfig({}, EXTRAS)]
      });
    });
    beforeEach(async(inject([BREAKPOINTS], (bps: BreakPoint[]) => {
      bpList = bps;
    })));

    it('has the custom breakpoints', () => {
      const total = DEFAULT_BREAKPOINTS.length + EXTRAS.length;

      expect(bpList.length).toEqual(total);
      expect(bpList[bpList.length - 2].alias).toEqual('lt-ab');
      expect(bpList[bpList.length - 2].suffix).toEqual('LtAb');
      expect(bpList[bpList.length - 1].alias).toEqual('cd');
      expect(bpList[bpList.length - 1].suffix).toEqual('Cd');
    });
  });

  describe('with custom breakpoint overrides', () => {
    const gtXsMediaQuery = 'screen and (max-width:20px) and (orientations: landscape)';
    const mdMediaQuery = 'print and (min-width:10000px)';
    const EXTRAS: BreakPoint[] = [
      {alias: 'md', mediaQuery: mdMediaQuery},
      {alias: 'gt-xs', mediaQuery: gtXsMediaQuery},
      {alias: 'lt-ab', mediaQuery: '(max-width: 297px)'},
      {alias: 'cd', mediaQuery: '(min-width: 298px) and (max-width:414px)'}
    ];
    const NUM_EXTRAS = 2;   // since md and gt-xs will not be added but merged
    let bpList: BreakPoint[];
    let accumulator: BreakPoint | null = null;
    let byAlias = (alias: string): BreakPoint | null => bpList.reduce((pos, it) => {
      return pos || ((it.alias === alias) ? it : null);
    }, accumulator);

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        imports: [FlexLayoutModule.withConfig({addOrientationBps: true}, EXTRAS)]
      });
    });
    // tslint:disable-next-line:no-shadowed-variable
    beforeEach(async(inject([BREAKPOINTS], (breakPoints: BreakPoint[]) => {
      bpList = breakPoints;
    })));

    it('has merged the custom breakpoints as overrides to existing defaults', () => {
      const total = ORIENTATION_BREAKPOINTS.length + DEFAULT_BREAKPOINTS.length + NUM_EXTRAS;

      expect(bpList.length).toEqual(total);

      expect(byAlias('gt-xs')).toBeDefined();
      expect(byAlias('gt-xs')!.mediaQuery).toEqual(gtXsMediaQuery);

      expect(byAlias('md')).toBeDefined();
      expect(byAlias('md')!.mediaQuery).toEqual(mdMediaQuery);
    });

    it('can extend existing default breakpoints with custom settings', () => {
      const total = ORIENTATION_BREAKPOINTS.length + DEFAULT_BREAKPOINTS.length + NUM_EXTRAS;

      expect(bpList.length).toEqual(total);
      expect(bpList[bpList.length - 2].alias).toEqual('lt-ab');
      expect(bpList[bpList.length - 2].suffix).toEqual('LtAb');
      expect(bpList[bpList.length - 1].alias).toEqual('cd');
      expect(bpList[bpList.length - 1].suffix).toEqual('Cd');
    });
  });

  describe('with exclusive custom breakpoints', () => {
    let bpList: BreakPoint[];
    const EXTRAS: BreakPoint[] = [
      {alias: 'lt-ab', mediaQuery: '(max-width: 297px)'},
      {alias: 'cd', mediaQuery: '(min-width: 298px) and (max-width: 414px)'}
    ];

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        imports: [FlexLayoutModule.withConfig({disableDefaultBps: true}, EXTRAS)]
      });
    });
    beforeEach(async(inject([BREAKPOINTS], (bps: BreakPoint[]) => {
      bpList = bps;
    })));

    it('has the only the registered custom breakpoints; defaults are excluded.', () => {
      const total = EXTRAS.length;

      expect(bpList.length).toEqual(total);
      expect(bpList[bpList.length - 1].alias).toEqual('cd');
      expect(bpList[bpList.length - 1].suffix).toEqual('Cd');
      expect(bpList[bpList.length - 2].alias).toEqual('lt-ab');
      expect(bpList[bpList.length - 2].suffix).toEqual('LtAb');
    });
  });

});
