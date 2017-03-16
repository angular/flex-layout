/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Component, OnInit
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {ObservableMedia} from '../../media-query/observable-media';
import {DEFAULT_BREAKPOINTS_PROVIDER} from '../../media-query/breakpoints/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';

import {customMatchers} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent, expectNativeEl
} from '../../utils/testing/helpers';
import {ClassDirective} from './class';
import {MediaQueriesModule} from '../../media-query/_module';

describe('class directive', () => {
  let fixture: ComponentFixture<any>;
  let createTestComponent = makeCreateTestComponent(() => TestClassComponent);
  let activateMediaQuery: Function = (alias, useOverlaps = false): void => {
    let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);
    matchMedia.activate(alias, useOverlaps);
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, MediaQueriesModule],
      declarations: [TestClassComponent, ClassDirective],
      providers: [
        BreakPointRegistry, DEFAULT_BREAKPOINTS_PROVIDER,
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

  ['xs', 'sm', 'md', 'lg']
      .forEach(mq => {
        const selector = `class-${mq}`;
        it(`should apply '${selector}' with '${mq}' media query`, () => {
          fixture = createTestComponent(`
              <div ngClass.${mq}="${selector}">
              </div>
          `);
          activateMediaQuery(mq);
          expectNativeEl(fixture).toHaveCssClass(selector);
        });
      });

  it('should keep existing class selector', () => {
    fixture = createTestComponent(`
        <div class="existing-class" ngClass.xs="xs-class">
        </div>
    `);

    expectNativeEl(fixture).toHaveCssClass('existing-class');
    activateMediaQuery('xs');
    expectNativeEl(fixture).not.toHaveCssClass('existing-class');

    activateMediaQuery('lg');
    expectNativeEl(fixture).toHaveCssClass('existing-class');
    expectNativeEl(fixture).not.toHaveCssClass('xs-class');
  });

  it('should keep existing ngClass selector', () => {
    // @see documentation for @angular/core ngClass =http://bit.ly/2mz0LAa
    fixture = createTestComponent(`
          <div ngClass="existing-class" ngClass.xs="existing-class xs-class">
          </div>
      `);

    expectNativeEl(fixture).toHaveCssClass('existing-class');
    activateMediaQuery('xs');
    expectNativeEl(fixture).toHaveCssClass('existing-class');

    activateMediaQuery('lg');
    expectNativeEl(fixture).toHaveCssClass('existing-class');
    expectNativeEl(fixture).not.toHaveCssClass('xs-class');
  });

  it('should support more than one responsive breakpoint on one element', () => {
    fixture = createTestComponent(`
                <div ngClass.xs="xs-class"
                  ngClass.md="md-class">
                </div>
            `);
    activateMediaQuery('xs');
    expectNativeEl(fixture).toHaveCssClass('xs-class');
    expectNativeEl(fixture).not.toHaveCssClass('md-class');
    activateMediaQuery('md');
    expectNativeEl(fixture).not.toHaveCssClass('xs-class');
    expectNativeEl(fixture).toHaveCssClass('md-class');
  });

  it('should work with ngClass object notation', () => {
    fixture = createTestComponent(`
        <div [ngClass]="{'xs-1': hasXs1, 'xs-3': hasXs3}" 
             [ngClass.xs]="{'xs-1': hasXs1, 'xs-2': hasXs2}">
        </div>
    `);
    activateMediaQuery('xs');
    expectNativeEl(fixture, {hasXs1: true, hasXs2: false}).toHaveCssClass('xs-1');
    expectNativeEl(fixture, {hasXs1: true, hasXs2: false}).not.toHaveCssClass('xs-2');

    expectNativeEl(fixture, {hasXs1: false, hasXs2: true}).toHaveCssClass('xs-2');
    expectNativeEl(fixture, {hasXs1: false, hasXs2: true}).not.toHaveCssClass('xs-1');

    activateMediaQuery('md');
    expectNativeEl(fixture, {hasXs1: true, hasX2: false, hasXs3: true}).toHaveCssClass('xs-3');
    expectNativeEl(fixture, {hasXs1: true, hasX2: false, hasXs3: true}).not.toHaveCssClass('xs-2');
    expectNativeEl(fixture, {hasXs1: true, hasX2: false, hasXs3: true}).toHaveCssClass('xs-1');
  });

  it('should work with ngClass array notation', () => {
    fixture = createTestComponent(`
        <div [ngClass.xs]="['xs-1', 'xs-2']">
        </div>
    `);
    activateMediaQuery('xs');
    expectNativeEl(fixture).toHaveCssClass('xs-1');
    expectNativeEl(fixture).toHaveCssClass('xs-2');
  });
});

// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-class-api',
  template: `<span>PlaceHolder Template HTML</span>`
})
export class TestClassComponent implements OnInit {
  hasXs1: boolean;
  hasXs2: boolean;

  constructor(private media: ObservableMedia) {
  }

  ngOnInit() {
  }
}



