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

describe('grid columns parent directive', () => {
  let fixture: ComponentFixture<any>;
  let styler: StyleUtils;
  let mediaController: MockMatchMedia;
  let platform: Platform;
  let shouldRun = true;
  let createTestComponent = (template: string, styles?: any) => {
    shouldRun = true;
    fixture = makeCreateTestComponent(() => TestGridColumnsComponent)(template, styles);
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
      declarations: [TestGridColumnsComponent],
      providers: [
        MockMatchMediaProvider,
        {provide: SERVER_TOKEN, useValue: true},
      ],
    });
  });

  describe('with static features', () => {
    it('should add column styles for parent', () => {
      let template = `
              <div gdColumns="100px 1fr">
                  <div gdArea="header"></div>
                  <div gdArea="sidebar"></div>
                  <div gdArea="footer"></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'display': 'grid',
        'grid-template-columns': '100px 1fr'
      }, styler);
    });

    it('should add auto column styles for parent', () => {
      let template = `
              <div gdColumns="100px 1fr auto!">
                  <div gdArea="header"></div>
                  <div gdArea="sidebar"></div>
                  <div gdArea="footer"></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      // TODO(CaerusKaru): Firefox has an issue with auto tracks,
      // caused by rachelandrew/gridbugs#1
      if (!platform.FIREFOX) {
        expectNativeEl(fixture).toHaveStyle({
          'display': 'grid',
          'grid-auto-columns': '100px 1fr auto'
        }, styler);
      }
    });

    it('should work with inline grid', () => {
      let template = `
              <div gdColumns="100px 1fr" gdInline>
                  <div gdArea="header"></div>
                  <div gdArea="sidebar"></div>
                  <div gdArea="footer"></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'display': 'inline-grid',
        'grid-template-columns': '100px 1fr'
      }, styler);
    });

    it('should add dynamic columns styles', () => {
      let template = `
            <div [gdColumns]='cols'></div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'display': 'grid',
        'grid-template-columns': '50px 1fr'
      }, styler);

      fixture.componentInstance.cols = '100px 1fr';

      expectNativeEl(fixture).toHaveStyle({
        'display': 'grid',
        'grid-template-columns': '100px 1fr'
      }, styler);
    });
  });

  describe('with responsive features', () => {
    it('should add col styles for a parent', () => {
      let template = `
              <div gdColumns="100px 1fr"
                   gdColumns.xs="50px 1fr"></div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      expectNativeEl(fixture).toHaveStyle({
        'display': 'grid',
        'grid-template-columns': '100px 1fr'
      }, styler);

      mediaController.activate('xs');
      expectNativeEl(fixture).toHaveStyle({
        'display': 'grid',
        'grid-template-columns': '50px 1fr'
      }, styler);

      mediaController.activate('md');
      expectNativeEl(fixture).toHaveStyle({
        'display': 'grid',
        'grid-template-columns': '100px 1fr'
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
class TestGridColumnsComponent {
  cols = '50px 1fr';
}
