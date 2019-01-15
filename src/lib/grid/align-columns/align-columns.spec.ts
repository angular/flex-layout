/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {Platform} from '@angular/cdk/platform';
import {
  ɵMatchMedia as MatchMedia,
  ɵMockMatchMedia as MockMatchMedia,
  ɵMockMatchMediaProvider as MockMatchMediaProvider,
  StyleUtils,
} from '@angular/flex-layout/core';

import {extendObject} from '../../utils/object-extend';
import {customMatchers} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, expectNativeEl} from '../../utils/testing/helpers';

import {GridModule} from '../module';

describe('align columns directive', () => {
  let fixture: ComponentFixture<any>;
  let mediaController: MockMatchMedia;
  let styler: StyleUtils;
  let shouldRun = true;
  let createTestComponent = (template: string) => {
    shouldRun = true;
    fixture = makeCreateTestComponent(() => TestAlignComponent)(template);

    inject([MatchMedia, StyleUtils, Platform],
      (_matchMedia: MockMatchMedia, _styler: StyleUtils, _platform: Platform) => {
        mediaController = _matchMedia;
        styler = _styler;

        // TODO(CaerusKaru): Grid tests won't work with Edge 14
        if (_platform.EDGE) {
          shouldRun = false;
        }
      })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, GridModule],
      declarations: [TestAlignComponent],
      providers: [MockMatchMediaProvider],
    });
  });

  describe('with static features', () => {

    it('should add correct styles for default `gdAlignColumns` usage', () => {
      createTestComponent(`<div gdAlignColumns></div>`);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle(DEFAULT_ALIGNS, styler);
    });

    it('should work with inline grid', () => {
      createTestComponent(`<div gdAlignColumns gdInline></div>`);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle(
        extendObject({
          'display': 'inline-grid'
          }, DEFAULT_ALIGNS),
        styler);
    });

    describe('for "main-axis" testing', () => {
      it('should add correct styles for `gdAlignColumns="start"` usage', () => {
        createTestComponent(`<div gdAlignColumns="start"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'align-content': 'start'}, CROSS_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdAlignColumns="end"` usage', () => {
        createTestComponent(`<div gdAlignColumns="end"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'align-content': 'end'}, CROSS_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdAlignColumns="stretch"` usage', () => {
        createTestComponent(`<div gdAlignColumns="stretch"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'align-content': 'stretch'}, CROSS_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdAlignColumns="center"` usage', () => {
        createTestComponent(`<div gdAlignColumns="center"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'align-content': 'center'}, CROSS_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdAlignColumns="space-around"` usage', () => {
        createTestComponent(`<div gdAlignColumns="space-around"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'align-content': 'space-around'}, CROSS_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdAlignColumns="space-between"` usage', () => {
        createTestComponent(`<div gdAlignColumns="space-between"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'align-content': 'space-between'}, CROSS_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdAlignColumns="space-evenly"` usage', () => {
        createTestComponent(`<div gdAlignColumns="space-evenly"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'align-content': 'space-evenly'}, CROSS_DEFAULT), styler
        );
      });

      it('should add ignore invalid row-axis values', () => {
        createTestComponent(`<div gdAlignColumns="invalid"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject(MAIN_DEFAULT, CROSS_DEFAULT), styler
        );
      });
    });

    describe('for "cross-axis" testing', () => {
      it('should add correct styles for `gdAlignColumns="start start"` usage', () => {
        createTestComponent(`<div gdAlignColumns='start start'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject(MAIN_DEFAULT, {'align-items': 'start'}), styler
        );
      });
      it('should add correct styles for `gdAlignColumns="start center"` usage', () => {
        createTestComponent(`<div gdAlignColumns='start center'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject(MAIN_DEFAULT, {'align-items': 'center'}), styler
        );
      });
      it('should add correct styles for `gdAlignColumns="start end"` usage', () => {
        createTestComponent(`<div gdAlignColumns='start end'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject(MAIN_DEFAULT, {'align-items': 'end'}), styler
        );
      });
      it('should add ignore invalid column-axis values', () => {
        createTestComponent(`<div gdAlignColumns='start invalid'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject(MAIN_DEFAULT, CROSS_DEFAULT), styler
        );
      });
    });

    describe('for dynamic inputs', () => {
      it('should add correct styles and ignore invalid axes values', () => {
        createTestComponent(`<div [gdAlignColumns]='alignBy'></div>`);

        if (!shouldRun) {
          return;
        }

        fixture.componentInstance.alignBy = 'center end';
        expectNativeEl(fixture).toHaveStyle({
          'align-content': 'center',
          'align-items': 'end'
        }, styler);

        fixture.componentInstance.alignBy = 'invalid invalid';
        expectNativeEl(fixture).toHaveStyle(DEFAULT_ALIGNS, styler);

        fixture.componentInstance.alignBy = '';
        expectNativeEl(fixture).toHaveStyle(DEFAULT_ALIGNS, styler);
      });
    });

  });

  describe('with responsive features', () => {

    it('should ignore responsive changes when not configured', () => {
      createTestComponent(`<div gdAlignColumns='center center'></div>`);

      if (!shouldRun) {
        return;
      }

      mediaController.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'align-content': 'center',
        'align-items': 'center'
      }, styler);
    });

    it('should add responsive styles when configured', () => {
      createTestComponent(`
        <div gdAlignColumns='center center' gdAlignColumns.md='end'></div>
      `);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'align-content': 'center',
        'align-items': 'center'
      }, styler);

      mediaController.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'align-content': 'end',
        'align-items': 'stretch'
      }, styler);
    });

    it('should fallback to default styles when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      createTestComponent(`
         <div gdAlignColumns='center stretch'
              gdAlignColumns.md='end stretch'>
         </div>
       `);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'align-content': 'center',
        'align-items': 'stretch'
      }, styler);

      mediaController.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'align-content': 'end',
        'align-items': 'stretch'
      }, styler);

      mediaController.activate('xs');

      expectNativeEl(fixture).toHaveStyle({
        'align-content': 'center',
        'align-items': 'stretch'
      }, styler);
    });

    it('should fallback to closest overlapping value when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      createTestComponent(`
          <div  gdAlignColumns='start'
                gdAlignColumns.gt-xs='end'
                gdAlignColumns.md='center'>
          </div>
      `);

      if (!shouldRun) {
        return;
      }

      mediaController.useOverlaps = true;

      expectNativeEl(fixture).toHaveStyle({
        'align-content': 'start'
      }, styler);

      mediaController.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'align-content': 'center'
      }, styler);

      mediaController.activate('xs');
      expectNativeEl(fixture).toHaveStyle({
        'align-content': 'start'
      }, styler);

      // Should fallback to value for 'gt-xs' or default
      mediaController.activate('lg', true);
      expectNativeEl(fixture).toHaveStyle({
        'align-content': 'end'
      }, styler);

      mediaController.activate('xs');
      expectNativeEl(fixture).toHaveStyle({
        'align-content': 'start'
      }, styler);

      // Should fallback to value for 'gt-xs' or default
      mediaController.activate('xl', true);
      expectNativeEl(fixture).toHaveStyle({
        'align-content': 'end'
      }, styler);
    });

  });

});


// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-layout',
  template: `<span>PlaceHolder Template HTML</span>`
})
class TestAlignComponent implements OnInit {
  mainAxis = 'start';
  crossAxis = 'end';

  set alignBy(style) {
    let vals = style.split(' ');
    this.mainAxis = vals[0];
    this.crossAxis = vals.length > 1 ? vals[1] : '';
  }

  get alignBy() {
    return `${this.mainAxis} ${this.crossAxis}`;
  }

  constructor() {
  }

  ngOnInit() {
  }
}


// *****************************************************************
// Template Component
// *****************************************************************

const DEFAULT_ALIGNS = {
  'align-content': 'start',
  'align-items': 'stretch'
};
const MAIN_DEFAULT = {
  'align-content': 'start'
};
const CROSS_DEFAULT = {
  'align-items': 'stretch'
};

