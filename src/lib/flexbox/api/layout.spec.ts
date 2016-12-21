import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, async } from '@angular/core/testing';

import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {BreakPointsProvider} from '../../media-query/providers/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {FlexLayoutModule} from '../_module';

import {customMatchers} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, makeExpectDOMFrom, expectNativeEl} from '../../utils/testing/helpers';

describe('layout directive', () => {
  let fixture: ComponentFixture<any>;
  let createTestComponent = makeCreateTestComponent(()=> TestLayoutComponent);
  let expectDOMFrom = makeExpectDOMFrom(()=> TestLayoutComponent);

  beforeEach(async(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule.forRoot()],
      declarations: [TestLayoutComponent],
      providers: [
        BreakPointRegistry, BreakPointsProvider,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    })
  }));
  afterEach(() => {
    fixture = null;
  });

  describe('with static features', () => {

    it('should add correct styles for default `fxLayout` usage', () => {
      expectDOMFrom(`<div fxLayout></div>`).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      });
    });
    it('should add correct styles for `fxLayout="row"` usage', () => {
      expectDOMFrom(`
        <div fxLayout="row"></div>
      `).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      });
    });
    it('should add correct styles for `fxLayout="column"` usage', () => {
      expectDOMFrom(`<div fxLayout="column"></div>`).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      });
    });
    it('should add correct styles for binding `[fxLayout]="direction"` usage', () => {
      expectDOMFrom(`<div [fxLayout]="direction"></div>`).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      });
    });
    it('should use default flex-direction for invalid value `fxLayout="invalid"` usage', () => {
      expectDOMFrom(`<div fxLayout="invalid"></div>`).toHaveCssStyle({
        'flex-direction': 'row'
      });
    });
    it('should use default flex-direction for invalid binding value `[fxLayout]="direction"` usage', () => {
      expectDOMFrom(`<div [fxLayout]="direction"></div>`, "direction", "invalid")
          .toHaveCssStyle({
            'flex-direction': 'row',
          });
    });
    it('should use update style with dynamic value changes `[fxLayout]="direction"` usage', () => {
      fixture = createTestComponent(`<div [fxLayout]="direction"></div>`);

      fixture.componentInstance.direction = "invalid";
      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row',
      });

      fixture.componentInstance.direction = "column";
      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'column'
      });

    });

  });

  describe('with responsive features', () => {

    it('should ignore responsive changes when not configured', () => {
      fixture = createTestComponent(`<div fxLayout="column"></div>`);
      let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);

      matchMedia.activate('md');
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      });
    });
    it('should add responsive styles when configured', () => {
      fixture = createTestComponent(`<div fxLayout fxLayout.md="column"></div>`);
      let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);

      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box'
      });

      matchMedia.activate('md');
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      });
    });
    it('should update responsive styles when the active mediaQuery changes', () => {
      fixture = createTestComponent(`<div fxLayout fxLayout.md="column"></div>`);
      let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);

      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });

      matchMedia.activate('md');
      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'column'
      });

      matchMedia.activate('all');
      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });
    });

    it('should update styles with bindings and the active mediaQuery changes', () => {
      fixture = createTestComponent(`
          <div fxLayout="row"
               [fxLayout.md]="direction">
          </div>
       `);
      let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);

      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });

      matchMedia.activate('md');
      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'column'
      });

      fixture.componentInstance.direction = "row";
      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });


    });
    it('should fallback to default styles when the active mediaQuery change is not configured', () => {
      fixture = createTestComponent(`<div fxLayout fxLayout.md="column"></div>`);
      let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);

      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });

      matchMedia.activate('md');
      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'column'
      });

      matchMedia.activate('lg');
      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });

    });
    it('should fallback to closest overlapping value when the active mediaQuery change is not configured', () => {
      fixture = createTestComponent(`<div fxLayout fxLayout.gt-sm="column" fxLayout.md="row"></div>`);
      let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);

      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });

      matchMedia.activate('gt-sm');
      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'column'
      });

      matchMedia.activate('md');
      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'row'
      });

      // Should fallback to value for 'gt-sm'
      matchMedia.activate('lg', true);
      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'flex-direction': 'column'
      });
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
export class TestLayoutComponent implements OnInit {
  direction = "column";

  constructor() {
  }

  ngOnInit() {
  }
}
