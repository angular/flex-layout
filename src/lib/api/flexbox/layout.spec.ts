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

import {customMatchers} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent,
  makeExpectDOMFrom,
  makeExpectDOMForQuery,
  expectNativeEl
} from '../../utils/testing/helpers';

describe('layout directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let expectDOMFrom = makeExpectDOMFrom(() => TestLayoutComponent);
  let expectDomForQuery = makeExpectDOMForQuery(() => TestLayoutComponent);
  let createTestComponent = (template: string) => {
    fixture = makeCreateTestComponent(() => TestLayoutComponent)(template);

    inject([MatchMedia], (_matchMedia: MockMatchMedia) => {
      matchMedia = _matchMedia;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule],
      declarations: [TestLayoutComponent],
      providers: [
        BreakPointRegistry, DEFAULT_BREAKPOINTS_PROVIDER,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });

  describe('with static features', () => {

    it('should add correct styles for default `fxLayout` usage', () => {
      expectDOMFrom(`<div fxLayout></div>`).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      });
    });
    it('should add correct styles for `fxLayout="row"` usage', () => {
      expectDOMFrom(`
        <div fxLayout='row'></div>
      `).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      });
    });
    it('should add correct styles for `fxLayout="row wrap"` usage', () => {
      expectDOMFrom(`
        <div fxLayout='row wrap'></div>
      `).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box',
        'flex-wrap': 'wrap'
      });
    });
    it('should add correct styles for `fxLayout="column"` usage', () => {
      expectDOMFrom(`<div fxLayout='column'></div>`).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      });
    });
    it('should add correct styles for binding `[fxLayout]="direction"` usage', () => {
      expectDOMFrom(`<div [fxLayout]='direction'></div>`).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      });
    });
    it('should use default flex-direction for invalid value `fxLayout="invalid"` usage', () => {
      expectDOMFrom(`<div fxLayout='invalid'></div>`).toHaveStyle({
        'flex-direction': 'row'
      });
    });
    it('should use default flex-direction for invalid binding value `[fxLayout]="direction"` usage', () => { // tslint:disable-line:max-line-length
      expectDOMFrom(`<div [fxLayout]='direction'></div>`, 'direction', 'invalid')
          .toHaveStyle({
            'flex-direction': 'row',
          });
    });
    it('should use update style with dynamic value changes `[fxLayout]="direction"` usage', () => {
      createTestComponent(`<div [fxLayout]='direction'></div>`);

      fixture.componentInstance.direction = 'invalid';
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row',
      });

      fixture.componentInstance.direction = 'column';
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column'
      });

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

      expectDomForQuery(template, '[fxLayout="row-reverse"]')
          .toHaveStyle({
            'flex-direction': 'row-reverse',
          });
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
      });
    });
    it('should add responsive styles when configured', () => {
      createTestComponent(`<div fxLayout fxLayout.md='column reverse-wrap'></div>`);

      expectNativeEl(fixture).toHaveStyle({

        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      });

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box',
        'flex-wrap': 'wrap-reverse'
      });

      matchMedia.activate('lg');
      expectNativeEl(fixture).not.toHaveStyle({
        'flex-wrap': 'reverse-wrap'
      });
    });
    it('should update responsive styles when the active mediaQuery changes', () => {
      createTestComponent(`<div fxLayout fxLayout.md='column'></div>`);

      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      });

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column'
      });
      matchMedia.activate('all');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      });
    });

    it('should update styles with bindings and the active mediaQuery changes', () => {
      createTestComponent(`
          <div fxLayout='row'
               [fxLayout.md]='direction'>
          </div>
       `);
      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'row'});

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'column'});

      fixture.componentInstance.direction = 'row';
      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'row'});


    });
    it('should fallback to default styles when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      createTestComponent(`<div fxLayout fxLayout.md='column'></div>`);

      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      });

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column'
      });
      matchMedia.activate('lg');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      });

    });
    it('should fallback to closest overlapping value when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      createTestComponent(`<div fxLayout fxLayout.gt-sm='column' fxLayout.md='row'></div>`);

      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      });

      matchMedia.activate('gt-sm');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column'
      });
      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      });

      // Should fallback to value for 'gt-sm'
      matchMedia.activate('lg', true);
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column'
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
export class TestLayoutComponent implements OnInit {
  direction = 'column';

  constructor() {
  }

  ngOnInit() {
  }
}
