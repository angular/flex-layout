// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {TestBed, inject, async} from '@angular/core/testing';

import {BreakPoint} from '../breakpoints/break-point';
import {BREAKPOINTS, RAW_DEFAULTS} from '../providers/break-points-provider';

describe('break-point-provider', () => {
  let breakPoints: BreakPoint[ ];

  describe('with default configuration', () => {
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [{provide: BREAKPOINTS, useValue: RAW_DEFAULTS}]
      });
    });
    beforeEach(async(inject([BREAKPOINTS], (_breakPoints_) => {
      breakPoints = _breakPoints_;
    })));

    it('has the standard breakpoints', () => {
      expect(breakPoints.length).toEqual(RAW_DEFAULTS.length);
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
