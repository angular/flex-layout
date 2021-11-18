/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {TestBed, inject} from '@angular/core/testing';

import {BreakPoint} from './break-point';
import {BreakPointRegistry} from './break-point-registry';
import {BREAKPOINTS} from './break-points-token';
import {DEFAULT_BREAKPOINTS} from './data/break-points';

describe('break-points', () => {
  let breakPoints: BreakPointRegistry;
  beforeEach(() => {
    breakPoints = new BreakPointRegistry(DEFAULT_BREAKPOINTS);
  });

  it('registry has all aliases defined', () => {
    expect(breakPoints.items.length).toBeGreaterThan(0);

    expect(breakPoints.findByAlias('xs')).toBeDefined();
    expect(breakPoints.findByAlias('gt-xs')).toBeDefined();   // Overlapping
    expect(breakPoints.findByAlias('sm')).toBeDefined();
    expect(breakPoints.findByAlias('gt-sm')).toBeDefined();   // Overlapping
    expect(breakPoints.findByAlias('md')).toBeDefined();
    expect(breakPoints.findByAlias('gt-md')).toBeDefined();   // Overlapping
    expect(breakPoints.findByAlias('lg')).toBeDefined();
    expect(breakPoints.findByAlias('gt-lg')).toBeDefined();   // Overlapping
    expect(breakPoints.findByAlias('xl')).toBeDefined();

    expect(breakPoints.overlappings.length).toBe(8);
  });

  describe('overridden with custom provider', () => {
    const CUSTOM_BPS: BreakPoint[] = [
      {alias: 'ab', suffix: 'Ab', mediaQuery: '(max-width: 297px)', overlapping: false},
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

    it('has the custom breakpoints', inject([BREAKPOINTS], (list: BreakPoint[]) => {
      expect(list.length).toEqual(CUSTOM_BPS.length);
      expect(list[0].alias).toEqual('ab');
      expect(list[list.length - 1].suffix).toEqual('Cd');
    }));
  });

});
