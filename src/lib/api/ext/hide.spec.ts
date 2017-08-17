/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Component, OnInit
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, inject} from '@angular/core/testing';

import {DEFAULT_BREAKPOINTS_PROVIDER} from '../../media-query/breakpoints/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {ObservableMedia} from '../../media-query/observable-media';

import {customMatchers, expect, NgMatchers} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent, expectNativeEl, queryFor
} from '../../utils/testing/helpers';
import {ShowHideDirective} from './show-hide';
import {MediaQueriesModule} from '../../media-query/_module';

describe('hide directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let createTestComponent = (template: string) => {
    fixture = makeCreateTestComponent(() => TestHideComponent)(template);

    inject([MatchMedia], (_matchMedia: MockMatchMedia) => {
      matchMedia = _matchMedia;
    })();

    return fixture;
  };
  let makeExpectWithActivation = (_fixture: ComponentFixture<any>, selector: string) => {
    fixture = _fixture;
    return (alias?: string): NgMatchers => {
      if (alias) {
        matchMedia.activate(alias);
      }
      fixture.detectChanges();

      let nodes = queryFor(fixture, selector);
      expect(nodes.length).toEqual(1);
      return expect(nodes[0].nativeElement);
    };
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);


    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, MediaQueriesModule],
      declarations: [TestHideComponent, ShowHideDirective],
      providers: [
        BreakPointRegistry, DEFAULT_BREAKPOINTS_PROVIDER,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });

  describe('without `responsive` features', () => {

    it('should initial with component not visible as default', () => {
      createTestComponent(`<div fxHide></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'none'});
    });

    it('should initial with component visible when set to `false`', () => {
      createTestComponent(`<div fxHide="false"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'block'});
    });

    it('should initial with component visible when set to `0`', () => {
      createTestComponent(`<div [fxHide]="isVisible"></div>`);
      expectNativeEl(fixture, {isVisible: 0}).toHaveStyle({'display': 'block'});
    });

    it('should update styles with binding changes', () => {
      createTestComponent(`<div [fxHide]="menuHidden"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'none'});
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveStyle({'display': 'block'});
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveStyle({'display': 'none'});
    });

    it('should use "block" display style when not explicitly defined', () => {
      createTestComponent(`<button [fxHide]="isHidden"></button>`);
      expectNativeEl(fixture, {isHidden: true}).toHaveStyle({'display': 'none'});
      expectNativeEl(fixture, {isHidden: false}).toHaveStyle({'display': 'inline-block'});
    });

    it('should use "flex" display style when the element also has an fxLayout', () => {
      createTestComponent(`<div fxLayout [fxHide]="isHidden"></div>`);
      expectNativeEl(fixture, {isHidden: true}).toHaveStyle({'display': 'none'});
      expectNativeEl(fixture, {isHidden: false}).toHaveStyle({'display': 'block'});
    });


  });

  describe('with responsive features', () => {

    it('should show on `xs` viewports only when the default is included', () => {
      createTestComponent(`<div fxHide="" fxHide.xs="false"></div>`);

      expectNativeEl(fixture).toHaveStyle({'display': 'none'});
      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({'display': 'block'});
      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'});
    });

    it('should preserve display and update only on activated mediaQuery', () => {
      createTestComponent(`<div [fxHide.xs]="isHidden" style="display:inline-block"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'inline-block'});

      // should hide with this activation
      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'});

      // should reset to original display style
      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({'display': 'inline-block'});
    });

    it('should restore original display when disabled', () => {
      createTestComponent(`<div [fxHide.xs]="isHidden" style="display:inline-block"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'inline-block'});

      // should hide with this activation
      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'});

      // should reset to original display style
      fixture.componentInstance.isHidden = false;
      expectNativeEl(fixture).toHaveStyle({'display': 'inline-block'});
    });

    it('should restore original display when the mediaQuery deactivates', () => {
      let originalDisplay = {'display': 'table'};
      createTestComponent(`<div [fxHide.xs]="isHidden" style="display:table"></div>`);
      expectNativeEl(fixture).toHaveStyle(originalDisplay);

      // should hide with this activation
      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'});

      // should reset to original display style
      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle(originalDisplay);
    });

    it('should support use of the `media` observable in templates ', () => {
      createTestComponent(`<div [fxHide]="media.isActive('xs')"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'block'});

      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({'display': 'none'});

      matchMedia.activate('lg');
      expectNativeEl(fixture).toHaveStyle({'display': 'block'});
    });

    it('should support use of the `media` observable in adaptive templates ', () => {
      createTestComponent(`<div fxHide="false" [fxHide.md]="media.isActive('xs')"></div>`);
      expectNativeEl(fixture).toHaveStyle({'display': 'block'});

      matchMedia.activate('xs');
      expectNativeEl(fixture).toHaveStyle({'display': 'block'});

      matchMedia.activate('md');
      expectNativeEl(fixture).toHaveStyle({'display': 'block'});
    });

    it('should hide when used with fxLayout and the ".md" breakpoint activates', () => {
      let template = `
          <div fxLayout="row" >
            <div  fxLayout="row"
                  fxLayout.md="column"
                  fxHide.md
                  class="hideOnMd">
              <div fxFlex>Col #1: First item in row</div>
              <div fxFlex>Col #1: Second item in row</div>
            </div>
            <div fxLayout="column" fxFlex>
              <div fxFlex>Col #2: First item in column</div>
              <div fxFlex>Col #2: Second item in column</div>
            </div>
          </div>
        `;
      let expectActivation = makeExpectWithActivation(createTestComponent(template), '.hideOnMd');

      expectActivation().toHaveStyle({'display': 'block'});
      expectActivation('md').toHaveStyle({'display': 'none'});
    });

    it('should restore proper display mode when not hiding', () => {
      let template = `
              <div>
                <span fxHide.xs class="hideOnXs">Label</span>
              </div>
           `;
      let expectActivation = makeExpectWithActivation(createTestComponent(template), '.hideOnXs');

      expectActivation().toHaveStyle({'display': 'inline'});
      expectActivation('xs').toHaveStyle({'display': 'none'});
      expectActivation('md').toHaveStyle({'display': 'inline'});
    });
  });

  it('should support hide and show', () => {
    createTestComponent(`
      <div fxShow fxHide.gt-sm style="display:inline-block;">
        This content to be shown ONLY when gt-sm
      </div>
    `);
    expectNativeEl(fixture).toHaveStyle({'display': 'inline-block'});

    matchMedia.activate('md', true);
    expectNativeEl(fixture).toHaveStyle({'display': 'none'});

    matchMedia.activate('xs', true);
    expectNativeEl(fixture).toHaveStyle({'display': 'inline-block'});
  });

});


// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-hide-api',
  template: `<span>PlaceHolder Template HTML</span>`
})
export class TestHideComponent implements OnInit {
  isVisible = 0;
  isHidden = true;
  menuHidden = true;

  constructor(public media: ObservableMedia) {
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  ngOnInit() {
  }
}



