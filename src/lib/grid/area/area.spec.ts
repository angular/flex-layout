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
import {
  expectEl,
  expectNativeEl,
  queryFor,
  makeCreateTestComponent,
} from '../../utils/testing/helpers';

import {GridModule} from '../module';

describe('grid area child directive', () => {
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
      if (platform.EDGE) {
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
    it('should add area styles for children', () => {
      let template = `
              <div gdAuto>
                  <div gdArea="heather / sophia"></div>
                  <div gdArea="grace / sarah"></div>
                  <div gdArea="sierra / becky"></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      fixture.detectChanges();

      let nodes = queryFor(fixture, '[gdArea]');
      expect(nodes.length).toBe(3);
      if (platform.WEBKIT) {
        expectEl(nodes[1]).toHaveStyle({
          'grid-row-start': 'grace',
          'grid-row-end': 'grace',
          'grid-column-start': 'sarah',
          'grid-column-end': 'sarah',
        }, styler);
      } else {
        let areaStyles = styler.lookupStyle(nodes[1].nativeElement, 'grid-area');
        let correctArea = areaStyles === 'grace / sarah' ||
          areaStyles === 'grace / sarah / grace / sarah';
        expect(correctArea).toBe(true);
      }
    });

    it('should add dynamic area styles', () => {
      let template = `
            <div [gdArea]='area'></div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'grid-row-start': 'sidebar',
          'grid-row-end': 'sidebar',
          'grid-column-start': 'sidebar',
          'grid-column-end': 'sidebar',
        }, styler);
      } else {
        fixture.detectChanges();
        let areaStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
          'grid-area');
        let correctArea = areaStyles === 'sidebar' ||
          areaStyles === 'sidebar / sidebar / sidebar / sidebar';
        expect(correctArea).toBe(true);
      }

      fixture.componentInstance.area = 'header';


      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'grid-row-start': 'header',
          'grid-row-end': 'header',
          'grid-column-start': 'header',
          'grid-column-end': 'header',
        }, styler);
      } else {
        fixture.detectChanges();
        let areaStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
          'grid-area');
        let correctArea = areaStyles === 'header' ||
          areaStyles === 'header / header / header / header';
        expect(correctArea).toBe(true);
      }
    });
  });

  describe('with responsive features', () => {
    it('should add row styles for a child', () => {
      let template = `
              <div gdArea="sidebar" gdArea.xs="footer"></div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'grid-row-start': 'sidebar',
          'grid-row-end': 'sidebar',
          'grid-column-start': 'sidebar',
          'grid-column-end': 'sidebar',
        }, styler);
      } else {
        fixture.detectChanges();
        let areaStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
          'grid-area');
        let correctArea = areaStyles === 'sidebar' ||
          areaStyles === 'sidebar / sidebar / sidebar / sidebar';
        expect(correctArea).toBe(true);
      }

      mediaController.activate('xs');
      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'grid-row-start': 'footer',
          'grid-row-end': 'footer',
          'grid-column-start': 'footer',
          'grid-column-end': 'footer',
        }, styler);
      } else {
        let areaStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
          'grid-area');
        let correctArea = areaStyles === 'footer' ||
          areaStyles === 'footer / footer / footer / footer';
        expect(correctArea).toBe(true);
      }

      mediaController.activate('md');
      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'grid-row-start': 'sidebar',
          'grid-row-end': 'sidebar',
          'grid-column-start': 'sidebar',
          'grid-column-end': 'sidebar',
        }, styler);
      } else {
        let areaStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
          'grid-area');
        let correctArea = areaStyles === 'sidebar' ||
          areaStyles === 'sidebar / sidebar / sidebar / sidebar';
        expect(correctArea).toBe(true);
      }
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
  area = 'sidebar';
}
