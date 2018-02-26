/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TestBed, inject, async} from '@angular/core/testing';

import {BreakPoint} from '../break-point';
import {BREAKPOINTS} from '../break-points-token';
import {DEFAULT_BREAKPOINTS} from './break-points';

describe('break-point-provider', () => {
  let breakPoints: BreakPoint[ ];

  describe('with default configuration', () => {
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [{provide: BREAKPOINTS, useValue: DEFAULT_BREAKPOINTS}]
      });
    });
    beforeEach(async(inject([BREAKPOINTS], (_) => {
      breakPoints = _;
    })));

    it('has the standard breakpoints', () => {
      expect(breakPoints.length).toEqual(DEFAULT_BREAKPOINTS.length);
      expect(breakPoints[0].alias).toEqual('xs');
      expect(breakPoints[breakPoints.length - 1].alias).toEqual('xl');
    });
  });

  describe('with custom configuration', () => {
    let bpList;

    const CUSTOM_BPS: BreakPoint[] = [
      {
        alias: 'ab',
        suffix: 'Ab',
        mediaQuery: '(max-width: 297px)',
        overlapping: false
      },
      {
        alias: 'cd',
        suffix: 'Cd',
        mediaQuery: '(min-width: 298px) and (max-width:414px',
        overlapping: false
      }
    ];

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [{provide: BREAKPOINTS, useValue: CUSTOM_BPS}]
      });
    });
    // tslint:disable-next-line:no-shadowed-variable
    beforeEach(async(inject([BREAKPOINTS], (breakPoints) => {
      bpList = breakPoints;
    })));

    it('has the custom breakpoints', () => {
      expect(bpList.length).toEqual(CUSTOM_BPS.length);
      expect(bpList[0].alias).toEqual('ab');
      expect(bpList[bpList.length - 1].suffix).toEqual('Cd');
    });
  });


});
