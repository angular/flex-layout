/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, OnInit, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MatchMedia} from '../../media-query/match-media';
import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {ObservableMediaService} from '../../media-query/observable-media-service';
import {BreakPointsProvider} from '../../media-query/providers/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {FlexLayoutModule} from '../_module';

import {customMatchers} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, expectNativeEl} from '../../utils/testing/helpers';

describe('show directive', () => {
  let fixture: ComponentFixture<any>;
  let createTestComponent = makeCreateTestComponent(() => TestShowComponent);
  let activateMediaQuery = (alias, enableOverlaps = false) => {
    let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);
    matchMedia.activate(alias, enableOverlaps);
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule.forRoot()],
      declarations: [TestShowComponent],
      providers: [
        BreakPointRegistry, BreakPointsProvider,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });
  afterEach(() => {
    if (fixture) {
      fixture.debugElement.injector.get(MatchMedia).clearAll();
      fixture = null;
    }
  });

  describe('without `responsive` features', () => {

    it('should initial with component visible as default', () => {
      fixture = createTestComponent(`
        <div fxShow >
          ...content
        </div>
      `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});
    });

    it('should initial with component not visible when set to `false`', () => {
      fixture = createTestComponent(`
        <div fxShow="false" >
          ...content
        </div>
      `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

    it('should initial with component not visible when set to `0`', () => {
      fixture = createTestComponent(`
        <div [fxShow]="isVisible" >
          ...content
        </div>
      `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      fixture.componentInstance.isVisible = true;
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});
    });

    it('should update styles with binding changes', () => {
      fixture = createTestComponent(`
        <div [fxShow]="menuOpen"
             fxShow.xs="true" >
          ...content
        </div>
      `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});
    });

    it('should use "block" display style when not explicitly defined', () => {
      fixture = createTestComponent(`
        <button fxShow >
          ...content
        </button>
      `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});
    });

    it('should use "flex" display style when the element also has an fxLayout', () => {
      fixture = createTestComponent(`
        <div fxLayout fxShow >
          ...content
        </div>
      `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'flex'});
    });

  });

  describe('with responsive features', () => {

    it('should hide on `xs` viewports only', () => {
      fixture = createTestComponent(`<div fxShow fxShow.xs="false" >...content</div>`);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});

      activateMediaQuery('xs');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      activateMediaQuery('md');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});
    });

    it('should hide when fallbacks are configured to hide on `gt-xs` viewports', () => {
      fixture = createTestComponent(`<div fxShow fxShow.gt-xs="false" >...content</div>`);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});

      activateMediaQuery('md', true);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

    it('should support use of the `media` observable in templates ', () => {
      fixture = createTestComponent(`
            <div [fxShow]="media.isActive('xs')" >
              ...content
            </div>
        `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      activateMediaQuery('xs', true);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});

      activateMediaQuery('gt-md', true);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

    it('should preserve display and update only on activated mediaQuery', () => {
      let visibleStyle = {'display': 'inline-block'};
      fixture = createTestComponent(`
        <div [fxShow.xs]="!isHidden" style="display:inline-block"></div>
      `);
      fixture.componentInstance.isHidden = false;
      expectNativeEl(fixture).toHaveCssStyle(visibleStyle);

      // should hide with this activation and setting
      activateMediaQuery('xs');
      fixture.componentInstance.isHidden = true;
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

    it('should restore display when not enabled', () => {
      let visibleStyle = {'display': 'inline-block'};
      fixture = createTestComponent(`
        <div [fxShow.xs]="!isHidden" style="display:inline-block"></div>
      `);
      fixture.componentInstance.isHidden = false;
      expectNativeEl(fixture).toHaveCssStyle(visibleStyle);

      // mqActivation but the isHidden == false, so show it
      activateMediaQuery('xs');
      expectNativeEl(fixture).toHaveCssStyle(visibleStyle);

      // should hide with this activation
      fixture.componentInstance.isHidden = true;
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

    it('should restore display when the mediaQuery deactivates', () => {
      let visibleStyle = {'display': 'inline-block'};
      fixture = createTestComponent(`
        <div [fxShow.xs]="!isHidden" style="display:inline-block"></div>
      `);
      fixture.componentInstance.isHidden = true;
      expectNativeEl(fixture).toHaveCssStyle(visibleStyle);

      // should hide with this activation
      activateMediaQuery('xs');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      // should reset to original display style
      activateMediaQuery('md');
      expectNativeEl(fixture).toHaveCssStyle(visibleStyle);
    });


  });

  describe('with fxHide features', () => {

    it('should support hide and show', () => {
      fixture = createTestComponent(`
          <div fxHide fxShow.gt-sm>
            This content to be shown ONLY when gt-sm
          </div>
       `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      activateMediaQuery('md', true);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'block'});

      activateMediaQuery('xs', true);
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

  constructor(@Inject(ObservableMediaService) private media) {
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {
  }
}



