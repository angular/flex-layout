import {customMatchers} from './matchers/custom-matchers';
import {Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, async, inject} from '@angular/core/testing';

import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {BreakPointsProvider} from '../../media-query/providers/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {FlexLayoutModule} from '../_module';

describe('layout directive', () => {
  let fixture: ComponentFixture<any>;

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
  afterEach(() => { fixture = null; });

  it('should add correct styles for default `fx-layout` usage', () => {
    expectTemplate(`<div fx-layout></div>`).toHaveCssStyle({
      'display'         : 'flex',
      'flex-direction'  : 'row',
      'box-sizing'      : 'border-box'
    });
  });
  it('should add correct styles for `fx-layout="row"` usage', () => {
    expectTemplate(`<div fx-layout="row"></div>`).toHaveCssStyle({
      'display'         : 'flex',
      'flex-direction'  : 'row',
      'box-sizing'      : 'border-box'
    });
  });
  it('should add correct styles for `fx-layout="column"` usage', () => {
    expectTemplate(`<div fx-layout="column"></div>`).toHaveCssStyle({
      'display'         : 'flex',
      'flex-direction'  : 'column',
      'box-sizing'      : 'border-box'
    });
  });
  it('should add correct styles for binding `[fx-layout]="direction"` usage', () => {
    expectTemplate(`<div [fx-layout]="direction"></div>`).toHaveCssStyle({
      'display'         : 'flex',
      'flex-direction'  : 'column',
      'box-sizing'      : 'border-box'
    });
  });
  it('should use default flex-direction for invalid value `fx-layout="invalid"` usage', () => {
    expectTemplate(`<div fx-layout="invalid"></div>`).toHaveCssStyle({
      'display'         : 'flex',
      'flex-direction'  : 'row',
      'box-sizing'      : 'border-box'
    });
  });
  it('should use default flex-direction for invalid binding value `[fx-layout]="direction"` usage', () => {
    expectTemplate(`<div [fx-layout]="direction"></div>`, "direction", "invalid")
      .toHaveCssStyle({
        'display'         : 'flex',
        'flex-direction'  : 'row',
        'box-sizing'      : 'border-box'
      });
  });

  describe('with responsive features', () => {

    it('should ignore responsive changes when not configured', () =>{
      let fixture = createTestComponent(`<div fx-layout></div>`);
      let matchMedia : MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);

      matchMedia.activate('md');
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveCssStyle({
        'display'         : 'flex',
        'flex-direction'  : 'row',
        'box-sizing'      : 'border-box'
      });
    });

    it('should add responsive styles when configured', () =>{
      let fixture = createTestComponent(`<div fx-layout fx-layout.md="column"></div>`);
      let matchMedia : MockMatchMedia = fixture.debugElement.injector.get(MatchMedia);

      fixture.detectChanges();
      expectNativeEl(fixture).toHaveCssStyle({
        'display'         : 'flex',
        'flex-direction'  : 'row',
        'box-sizing'      : 'border-box'
      });

      matchMedia.activate('md');
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveCssStyle({
        'display'         : 'flex',
        'flex-direction'  : 'column',
        'box-sizing'      : 'border-box'
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
  constructor() {  }
  ngOnInit() { }
}

// *****************************************************************
// Helper functions
// *****************************************************************

  function expectTemplate(template:string, key?:string, value?:any) : any {
    let fixture = createTestComponent(template);

    if ( key ) {
      let instance = fixture.componentInstance;
      instance[key] = value;
    }
    fixture.detectChanges();

    return expectNativeEl(fixture);
  }

  function createTestComponent(template: string): ComponentFixture<TestLayoutComponent> {
    return TestBed
      .overrideComponent(TestLayoutComponent, {set: {template: template}})
      .createComponent(TestLayoutComponent);
  }

  function expectNativeEl(fixture: ComponentFixture<any>): any {
    return expect(fixture.debugElement.children[0].nativeElement);
  }


// *****************************************************************
// *****************************************************************

