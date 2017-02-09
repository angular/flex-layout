/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BreakPointsProvider} from '../../media-query/breakpoints/break-points';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {FlexLayoutModule} from '../_module';

import {customMatchers} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent,
  makeExpectDOMFrom,
  makeExpectDOMForQuery,
  expectNativeEl
} from '../../utils/testing/helpers';

describe('layout directive', () => {
  let fixture: ComponentFixture<any>;
  let createTestComponent = makeCreateTestComponent(() => TestLayoutComponent);
  let expectDOMFrom = makeExpectDOMFrom(() => TestLayoutComponent);
  let expectDomForQuery = makeExpectDOMForQuery(() => TestLayoutComponent);
  let activateMediaQuery = (alias, allowOverlaps?: boolean) => {
    let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);
    matchMedia.activate(alias, allowOverlaps);
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule],
      declarations: [TestLayoutComponent],
      providers: [
        BreakPointRegistry, BreakPointsProvider,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });
  afterEach(() => {
    if (fixture) {
      fixture.debugElement.injector.get(MatchMedia).clearAll();
      fixture = null;
    }
  });

  describe('with static features', () => {

    it('should add correct styles for default `fxLayout` usage', () => {
      expectDOMFrom(`<div fxLayout></div>`).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      });
    });
    it('should add correct styles for `fxLayout="row"` usage', () => {
      expectDOMFrom(`
        <div fxLayout="row"></div>
      `).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      });
    });
    it('should add correct styles for `fxLayout="column"` usage', () => {
      expectDOMFrom(`<div fxLayout="column"></div>`).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      });
    });
    it('should add correct styles for binding `[fxLayout]="direction"` usage', () => {
      expectDOMFrom(`<div [fxLayout]="direction"></div>`).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      });
    });
    it('should use default flex-direction for invalid value `fxLayout="invalid"` usage', () => {
      expectDOMFrom(`<div fxLayout="invalid"></div>`).toHaveCssStyle({
        'flex-direction': 'row'
      });
    });
    it('should use default flex-direction for invalid binding value `[fxLayout]="direction"` usage', () => { // tslint:disable-line:max-line-length
      expectDOMFrom(`<div [fxLayout]="direction"></div>`, "direction", "invalid")
          .toHaveCssStyle({
            'flex-direction': 'row',
          });
    });
    it('should use update style with dynamic value changes `[fxLayout]="direction"` usage', () => {
      fixture = createTestComponent(`<div [fxLayout]="direction"></div>`);

      fixture.componentInstance.direction = "invalid";
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row',
      });

      fixture.componentInstance.direction = "column";
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'column'
      });

    });

    it('should set row-reverse direction for nested fxLayout containers', () => {
      let template = `
        <div [fxLayout]="direction" (click)="toggleDirection()" class="colored box" >
          <div fxFlex="20">  fxFlex="20"  </div>
          <div fxFlex="60">  outer fxFlex="60"
            <div fxLayout="row-reverse" fxLayoutAlign="center center" class="colored box" >
              <div fxFlex="20">  inner fxFlex="20"  </div>
              <div fxFlex="60">  inner fxFlex="60"  </div>
              <div fxFlex >      inner fxFlex       </div>
            </div>
          </div>
          <div fxFlex >      fxFlex       </div>
        </div>
      `;

      expectDomForQuery(template, "[fxLayout='row-reverse']")
          .toHaveCssStyle({
            'flex-direction': 'row-reverse',
          });
    });

  });

  describe('with responsive features', () => {

    it('should ignore responsive changes when not configured', () => {
      fixture = createTestComponent(`<div fxLayout="column"></div>`);
      activateMediaQuery('md');
      expectNativeEl(fixture).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      });
    });
    it('should add responsive styles when configured', () => {
      fixture = createTestComponent(`<div fxLayout fxLayout.md="column"></div>`);

      expectNativeEl(fixture).toHaveCssStyle({

        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      });

      activateMediaQuery('md');
      expectNativeEl(fixture).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      });
    });
    it('should update responsive styles when the active mediaQuery changes', () => {
      fixture = createTestComponent(`<div fxLayout fxLayout.md="column"></div>`);

      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });

      activateMediaQuery('md');
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'column'
      });
      activateMediaQuery('all');
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });
    });

    it('should update styles with bindings and the active mediaQuery changes', () => {
      fixture = createTestComponent(`
          <div fxLayout="row"
               [fxLayout.md]="direction">
          </div>
       `);
      expectNativeEl(fixture).toHaveCssStyle({'flex-direction': 'row'});

      activateMediaQuery('md');
      expectNativeEl(fixture).toHaveCssStyle({'flex-direction': 'column'});

      fixture.componentInstance.direction = "row";
      expectNativeEl(fixture).toHaveCssStyle({'flex-direction': 'row'});


    });
    it('should fallback to default styles when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      fixture = createTestComponent(`<div fxLayout fxLayout.md="column"></div>`);

      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });

      activateMediaQuery('md');
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'column'
      });
      activateMediaQuery('lg');
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });

    });
    it('should fallback to closest overlapping value when the active mediaQuery change is not configured', () => { // tslint:disable-line:max-line-length
      fixture = createTestComponent(`<div fxLayout fxLayout.gt-sm="column" fxLayout.md="row"></div>`);

      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });

      activateMediaQuery('gt-sm');
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'column'
      });
      activateMediaQuery('md');
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });

      // Should fallback to value for 'gt-sm'
      activateMediaQuery('lg', true);
      expectNativeEl(fixture).toHaveCssStyle({
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
  direction = "column";

  constructor() {
  }

  ngOnInit() {
  }
}
