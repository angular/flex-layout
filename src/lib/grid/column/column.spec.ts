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
  queryFor,
  makeCreateTestComponent,
} from '../../utils/testing/helpers';

import {GridModule} from '../module';

describe('grid column child directive', () => {
  let fixture: ComponentFixture<any>;
  let styler: StyleUtils;
  let mediaController: MockMatchMedia;
  let platform: Platform;
  let shouldRun = true;
  let createTestComponent = (template: string, styles?: any) => {
    shouldRun = true;
    fixture = makeCreateTestComponent(() => TestGridColumnComponent)(template, styles);
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
      declarations: [TestGridColumnComponent],
      providers: [
        MockMatchMediaProvider,
        {provide: SERVER_TOKEN, useValue: true},
      ],
    });
  });

  describe('with static features', () => {
    it('should add column styles for children', () => {
      let template = `
              <div gdAuto>
                  <div gdColumn="span 3 / 6"></div>
                  <div gdColumn="span 2 / 6"></div>
                  <div gdColumn="span 1 / 6"></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      fixture.detectChanges();

      let nodes = queryFor(fixture, '[gdColumn]');
      expect(nodes.length).toBe(3);

      if (platform.WEBKIT) {
        expectEl(nodes[1]).toHaveStyle({
          'grid-column-start': 'span 2',
          'grid-column-end': '6',
        }, styler);
      } else {
        expectEl(nodes[1]).toHaveStyle({'grid-column': 'span 2 / 6'}, styler);
      }
    });

    it('should add dynamic column styles', () => {
      let template = `
            <div [gdColumn]='col'></div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      fixture.detectChanges();

      let colStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
        'grid-column');
      let correctCol = colStyles === 'apples' || colStyles === 'apples / apples' ||
        colStyles === 'apples apples';

      expect(correctCol).toBe(true);

      fixture.componentInstance.col = 'oranges';
      fixture.detectChanges();

      colStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement, 'grid-column');
      correctCol = colStyles === 'oranges' || colStyles === 'oranges / oranges' ||
        colStyles === 'oranges oranges';
      expect(correctCol).toBe(true);
    });
  });

  describe('with responsive features', () => {
    it('should add row styles for a child', () => {
      let template = `
              <div gdColumn="sidebar" gdColumn.xs="footer"></div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      fixture.detectChanges();
      let colStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
        'grid-column');
      let correctCol = colStyles === 'sidebar' || colStyles === 'sidebar / sidebar' ||
        colStyles === 'sidebar sidebar';
      expect(correctCol).toBe(true);

      mediaController.activate('xs');
      colStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
        'grid-column');
      correctCol = colStyles === 'footer' || colStyles === 'footer / footer' ||
        colStyles === 'footer footer';
      expect(correctCol).toBe(true);

      mediaController.activate('md');
      colStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
        'grid-column');
      correctCol = colStyles === 'sidebar' || colStyles === 'sidebar / sidebar' ||
        colStyles === 'sidebar sidebar';
      expect(correctCol).toBe(true);
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
class TestGridColumnComponent {
  col = 'apples';
}
