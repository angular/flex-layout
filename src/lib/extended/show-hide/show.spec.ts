/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Component,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Optional,
  PLATFORM_ID,
  Self,
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {ComponentFixture, TestBed, inject, async} from '@angular/core/testing';
import {
  LAYOUT_CONFIG,
  LayoutConfigOptions,
  MatchMedia,
  MediaMonitor,
  MockMatchMedia,
  MockMatchMediaProvider,
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
import {negativeOf, ShowHideDirective} from './show-hide';
import {LayoutDirective} from '@angular/flex-layout/flex';

describe('show directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let styler: StyleUtils;
  let platformId: Object;
  let createTestComponent = (template: string) => {
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
      imports: [
        CommonModule,
        FlexLayoutModule,
        MatFormFieldModule,
        FormsModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
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

      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      matchMedia.activate('md');
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);
    });

    it('should hide when fallbacks are configured to hide on `gt-xs` viewports', () => {
      createTestComponent(`<div fxShow fxShow.gt-xs="false"></div>`);
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);

      matchMedia.activate('md', true);
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

    it('should support use of the `media` observable in templates ', () => {
      createTestComponent(`<div [fxShow]="media.isActive('xs')"></div>`);

      matchMedia.useOverlaps = true;
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      matchMedia.activate('xs');
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);

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

    it('should work oninit with responsive', () => {
      createTestComponent(`
        <div fxFlex fxShow="false" fxShow.gt-lg>
          Shown on devices larger than 1200px wide only.
        </div>`);

      matchMedia.activate('gt-lg');
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);

      matchMedia.activate('lg');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      matchMedia.activate('gt-lg');
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);
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
      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);

      matchMedia.activate('sm');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    });

    it('should work with responsive and adding flex to parent', () => {
      createTestComponent(`
        <div fxHide fxShow.gt-sm>
          <div fxLayout="row" fxLayoutAlign="start center" fxFlex="0 1 auto">
            This content doesn't get hidden on small screen size!
          </div>
        </div>
      `);

      matchMedia.useOverlaps = true;
      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      matchMedia.activate('gt-sm');
      expectNativeEl(fixture).toHaveStyle({'display': 'flex'}, styler);

      matchMedia.activate('sm');
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

      let selector = '[el]';

      matchMedia.useOverlaps = true;
      fixture.detectChanges();

      // NOTE: platform-server can't compute display for unknown elements
      if (isPlatformBrowser(platformId)) {
        expectEl(queryFor(fixture, selector)[0]).toHaveStyle({
          'display': 'inline'
        }, styler);
      } else {
        expectEl(queryFor(fixture, selector)[0]).not.toHaveStyle({
          'display': '*'
        }, styler);
      }

      matchMedia.activate('xs');
      fixture.detectChanges();
      expectEl(queryFor(fixture, selector)[0]).toHaveStyle({
        'display': 'none'
      }, styler);

      matchMedia.activate('lg');
      fixture.detectChanges();
      // NOTE: platform-server can't compute display for unknown elements
      if (isPlatformBrowser(platformId)) {
        expectEl(queryFor(fixture, selector)[0]).toHaveStyle({
          'display': 'inline'
        }, styler);
      } else {
        expectEl(queryFor(fixture, selector)[0]).not.toHaveStyle({
          'display': '*'
        }, styler);
      }
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
          }, {
            alias: 'sm-md',
            suffix: 'SmMd',
            mediaQuery: 'screen and (min-width: 720px) and (max-width: 839px)',
            overlapping: false
          }),
        ],
        declarations: [FxShowHideDirective],
        providers: [
          MockMatchMediaProvider,
        ]
      });
    });

    it('should respond to custom breakpoint', async(() => {
      createTestComponent(`
        <p fxFlex="100%" fxHide="true" fxShow.sm-md="true"></p>
      `);

      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);

      matchMedia.activate('sm-md');

      expectNativeEl(fixture).not.toHaveStyle({'display': 'none'}, styler);

      matchMedia.activate('sm');

      expectNativeEl(fixture).toHaveStyle({'display': 'none'}, styler);
    }));
  });

});

@Directive({
  selector: `[fxShow.sm-md], [fxHide.sm-md]`
})
class FxShowHideDirective extends ShowHideDirective {
  constructor(monitor: MediaMonitor,
              @Optional() @Self() protected layout: LayoutDirective,
              protected elRef: ElementRef,
              protected styleUtils: StyleUtils,
              @Inject(PLATFORM_ID) protected platformId: Object,
              @Optional() @Inject(SERVER_TOKEN) protected serverModuleLoaded: boolean,
              @Inject(LAYOUT_CONFIG) protected layoutConfig: LayoutConfigOptions) {
    super(monitor, layout, elRef, styleUtils, platformId, serverModuleLoaded, layoutConfig);
  }

  @Input('fxShow.sm-md') set showSmMd(val: string) {
    this._cacheInput('showSmMd', val);
  }
  @Input('fxHide.sm-md') set hideSmMd(val: string) {
    this._cacheInput('showSmMd', negativeOf(val));
  }
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



