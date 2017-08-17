/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, inject} from '@angular/core/testing';

import {DEFAULT_BREAKPOINTS_PROVIDER} from '../../media-query/breakpoints/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';

import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {FlexLayoutModule} from '../../module';

import {extendObject} from '../../utils/object-extend';
import {customMatchers} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent,
  makeExpectDOMFrom,
  expectNativeEl
} from '../../utils/testing/helpers';

describe('layout-align directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let expectDOMFrom = makeExpectDOMFrom(() => TestLayoutAlignComponent);
  let createTestComponent = (template: string) => {
    fixture = makeCreateTestComponent(() => TestLayoutAlignComponent)(template);

    inject([MatchMedia], (_matchMedia: MockMatchMedia) => {
      matchMedia = _matchMedia;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule],
      declarations: [TestLayoutAlignComponent],
      providers: [
        BreakPointRegistry, DEFAULT_BREAKPOINTS_PROVIDER,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });

  describe('with static features', () => {

    it('should add work without a peer `fxLayout` directive', () => {
      expectDOMFrom(`<div fxLayoutAlign></div>`).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      });
    });
    it('should add correct styles for default `fxLayoutAlign` usage', () => {
      expectDOMFrom(`<div fxLayoutAlign></div>`).toHaveStyle({
        'justify-content': 'flex-start',
        'align-items': 'stretch',
        'align-content': 'stretch'
      });
    });
    it('should add preserve fxLayout', () => {
      expectDOMFrom(`<div fxLayout='column' fxLayoutAlign></div>`).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box',
        'justify-content': 'flex-start',
        'align-items': 'stretch',
        'align-content': 'stretch'
      });
    });

    describe('for "main-axis" testing', () => {
      it('should add correct styles for `fxLayoutAlign="start"` usage', () => {
        expectDOMFrom(`<div fxLayoutAlign='start'></div>`).toHaveStyle(
            extendObject({'justify-content': 'flex-start'}, CROSSAXIS_DEFAULTS)
        );
      });
      it('should add correct styles for `fxLayoutAlign="flex-start"` usage', () => {
        expectDOMFrom(`<div fxLayoutAlign='flex-start'></div>`).toHaveStyle(
            extendObject({'justify-content': 'flex-start'}, CROSSAXIS_DEFAULTS)
        );
      });
      it('should add correct styles for `fxLayoutAlign="center"` usage', () => {
        expectDOMFrom(`<div fxLayoutAlign='center'></div>`).toHaveStyle(
            extendObject({'justify-content': 'center'}, CROSSAXIS_DEFAULTS)
        );
      });
      it('should add correct styles for `fxLayoutAlign="space-around"` usage', () => {
        expectDOMFrom(`<div fxLayoutAlign='space-around'></div>`).toHaveStyle(
            extendObject({'justify-content': 'space-around'}, CROSSAXIS_DEFAULTS)
        );
      });
      it('should add correct styles for `fxLayoutAlign="space-between"` usage', () => {
        expectDOMFrom(`<div fxLayoutAlign='space-between'></div>`).toHaveStyle(
            extendObject({'justify-content': 'space-between'}, CROSSAXIS_DEFAULTS)
        );
      });
      it('should add correct styles for `fxLayoutAlign="end"` usage', () => {
        expectDOMFrom(`<div fxLayoutAlign='end'></div>`).toHaveStyle(
            extendObject({'justify-content': 'flex-end'}, CROSSAXIS_DEFAULTS)
        );
      });
      it('should add correct styles for `fxLayoutAlign="flex-end"` usage', () => {
        expectDOMFrom(`<div fxLayoutAlign='flex-end'></div>`).toHaveStyle(
            extendObject({'justify-content': 'flex-end'}, CROSSAXIS_DEFAULTS)
        );
      });
      it('should add ignore invalid main-axis values', () => {
        expectDOMFrom(`<div fxLayoutAlign='invalid'></div>`).toHaveStyle(
            extendObject({'justify-content': 'flex-start'}, CROSSAXIS_DEFAULTS)
        );
      });
    });

    describe('for "cross-axis" testing', () => {
      it('should add correct styles for `fxLayoutAlign="start start"` usage', () => {
        expectDOMFrom(`<div fxLayoutAlign='start start'></div>`).toHaveStyle(
            extendObject(MAINAXIS_DEFAULTS, {
              'align-items': 'flex-start',
              'align-content': 'flex-start'
            })
        );
      });
      it('should add correct styles for `fxLayoutAlign="start baseline"` usage', () => {
        expectDOMFrom(`<div fxLayoutAlign='start baseline'></div>`)
          .toHaveStyle({
            'justify-content' : 'flex-start',
            'align-items': 'baseline'
          });
      });
      it('should add correct styles for `fxLayoutAlign="start center"` usage', () => {
        expectDOMFrom(`<div fxLayoutAlign='start center'></div>`).toHaveStyle(
            extendObject(MAINAXIS_DEFAULTS, {
              'align-items': 'center',
              'align-content': 'center'
            })
        );
      });
      it('should add correct styles for `fxLayoutAlign="start end"` usage', () => {
        expectDOMFrom(`<div fxLayoutAlign='start end'></div>`).toHaveStyle(
            extendObject(MAINAXIS_DEFAULTS, {
              'align-items': 'flex-end',
              'align-content': 'flex-end'
            })
        );
      });
      it('should add ignore invalid cross-axis values', () => {
        expectDOMFrom(`<div fxLayoutAlign='start invalid'></div>`).toHaveStyle(
            extendObject(MAINAXIS_DEFAULTS, {
              'align-items': 'stretch',
              'align-content': 'stretch'
            })
        );
      });
      it('should add special styles for cross-axis `stretch`', () => {
        expectDOMFrom(`<div fxLayoutAlign='start stretch'></div>`)
            .toHaveStyle({
              'max-height': '100%'
            });
      });
      it('should add special styles for cross-axis `stretch` when layout is `column`', () => {
        expectDOMFrom(`<div fxLayout='column' fxLayoutAlign='end stretch'></div>`)
            .toHaveStyle({
              'max-width': '100%'
            });
      });
    });

    describe('for dynamic inputs', () => {
      it('should add correct styles and ignore invalid axes values', () => {
        createTestComponent(`<div [fxLayoutAlign]='alignBy'></div>`);

        fixture.componentInstance.alignBy = 'center end';
        expectNativeEl(fixture).toHaveStyle({
          'justify-content': 'center',
          'align-items': 'flex-end',
          'align-content': 'flex-end'
        });

        fixture.componentInstance.alignBy = 'invalid invalid';
        expectNativeEl(fixture).toHaveStyle(DEFAULT_ALIGNS);

        fixture.componentInstance.alignBy = '';
        expectNativeEl(fixture).toHaveStyle(DEFAULT_ALIGNS);
      });
    });

  });

  describe('with responsive features', () => {

    it('should ignore responsive changes when not configured', () => {
      createTestComponent(`<div fxLayoutAlign='center center'></div>`);

      matchMedia.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'center',
        'align-items': 'center',
        'align-content': 'center'
      });
    });

    it('should add responsive styles when configured', () => {
      createTestComponent(`
        <div fxLayoutAlign='center center' fxLayoutAlign.md='end'></div>
      `);

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'center',
        'align-items': 'center',
        'align-content': 'center'
      });

      matchMedia.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'flex-end',
        'align-items': 'stretch',
        'align-content': 'stretch'
      });
    });

    it('should update responsive styles when the layout direction changes', () => {
      createTestComponent(`
        <div fxLayout
             [fxLayout.md]='direction'
             fxLayoutAlign='center stretch'
             fxLayoutAlign.md='end stretch'>
        </div>
      `);

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'center',
        'max-height': '100%'
      });

      matchMedia.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'flex-end',
        'max-width': '100%'
      });
    });

    it('should fallback to default styles when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      createTestComponent(`
         <div fxLayout
              [fxLayout.md]='direction'
              fxLayoutAlign='center stretch'
              fxLayoutAlign.md='end stretch'>
         </div>
       `);

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'center',
        'max-height': '100%'
      });

      matchMedia.activate('md');

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'flex-end',
        'max-width': '100%'
      });

      matchMedia.activate('xs');

      expectNativeEl(fixture).toHaveStyle({
        'justify-content': 'center',
        'max-height': '100%'
      });
    });

    it('should fallback to closest overlapping value when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      createTestComponent(`
          <div  fxLayout
                fxLayout.md='column'
                fxLayoutAlign='start'
                fxLayoutAlign.gt-xs='end'
                fxLayoutAlign.md='center'>
          </div>
      `);

      matchMedia.useOverlaps = true;

      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row',
        'justify-content': 'flex-start'
      });

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column',
        'justify-content': 'center'
      });

      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row',
        'justify-content': 'flex-start'
      });

      // Should fallback to value for 'gt-xs' or default
      matchMedia.activate('lg', true);
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row',
        'justify-content': 'flex-end'
      });

      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row',
        'justify-content': 'flex-start'
      });

      // Should fallback to value for 'gt-xs' or default
      matchMedia.activate('xl', true);
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row',
        'justify-content': 'flex-end'
      });

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
export class TestLayoutAlignComponent implements OnInit {
  direction = 'column';
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
  'justify-content': 'flex-start',
  'align-items': 'stretch',
  'align-content': 'stretch'
};
const CROSSAXIS_DEFAULTS = {
  'align-items': 'stretch',
  'align-content': 'stretch'
};
const MAINAXIS_DEFAULTS = {
  'justify-content': 'flex-start'
};

