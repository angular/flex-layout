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
  MatchMedia,
  MockMatchMedia,
  MockMatchMediaProvider,
  SERVER_TOKEN,
  StyleUtils,
} from '@angular/flex-layout/core';

import {FlexModule} from '../module';
import {customMatchers} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, expectNativeEl, expectEl} from '../../utils/testing/helpers';
import {queryFor} from '../../utils/testing/helpers';

describe('layout directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let styler: StyleUtils;
  let createTestComponent = (template: string) => {
    fixture = makeCreateTestComponent(() => TestLayoutComponent)(template);

    inject([MatchMedia, StyleUtils], (_matchMedia: MockMatchMedia, _styler: StyleUtils) => {
      matchMedia = _matchMedia;
      styler = _styler;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexModule],
      declarations: [TestLayoutComponent],
      providers: [
        MockMatchMediaProvider,
        {provide: SERVER_TOKEN, useValue: true}
      ]
    });
  });

  describe('with static features', () => {

    it('should add correct styles for default `fxLayout` usage', () => {
      createTestComponent(`<div fxLayout></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      }, styler);
    });
    it('should add correct styles for `fxLayout="row"` usage', () => {
      createTestComponent(`<div fxLayout='row'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      }, styler);
    });
    it('should add correct styles for `fxLayout="row wrap"` usage', () => {
      createTestComponent(`<div fxLayout='row wrap'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box',
        'flex-wrap': 'wrap'
      }, styler);
    });
    it('should add correct styles for `fxLayout="column"` usage', () => {
      createTestComponent(`<div fxLayout='column'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      }, styler);
    });
    it('should add correct styles for binding `[fxLayout]="direction"` usage', () => {
      createTestComponent(`<div [fxLayout]='direction'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      }, styler);
    });
    it('should use default flex-direction for invalid value `fxLayout="invalid"` usage', () => {
      createTestComponent(`<div fxLayout='invalid'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      }, styler);
    });
    it('should use default flex-direction for invalid binding value `[fxLayout]="direction"` usage', () => { // tslint:disable-line:max-line-length
      createTestComponent(`<div [fxLayout]='direction'></div>`);
      fixture.componentInstance.direction = 'invalid';
      expectNativeEl(fixture)
        .toHaveStyle({
          'flex-direction': 'row',
        }, styler);
    });
    it('should use update style with dynamic value changes `[fxLayout]="direction"` usage', () => {
      createTestComponent(`<div [fxLayout]='direction'></div>`);

      fixture.componentInstance.direction = 'invalid';
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row',
      }, styler);

      fixture.componentInstance.direction = 'column';
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column'
      }, styler);

    });

    it('should set row-reverse direction for nested fxLayout containers', () => {
      let template = `
        <div [fxLayout]='direction' (click)='toggleDirection()' class='colored box' >
          <div fxFlex='20'>  fxFlex='20'  </div>
          <div fxFlex='60'>  outer fxFlex='60'
            <div fxLayout='row-reverse' fxLayoutAlign='center center' class='colored box' >
              <div fxFlex='20'>  inner fxFlex='20'  </div>
              <div fxFlex='60'>  inner fxFlex='60'  </div>
              <div fxFlex >      inner fxFlex       </div>
            </div>
          </div>
          <div fxFlex >      fxFlex       </div>
        </div>
      `;
      let selector = '[fxLayout="row-reverse"]';

      createTestComponent(template);
      fixture.detectChanges();
      expectEl(queryFor(fixture, selector)[0]).toHaveStyle({
        'flex-direction': 'row-reverse',
      }, styler);
    });

  });

  describe('with wrap options', () => {

    it('should recognize valid `wrap` option', () => {
       createTestComponent(`<div fxLayout='row wrap'></div>`);
       expectNativeEl(fixture).toHaveStyle({
         'display': 'flex',
         'flex-direction': 'row',
         'box-sizing': 'border-box',
         'flex-wrap': 'wrap'
       }, styler);
    });

    it('should fallback to `wrap` for invalid options', () => {
       createTestComponent(`<div fxLayout='row warpped'></div>`);
       expectNativeEl(fixture).toHaveStyle({
         'flex-wrap': 'wrap'
       }, styler);
    });

    it('should fallback to `wrap` for invalid options', () => {
       createTestComponent(`<div fxLayout='row wrap-rev'></div>`);
       expectNativeEl(fixture).toHaveStyle({
         'flex-wrap': 'wrap'
       }, styler);
    });

    it('should have valid wrap with flex children', () => {
      createTestComponent(`<div fxLayout='row wrap'><div fxFlex></div></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex-wrap': 'wrap'
      }, styler);
    });

  });

  describe('with inline options', () => {

    it('should recognize valid `inline` option', () => {
       createTestComponent(`<div fxLayout='row inline'></div>`);
       expectNativeEl(fixture).toHaveStyle({
         'display': 'inline-flex',
         'flex-direction': 'row'
       }, styler);
    });

    it('should recognize `line` used with `wrap`', () => {
       createTestComponent(`<div fxLayout='row inline wrap'></div>`);
       expectNativeEl(fixture).toHaveStyle({
         'display': 'inline-flex',
         'flex-wrap': 'wrap'
       }, styler);
    });

    it('should recognize `inline` used with `wrap`', () => {
       createTestComponent(`<div fxLayout='row wrap inline'></div>`);
       expectNativeEl(fixture).toHaveStyle({
         'display': 'inline-flex',
         'flex-wrap': 'wrap'
       }, styler);
    });

    it('should fallback to `wrap` for invalid options', () => {
          createTestComponent(`<div fxLayout='row inline wrap-rev'></div>`);
          expectNativeEl(fixture).toHaveStyle({
            'display': 'inline-flex',
            'flex-wrap': 'wrap'
          }, styler);
       });

  });


  describe('with responsive features', () => {

    it('should ignore responsive changes when not configured', () => {
      createTestComponent(`<div fxLayout='column'></div>`);
      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      }, styler);
    });
    it('should add responsive styles when configured', () => {
      createTestComponent(`<div fxLayout fxLayout.md='column reverse-wrap'></div>`);

      expectNativeEl(fixture).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      }, styler);

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box',
        'flex-wrap': 'wrap-reverse'
      }, styler);

      matchMedia.activate('lg');
      expectNativeEl(fixture).not.toHaveStyle({
        'flex-wrap': 'reverse-wrap'
      }, styler);
    });
    it('should update responsive styles when the active mediaQuery changes', () => {
      createTestComponent(`<div fxLayout fxLayout.md='column'></div>`);

      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      }, styler);

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column'
      }, styler);
      matchMedia.activate('all');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      }, styler);
    });

    it('should update styles with bindings and the active mediaQuery changes', () => {
      createTestComponent(`
          <div fxLayout='row'
               [fxLayout.md]='direction'>
          </div>
       `);
      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'row'}, styler);

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'column'}, styler);

      fixture.componentInstance.direction = 'row';
      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'row'}, styler);


    });
    it('should fallback to default styles when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      createTestComponent(`<div fxLayout fxLayout.md='column'></div>`);

      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      }, styler);

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column'
      }, styler);
      matchMedia.activate('lg');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      }, styler);

    });
    it('should fallback to closest overlapping value when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      createTestComponent(`<div fxLayout fxLayout.gt-sm='column' fxLayout.md='row'></div>`);

      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      }, styler);

      matchMedia.activate('gt-sm');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column'
      }, styler);
      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      }, styler);

      // Should fallback to value for 'gt-sm'
      matchMedia.activate('lg', true);
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column'
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
class TestLayoutComponent implements OnInit {
  direction = 'column';

  constructor() {
  }

  ngOnInit() {
  }
}
