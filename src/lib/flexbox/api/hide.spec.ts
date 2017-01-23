/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Component, OnInit, Inject
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia, MatchMediaObservable} from '../../media-query/match-media';
import {BreakPointsProvider} from '../../media-query/providers/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';

import {customMatchers, expect} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent, expectNativeEl, queryFor
} from '../../utils/testing/helpers';
import {HideDirective} from './hide';
import {MediaQueriesModule} from '../../media-query/_module';

describe('hide directive', () => {
  let fixture: ComponentFixture<any>;
  let createTestComponent = makeCreateTestComponent(() => TestHideComponent);
  let activateMediaQuery = (alias) => {
    let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);
    matchMedia.activate(alias);
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);


    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, MediaQueriesModule.forRoot()],
      declarations: [TestHideComponent, HideDirective],
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

    it('should initial with component not visible as default', () => {
      fixture = createTestComponent(`
        <div fxHide>
          ...content
        </div>
      `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

    it('should initial with component visible when set to `false`', () => {
      fixture = createTestComponent(`
        <div fxHide="false" >
          ...content
        </div>
      `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'flex'});
    });

    it('should initial with component visible when set to `0`', () => {
      fixture = createTestComponent(`
        <div [fxHide]="isVisible" >
          ...content
        </div>
      `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'flex'});
    });

    it('should update styles with binding changes', () => {
      fixture = createTestComponent(`
        <div [fxHide]="menuHidden">
          ...content
        </div>
      `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveCssStyle({'display': 'flex'});
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

  });

  describe('with responsive features', () => {

    it('should show on `xs` viewports only when the default is included', () => {
      fixture = createTestComponent(`
            <div fxHide="" fxHide.xs="false" >
              ...content
            </div>
          `);

      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
      activateMediaQuery('xs');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'flex'});
      activateMediaQuery('md');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});
    });

    it('should preserve display and update only on activated mediaQuery', () => {
      fixture = createTestComponent(`
        <div [fxHide.xs]="isHidden" style="display:inline-block"></div>
      `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'inline-block'});

      // should hide with this activation
      activateMediaQuery('xs');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      // should reset to original display style
      activateMediaQuery('md');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'inline-block'});
    });

    it('should restore original display when disabled', () => {
      fixture = createTestComponent(`
        <div [fxHide.xs]="isHidden" style="display:inline-block"></div>
      `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'inline-block'});

      // should hide with this activation
      activateMediaQuery('xs');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      // should reset to original display style
      fixture.componentInstance.isHidden = false;
      expectNativeEl(fixture).toHaveCssStyle({'display': 'inline-block'});
    });

    it('should restore original display when the mediaQuery deactivates', () => {
        let originalDisplay = {'display': 'table'};
        fixture = createTestComponent(`
          <div [fxHide.xs]="isHidden" style="display:table"></div>
        `);
        expectNativeEl(fixture).toHaveCssStyle(originalDisplay);

        // should hide with this activation
        activateMediaQuery('xs');
        expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

        // should reset to original display style
        activateMediaQuery('md');
        expectNativeEl(fixture).toHaveCssStyle(originalDisplay);
      });

    it('should support use of the `media` observable in templates ', () => {
      fixture = createTestComponent(`
              <div [fxHide]="media.isActive('xs')" >
                ...content
              </div>
          `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'flex'});

      activateMediaQuery('xs');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'none'});

      activateMediaQuery('lg');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'flex'});
    });

    it('should support use of the `media` observable in adaptive templates ', () => {
      fixture = createTestComponent(`
              <div fxHide="false" [fxHide.md]="media.isActive('xs')" >
                ...content
              </div>
          `);
      expectNativeEl(fixture).toHaveCssStyle({'display': 'flex'});

      activateMediaQuery('xs');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'flex'});

      activateMediaQuery('md');
      expectNativeEl(fixture).toHaveCssStyle({'display': 'flex'});
    });

    fit('should hide when used with fxLayout and the ".md" breakpoint activates', () => {
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

        fixture = createTestComponent(template);
        fixture.detectChanges();

        let nodes = queryFor(fixture, ".hideOnMd");
        expect(nodes.length).toEqual(1);
        expect(nodes[0].nativeElement).toHaveCssStyle({'display':'flex'});

        activateMediaQuery('md');
        fixture.detectChanges();

        nodes = queryFor(fixture, ".hideOnMd");
        expect(nodes.length).toEqual(1);
        expect(nodes[0].nativeElement).toHaveCssStyle({'display':'none'});
      })
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

  constructor(@Inject(MatchMediaObservable) private media) {
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  ngOnInit() {
  }
}



