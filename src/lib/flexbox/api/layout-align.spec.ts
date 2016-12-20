import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, async } from '@angular/core/testing';

import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {BreakPointsProvider} from '../../media-query/providers/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {FlexLayoutModule} from '../_module';

import {extendObject} from '../../utils/object-extend';
import {customMatchers} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, makeExpectTemplate, expectNativeEl} from '../../utils/testing/helpers';

describe('layout directive', () => {
  let fixture: ComponentFixture<any>;
  let createTestComponent = makeCreateTestComponent(()=> TestLayoutComponent);
  let expectTemplate = makeExpectTemplate(()=> TestLayoutComponent);

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

    it('should add correct styles for default `fx-layout-align` usage', () => {
      expectTemplate(`<div fx-layout-align></div>`).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'row',
        'box-sizing': 'border-box',
        'justify-content' : 'flex-start',
        'align-items' : 'stretch',
        'align-content' : 'stretch'
      });
    });
    it('should add preserve fx-layout', () => {
      expectTemplate(`<div fx-layout="column" fx-layout-align></div>`).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box',
        'justify-content' : 'flex-start',
        'align-items' : 'stretch',
        'align-content' : 'stretch'
      });
    });

    describe('for "main-axis" testing', ()=>{
      let crossAxis = '';

      it('should add correct styles for `fx-layout-align="start"` usage', () => {
        expectTemplate(`<div fx-layout-align="start"></div>`).toHaveCssStyle(
            extendObject({ 'justify-content' : 'flex-start' }, CROSSAXIS_DEFAULTS)
        );
      });
      it('should add correct styles for `fx-layout-align="center"` usage', () => {
        expectTemplate(`<div fx-layout-align="center"></div>`).toHaveCssStyle(
            extendObject({ 'justify-content' : 'center' }, CROSSAXIS_DEFAULTS)
        );
      });
      it('should add correct styles for `fx-layout-align="space-around"` usage', () => {
        expectTemplate(`<div fx-layout-align="space-around"></div>`).toHaveCssStyle(
            extendObject({ 'justify-content' : 'space-around' }, CROSSAXIS_DEFAULTS)
        );
      });
      it('should add correct styles for `fx-layout-align="space-between"` usage', () => {
        expectTemplate(`<div fx-layout-align="space-between"></div>`).toHaveCssStyle(
            extendObject({ 'justify-content' : 'space-between' }, CROSSAXIS_DEFAULTS)
        );
      });
      it('should add correct styles for `fx-layout-align="end"` usage', () => {
        expectTemplate(`<div fx-layout-align="end"></div>`).toHaveCssStyle(
            extendObject({ 'justify-content' : 'flex-end' }, CROSSAXIS_DEFAULTS)
        );
      });
      it('should add ignore invalid main-axis values', () => {
        expectTemplate(`<div fx-layout-align="invalid"></div>`).toHaveCssStyle(
            extendObject({ 'justify-content' : 'flex-start' }, CROSSAXIS_DEFAULTS)
        );
      });
    });

    describe('for "cross-axis" testing', ()=>{

      it('should add correct styles for `fx-layout-align="start start"` usage', () => {
        expectTemplate(`<div fx-layout-align="start start"></div>`).toHaveCssStyle(
            extendObject(MAINAXIS_DEFAULTS, {
              'align-items' : 'flex-start',
              'align-content' : 'flex-start'
            })
        );
      });
      it('should add correct styles for `fx-layout-align="start baseline"` usage', () => {
        expectTemplate(`<div fx-layout-align="start baseline"></div>`).toHaveCssStyle(
            extendObject(MAINAXIS_DEFAULTS, {
              'align-items' : 'baseline',
              'align-content' : 'stretch'
            })
        );
      });
      it('should add correct styles for `fx-layout-align="start center"` usage', () => {
        expectTemplate(`<div fx-layout-align="start center"></div>`).toHaveCssStyle(
            extendObject(MAINAXIS_DEFAULTS, {
              'align-items' : 'center',
              'align-content' : 'center'
            })
        );
      });
      it('should add correct styles for `fx-layout-align="start end"` usage', () => {
        expectTemplate(`<div fx-layout-align="start end"></div>`).toHaveCssStyle(
            extendObject(MAINAXIS_DEFAULTS, {
              'align-items' : 'flex-end',
              'align-content' : 'flex-end'
            })
        );
      });
      it('should add ignore invalid cross-axis values',  () => {
        expectTemplate(`<div fx-layout-align="start invalid"></div>`).toHaveCssStyle(
            extendObject(MAINAXIS_DEFAULTS, {
              'align-items' : 'stretch',
              'align-content' : 'stretch'
            })
        );
      });
    });

  });

  xdescribe('with responsive features', () => {

    xit('should ignore responsive changes when not configured', () => {
      fixture = createTestComponent(`<div fx-layout="column"></div>`);
      let matchMedia: MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);

      matchMedia.activate('md');
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveCssStyle({
        'display': 'flex',
        'flex-direction': 'column',
        'box-sizing': 'border-box'
      });
    });
    xit('should add responsive styles when configured', () => {
      fixture = createTestComponent(`<div fx-layout fx-layout.md="column"></div>`);
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
    xit('should update responsive styles when the active mediaQuery changes', () => {
      fixture = createTestComponent(`<div fx-layout fx-layout.md="column"></div>`);
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
    xit('should fallback to default styles when the active mediaQuery change is not configured', () => {
      fixture = createTestComponent(`<div fx-layout fx-layout.md="column"></div>`);
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
    xit('should fallback to closest overlapping value when the active mediaQuery change is not configured', () => {
      fixture = createTestComponent(`<div fx-layout fx-layout.gt-sm="column" fx-layout.md="row"></div>`);
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
  mainAxis = "start";
  crossAxis = "end";

  constructor() {  }
  ngOnInit() { }
}


// *****************************************************************
// Template Component
// *****************************************************************

  const CROSSAXIS_DEFAULTS = {
          'align-items': 'stretch',
          'align-content': 'stretch'
        };
  const MAINAXIS_DEFAULTS = {
          'justify-content' : 'flex-start'
        };

