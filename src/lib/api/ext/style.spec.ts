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

import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {DEFAULT_BREAKPOINTS_PROVIDER} from '../../media-query/breakpoints/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';

import {LayoutDirective} from '../flexbox/layout';
import {StyleDirective} from './style';
import {MediaQueriesModule} from '../../media-query/_module';

import {customMatchers} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent, expectNativeEl
} from '../../utils/testing/helpers';

describe('style directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let createTestComponent = (template) => {
    fixture = makeCreateTestComponent(() => TestStyleComponent)(template);

    inject([MatchMedia], (_matchMedia: MockMatchMedia) => {
      matchMedia = _matchMedia;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, MediaQueriesModule],
      declarations: [TestStyleComponent, LayoutDirective, StyleDirective],
      providers: [
        BreakPointRegistry, DEFAULT_BREAKPOINTS_PROVIDER,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
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
      matchMedia.activate(testData.mq);
      expectNativeEl(fixture).toHaveStyle(testData.styleObj);
    });
  });

  it('should merge with default inline styles', () => {
    createTestComponent(`
        <div style="color: blue" [ngStyle.xs]="{'font-size.px': '15'}">
        </div>
    `);
    expectNativeEl(fixture).toHaveStyle({color: 'blue'});
    matchMedia.activate('xs');
    expectNativeEl(fixture).toHaveStyle({color: 'blue', 'font-size': '15px'});
  });

  it('should support raw-string notations', () => {
    createTestComponent(`
        <div
            style="color: blue"
            ngStyle.xs="font-size: 15px; background-color:#fc2929;" >
        </div>
    `);
    expectNativeEl(fixture).toHaveStyle({color: 'blue'});
    matchMedia.activate('xs');
    expectNativeEl(fixture).toHaveStyle({
      'color': 'blue',
      'font-size': '15px',
      'background-color': 'rgb(252, 41, 41)'
    });
  });

  it('should allow more than one responsive breakpoint on one element', () => {
    createTestComponent(`
      <div  fxLayout
        [ngStyle]="{'font-size': '10px;', 'margin-left' : '13px'}"
        [ngStyle.xs]="{'font-size': '16px'}"
        [ngStyle.md]="{'font-size': '12px'}">
      </div>
    `);

    fixture.detectChanges();

    matchMedia.activate('xs');
    expectNativeEl(fixture).toHaveStyle({'display': 'flex'});
    expectNativeEl(fixture).toHaveStyle({'font-size': '16px'});
    expectNativeEl(fixture).not.toHaveStyle({'font-size': '12px'});

    matchMedia.activate('md');
    expectNativeEl(fixture).not.toHaveStyle({'font-size': '16px'});
    expectNativeEl(fixture).toHaveStyle({'font-size': '12px'});

    matchMedia.activate('lg');
    expectNativeEl(fixture).not.toHaveStyle({'font-size': '12px'});
    expectNativeEl(fixture).not.toHaveStyle({'font-size': '16px'});
    expectNativeEl(fixture).toHaveStyle({'font-size': '10px'});  // original is gone
    expectNativeEl(fixture).toHaveStyle({'margin-left': '13px'});   // portion remains

  });

  it('should work with special ngStyle px notation', () => {
    createTestComponent(`
        <div [ngStyle.xs]="{'font-size.px': 15}">
        </div>
    `);
    matchMedia.activate('xs');
    expectNativeEl(fixture).toHaveStyle({'font-size': '15px'});
  });

  it('should work with bound values', () => {
    createTestComponent(`
        <div [ngStyle.xs]="{'font-size.px': fontSize}">
        </div>
    `);
    matchMedia.activate('xs');
    expectNativeEl(fixture, {fontSize: 19}).toHaveStyle({'font-size': '19px'});
  });
});

// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-style-api',
  template: `<span>PlaceHolder Template HTML</span>`
})
export class TestStyleComponent {
  fontSize: number;
}



