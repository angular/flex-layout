/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {
  ɵMatchMedia as MatchMedia,
  CoreModule,
  ɵMockMatchMedia as MockMatchMedia,
  ɵMockMatchMediaProvider as MockMatchMediaProvider,
  StyleUtils,
} from '@angular/flex-layout/core';
import {DefaultLayoutDirective} from '@angular/flex-layout/flex';

import {DefaultStyleDirective} from './style';
import {customMatchers} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent, expectNativeEl
} from '../../utils/testing/helpers';

describe('style directive', () => {
  let fixture: ComponentFixture<any>;
  let mediaController: MockMatchMedia;
  let styler: StyleUtils;
  let createTestComponent = (template: string) => {
    fixture = makeCreateTestComponent(() => TestStyleComponent)(template);

    inject([MatchMedia, StyleUtils], (_matchMedia: MockMatchMedia, _styler: StyleUtils) => {
      mediaController = _matchMedia;
      styler = _styler;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, CoreModule],
      declarations: [TestStyleComponent, DefaultLayoutDirective, DefaultStyleDirective],
      providers: [MockMatchMediaProvider]
    });
  });

  [
    {mq: 'xs', styleStr: "{'font-size': '15px'}", styleObj: {'font-size': '15px'}},
    {mq: 'sm', styleStr: "{'font-size': '16px'}", styleObj: {'font-size': '16px'}},
    {mq: 'md', styleStr: "{'font-size': '17px'}", styleObj: {'font-size': '17px'}},
    {mq: 'lg', styleStr: "{'font-size': '18px'}", styleObj: {'font-size': '18px'}}
  ]
  .forEach(testData => {
    it(`should apply '${testData.styleStr}' with '${testData.mq}' media query`, () => {
      createTestComponent(`
        <div [ngStyle.${testData.mq}]="${testData.styleStr}">
        </div>
    `);
      mediaController.activate(testData.mq);
      expectNativeEl(fixture).toHaveStyle(testData.styleObj, styler);
    });
  });

  it('should merge with default inline styles', () => {
    createTestComponent(`
        <div style="color: blue" [ngStyle.xs]="{'font-size.px': '15'}">
        </div>
    `);
    expectNativeEl(fixture).toHaveStyle({color: 'blue'}, styler);
    mediaController.activate('xs');
    expectNativeEl(fixture).toHaveStyle({color: 'blue', 'font-size': '15px'}, styler);
  });

  it('should support raw-string notations', () => {
    createTestComponent(`
        <div
            style="color: blue"
            ngStyle.xs="font-size: 15px; background-color: #fc2929;" >
        </div>
    `);
    expectNativeEl(fixture).toHaveStyle({color: 'blue'}, styler);
    mediaController.activate('xs');

    expectNativeEl(fixture).toHaveStyle({
      'color': 'blue',
      'font-size': '15px'
    }, styler);

    // TODO(CaerusKaru): the Domino server impl. does not process colors correctly
    const backgroundColor = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
      'background-color');
    const hasBackgroundRaw = backgroundColor === '#fc2929';
    const hasBackgroundFormat = backgroundColor === 'rgb(252, 41, 41)';
    const hasBackground = hasBackgroundFormat || hasBackgroundRaw;

    expect(hasBackground).toBe(true);
  });

  it('should allow more than one responsive breakpoint on one element', () => {
    createTestComponent(`
      <div fxLayout
        [ngStyle]="{'font-size': '10px;', 'margin-left' : '13px'}"
        [ngStyle.xs]="{'font-size': '16px'}"
        [ngStyle.md]="{'font-size': '12px'}">
      </div>
    `);

    fixture.detectChanges();

    mediaController.activate('xs');
    expectNativeEl(fixture).toHaveStyle({'display': 'flex'}, styler);
    expectNativeEl(fixture).toHaveStyle({'font-size': '16px'}, styler);
    expectNativeEl(fixture).not.toHaveStyle({'font-size': '12px'}, styler);

    mediaController.activate('md');
    expectNativeEl(fixture).not.toHaveStyle({'font-size': '16px'}, styler);
    expectNativeEl(fixture).toHaveStyle({'font-size': '12px'}, styler);

    mediaController.activate('lg');
    expectNativeEl(fixture).not.toHaveStyle({'font-size': '12px'}, styler);
    expectNativeEl(fixture).not.toHaveStyle({'font-size': '16px'}, styler);
    expectNativeEl(fixture).toHaveStyle({'font-size': '10px'}, styler);  // original is gone
    expectNativeEl(fixture).toHaveStyle({'margin-left': '13px'}, styler);   // portion remains

  });

  it('should work with special ngStyle px notation', () => {
    createTestComponent(`
        <div [ngStyle.xs]="{'font-size.px': 15}">
        </div>
    `);
    mediaController.activate('xs');
    expectNativeEl(fixture).toHaveStyle({'font-size': '15px'}, styler);
  });

  it('should work with bound values', () => {
    createTestComponent(`
        <div [ngStyle.xs]="{'font-size.px': fontSize}">
        </div>
    `);
    mediaController.activate('xs');
    expectNativeEl(fixture, {fontSize: 19}).toHaveStyle({'font-size': '19px'}, styler);
  });

  it('should work with URLs', () => {
    createTestComponent(`
        <div [ngStyle]="{'background-image': 'url(' + testUrl + ')', 'height': '300px'}">
        </div>
    `);
    fixture.detectChanges();
    const url = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
      'background-image');
    const isUrl = url === `url("${URL}")` || url === `url(${URL})`;
    expect(isUrl).toBeTruthy();
  });

  it('should work with just ngStyle and preexisting styles', () => {
    createTestComponent(`
      <div style="background-color: red; height: 100px; width: 100px;" [ngStyle]="divStyle">
        First div
      </div>
    `);
    expectNativeEl(fixture).toHaveStyle({'background-color': 'red'}, styler);
    expectNativeEl(fixture).toHaveStyle({'height': '100px'}, styler);
    expectNativeEl(fixture).toHaveStyle({'width': '100px'}, styler);
    expectNativeEl(fixture).toHaveStyle({'border': '2px solid green'}, styler);
  });
});

// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-style-api',
  template: `<span>PlaceHolder Template HTML</span>`
})
class TestStyleComponent {
  fontSize: number = 0;
  testUrl = URL;
  divStyle = {'border': '2px solid green'};
}

const URL = 'https://cloud.githubusercontent.com/assets/210413/' +
  '21288118/917e3faa-c440-11e6-9b08-28aff590c7ae.png';
