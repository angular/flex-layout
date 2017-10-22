/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {TestBed, inject} from '@angular/core/testing';

import {BreakPoint} from '../media-query/breakpoints/break-point';
import {BREAKPOINTS} from '../media-query/breakpoints/break-points-token';
import {
  DEFAULT_BREAKPOINTS_PROVIDER,
  buildMergedBreakPoints
} from '../media-query/breakpoints/break-points-provider';
import {validateSuffixes, mergeByAlias} from './breakpoint-tools';

describe('breakpoint-tools', () => {
  let all: BreakPoint[];
  let findByAlias = (alias): BreakPoint => all.reduce((pos, it) => {
    return pos || ((it.alias == alias) ? it : null);
  }, null);

  beforeEach(() => {
    all = buildMergedBreakPoints([], {orientations: true})();
  });

  describe('validation', () => {
    it('should not replace an existing suffix', () => {
      let validated = validateSuffixes([
        {alias: 'handset-portrait', suffix: 'Handset', mediaQuery: 'screen'}
      ]);
      expect(validated[0].suffix).toEqual('Handset');
    });
    it('should add valid suffixes to breakpoints', () => {
      let validated = validateSuffixes([
        {alias: 'xs', mediaQuery: 'screen and (max-width: 599px)'},
        {alias: 'gt-lg', mediaQuery: 'screen and (max-width: 599px)'},
        {alias: 'gt_md', mediaQuery: 'screen and (max-width: 599px)'},
        {alias: 'gt.xs', mediaQuery: 'screen and (max-width: 599px)'},
        {alias: 'handset-portrait', mediaQuery: 'screen and (max-width: 599px)'}
      ]);
      expect(validated[0].suffix).toEqual('Xs');
      expect(validated[1].suffix).toEqual('GtLg');
      expect(validated[2].suffix).toEqual('GtMd');
      expect(validated[3].suffix).toEqual('GtXs');
      expect(validated[4].suffix).toEqual('HandsetPortrait');
    });
    it('should auto-validate the DEFAULT_BREAKPOINTS', () => {
      let xsBp: BreakPoint = findByAlias('xs');
      let gtLgBp: BreakPoint = findByAlias('gt-lg');
      let xlBp: BreakPoint = findByAlias('xl');

      expect(xsBp.alias).toEqual('xs');
      expect(xsBp.suffix).toEqual('Xs');

      expect(gtLgBp.alias).toEqual('gt-lg');
      expect(gtLgBp.suffix).toEqual('GtLg');

      expect(xlBp.alias).toEqual('xl');
      expect(xlBp.suffix).toEqual('Xl');
    });
  });

  describe('merges', () => {
    it('should add custom breakpoints with empty defaults', () => {
      let defaults = [], custom = [
        {alias: 'sm', mediaQuery: 'screen'},
        {alias: 'md', mediaQuery: 'screen'},
      ];
      all = mergeByAlias(defaults, custom);

      expect(all.length).toEqual(2);
      expect(findByAlias('sm').suffix).toEqual('Sm');
      expect(findByAlias('md').suffix).toEqual('Md');
    });
    it('should add custom breakpoints with unique aliases', () => {
      let defaults = [{alias: 'xs', mediaQuery: 'screen and (max-width: 599px)'}],
          custom = [{alias: 'sm', mediaQuery: 'screen'}, {alias: 'md', mediaQuery: 'screen'}];

      all = mergeByAlias(defaults, custom);

      expect(all.length).toEqual(3);
      expect(findByAlias('xs').suffix).toEqual('Xs');
      expect(findByAlias('sm').suffix).toEqual('Sm');
      expect(findByAlias('md').suffix).toEqual('Md');
    });
    it('should overwrite existing breakpoints with matching aliases', () => {
      let defaults = [{alias: 'xs', mediaQuery: 'screen and (max-width: 599px)'}];
      let custom = [{alias: 'xs', mediaQuery: 'screen and none'}];

      all = mergeByAlias(defaults, custom);

      expect(all.length).toEqual(1);
      expect(findByAlias('xs').suffix).toEqual('Xs');
      expect(findByAlias('xs').mediaQuery).toEqual('screen and none');
    });
  });

  describe('with DEFAULT_BREAKPOINTS_PROVIDER', () => {
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [
          DEFAULT_BREAKPOINTS_PROVIDER  // Supports developer overrides of list of known breakpoints
        ]
      });
    });

    it('should inject the BREAKPOINTS with auto-validate items', inject([BREAKPOINTS], (list) => {
      all = list;
      let xsBp: BreakPoint = findByAlias('xs');
      let gtLgBp: BreakPoint = findByAlias('gt-lg');
      let xlBp: BreakPoint = findByAlias('xl');

      expect(xsBp.alias).toEqual('xs');
      expect(xsBp.suffix).toEqual('Xs');

      expect(gtLgBp.alias).toEqual('gt-lg');
      expect(gtLgBp.suffix).toEqual('GtLg');

      expect(xlBp.alias).toEqual('xl');
      expect(xlBp.suffix).toEqual('Xl');
    }));
  });

});
