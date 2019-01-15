/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {Platform} from '@angular/cdk/platform';
import {
  ɵMatchMedia as MatchMedia,
  ɵMockMatchMedia as MockMatchMedia,
  ɵMockMatchMediaProvider as MockMatchMediaProvider,
  SERVER_TOKEN,
  StyleUtils,
} from '@angular/flex-layout/core';

import {customMatchers} from '../../utils/testing/custom-matchers';
import {expectNativeEl, makeCreateTestComponent} from '../../utils/testing/helpers';

import {GridModule} from '../module';

describe('grid area parent directive', () => {
  let fixture: ComponentFixture<any>;
  let styler: StyleUtils;
  let mediaController: MockMatchMedia;
  let platform: Platform;
  let shouldRun = true;
  let createTestComponent = (template: string, styles?: any) => {
    shouldRun = true;
    fixture = makeCreateTestComponent(() => TestGridAreaComponent)(template, styles);
    inject([StyleUtils, MatchMedia, Platform],
      (_styler: StyleUtils, _matchMedia: MockMatchMedia, _platform: Platform) => {
      styler = _styler;
      mediaController = _matchMedia;
      platform = _platform;

      // TODO(CaerusKaru): Grid tests won't work with Edge 14
      if (_platform.EDGE) {
        shouldRun = false;
      }
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, GridModule],
      declarations: [TestGridAreaComponent],
      providers: [
        MockMatchMediaProvider,
        {provide: SERVER_TOKEN, useValue: true},
      ],
    });
  });

  describe('with static features', () => {
    it('should add area styles for parent', () => {
      let template = `
              <div gdAreas="header | header | sidebar | footer">
                  <div gdArea="header"></div>
                  <div gdArea="sidebar"></div>
                  <div gdArea="footer"></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      // TODO(CaerusKaru): Edge currently has a bug with template areas
      // when they don't have columns/rows explicitly set. Remove when fixed
      if (platform.EDGE) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'display': 'grid',
        'grid-template-areas': '"header" "header" "sidebar" "footer"'
      }, styler);
    });

    it('should work with inline grid', () => {
      let template = `
              <div gdAreas="header | header | sidebar | footer" gdInline>
                  <div gdArea="header"></div>
                  <div gdArea="sidebar"></div>
                  <div gdArea="footer"></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      // TODO(CaerusKaru): Edge currently has a bug with template areas
      // when they don't have columns/rows explicitly set. Remove when fixed
      if (platform.EDGE) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'display': 'inline-grid',
        'grid-template-areas': '"header" "header" "sidebar" "footer"'
      }, styler);
    });

    it('should work with weird spacing', () => {
      let template = `
              <div gdAreas="header| header |sidebar | footer       ">
                  <div gdArea="header"></div>
                  <div gdArea="sidebar"></div>
                  <div gdArea="footer"></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      // TODO(CaerusKaru): Edge currently has a bug with template areas
      // when they don't have columns/rows explicitly set. Remove when fixed
      if (platform.EDGE) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'display': 'grid',
        'grid-template-areas': '"header" "header" "sidebar" "footer"'
      }, styler);
    });

    it('should add dynamic area styles', () => {
      let template = `
            <div [gdAreas]='areas'></div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      // TODO(CaerusKaru): Edge currently has a bug with template areas
      // when they don't have columns/rows explicitly set. Remove when fixed
      if (platform.EDGE) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'grid-template-areas': '"sidebar" "sidebar"'
      }, styler);

      fixture.componentInstance.areas = 'header | header | sidebar';

      expectNativeEl(fixture).toHaveStyle({
        'display': 'grid',
        'grid-template-areas': '"header" "header" "sidebar"'
      }, styler);
    });
  });

  describe('with responsive features', () => {
    it('should add row styles for a child', () => {
      let template = `
              <div gdAreas="header header header | sidebar content content | footer footer footer"
                   gdAreas.xs="header header | sidebar content | footer footer"></div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      // TODO(CaerusKaru): Edge currently has a bug with template areas
      // when they don't have columns/rows explicitly set. Remove when fixed
      if (platform.EDGE) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'display': 'grid',
        'grid-template-areas':
          '"header header header" "sidebar content content" "footer footer footer"'
      }, styler);

      mediaController.activate('xs');
      expectNativeEl(fixture).toHaveStyle({
        'display': 'grid',
        'grid-template-areas': '"header header" "sidebar content" "footer footer"'
      }, styler);

      mediaController.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'display': 'grid',
        'grid-template-areas':
          '"header header header" "sidebar content content" "footer footer footer"'
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
class TestGridAreaComponent {
  areas = 'sidebar | sidebar';
}
