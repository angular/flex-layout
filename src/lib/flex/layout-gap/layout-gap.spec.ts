/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, Injectable, OnInit, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformServer} from '@angular/common';
import {TestBed, ComponentFixture, inject, async} from '@angular/core/testing';
import {DIR_DOCUMENT} from '@angular/cdk/bidi';
import {
  ɵMatchMedia as MatchMedia,
  ɵMockMatchMedia as MockMatchMedia,
  ɵMockMatchMediaProvider as MockMatchMediaProvider,
  SERVER_TOKEN,
  StyleBuilder,
  StyleUtils,
} from '@angular/flex-layout/core';

import {FlexLayoutModule} from '../../module';
import {customMatchers, expect} from '../../utils/testing/custom-matchers';
import {
  expectEl,
  expectNativeEl,
  makeCreateTestComponent,
  queryFor,
} from '../../utils/testing/helpers';
import {FlexModule} from '../module';
import {LayoutGapStyleBuilder} from './layout-gap';

describe('layout-gap directive', () => {
  let fixture: ComponentFixture<any>;
  let fakeDocument: {body: {dir?: string}, documentElement: {dir?: string}};
  let styler: StyleUtils;
  let platformId: Object;
  let mediaController: MockMatchMedia;
  let createTestComponent = (template: string, styles?: any) => {
    fixture = makeCreateTestComponent(() => TestLayoutGapComponent)(template, styles);
    inject([MatchMedia, StyleUtils, PLATFORM_ID],
      (_matchMedia: MockMatchMedia, _styler: StyleUtils, _platformId: Object) => {
      mediaController = _matchMedia;
      styler = _styler;
      platformId = _platformId;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    fakeDocument = {body: {}, documentElement: {}};

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule],
      declarations: [TestLayoutGapComponent],
      providers: [
        MockMatchMediaProvider,
        {provide: DIR_DOCUMENT, useValue: fakeDocument},
        {provide: SERVER_TOKEN, useValue: true}
      ]
    });
  });

  function verifyCorrectMargin(layout: string, marginKey: string) {
    const margin = '8px';
    const template = `
            <div fxLayout='${layout}' fxLayoutGap='${margin}'>
                <span></span>
                <span></span>
            </div>
        `;

    createTestComponent(template);
    fixture.detectChanges();

    const nodes = queryFor(fixture, 'span');
    const styles = {[marginKey]: margin};

    expectEl(nodes[0]).toHaveStyle(styles, styler);
    expectEl(nodes[1]).not.toHaveStyle(styles, styler);
  }

  describe('with static features', () => {

    it('should not add gap styles for a single child', () => {
      let template = `
              <div fxLayoutAlign='center center' fxLayoutGap='13px'>
                  <div fxFlex></div>
              </div>
          `;
      createTestComponent(template);
      expectEl(queryFor(fixture, '[fxFlex]')[0]).not.toHaveStyle({'margin-right': '13px;'}, styler);
    });

    it('should add gap styles to all children except the 1st child', () => {
      let template = `
              <div fxLayoutAlign='center center' fxLayoutGap='13px'>
                  <div fxFlex></div>
                  <div fxFlex></div>
                  <div fxFlex></div>
              </div>
          `;
      createTestComponent(template);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(3);
      expectEl(nodes[0]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[1]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '0px'}, styler);
    });

    it('should add gap styles in proper order when order style is applied', () => {
      let template = `
        <div fxLayoutAlign='center center' fxLayoutGap='13px'>
          <div fxFlex fxFlexOrder="3"></div>
          <div fxFlex fxFlexOrder="2"></div>
          <div fxFlex fxFlexOrder="1"></div>
        </div>
      `;
      createTestComponent(template);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(3);
      expectEl(nodes[2]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[1]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[0]).not.toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[0]).not.toHaveStyle({'margin-right': '0px'}, styler);
    });

    it('should add gap styles to dynamics rows EXCEPT first', () => {
      let template = `
              <div fxLayoutAlign='center center' fxLayoutGap='13px'>
                  <div fxFlex *ngFor='let row of rows'></div>
              </div>
          `;
      createTestComponent(template);
      fixture.componentInstance.direction = 'row';
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(4);
      expectEl(nodes[0]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[1]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[2]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[3]).not.toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[3]).not.toHaveStyle({'margin-right': '0px'}, styler);
    });

    it('should add update gap styles when row items are removed', async(() => {
      let template = `
              <div fxLayoutAlign='center center' fxLayoutGap='13px'>
                  <div fxFlex *ngFor='let row of rows'></div>
              </div>
          `;
      createTestComponent(template);
      fixture.componentInstance.direction = 'row';
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(4);

      fixture.componentInstance.rows = new Array(3);
      fixture.detectChanges();

      setTimeout(() => {
        // Since the layoutGap directive detects the *ngFor changes by using a MutationObserver, the
        // browser will take up some time, to actually announce the changes to the directive.
        // (Kudos to @DevVersion)
        nodes = queryFor(fixture, '[fxFlex]');
        expect(nodes.length).toEqual(3);

        if (typeof MutationObserver !== 'undefined') {
          expectEl(nodes[0]).toHaveStyle({'margin-right': '13px'}, styler);
          expectEl(nodes[1]).toHaveStyle({'margin-right': '13px'}, styler);
          expectEl(nodes[2]).not.toHaveStyle({'margin-right': '13px'}, styler);
        }
      });

    }));

    it('should add update gap styles when only 1 row is remaining', async(() => {
      let template = `
              <div fxLayoutAlign='center center' fxLayoutGap='13px'>
                  <div fxFlex *ngFor='let row of rows'></div>
              </div>
          `;
      createTestComponent(template);
      fixture.componentInstance.direction = 'row';
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes.length).toEqual(4);
      expectEl(nodes[0]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[3]).not.toHaveStyle({'margin-right': '13px'}, styler);

      fixture.componentInstance.rows = new Array(1);
      fixture.detectChanges();

      setTimeout(() => {
        // Since the layoutGap directive detects the *ngFor changes by using a MutationObserver, the
        // browser will take up some time, to actually announce the changes to the directive.
        // (Kudos to @DevVersion)
        nodes = queryFor(fixture, '[fxFlex]');

        expect(nodes.length).toEqual(1);
        if (typeof MutationObserver !== 'undefined') {
          expectEl(nodes[0]).not.toHaveStyle({'margin-right': '13px'}, styler);
        }
      });

    }));

    it('should apply margin-top for column layouts', () => {
      verifyCorrectMargin('column', 'margin-bottom');
    });

    it('should apply margin-left for row-reverse layouts', () => {
      verifyCorrectMargin('row-reverse', 'margin-left');
    });

    it('should apply margin-top for column-reverse layouts', () => {
      verifyCorrectMargin('column-reverse', 'margin-top');
    });

    it('should remove obsolete margin and apply valid margin for layout changes', () => {
      createTestComponent(`
          <div [fxLayout]='direction' [fxLayoutGap]='gap'>
              <span></span>
              <span></span>
          </div>
      `);
      let instance = fixture.componentInstance;

      // layout = column, use margin-top
      instance.direction = 'column';
      instance.gap = '8px';
      fixture.detectChanges();
      let nodes = queryFor(fixture, 'span');

      expectEl(nodes[0]).not.toHaveStyle({'margin-right': '8px'}, styler);
      expectEl(nodes[0]).toHaveStyle({'margin-bottom': '8px'}, styler);


      // layout = column-reverse, use margin-bottom
      instance.direction = 'column-reverse';
      fixture.detectChanges();
      nodes = queryFor(fixture, 'span');

      expectEl(nodes[0]).not.toHaveStyle({'margin-right': '8px'}, styler);
      expectEl(nodes[0]).toHaveStyle({'margin-top': '8px'}, styler);


      // layout = row-reverse, use margin-right
      instance.direction = 'row-reverse';
      fixture.detectChanges();
      nodes = queryFor(fixture, 'span');

      expectEl(nodes[0]).not.toHaveStyle({'margin-bottom': '8px'}, styler);
      expectEl(nodes[0]).toHaveStyle({'margin-left': '8px'}, styler);
    });

    it('should recognize hidden elements when applying gaps', () => {
      let styles = ['.col1 { display:none !important;'];
      let template = `
        <div class='container' fxLayout='row' fxLayoutGap='16px'>
          <div fxFlex class='col1'>Div 1</div>
          <div fxFlex class='col2'>Div 2</div>
          <div fxFlex class='col3'>Div 3</div>
        </div>
      `;
      createTestComponent(template, styles);
      fixture.componentInstance.direction = 'row';
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes.length).toEqual(3);
      // TODO(CaerusKaru): Domino is unable to detect this style
      if (!isPlatformServer(platformId)) {
        expectEl(nodes[0]).not.toHaveStyle({'margin-right': '0px'}, styler);
        expectEl(nodes[0]).not.toHaveStyle({'margin-right': '16px'}, styler);
        expectEl(nodes[1]).toHaveStyle({'margin-right': '16px'}, styler);
        expectEl(nodes[2]).not.toHaveStyle({'margin-right': '16px'}, styler);
      }

    });

    it('should adjust gaps based on layout-wrap presence', () => {
      let styles = ['.col1 { display:none !important;'];
      let template = `
            <div class='container'
                 [fxLayout]='direction + " wrap"'
                 [fxLayoutGap]='gap'>
              <div fxFlex class='col1'>Div 1</div>
              <div fxFlex class='col2'>Div 2</div>
              <div fxFlex class='col3'>Div 2</div>
              <div fxFlex class='col4'>Div 3</div>
            </div>
          `;
      createTestComponent(template, styles);
      fixture.componentInstance.gap = '16px';
      fixture.componentInstance.direction = 'row';
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes.length).toEqual(4);
      // TODO(CaerusKaru): Domino is unable to detect this style
      if (!isPlatformServer(platformId)) {
        expectEl(nodes[0]).not.toHaveStyle({'margin-right': '16px'}, styler);
        expectEl(nodes[1]).toHaveStyle({'margin-right': '16px'}, styler);
        expectEl(nodes[2]).toHaveStyle({'margin-right': '16px'}, styler);
        expectEl(nodes[3]).not.toHaveStyle({'margin-right': '16px'}, styler);
      }

      fixture.componentInstance.gap = '8px';
      fixture.componentInstance.direction = 'column';
      fixture.detectChanges();

      nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes.length).toEqual(4);
      // TODO(CaerusKaru): Domino is unable to detect this style
      if (!isPlatformServer(platformId)) {
        expectEl(nodes[0]).not.toHaveStyle({'margin-bottom': '8px'}, styler);
        expectEl(nodes[1]).toHaveStyle({'margin-bottom': '8px'}, styler);
        expectEl(nodes[2]).toHaveStyle({'margin-bottom': '8px'}, styler);
        expectEl(nodes[3]).not.toHaveStyle({'margin-bottom': '8px'}, styler);
      }
    });
  });

  describe('with responsive features', () => {
    it('should set gap on breakpoint change', () => {
      let template = `
        <div fxLayoutAlign='center center' fxLayoutGap='13px' fxLayoutGap.md="24px">
          <div fxFlex></div>
          <div fxFlex></div>
          <div fxFlex></div>
        </div>
      `;
      createTestComponent(template);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(3);
      expectEl(nodes[0]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[1]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '0px'}, styler);

      mediaController.activate('md');
      fixture.detectChanges();
      expectEl(nodes[0]).toHaveStyle({'margin-right': '24px'}, styler);
      expectEl(nodes[1]).toHaveStyle({'margin-right': '24px'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '24px'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '0px'}, styler);
    });

    it('should set gap without fallback', () => {
      let template = `
        <div fxLayoutAlign='center center' fxLayoutGap.md="24px">
          <div fxFlex></div>
          <div fxFlex></div>
          <div fxFlex></div>
        </div>
      `;
      createTestComponent(template);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(3);
      mediaController.activate('sm');
      expectEl(nodes[0]).not.toHaveStyle({'margin-right': '*'}, styler);
      expectEl(nodes[1]).not.toHaveStyle({'margin-right': '*'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '*'}, styler);

      mediaController.activate('md');
      fixture.detectChanges();
      expectEl(nodes[0]).toHaveStyle({'margin-right': '24px'}, styler);
      expectEl(nodes[1]).toHaveStyle({'margin-right': '24px'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '24px'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '0px'}, styler);

      mediaController.activate('sm');
      expectEl(nodes[0]).not.toHaveStyle({'margin-right': '*'}, styler);
      expectEl(nodes[1]).not.toHaveStyle({'margin-right': '*'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '*'}, styler);
    });

    it('should set gap with responsive layout change', () => {
      let template = `
        <div fxLayout="row" fxLayout.xs="column" fxLayoutGap="24px">
          <div fxFlex></div>
          <div fxFlex></div>
          <div fxFlex></div>
        </div>
      `;
      createTestComponent(template);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(3);
      expectEl(nodes[0]).toHaveStyle({'margin-right': '24px'}, styler);
      expectEl(nodes[1]).toHaveStyle({'margin-right': '24px'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '*'}, styler);

      mediaController.activate('xs');
      fixture.detectChanges();
      expectEl(nodes[0]).toHaveStyle({'margin-bottom': '24px'}, styler);
      expectEl(nodes[1]).toHaveStyle({'margin-bottom': '24px'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-bottom': '*'}, styler);
    });

    it('should work with dynamic fxHide', () => {
      let template = `
        <div fxLayout="row" fxLayoutGap="10px">
          <div fxFlex>A</div>
          <div fxFlex [fxHide]="shouldHide">B</div>
        </div>
      `;
      createTestComponent(template);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(2);
      expectEl(nodes[0]).not.toHaveStyle({'margin-right': '*'}, styler);
      expectEl(nodes[1]).not.toHaveStyle({'margin-right': '*'}, styler);

      let instance = fixture.componentInstance;
      instance.shouldHide = false;
      fixture.detectChanges();

      expectEl(nodes[0]).toHaveStyle({'margin-right': '10px'}, styler);
      expectEl(nodes[1]).not.toHaveStyle({'margin-right': '*'}, styler);
    });

    it('should work with responsive fxHide', () => {
      let template = `
        <div fxLayoutAlign="center center" fxLayoutGap="13px">
          <div fxFlex="15" class="sec1" fxFlex.xs="55"></div>
          <div fxFlex="30" class="sec2" fxFlex.sm></div>
          <div fxFlex="55" class="sec3" fxShow fxHide.sm></div>
        </div>
      `;
      createTestComponent(template);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(3);
      expectEl(nodes[0]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[1]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '*'}, styler);

      mediaController.activate('sm');
      fixture.detectChanges();
      expectEl(nodes[0]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[1]).not.toHaveStyle({'margin-right': '*'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '*'}, styler);

      mediaController.activate('lg');
      fixture.detectChanges();
      expectEl(nodes[0]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[1]).toHaveStyle({'margin-right': '13px'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'margin-right': '*'}, styler);
    });
  });

  describe('rtl support', () => {
    it('uses margin-left when document body has rtl dir', () => {
      fakeDocument.body.dir = 'rtl';
      verifyCorrectMargin('row', 'margin-left');
    });

    it('uses margin-left when documentElement has rtl dir', () => {
      fakeDocument.documentElement.dir = 'rtl';
      verifyCorrectMargin('row', 'margin-left');
    });

    it('still uses margin-bottom in column layout when body has rtl dir', () => {
      fakeDocument.body.dir = 'rtl';
      verifyCorrectMargin('column', 'margin-bottom');
    });
  });

  describe('grid option', () => {
    it('should add gap styles correctly', () => {
      let template = `
        <div fxLayoutGap='13px grid'>
          <div fxFlex></div>
          <div fxFlex></div>
          <div fxFlex></div>
        </div>
      `;
      createTestComponent(template);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      let expectedMargin = {'margin': '0px -13px -13px 0px'};
      let expectedPadding = {'padding': '0px 13px 13px 0px'};
      expect(nodes.length).toEqual(3);
      expectEl(nodes[0]).toHaveStyle(expectedPadding, styler);
      expectEl(nodes[1]).toHaveStyle(expectedPadding, styler);
      expectEl(nodes[2]).toHaveStyle(expectedPadding, styler);
      expectNativeEl(fixture).toHaveStyle(expectedMargin, styler);
    });

    it('should add gap styles correctly between option', () => {
      let template = `
        <div fxLayoutGap='13px 12px grid'>
          <div fxFlex></div>
          <div fxFlex></div>
          <div fxFlex></div>
        </div>
      `;
      createTestComponent(template);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      let expectedMargin = {'margin': '0px -13px -12px 0px'};
      let expectedPadding = {'padding': '0px 13px 12px 0px'};
      expect(nodes.length).toEqual(3);
      expectEl(nodes[0]).toHaveStyle(expectedPadding, styler);
      expectEl(nodes[1]).toHaveStyle(expectedPadding, styler);
      expectEl(nodes[2]).toHaveStyle(expectedPadding, styler);
      expectNativeEl(fixture).toHaveStyle(expectedMargin, styler);
    });

    it('should set gap without fallback', () => {
      let template = `
        <div fxLayoutAlign='center center' fxLayoutGap.md="24px grid">
          <div fxFlex></div>
          <div fxFlex></div>
          <div fxFlex></div>
        </div>
      `;
      createTestComponent(template);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(3);
      mediaController.activate('sm');
      expectEl(nodes[0]).not.toHaveStyle({'padding': '*'}, styler);
      expectEl(nodes[1]).not.toHaveStyle({'padding': '*'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'padding': '*'}, styler);

      mediaController.activate('md');
      fixture.detectChanges();
      expectEl(nodes[0]).toHaveStyle({'padding': '0px 24px 24px 0px'}, styler);
      expectEl(nodes[1]).toHaveStyle({'padding': '0px 24px 24px 0px'}, styler);
      expectEl(nodes[2]).toHaveStyle({'padding': '0px 24px 24px 0px'}, styler);

      mediaController.activate('sm');
      expectEl(nodes[0]).not.toHaveStyle({'padding': '*'}, styler);
      expectEl(nodes[1]).not.toHaveStyle({'padding': '*'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'padding': '*'}, styler);
    });

    it('should add gap styles correctly for rtl', () => {
      fakeDocument.body.dir = 'rtl';
      let template = `
        <div fxLayoutGap='13px grid'>
          <div fxFlex></div>
          <div fxFlex></div>
          <div fxFlex></div>
        </div>
      `;
      createTestComponent(template);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      let expectedMargin = {'margin': '0px 0px -13px -13px'};
      let expectedPadding = {'padding': '0px 0px 13px 13px'};
      expect(nodes.length).toEqual(3);
      expectEl(nodes[0]).toHaveStyle(expectedPadding, styler);
      expectEl(nodes[1]).toHaveStyle(expectedPadding, styler);
      expectEl(nodes[2]).toHaveStyle(expectedPadding, styler);
      expectNativeEl(fixture).toHaveStyle(expectedMargin, styler);
    });
  });

  describe('with custom builder', () => {
    beforeEach(() => {
      jasmine.addMatchers(customMatchers);

      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FlexLayoutModule.withConfig({
            useColumnBasisZero: false,
            serverLoaded: true,
          }),
        ],
        declarations: [],
        providers: [
          {
            provide: LayoutGapStyleBuilder,
            useClass: MockLayoutGapStyleBuilder,
          }
        ]
      });
    });

    it('should set gap not to input', () => {
      createTestComponent(`
        <div fxLayoutGap='10px'>
          <div fxFlexOffset="25"></div>
        </div>
      `);
      expectNativeEl(fixture).toHaveStyle({'margin-top': '12px'}, styler);
    });
  });

});

@Injectable({providedIn: FlexModule})
export class MockLayoutGapStyleBuilder extends StyleBuilder {
  shouldCache = false;
  buildStyles(_input: string) {
    return {'margin-top': '12px'};
  }
}


// *****************************************************************
// Template Component
// *****************************************************************
@Component({
  selector: 'test-layout',
  template: `<span>PlaceHolder Template HTML</span>`
})
class TestLayoutGapComponent implements OnInit {
  direction = 'column';
  gap = '8px';
  shouldHide = true;
  rows = new Array(4);

  constructor() {
  }

  ngOnInit() {
  }
}
