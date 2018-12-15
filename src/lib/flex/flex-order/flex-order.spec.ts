/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component} from '@angular/core';
import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {
  MatchMedia,
  MockMatchMedia,
  MockMatchMediaProvider,
  SERVER_TOKEN,
  StyleUtils,
} from '@angular/flex-layout/core';

import {customMatchers} from '../../utils/testing/custom-matchers';
import {FlexLayoutModule} from '../../module';
import {expectNativeEl, makeCreateTestComponent} from '../../utils/testing/helpers';

describe('flex-order', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let styler: StyleUtils;
  let createTestComponent = (template: string) => {
    fixture = makeCreateTestComponent(() => TestOrderComponent)(template);

    inject([MatchMedia, StyleUtils], (_matchMedia: MockMatchMedia, _styler: StyleUtils) => {
      matchMedia = _matchMedia;
      styler = _styler;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    TestBed.configureTestingModule({
      declarations: [TestOrderComponent],
      imports: [CommonModule, FlexLayoutModule],
      providers: [
        MockMatchMediaProvider,
        {provide: SERVER_TOKEN, useValue: true},
      ],
    });
  });

  describe('static API', () => {
    it('should add correct static values', () => {
      createTestComponent(`<div fxFlexOrder="1"></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'order': '1',
      }, styler);
    });
  });

  describe('responsive API', () => {
    it('should add correct responsive values', () => {
      createTestComponent(`<div fxFlexOrder.xs="1"></div>`);
      expectNativeEl(fixture).not.toHaveStyle({
        'order': '1',
      }, styler);
      matchMedia.activate('lt-sm', true);
      expectNativeEl(fixture).toHaveStyle({
        'order': '1',
      }, styler);
      matchMedia.activate('sm');
      expectNativeEl(fixture).not.toHaveStyle({
        'order': '1',
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
class TestOrderComponent {
  constructor() {
  }
}
