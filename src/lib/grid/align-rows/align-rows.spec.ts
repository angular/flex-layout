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
import {Platform} from '@angular/cdk/platform';

describe('align rows directive', () => {
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

    it('should add correct styles for default `gdAlignRows` usage', () => {
      createTestComponent(`<div gdAlignRows></div>`);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle(DEFAULT_ALIGNS, styler);
    });

    it('should work with inline grid', () => {
      createTestComponent(`<div gdAlignRows gdInline></div>`);

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
      it('should add correct styles for `gdAlignRows="start"` usage', () => {
        createTestComponent(`<div gdAlignRows="start"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'justify-content': 'start'}, CROSS_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdAlignRows="end"` usage', () => {
        createTestComponent(`<div gdAlignRows="end"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'justify-content': 'end'}, CROSS_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdAlignRows="stretch"` usage', () => {
        createTestComponent(`<div gdAlignRows="stretch"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'justify-content': 'stretch'}, CROSS_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdAlignRows="center"` usage', () => {
        createTestComponent(`<div gdAlignRows="center"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'justify-content': 'center'}, CROSS_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdAlignRows="space-around"` usage', () => {
        createTestComponent(`<div gdAlignRows="space-around"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'justify-content': 'space-around'}, CROSS_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdAlignRows="space-between"` usage', () => {
        createTestComponent(`<div gdAlignRows="space-between"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'justify-content': 'space-between'}, CROSS_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdAlignRows="space-evenly"` usage', () => {
        createTestComponent(`<div gdAlignRows="space-evenly"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'justify-content': 'space-evenly'}, CROSS_DEFAULT), styler
        );
      });

      it('should add ignore invalid row-axis values', () => {
        createTestComponent(`<div gdAlignRows="invalid"></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
            extendObject(MAIN_DEFAULT, CROSS_DEFAULT), styler
        );
      });
    });

    describe('for "cross-axis" testing', () => {
      it('should add correct styles for `gdAlignRows="start start"` usage', () => {
        createTestComponent(`<div gdAlignRows='start start'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject(MAIN_DEFAULT, {'justify-items': 'start'}), styler
        );
      });
      it('should add correct styles for `gdAlignRows="start center"` usage', () => {
        createTestComponent(`<div gdAlignRows='start center'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject(MAIN_DEFAULT, {'justify-items': 'center'}), styler
        );
      });
      it('should add correct styles for `gdAlignRows="start end"` usage', () => {
        createTestComponent(`<div gdAlignRows='start end'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject(MAIN_DEFAULT, {'justify-items': 'end'}), styler
        );
      });
      it('should add ignore invalid column-axis values', () => {
        createTestComponent(`<div gdAlignRows='start invalid'></div>`);

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
        createTestComponent(`<div [gdAlignRows]='alignBy'></div>`);

        if (!shouldRun) {
          return;
        }

        fixture.componentInstance.alignBy = 'center end';
        expectNativeEl(fixture).toHaveStyle({
          'justify-content': 'center',
          'justify-items': 'end'
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
      createTestComponent(`<div gdAlignRows='center center'></div>`);

      if (!shouldRun) {
        return;
      }

      mediaController.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'center',
        'justify-items': 'center'
      }, styler);
    });

    it('should add responsive styles when configured', () => {
      createTestComponent(`
        <div gdAlignRows='center center' gdAlignRows.md='end'></div>
      `);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'center',
        'justify-items': 'center'
      }, styler);

      mediaController.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'end',
        'justify-items': 'stretch'
      }, styler);
    });

    it('should fallback to default styles when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      createTestComponent(`
         <div gdAlignRows='center stretch'
              gdAlignRows.md='end stretch'>
         </div>
       `);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'center',
        'justify-items': 'stretch'
      }, styler);

      mediaController.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'end',
        'justify-items': 'stretch'
      }, styler);

      mediaController.activate('xs');

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'center',
        'justify-items': 'stretch'
      }, styler);
    });

    it('should fallback to closest overlapping value when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      createTestComponent(`
          <div  gdAlignRows='start'
                gdAlignRows.gt-xs='end'
                gdAlignRows.md='center'>
          </div>
      `);

      if (!shouldRun) {
        return;
      }

      mediaController.useOverlaps = true;

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'start'
      }, styler);

      mediaController.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'center'
      }, styler);

      mediaController.activate('xs');
      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'start'
      }, styler);

      // Should fallback to value for 'gt-xs' or default
      mediaController.activate('lg', true);
      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'end'
      }, styler);

      mediaController.activate('xs');
      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'start'
      }, styler);

      // Should fallback to value for 'gt-xs' or default
      mediaController.activate('xl', true);
      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'end'
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
  'justify-content': 'start',
  'justify-items': 'stretch'
};
const MAIN_DEFAULT = {
  'justify-content': 'start'
};
const CROSS_DEFAULT = {
  'justify-items': 'stretch'
};

