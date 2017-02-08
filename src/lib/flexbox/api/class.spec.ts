/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Component, OnInit, Inject, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockMatchMedia } from '../../media-query/mock/mock-match-media';
import { MatchMedia } from '../../media-query/match-media';
import { ObservableMedia } from '../../media-query/observable-media-service';
import { BreakPointsProvider } from '../../media-query/breakpoints/break-points';
import { BreakPointRegistry } from '../../media-query/breakpoints/break-point-registry';
import { BaseFxDirectiveAdapter } from './class';

import { customMatchers, expect } from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent, expectNativeEl
} from '../../utils/testing/helpers';
import { ClassDirective } from './class';
import { MediaQueriesModule } from '../../media-query/_module';

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

  ['xs', 'sm', 'md', 'lg']
    .forEach(mq => {
      const selector = `class-${mq}`;
      it(`should apply '${selector}' with '${mq}' media query`, () => {
        fixture = createTestComponent(`
              <div class.${mq}="${selector}">
              </div>
          `);
        activateMediaQuery(mq, true);
        expectNativeEl(fixture).toHaveCssClass(selector);
      });
    });

  it('should keep existing class selector', () => {
    fixture = createTestComponent(`
                <div class="existing-class" class.xs="xs-class">
                </div>
            `);
    expectNativeEl(fixture).toHaveCssClass('existing-class');
    activateMediaQuery('xs', true);
    expectNativeEl(fixture).toHaveCssClass('existing-class');
  });

  it('should allow more than one responsive breakpoint on one element', () => {
    fixture = createTestComponent(`
                <div class.xs="xs-class"
                  class.md="md-class">
                </div>
            `);
    activateMediaQuery('xs', true);
    expectNativeEl(fixture).toHaveCssClass('xs-class');
    expectNativeEl(fixture).not.toHaveCssClass('md-class');
    activateMediaQuery('md', true);
    expectNativeEl(fixture).not.toHaveCssClass('xs-class');
    expectNativeEl(fixture).toHaveCssClass('md-class');
  });

  it('should work with ngClass object notation', () => {
    fixture = createTestComponent(`
                <div [class.xs]="{'xs-1': hasXs1, 'xs-2': hasXs2}">
                </div>
            `);
    activateMediaQuery('xs', true);
    expectNativeEl(fixture, { hasXs1: true, hasXs2: false }).toHaveCssClass('xs-1');
    expectNativeEl(fixture, { hasXs1: true, hasXs2: false }).not.toHaveCssClass('xs-2');

    expectNativeEl(fixture, { hasXs1: false, hasXs2: true }).toHaveCssClass('xs-2');
    expectNativeEl(fixture, { hasXs1: false, hasXs2: true }).not.toHaveCssClass('xs-1');
  });

  it('should work with ngClass array notation', () => {
    fixture = createTestComponent(`
                <div [class.xs]="['xs-1', 'xs-2']">
                </div>
            `);
    activateMediaQuery('xs', true);
    expectNativeEl(fixture).toHaveCssClass('xs-1');
    expectNativeEl(fixture).toHaveCssClass('xs-2');
  });
});

export class MockElementRef extends ElementRef {
  constructor() {
    const nEl = document.createElement('DIV');
    super(nEl);
    this.nativeElement = nEl;
  }
}

describe('BaseFxDirectiveAdapter class', () => {
  let component;
  beforeEach(() => {
    component = new BaseFxDirectiveAdapter(null, new MockElementRef(), null);
  });
  describe('cacheInput', () => {
    it('should call _cacheInputArray when source is an array', () => {
      spyOn(component, '_cacheInputArray');
      component.cacheInput('key', []);
      expect(component._cacheInputArray).toHaveBeenCalled();
    });
    it('should call _cacheInputObject when source is an object', () => {
      spyOn(component, '_cacheInputObject');
      component.cacheInput('key', {});
      expect(component._cacheInputObject).toHaveBeenCalled();
    });
    it('should call _cacheInputString when source is a string', () => {
      spyOn(component, '_cacheInputString');
      component.cacheInput('key', '');
      expect(component._cacheInputString).toHaveBeenCalled();
    });
    it('should throw when source is not an object, array or string', () => {
      expect(component.cacheInput.bind(null, true)).toThrow();
    });
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

  constructor( @Inject(ObservableMedia) private media) {
  }

  ngOnInit() {
  }
}



