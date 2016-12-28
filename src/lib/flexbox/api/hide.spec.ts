import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed } from '@angular/core/testing';

import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {BreakPointsProvider} from '../../media-query/providers/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {FlexLayoutModule} from '../_module';

import {customMatchers} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, expectNativeEl} from '../../utils/testing/helpers';

describe('show directive', () => {
  let fixture: ComponentFixture<any>;
  let createTestComponent = makeCreateTestComponent(()=> TestHideComponent);
  let activateMediaQuery = (alias) => {
        let matchMedia : MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);
        matchMedia.activate(alias);
      };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule.forRoot()],
      declarations: [TestHideComponent],
      providers: [
        BreakPointRegistry, BreakPointsProvider,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    })
  });
  afterEach(() => {
    if ( fixture ) {
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
      expectNativeEl(fixture).toHaveCssStyle({ 'display': 'none' });
    });

    it('should initial with component visible when set to `false`', () => {
      fixture = createTestComponent(`
        <div fxHide="false" >
          ...content
        </div>  
      `);
      expectNativeEl(fixture).toHaveCssStyle({ 'display': 'flex' });
    });

    it('should initial with component visible when set to `0`', () => {
      fixture = createTestComponent(`
        <div [fxHide]="isVisible" >
          ...content
        </div>  
      `);
      expectNativeEl(fixture).toHaveCssStyle({ 'display': 'flex' });
    });

    it('should update styles with binding changes', () => {
      fixture = createTestComponent(`
        <div [fxHide]="menuHidden"  >
          ...content
        </div>  
      `);
      expectNativeEl(fixture).toHaveCssStyle({ 'display': 'none' });
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveCssStyle({ 'display': 'flex' });
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveCssStyle({ 'display': 'none' });
    });

  });

  describe('with responsive features', () => {

        it('should show on `xs` viewports only', () => {
          fixture = createTestComponent(`
            <div fxHide="" fxHide.xs="false" >
              ...content
            </div>  
          `);

          expectNativeEl(fixture).toHaveCssStyle({ 'display': 'none' });
          activateMediaQuery('xs');
          expectNativeEl(fixture).toHaveCssStyle({ 'display': 'flex' });
          activateMediaQuery('md');
          expectNativeEl(fixture).toHaveCssStyle({ 'display': 'none' });
        });

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
  menuHidden: boolean = true;
  toggleMenu() {
      this.menuHidden = !this.menuHidden;
  }
  constructor() {  }
  ngOnInit() { }
}



