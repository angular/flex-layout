/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Component, OnInit, Inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockMatchMedia } from '../../media-query/mock/mock-match-media';
import { MatchMedia } from '../../media-query/match-media';
import { ObservableMedia } from '../../media-query/observable-media-service';
import { BreakPointsProvider } from '../../media-query/breakpoints/break-points';
import { BreakPointRegistry } from '../../media-query/breakpoints/break-point-registry';

import { customMatchers } from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent, expectNativeEl
} from '../../utils/testing/helpers';
import { StyleDirective } from './style';
import { MediaQueriesModule } from '../../media-query/_module';

describe('style directive', () => {
  let fixture: ComponentFixture<any>;
  let createTestComponent = makeCreateTestComponent(() => TestStyleComponent);
  let activateMediaQuery: Function = (alias, useOverlaps = false): void => {
    let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);
    matchMedia.activate(alias, useOverlaps);
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, MediaQueriesModule],
      declarations: [TestStyleComponent, StyleDirective],
      providers: [
        BreakPointRegistry, BreakPointsProvider,
        { provide: MatchMedia, useClass: MockMatchMedia }
      ]
    });
  });
  afterEach(() => {
    if (fixture) {
      fixture.debugElement.injector.get(MatchMedia).clearAll();
      fixture = null;
    }
  });

  [
    { mq: 'xs', styleStr: "{'font-size': '15px'}", styleObj: { 'font-size': '15px' } },
    { mq: 'sm', styleStr: "{'font-size': '16px'}", styleObj: { 'font-size': '16px' } },
    { mq: 'md', styleStr: "{'font-size': '17px'}", styleObj: { 'font-size': '17px' } },
    { mq: 'lg', styleStr: "{'font-size': '18px'}", styleObj: { 'font-size': '18px' } }
  ]
    .forEach(testData => {
      it(`should apply '${testData.styleStr}' with '${testData.mq}' media query`, () => {
        fixture = createTestComponent(`
            <div [style.${testData.mq}]="${testData.styleStr}">
            </div>
        `);
        activateMediaQuery(testData.mq, true);
        expectNativeEl(fixture).toHaveCssStyle(testData.styleObj);
      });
    });

  it('should override existing styles', () => {
    fixture = createTestComponent(`
                <div style="color: blue" [style.xs]="{'font-size': '15px'}">
                </div>
            `);
    expectNativeEl(fixture).toHaveCssStyle({ color: 'blue' });
    activateMediaQuery('xs', true);
    expectNativeEl(fixture).toHaveCssStyle({ 'font-size': '15px' });
  });

  it('should allow more than one responsive breakpoint on one element', () => {
    fixture = createTestComponent(`
                <div [style.xs]="{'font-size': '16px'}"
                  [style.md]="{'font-size': '12px'}">
                </div>
            `);
    activateMediaQuery('xs', true);
    expectNativeEl(fixture).toHaveCssStyle({ 'font-size': '16px' });
    expectNativeEl(fixture).not.toHaveCssStyle({ 'font-size': '12px' });
    activateMediaQuery('md', true);
    expectNativeEl(fixture).not.toHaveCssStyle({ 'font-size': '16px' });
    expectNativeEl(fixture).toHaveCssStyle({ 'font-size': '12px' });
  });

  it('should work with special ngStyle px notation', () => {
    fixture = createTestComponent(`
                <div [style.xs]="{'font-size.px': 15}">
                </div>
            `);
    activateMediaQuery('xs', true);
    expectNativeEl(fixture).toHaveCssStyle({ 'font-size': '15px' });
  });

  it('should work with bound values', () => {
    fixture = createTestComponent(`
                <div [style.xs]="{'font-size.px': fontSize}">
                </div>
            `);
    activateMediaQuery('xs', true);
    expectNativeEl(fixture, { fontSize: 19 }).toHaveCssStyle({ 'font-size': '19px' });
  });
});

// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-style-api',
  template: `<span>PlaceHolder Template HTML</span>`
})
export class TestStyleComponent implements OnInit {
  fontSize: number;

  constructor( @Inject(ObservableMedia) private media) {
  }

  ngOnInit() {
  }
}



