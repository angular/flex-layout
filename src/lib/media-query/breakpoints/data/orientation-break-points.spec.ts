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
import {
  DEFAULT_BREAKPOINTS_PROVIDER,
  CUSTOM_BREAKPOINTS_PROVIDER_FACTORY
} from '../break-points-provider';

describe('break-point-provider', () => {
  let breakPoints: BreakPoint[ ];
  let findByAlias = (alias): BreakPoint => breakPoints.reduce((pos, it) => {
    return pos || ((it.alias == alias) ? it : null);
  }, null);

  describe('with default breakpoints only', () => {
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [DEFAULT_BREAKPOINTS_PROVIDER]
      });
    });
    beforeEach(async(inject([BREAKPOINTS], (_) => {
      breakPoints = _;
    })));

    it('has the only standard default breakpoints without internal custom breakpoints', () => {
      const total = DEFAULT_BREAKPOINTS.length;

      expect(breakPoints.length).toEqual(total);
      expect(findByAlias('xs')).toBeDefined();
      expect(findByAlias('web.portrait')).toBeNull();
    });
  });

  describe('with merged custom breakpoints', () => {
    let bpList;
    const EXTRAS: BreakPoint[] = [
      {alias: 'lt-ab', mediaQuery: '(max-width: 297px)'},
      {alias: 'cd', mediaQuery: '(min-width: 298px) and (max-width:414px)'}
    ];

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(EXTRAS)]
      });
    });
    // tslint:disable-next-line:no-shadowed-variable
    beforeEach(async(inject([BREAKPOINTS], (breakPoints) => {
      bpList = breakPoints;
    })));

    it('has the custom breakpoints', () => {
      const total = DEFAULT_BREAKPOINTS.length + EXTRAS.length;

      expect(bpList.length).toEqual(total);
      expect(bpList[total - 2].alias).toEqual('lt-ab');
      expect(bpList[total - 2].suffix).toEqual('LtAb');
      expect(bpList[total - 1].alias).toEqual('cd');
      expect(bpList[total - 1].suffix).toEqual('Cd');
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
    let bpList;
    let byAlias = (alias): BreakPoint => bpList.reduce((pos, it) => {
      return pos || ((it.alias == alias) ? it : null);
    }, null);

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(EXTRAS, {orientations: true})]
      });
    });
    // tslint:disable-next-line:no-shadowed-variable
    beforeEach(async(inject([BREAKPOINTS], (breakPoints) => {
      bpList = breakPoints;
    })));

    it('has merged the custom breakpoints as overrides to existing defaults', () => {
      const total = ORIENTATION_BREAKPOINTS.length + DEFAULT_BREAKPOINTS.length + NUM_EXTRAS;

      expect(bpList.length).toEqual(total);

      expect(byAlias('gt-xs')).toBeDefined();
      expect(byAlias('gt-xs').mediaQuery).toEqual(gtXsMediaQuery);

      expect(byAlias('md')).toBeDefined();
      expect(byAlias('md').mediaQuery).toEqual(mdMediaQuery);
    });

    it('can extend existing default breakpoints with custom settings', () => {
      const total = ORIENTATION_BREAKPOINTS.length + DEFAULT_BREAKPOINTS.length + NUM_EXTRAS;

      expect(bpList.length).toEqual(total);
      expect(bpList[total - 2].alias).toEqual('lt-ab');
      expect(bpList[total - 2].suffix).toEqual('LtAb');
      expect(bpList[total - 1].alias).toEqual('cd');
      expect(bpList[total - 1].suffix).toEqual('Cd');
    });
  });

  describe('with exclusive custom breakpoints', () => {
    let bpList;
    const EXTRAS: BreakPoint[] = [
      {alias: 'lt-ab', mediaQuery: '(max-width: 297px)'},
      {alias: 'cd', mediaQuery: '(min-width: 298px) and (max-width:414px)'}
    ];

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(EXTRAS, {defaults: false})]
      });
    });
    // tslint:disable-next-line:no-shadowed-variable
    beforeEach(async(inject([BREAKPOINTS], (breakPoints) => {
      bpList = breakPoints;
    })));

    it('has the only the registered custom breakpoints; defaults are excluded.', () => {
      const total = EXTRAS.length;

      expect(bpList.length).toEqual(total);
      expect(bpList[total - 1].alias).toEqual('cd');
      expect(bpList[total - 1].suffix).toEqual('Cd');
      expect(bpList[total - 2].alias).toEqual('lt-ab');
      expect(bpList[total - 2].suffix).toEqual('LtAb');
    });
  });

});
