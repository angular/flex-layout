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

describe('grid row child directive', () => {
  let fixture: ComponentFixture<any>;
  let styler: StyleUtils;
  let mediaController: MockMatchMedia;
  let platform: Platform;
  let shouldRun = true;
  let createTestComponent = (template: string, styles?: any) => {
    shouldRun = true;
    fixture = makeCreateTestComponent(() => TestGridRowComponent)(template, styles);
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
      declarations: [TestGridRowComponent],
      providers: [
        MockMatchMediaProvider,
        {provide: SERVER_TOKEN, useValue: true},
      ],
    });
  });

  describe('with static features', () => {
    it('should add row styles for children', () => {
      let template = `
              <div gdAuto>
                  <div gdRow="span 3 / 6"></div>
                  <div gdRow="span 2 / 6"></div>
                  <div gdRow="span 1 / 6"></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      fixture.detectChanges();

      let nodes = queryFor(fixture, '[gdRow]');
      expect(nodes.length).toBe(3);
      if (platform.WEBKIT) {
        expectEl(nodes[1]).toHaveStyle({
          'grid-row-start': 'span 2',
          'grid-row-end': '6',
        }, styler);
      } else {
        expectEl(nodes[1]).toHaveStyle({'grid-row': 'span 2 / 6'}, styler);
      }
    });

    it('should add dynamic row styles', () => {
      let template = `
            <div [gdRow]='row'></div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      fixture.detectChanges();

      let rowStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
        'grid-row');
      let correctRow = rowStyles === 'apples' || rowStyles === 'apples / apples' ||
        rowStyles === 'apples apples';

      expect(correctRow).toBe(true);

      fixture.componentInstance.row = 'oranges';
      fixture.detectChanges();

      rowStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement, 'grid-row');
      correctRow = rowStyles === 'oranges' || rowStyles === 'oranges / oranges' ||
        rowStyles === 'oranges oranges';
      expect(correctRow).toBe(true);
    });
  });

  describe('with responsive features', () => {
    it('should add row styles for a child', () => {
      let template = `
              <div gdRow="sidebar" gdRow.xs="footer"></div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      fixture.detectChanges();
      let rowStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
        'grid-row');
      let correctRow = rowStyles === 'sidebar' || rowStyles === 'sidebar / sidebar' ||
        rowStyles === 'sidebar sidebar';
      expect(correctRow).toBe(true);

      mediaController.activate('xs');
      rowStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
        'grid-row');
      correctRow = rowStyles === 'footer' || rowStyles === 'footer / footer' ||
        rowStyles === 'footer footer';
      expect(correctRow).toBe(true);

      mediaController.activate('md');
      rowStyles = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
        'grid-row');
      correctRow = rowStyles === 'sidebar' || rowStyles === 'sidebar / sidebar' ||
        rowStyles === 'sidebar sidebar';
      expect(correctRow).toBe(true);
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
class TestGridRowComponent {
  row = 'apples';
}
