/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, Directive, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {
  ɵMatchMedia as MatchMedia,
  ɵMockMatchMedia as MockMatchMedia,
  ɵMockMatchMediaProvider as MockMatchMediaProvider,
  MediaObserver,
  SERVER_TOKEN,
  StyleUtils,
} from '@angular/flex-layout/core';
import {FlexLayoutModule} from '../../module';

import {customMatchers} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent,
  expectNativeEl,
  expectEl,
  queryFor,
} from '../../utils/testing/helpers';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ShowHideDirective} from './show-hide';

describe('show directive', () => {
  let fixture: ComponentFixture<any>;
  let mediaController: MockMatchMedia;
  let styler: StyleUtils;
  let createTestComponent = (template: string) => {
    fixture = makeCreateTestComponent(() => TestShowComponent)(template);

    // Can only Inject() AFTER TestBed.override(...)
    inject(
        [MatchMedia, StyleUtils],
        (_matchMedia: MockMatchMedia, _styler: StyleUtils) => {
       mediaController = _matchMedia;
       styler = _styler;
    })();

    return fixture;
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatFormFieldModule,
        FlexLayoutModule,
        FormsModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      declarations: [
        TestShowComponent,
      ],
      providers: [
        MockMatchMediaProvider,
        {provide: SERVER_TOKEN, useValue: true}
      ]
    });
  });

  afterEach(() => {
    mediaController.clearAll();
  });

  describe('without `responsive` features', () => {

    it('should initial with component visible as default', () => {
      createTestComponent(`<div fxShow></div>`);
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);
    });

    it('should initial with component not visible when set to `false`', () => {
      createTestComponent(`<div fxShow="false"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

    it('should initial with component not visible when set to `0`', () => {
      createTestComponent(`<div [fxShow]="isVisible"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      fixture.componentInstance.isVisible = true;
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);
    });

    it('should update styles with binding changes', () => {
      createTestComponent(`<div [fxShow]="menuOpen" fxShow.xs="true"></div>`);
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);
    });

    it('should use "block" display style when not explicitly defined', () => {
      createTestComponent(`<button fxShow></button>`);
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);
    });

    it('should use "flex" display style when the element also has an fxLayout', () => {
      createTestComponent(`<div fxLayout fxShow></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'flex'}, styler);
    });

  });

  describe('with responsive features', () => {

    it('should hide on `xs` viewports only', () => {
      createTestComponent(`<div fxShow fxShow.xs="false"></div>`);
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('xs');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('md');
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);
    });

    it('should hide when fallbacks are configured to hide on `gt-xs` viewports', () => {
      createTestComponent(`<div fxShow fxShow.gt-xs="false"></div>`);
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('md', true);
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

    it('should support use of the `media` observable in templates ', () => {
      createTestComponent(`<div [fxShow]="media.isActive('xs')"></div>`);

      mediaController.useOverlaps = true;
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('xs');
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('gt-md');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

    it('should preserve display and update only on activated mediaQuery', () => {
      createTestComponent(`<div [fxShow.xs]="!isHidden" style="display:inline-block"></div>`);
      fixture.componentInstance.isHidden = false;

      expectNativeEl(fixture).toHaveStyle({'display': 'inline-block'}, styler);

      // should hide with this activation and setting
      mediaController.activate('xs');
      fixture.componentInstance.isHidden = true;
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

    it('should restore display when not enabled', () => {
      let visibleStyle = {'display': 'inline-block'};
      createTestComponent(`<div [fxShow.xs]="!isHidden" style="display:inline-block"></div>`);
      fixture.componentInstance.isHidden = false;
      expectNativeEl(fixture).toHaveStyle(visibleStyle, styler);

      // mqActivation but the isHidden == false, so show it
      mediaController.activate('xs');
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
      mediaController.activate('xs');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      // should reset to original display style
      mediaController.activate('md');
      expectNativeEl(fixture).toHaveStyle(visibleStyle, styler);
    });

    it('should work oninit with responsive', () => {
      createTestComponent(`
        <div fxFlex fxShow="false" fxShow.gt-lg>
          Shown on devices larger than 1200px wide only.
        </div>`);

      mediaController.activate('gt-lg');
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('lg');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('gt-lg');
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);
    });

  });

  describe('with fxShow.print features', () => {

    it('should support print', () => {
      createTestComponent(`
          <div [fxShow]="false" fxShow.print style="display: block;">
            This content to be shown ONLY when printing
          </div>
        `);

      mediaController.useOverlaps = true;
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('print');
      expectNativeEl(fixture).toHaveStyle({'display': 'block'}, styler);

      mediaController.activate('sm');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

  });

  describe('with fxHide features', () => {

    it('should support hide and show', () => {
      createTestComponent(`
        <div fxHide fxShow.gt-md fxShow.print style="display: block;">
          This content to be shown ONLY when gt-sm
        </div>
      `);

      mediaController.useOverlaps = true;
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('lg');
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('sm');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('print');
      expectNativeEl(fixture).toHaveStyle({'display': 'block'}, styler);
    });

    it('should work with responsive and adding flex to parent', () => {
      createTestComponent(`
        <div fxHide fxShow.gt-sm>
          <div fxLayout="row" fxLayoutAlign="start center" fxFlex="0 1 auto">
            This content doesn't get hidden on small screen size!
          </div>
        </div>
      `);

      mediaController.useOverlaps = true;
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('gt-sm');
      expectNativeEl(fixture).toHaveStyle({'display': 'flex'}, styler);

      mediaController.activate('sm');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

    it('should work with unknown elements', () => {
      createTestComponent(`
        <mat-form-field>
          <mat-placeholder>foo</mat-placeholder>
          <mat-placeholder fxHide.xs el>bar</mat-placeholder>
          <mat-select>
            <mat-option *ngFor="let option of [1,2,3]" [value]=option>
              option {{option}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      `);

      const elSelector = '[el]';

      mediaController.useOverlaps = true;
      fixture.detectChanges();

      // NOTE: platform-server can't compute display for unknown elements
      expectEl(queryFor(fixture, elSelector)[0]).toHaveCSS({
        'display': 'initial'
      }, styler);

      mediaController.activate('xs');
      fixture.detectChanges();
      expectEl(queryFor(fixture, elSelector)[0]).toHaveStyle({
        'display': 'none'
      }, styler);

      mediaController.activate('lg');
      fixture.detectChanges();
      // NOTE: platform-server can't compute display for unknown elements
      expectEl(queryFor(fixture, elSelector)[0]).toHaveCSS({
        'display': 'initial'
      }, styler);
    });
  });

  describe('with custom breakpoints', () => {
    beforeEach(() => {
      jasmine.addMatchers(customMatchers);

      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FlexLayoutModule.withConfig({
            serverLoaded: true,
          }, [
            {
              alias: 'sm-md',
              suffix: 'SmMd',
              mediaQuery: 'screen and (min-width: 720px) and (max-width: 839px)',
              overlapping: false
            },
            {
              alias: 'sm.lg',
              suffix: 'SmLg',
              mediaQuery: 'screen and (min-width: 840px) and (max-width: 1000px)',
              overlapping: false
            }
          ]),
        ],
        declarations: [FxShowHideDirective],
        providers: [
          MockMatchMediaProvider,
        ]
      });
    });
    afterEach(() => {
       mediaController.clearAll();
    });

    it('should respond to custom breakpoint', () => {
      createTestComponent(`
        <p fxFlex="100%" fxHide="true" fxShow.sm-md="true" fxShow.sm.lg="true"></p>
      `);

      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('sm-md');
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('sm');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      mediaController.activate('sm.lg');
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);
    });
  });

});

const inputs = ['fxShow.sm-md', 'fxHide.sm-md', 'fxShow.sm.lg', 'fxHide.sm.lg'];
const selector = `[fxShow.sm-md], [fxHide.sm-md], [fxShow.sm.lg], [fxHide.sm.lg]`;

// Used to test custom breakpoint functionality
@Directive({inputs, selector})
class FxShowHideDirective extends ShowHideDirective {
  protected inputs = inputs;
}


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

  constructor(public media: MediaObserver) {
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {
  }
}



