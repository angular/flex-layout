/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, inject} from '@angular/core/testing';

import {DEFAULT_BREAKPOINTS_PROVIDER} from '../../media-query/breakpoints/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {MatchMedia} from '../../media-query/match-media';
import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {ObservableMedia} from '../../media-query/observable-media';
import {FlexLayoutModule} from '../_module';

import {customMatchers} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, expectNativeEl} from '../../utils/testing/helpers';

describe('show directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let createTestComponent = (template) => {
    fixture = makeCreateTestComponent(() => TestShowComponent)(template);

    inject([MatchMedia], (_matchMedia: MockMatchMedia) => {
      matchMedia = _matchMedia;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule],
      declarations: [TestShowComponent],
      providers: [
        BreakPointRegistry, DEFAULT_BREAKPOINTS_PROVIDER,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });

  describe('without `responsive` features', () => {

    it('should initial with component visible as default', () => {
      createTestComponent(`<div fxShow></div>`);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});
    });

    it('should initial with component not visible when set to `false`', () => {
      createTestComponent(`<div fxShow="false"></div>`);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

    it('should initial with component not visible when set to `0`', () => {
      createTestComponent(`<div [fxShow]="isVisible"></div>`);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      fixture.componentInstance.isVisible = true;
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});
    });

    it('should update styles with binding changes', () => {
      createTestComponent(`<div [fxShow]="menuOpen" fxShow.xs="true"></div>`);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});
    });

    it('should use "block" display style when not explicitly defined', () => {
      createTestComponent(`<button fxShow></button>`);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'inline-block'});
    });

    it('should use "flex" display style when the element also has an fxLayout', () => {
      createTestComponent(`<div fxLayout fxShow></div>`);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'flex'});
    });

  });

  describe('with responsive features', () => {

    it('should hide on `xs` viewports only', () => {
      createTestComponent(`<div fxShow fxShow.xs="false"></div>`);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});

      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});
    });

    it('should hide when fallbacks are configured to hide on `gt-xs` viewports', () => {
      createTestComponent(`<div fxShow fxShow.gt-xs="false"></div>`);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});

      matchMedia.activate('md', true);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

    it('should support use of the `media` observable in templates ', () => {
      createTestComponent(`<div [fxShow]="media.isActive('xs')"></div>`);

      matchMedia.useOverlaps = true;
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});

      matchMedia.activate('gt-md');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

    it('should preserve display and update only on activated mediaQuery', () => {
      createTestComponent(`<div [fxShow.xs]="!isHidden" style="display:inline-block"></div>`);
      fixture.componentInstance.isHidden = false;

      expectNativeEl(fixture).toHaveCssStyle({'display': 'inline-block'});

      // should hide with this activation and setting
      matchMedia.activate('xs');
      fixture.componentInstance.isHidden = true;
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

    it('should restore display when not enabled', () => {
      let visibleStyle = {'display': 'inline-block'};
      createTestComponent(`<div [fxShow.xs]="!isHidden" style="display:inline-block"></div>`);
      fixture.componentInstance.isHidden = false;
      expectNativeEl(fixture).toHaveCssStyle(visibleStyle);

      // mqActivation but the isHidden == false, so show it
      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveCssStyle(visibleStyle);

      // should hide with this activation
      fixture.componentInstance.isHidden = true;
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

    it('should restore display when the mediaQuery deactivates', () => {
      let visibleStyle = {'display': 'inline-block'};
      createTestComponent(`<div [fxShow.xs]="!isHidden" style="display:inline-block"></div>`);
      fixture.componentInstance.isHidden = true;
      expectNativeEl(fixture).toHaveCssStyle(visibleStyle);

      // should hide with this activation
      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      // should reset to original display style
      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveCssStyle(visibleStyle);
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
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      matchMedia.activate('lg');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});

      matchMedia.activate('sm');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
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
export class TestShowComponent implements OnInit {
  isVisible = 0;
  isHidden = false;
  menuOpen = true;

  constructor(private media: ObservableMedia) {
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {
  }
}



