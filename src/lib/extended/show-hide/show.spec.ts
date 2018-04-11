/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, OnInit, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformServer} from '@angular/common';
import {ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {
  MatchMedia,
  MockMatchMedia,
  MockMatchMediaProvider,
  ObservableMedia,
  SERVER_TOKEN,
  StyleUtils,
} from '@angular/flex-layout/core';
import {FlexModule} from '@angular/flex-layout/flex';

import {ExtendedModule} from '../module';
import {customMatchers} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, expectNativeEl} from '../../utils/testing/helpers';

describe('show directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let styler: StyleUtils;
  let platformId: Object;
  let createTestComponent = (template) => {
    fixture = makeCreateTestComponent(() => TestShowComponent)(template);

    inject([MatchMedia, StyleUtils, PLATFORM_ID],
      (_matchMedia: MockMatchMedia, _styler: StyleUtils, _platformId: Object) => {
      matchMedia = _matchMedia;
      styler = _styler;
      platformId = _platformId;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexModule, ExtendedModule],
      declarations: [TestShowComponent],
      providers: [
        MockMatchMediaProvider,
        {provide: SERVER_TOKEN, useValue: true}
      ]
    });
  });

  describe('without `responsive` features', () => {

    it('should initial with component visible as default', () => {
      createTestComponent(`<div fxShow></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'block'}, styler);
    });

    it('should initial with component not visible when set to `false`', () => {
      createTestComponent(`<div fxShow="false"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

    it('should initial with component not visible when set to `0`', () => {
      createTestComponent(`<div [fxShow]="isVisible"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      fixture.componentInstance.isVisible = true;
      expectNativeEl(fixture).toHaveStyle({'display': 'block'}, styler);
    });

    it('should update styles with binding changes', () => {
      createTestComponent(`<div [fxShow]="menuOpen" fxShow.xs="true"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'block'}, styler);
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveStyle({'display': 'block'}, styler);
    });

    it('should use "block" display style when not explicitly defined', () => {
      createTestComponent(`<button fxShow></button>`);
      // TODO(CaerusKaru): the Domino server impl. does not process inline display correctly
      expectNativeEl(fixture).toHaveStyle({
        'display': isPlatformServer(platformId) ? 'block' : 'inline-block'
      }, styler);
    });

    it('should use "flex" display style when the element also has an fxLayout', () => {
      createTestComponent(`<div fxLayout fxShow></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'flex'}, styler);
    });

  });

  describe('with responsive features', () => {

    it('should hide on `xs` viewports only', () => {
      createTestComponent(`<div fxShow fxShow.xs="false"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'block'}, styler);

      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({'display': 'block'}, styler);
    });

    it('should hide when fallbacks are configured to hide on `gt-xs` viewports', () => {
      createTestComponent(`<div fxShow fxShow.gt-xs="false"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'block'}, styler);

      matchMedia.activate('md', true);
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

    it('should support use of the `media` observable in templates ', () => {
      createTestComponent(`<div [fxShow]="media.isActive('xs')"></div>`);

      matchMedia.useOverlaps = true;
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({'display': 'block'}, styler);

      matchMedia.activate('gt-md');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

    it('should preserve display and update only on activated mediaQuery', () => {
      createTestComponent(`<div [fxShow.xs]="!isHidden" style="display:inline-block"></div>`);
      fixture.componentInstance.isHidden = false;

      expectNativeEl(fixture).toHaveStyle({'display': 'inline-block'}, styler);

      // should hide with this activation and setting
      matchMedia.activate('xs');
      fixture.componentInstance.isHidden = true;
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

    it('should restore display when not enabled', () => {
      let visibleStyle = {'display': 'inline-block'};
      createTestComponent(`<div [fxShow.xs]="!isHidden" style="display:inline-block"></div>`);
      fixture.componentInstance.isHidden = false;
      expectNativeEl(fixture).toHaveStyle(visibleStyle, styler);

      // mqActivation but the isHidden == false, so show it
      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle(visibleStyle, styler);

      // should hide with this activation
      fixture.componentInstance.isHidden = true;
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

    it('should restore display when the mediaQuery deactivates', () => {
      let visibleStyle = {'display': 'inline-block'};
      createTestComponent(`<div [fxShow.xs]="!isHidden" style="display:inline-block"></div>`);
      fixture.componentInstance.isHidden = true;
      expectNativeEl(fixture).toHaveStyle(visibleStyle, styler);

      // should hide with this activation
      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      // should reset to original display style
      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle(visibleStyle, styler);
    });


  });

  describe('with fxHide features', () => {

    it('should support hide and show', () => {
      createTestComponent(`
        <div fxHide fxShow.gt-md>
          This content to be shown ONLY when gt-sm
        </div>
      `);

      matchMedia.useOverlaps = true;
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      matchMedia.activate('lg');
      expectNativeEl(fixture).toHaveStyle({'display': 'block'}, styler);

      matchMedia.activate('sm');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });
  });

});


// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-show-api',
  template: `<span>PlaceHolder Template HTML</span>`
})
class TestShowComponent implements OnInit {
  isVisible = 0;
  isHidden = false;
  menuOpen = true;

  constructor(public media: ObservableMedia) {
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {
  }
}



