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
  const findByAlias = (alias: string): BreakPoint|null => {
      let result = null;
       breakPoints.forEach(bp => {
          if (bp.alias === alias) {
            result = {...bp};
          }
      });
      return result;
    };

  describe('with default breakpoints only', () => {
    beforeEach(inject([BREAKPOINTS], (bps: BreakPoint[]) => {
      breakPoints = bps;
    }));

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
        imports: [FlexLayoutModule.withConfig({serverLoaded: true}, EXTRAS)]
      });
    });
    beforeEach(inject([BREAKPOINTS], (bps: BreakPoint[]) => {
      bpList = bps;
    }));

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
    const xxxlQuery = 'screen and (min-width:10000px)';
    const EXTRAS: BreakPoint[] = [
      {alias: 'xxl',  priority: 2000, mediaQuery: xxxlQuery},
      {alias: 'gt-xsl', priority: 2000, mediaQuery: gtXsMediaQuery},
      {alias: 'lt-ab', priority: 2000, mediaQuery: '(max-width: 297px)'},
      {alias: 'cd', priority: 2000, mediaQuery: '(min-width: 298px) and (max-width:414px)'}
    ];
    let bpList: BreakPoint[];
    let accumulator: BreakPoint | null = null;
    let byAlias = (alias: string): BreakPoint | null => bpList.reduce((pos, it) => {
      return pos || ((it.alias === alias) ? it : null);
    }, accumulator);

    beforeEach(async (() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        imports: [
          FlexLayoutModule.withConfig({
            addOrientationBps: true,
            serverLoaded: true,
          }, EXTRAS)
        ]
      });
    }));
    // tslint:disable-next-line:no-shadowed-variable
    beforeEach(inject([BREAKPOINTS], (breakPoints: BreakPoint[]) => {
      bpList = breakPoints;
    }));

    it('has merged the custom breakpoints as overrides to existing defaults', () => {
      const total = ORIENTATION_BREAKPOINTS.length + DEFAULT_BREAKPOINTS.length + EXTRAS.length;

      expect(bpList.length).toEqual(total);

      expect(byAlias('gt-xsl')).toBeDefined();
      expect(byAlias('gt-xsl')!.mediaQuery).toEqual(gtXsMediaQuery);

      expect(byAlias('xxl')).toBeDefined();
      expect(byAlias('xxl')!.mediaQuery).toEqual(xxxlQuery);
    });

    it('can extend existing default breakpoints with custom settings', () => {
      const total = ORIENTATION_BREAKPOINTS.length + DEFAULT_BREAKPOINTS.length + EXTRAS.length;

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
        imports: [
          FlexLayoutModule.withConfig({
            disableDefaultBps: true,
            serverLoaded: true,
          }, EXTRAS)
        ]
      });
    });
    beforeEach(inject([BREAKPOINTS], (bps: BreakPoint[]) => {
      bpList = bps;
    }));

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
