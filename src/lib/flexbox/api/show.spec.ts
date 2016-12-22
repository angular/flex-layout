import {Component, OnInit, DebugElement} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, async } from '@angular/core/testing';

import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {BreakPointsProvider} from '../../media-query/providers/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {FlexLayoutModule} from '../_module';

import {customMatchers, expect} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, makeExpectDOMFrom, expectNativeEl} from '../../utils/testing/helpers';

describe('show directive', () => {
  let fixture: ComponentFixture<any>;
  let createTestComponent = makeCreateTestComponent(()=> TestShowComponent);
  let expectDOMFrom = makeExpectDOMFrom(()=> TestShowComponent);

  beforeEach(async(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule.forRoot()],
      declarations: [TestShowComponent],
      providers: [
        BreakPointRegistry, BreakPointsProvider,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    })
  }));
  afterEach(() => {
    fixture = null;
  });

  describe('without `responsive` features', () => {

    it('should initial with component visible as default', () => {
      fixture = createTestComponent(`
        <div fxShow >
          ...content
        </div>  
      `);
      expectNativeEl(fixture).toHaveCssStyle({ 'display': 'flex' });
    });

    it('should initial with component not visible when set to `false`', () => {
      fixture = createTestComponent(`
        <div fxShow="false" >
          ...content
        </div>  
      `);
      expectNativeEl(fixture).toHaveCssStyle({ 'display': 'none' });
    });

    it('should initial with component not visible when set to `0`', () => {
      fixture = createTestComponent(`
        <div [fxShow]="isVisible" >
          ...content
        </div>  
      `);
      expectNativeEl(fixture).toHaveCssStyle({ 'display': 'none' });
    });

    it('should update styles with binding changes', () => {
      fixture = createTestComponent(`
        <div [fxShow]="menuOpen"
             fxShow.xs="true" >
          ...content
        </div>  
      `);
      expectNativeEl(fixture).toHaveCssStyle({ 'display': 'flex' });
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveCssStyle({ 'display': 'none' });
      fixture.componentInstance.toggleMenu();
      expectNativeEl(fixture).toHaveCssStyle({ 'display': 'flex' });
    });

  });

  describe('with responsive features', () => {

      it('should hide on `xs` viewports only', () => {
        let fixture = createTestComponent(`
                        <div fxShow fxShow.xs="false" >
                          ...content
                        </div>  
                      `);
        let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);

        expectNativeEl(fixture).toHaveCssStyle({ 'display': 'flex' });
        matchMedia.activate('xs');
        expectNativeEl(fixture).toHaveCssStyle({ 'display': 'none' });
        matchMedia.activate('md');
        expectNativeEl(fixture).toHaveCssStyle({ 'display': 'flex' });
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
  menuOpen: boolean = true;
  toggleMenu() {
      this.menuOpen = !this.menuOpen;
  }
  constructor() {  }
  ngOnInit() { }
}



