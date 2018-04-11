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
  MatchMedia,
  MockMatchMedia,
  MockMatchMediaProvider,
  SERVER_TOKEN,
  StyleUtils,
} from '@angular/flex-layout/core';

import {GridModule} from '../module';
import {extendObject} from '../../utils/object-extend';
import {customMatchers} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, expectNativeEl} from '../../utils/testing/helpers';

describe('align directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let styler: StyleUtils;
  let shouldRun = true;
  let createTestComponent = (template: string) => {
    shouldRun = true;
    fixture = makeCreateTestComponent(() => TestAlignComponent)(template);

    inject([MatchMedia, StyleUtils, Platform],
      (_matchMedia: MockMatchMedia, _styler: StyleUtils, _platform: Platform) => {
      matchMedia = _matchMedia;
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
      providers: [
        MockMatchMediaProvider,
        {provide: SERVER_TOKEN, useValue: true}
      ]
    });
  });

  describe('with static features', () => {

    it('should add correct styles for default `fxLayoutAlign` usage', () => {
      createTestComponent(`<div gdGridAlign></div>`);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({'justify-self': 'stretch'}, styler);
    });

    describe('for "main-axis" testing', () => {
      it('should add correct styles for `gdGridAlign="start"` usage', () => {
        createTestComponent(`<div gdGridAlign='start'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'justify-self': 'start'}, COLUMN_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdGridAlign="center"` usage', () => {
        createTestComponent(`<div gdGridAlign='center'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
            extendObject({'justify-self': 'center'}, COLUMN_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdGridAlign="end"` usage', () => {
        createTestComponent(`<div gdGridAlign='end'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
            extendObject({'justify-self': 'end'}, COLUMN_DEFAULT), styler
        );
      });
      it('should add correct styles for `gdGridAlign="stretch"` usage', () => {
        createTestComponent(`<div gdGridAlign='stretch'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject({'justify-self': 'stretch'}, COLUMN_DEFAULT), styler
        );
      });
      it('should add ignore invalid row-axis values', () => {
        createTestComponent(`<div gdGridAlign='invalid'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
            extendObject({'justify-self': 'stretch'}, COLUMN_DEFAULT), styler
        );
      });
    });

    describe('for "column-axis" testing', () => {
      it('should add correct styles for `gdGridAlign="start start"` usage', () => {
        createTestComponent(`<div gdGridAlign='stretch start'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject(ROW_DEFAULT, {'align-self': 'start'}), styler
        );
      });
      it('should add correct styles for `gdGridAlign="start center"` usage', () => {
        createTestComponent(`<div gdGridAlign='stretch center'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject(ROW_DEFAULT, {'align-self': 'center'}), styler
        );
      });
      it('should add correct styles for `gdGridAlign="start end"` usage', () => {
        createTestComponent(`<div gdGridAlign='stretch end'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject(ROW_DEFAULT, {'align-self': 'end'}), styler
        );
      });
      it('should add ignore invalid column-axis values', () => {
        createTestComponent(`<div gdGridAlign='stretch invalid'></div>`);

        if (!shouldRun) {
          return;
        }

        expectNativeEl(fixture).toHaveStyle(
          extendObject(ROW_DEFAULT, {'align-self': 'stretch'}), styler
        );
      });
    });

    describe('for dynamic inputs', () => {
      it('should add correct styles and ignore invalid axes values', () => {
        createTestComponent(`<div [gdGridAlign]='alignBy'></div>`);

        if (!shouldRun) {
          return;
        }

        fixture.componentInstance.alignBy = 'center end';
        expectNativeEl(fixture).toHaveStyle({
          'justify-self': 'center',
          'align-self': 'end'
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
      createTestComponent(`<div gdGridAlign='center center'></div>`);

      if (!shouldRun) {
        return;
      }

      matchMedia.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'justify-self': 'center',
        'align-self': 'center'
      }, styler);
    });

    it('should add responsive styles when configured', () => {
      createTestComponent(`
        <div gdGridAlign='center center' gdGridAlign.md='end'></div>
      `);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'justify-self': 'center',
        'align-self': 'center'
      }, styler);

      matchMedia.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'justify-self': 'end',
        'align-self': 'stretch'
      }, styler);
    });

    it('should fallback to default styles when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      createTestComponent(`
         <div gdGridAlign='center stretch'
              gdGridAlign.md='end stretch'>
         </div>
       `);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'justify-self': 'center',
        'align-self': 'stretch'
      }, styler);

      matchMedia.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'justify-self': 'end',
        'align-self': 'stretch'
      }, styler);

      matchMedia.activate('xs');

      expectNativeEl(fixture).toHaveStyle({
        'justify-self': 'center',
        'align-self': 'stretch'
      }, styler);
    });

    it('should fallback to closest overlapping value when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      createTestComponent(`
          <div  gdGridAlign='start'
                gdGridAlign.gt-xs='end'
                gdGridAlign.md='center'>
          </div>
      `);

      if (!shouldRun) {
        return;
      }

      matchMedia.useOverlaps = true;

      expectNativeEl(fixture).toHaveStyle({
        'justify-self': 'start'
      }, styler);

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'justify-self': 'center'
      }, styler);

      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({
        'justify-self': 'start'
      }, styler);

      // Should fallback to value for 'gt-xs' or default
      matchMedia.activate('lg', true);
      expectNativeEl(fixture).toHaveStyle({
        'justify-self': 'end'
      }, styler);

      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({
        'justify-self': 'start'
      }, styler);

      // Should fallback to value for 'gt-xs' or default
      matchMedia.activate('xl', true);
      expectNativeEl(fixture).toHaveStyle({
        'justify-self': 'end'
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
  'justify-self': 'stretch',
  'align-self': 'stretch'
};
const ROW_DEFAULT = {
  'justify-self': 'stretch'
};
const COLUMN_DEFAULT = {
  'align-self': 'stretch'
};

