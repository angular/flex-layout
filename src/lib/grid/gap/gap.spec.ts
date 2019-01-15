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

describe('grid gap directive', () => {
  let fixture: ComponentFixture<any>;
  let styler: StyleUtils;
  let mediaController: MockMatchMedia;
  let platform: Platform;
  let shouldRun = true;
  let createTestComponent = (template: string, styles?: any) => {
    shouldRun = true;
    fixture = makeCreateTestComponent(() => TestLayoutGapComponent)(template, styles);
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
      declarations: [TestLayoutGapComponent],
      providers: [
        MockMatchMediaProvider,
        {provide: SERVER_TOKEN, useValue: true},
      ],
    });
  });

  describe('with static features', () => {
    it('should add gap styles for a parent', () => {
      let template = `
              <div gdGap="10px">
                  <div></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'display': 'grid',
          'grid-row-gap': '10px',
          'grid-column-gap': '10px',
        }, styler);
      } else {
        expectNativeEl(fixture).toHaveStyle({'display': 'grid'}, styler);
        let gapStyle = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
          'grid-gap');
        let correctGap = gapStyle === '10px' || gapStyle == '10px 10px';
        expect(correctGap).toBe(true);
      }
    });

    it('should add gap styles with multiple values for a parent', () => {
      let template = `
              <div gdGap="10px 15px">
                  <div></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'display': 'grid',
          'grid-row-gap': '10px',
          'grid-column-gap': '15px',
        }, styler);
      } else if (platform.BLINK) {
        expectNativeEl(fixture).toHaveStyle({
          'display': 'grid',
          'gap': '10px 15px',
        }, styler);
      } else {
        expectNativeEl(fixture).toHaveStyle({
          'display': 'grid',
          'grid-gap': '10px 15px',
        }, styler);
      }
    });

    it('should add dynamic gap styles', () => {
      let template = `
              <div [gdGap]='gap'>
                  <div></div>
                  <div></div>
                  <div></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'display': 'grid',
          'grid-row-gap': '8px',
          'grid-column-gap': '8px',
        }, styler);
      } else {
        fixture.detectChanges();
        let gapStyle = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
          'grid-gap');
        let correctGap = gapStyle === '8px' || gapStyle == '8px 8px';
        expect(correctGap).toBe(true);
      }

      fixture.componentInstance.gap = '16px';

      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'display': 'grid',
          'grid-row-gap': '16px',
          'grid-column-gap': '16px',
        }, styler);
      } else {
        fixture.detectChanges();
        let gapStyle = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
          'grid-gap');
        let correctGap = gapStyle === '16px' || gapStyle == '16px 16px';
        expect(correctGap).toBe(true);
      }
    });

    it('should add inline grid css style', () => {
      let template = `
              <div gdGap="10px" gdInline>
                  <div></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'display': 'inline-grid',
          'grid-row-gap': '10px',
          'grid-column-gap': '10px',
        }, styler);
      } else {
        expectNativeEl(fixture).toHaveStyle({'display': 'inline-grid'}, styler);
        let gapStyle = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
          'grid-gap');
        let correctGap = gapStyle === '10px' || gapStyle == '10px 10px';
        expect(correctGap).toBe(true);
      }
    });
  });

  describe('with responsive features', () => {
    it('should add gap styles for a parent', () => {
      let template = `
              <div gdGap="10px" gdGap.xs="16px">
                  <div></div>
              </div>
          `;
      createTestComponent(template);

      if (!shouldRun) {
        return;
      }

      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'display': 'grid',
          'grid-row-gap': '10px',
          'grid-column-gap': '10px',
        }, styler);
      } else {
        expectNativeEl(fixture).toHaveStyle({'display': 'grid'}, styler);
        let gapStyle = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
          'grid-gap');
        let correctGap = gapStyle === '10px' || gapStyle == '10px 10px';
        expect(correctGap).toBe(true);
      }

      mediaController.activate('xs');
      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'display': 'grid',
          'grid-row-gap': '16px',
          'grid-column-gap': '16px',
        }, styler);
      } else {
        expectNativeEl(fixture).toHaveStyle({'display': 'grid'}, styler);
        let gapStyle = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
          'grid-gap');
        let correctGap = gapStyle === '16px' || gapStyle == '16px 16px';
        expect(correctGap).toBe(true);
      }

      mediaController.activate('md');
      if (platform.WEBKIT) {
        expectNativeEl(fixture).toHaveStyle({
          'display': 'grid',
          'grid-row-gap': '10px',
          'grid-column-gap': '10px',
        }, styler);
      } else {
        expectNativeEl(fixture).toHaveStyle({'display': 'grid'}, styler);
        let gapStyle = styler.lookupStyle(fixture.debugElement.children[0].nativeElement,
          'grid-gap');
        let correctGap = gapStyle === '10px' || gapStyle == '10px 10px';
        expect(correctGap).toBe(true);
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
class TestLayoutGapComponent {
  gap = '8px';
}
