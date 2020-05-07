/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, Injectable, PLATFORM_ID, ViewChild} from '@angular/core';
import {CommonModule, isPlatformServer} from '@angular/common';
import {ComponentFixture, TestBed, inject, fakeAsync} from '@angular/core/testing';
import {Platform} from '@angular/cdk/platform';
import {
  ɵMatchMedia as MatchMedia,
  ɵMockMatchMedia as MockMatchMedia,
  ɵMockMatchMediaProvider as MockMatchMediaProvider,
  StyleBuilder,
  StyleUtils,
} from '@angular/flex-layout/core';

import {FlexLayoutModule} from '../../module';
import {DefaultFlexDirective, FlexStyleBuilder} from './flex';
import {DefaultLayoutDirective} from '../layout/layout';
import {customMatchers, expect} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent,
  expectNativeEl,
  queryFor,
  expectEl,
} from '../../utils/testing/helpers';

describe('flex directive', () => {
  let fixture: ComponentFixture<any>;
  let mediaController: MockMatchMedia;
  let styler: StyleUtils;
  let platform: Platform;
  let platformId: Object;
  let componentWithTemplate = (template: string) => {
    fixture = makeCreateTestComponent(() => TestFlexComponent)(template);

    // Can only Inject() AFTER TestBed.override(...)
    inject(
        [MatchMedia, StyleUtils, Platform, PLATFORM_ID],
        (_matchMedia: MockMatchMedia, _styler: StyleUtils, _platform: Platform,
     _platformId: Object) => {
      mediaController = _matchMedia;
      styler = _styler;
      platform = _platform;
      platformId = _platformId;

    })();

    return fixture;
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FlexLayoutModule.withConfig({serverLoaded: true}),
      ],
      declarations: [TestFlexComponent, TestQueryWithFlexComponent],
      providers: [MockMatchMediaProvider]
    });
  });

  afterEach(() => {
    mediaController.clearAll();
  });

  describe('with static features', () => {
    afterEach(() => {
      mediaController.clearAll();
    });

    it('should add correct styles for default `fxFlex` usage', () => {
      componentWithTemplate(`<div fxFlex></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0];
      expectEl(dom).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(dom).toHaveStyle({'flex': '1 1 0%'}, styler);
    });

    it('should add correct styles for `fxFlex` and ngStyle with layout change', () => {
      // NOTE: the presence of ngIf on the child element is imperative for detecting issue 700
      componentWithTemplate(`
        <div fxLayout="row wrap" fxLayoutAlign="start center">
          <div fxFlex="10 1 auto" [ngStyle.lt-md]="{'width.px': 15}" *ngIf="true"></div>
        </div>
      `);
      fixture.detectChanges();
      mediaController.activate('sm', true);
      let element = queryFor(fixture, '[fxFlex]')[0];
      expectEl(element).toHaveStyle({'width': '15px'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '10 1 auto'}, styler);
    });

    it('should add correct styles for `fxFlex` with NgForOf', () => {
      componentWithTemplate(`
        <div [fxLayout]="direction">
          <div *ngFor="let el of els" fxFlex="50"></div>
        </div>
      `);
      fixture.componentInstance.direction = 'row';
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0];
      expectEl(element).toHaveStyle({'max-width': '50%'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '1 1 100%'}, styler);
      fixture.componentInstance.direction = 'column';
      fixture.detectChanges();
      element = queryFor(fixture, '[fxFlex]')[0];
      expectEl(element).toHaveStyle({'max-height': '50%'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '1 1 100%'}, styler);
    });

    it('should add correct styles for `fxFlex` and ngStyle without layout change', () => {
      // NOTE: the presence of ngIf on the child element is imperative for detecting issue 700
      componentWithTemplate(`
        <div fxLayout="row wrap" fxLayoutAlign="start center">
          <div fxFlex="10 1 auto" [ngStyle.lt-md]="{'width.px': 15}" *ngIf="true"></div>
        </div>
      `);
      fixture.detectChanges();
      mediaController.activate('sm', true);
      let element = queryFor(fixture, '[fxFlex]')[0];
      expectEl(element).toHaveStyle({'width': '15px'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '10 1 auto'}, styler);
    });

    it('should add correct styles for `fxFlex` with multiple layout changes and wraps', () => {
      componentWithTemplate(`
        <div [fxLayout]="direction + ' wrap'" fxLayoutAlign="start center">
          <div fxFlex="30"></div>
        </div>
      `);
      fixture.debugElement.componentInstance.direction = 'column';
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0];
      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'column'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '1 1 30%'}, styler);
      expectEl(element).toHaveStyle({'max-height': '30%'}, styler);

      fixture.debugElement.componentInstance.direction = 'row';
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'row'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '1 1 30%'}, styler);
      expectEl(element).toHaveStyle({'max-width': '30%'}, styler);

      fixture.debugElement.componentInstance.direction = 'column';
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'column'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '1 1 30%'}, styler);
      expectEl(element).toHaveStyle({'max-height': '30%'}, styler);
    });

    it('should add correct styles for `fxFlex` with gap in grid mode and wrap parent', () => {
      componentWithTemplate(`
        <div [fxLayout]="direction + ' wrap'" fxLayoutGap="10px grid">
          <div fxFlex="30"></div>
          <div fxFlex="30"></div>
          <div fxFlex="30"></div>
        </div>
      `);
      fixture.debugElement.componentInstance.direction = 'row';
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0];
      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'row'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '1 1 30%'}, styler);
      expectEl(element).toHaveStyle({'max-width': '30%'}, styler);

      fixture.debugElement.componentInstance.direction = 'row-reverse';
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'row-reverse'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '1 1 30%'}, styler);
      expectEl(element).toHaveStyle({'max-width': '30%'}, styler);

      fixture.debugElement.componentInstance.direction = 'column';
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'column'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '1 1 30%'}, styler);
      expectEl(element).toHaveStyle({'max-height': '30%'}, styler);

      fixture.debugElement.componentInstance.direction = 'column-reverse';
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({'flex-direction': 'column-reverse'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '1 1 30%'}, styler);
      expectEl(element).toHaveStyle({'max-height': '30%'}, styler);
    });

    it('should add correct styles for `fxFlex` and ngStyle with multiple layout changes', () => {
      // NOTE: the presence of ngIf on the child element is imperative for detecting 700
      componentWithTemplate(`
        <div fxLayout="row wrap" fxLayoutAlign="start center">
          <div fxFlex="10 1 auto" [ngStyle.lt-md]="{'width.px': 15}" *ngIf="true"></div>
        </div>
      `);
      mediaController.activate('sm', true);
      fixture.detectChanges();

      let element = queryFor(fixture, '[fxFlex]')[0];
      expectEl(element).toHaveStyle({'width': '15px'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '10 1 auto'}, styler);

      mediaController.activate('md', true);
      fixture.detectChanges();

      expectEl(element).not.toHaveStyle({'width': '15px'}, styler);
      expectEl(element).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(element).toHaveStyle({'flex': '10 1 auto'}, styler);
    });

    it('should apply `fxGrow` value to flex-grow when used default `fxFlex`', () => {
      componentWithTemplate(`<div fxFlex fxGrow="10"></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0];

      expectEl(dom).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(dom).toHaveStyle({'flex': '10 1 0%'}, styler);
    });

    it('should apply `fxShrink` value to flex-shrink when used default `fxFlex`', () => {
      componentWithTemplate(`<div fxFlex fxShrink="10"></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0];

      expectEl(dom).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(dom).toHaveStyle({'flex': '1 10 0%'}, styler);
    });

    it('should apply both `fxGrow` and `fxShrink` when used with default fxFlex', () => {
      componentWithTemplate(`<div fxFlex fxGrow="4" fxShrink="5"></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0];
      expectEl(dom).toHaveStyle({'box-sizing': 'border-box'}, styler);
      expectEl(dom).toHaveStyle({'flex': '4 5 0%'}, styler);
    });

    it('should add correct styles for flex-basis unitless 0 input', () => {
      componentWithTemplate(`<div fxFlex="1 1 0"></div>`);

      fixture.detectChanges();
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 0%',
        'box-sizing': 'border-box',
      }, styler);

      expectNativeEl(fixture).not.toHaveStyle({
        'max-width': '*'
      }, styler);
    });

    it('should add correct styles for flex-basis 0px input', () => {
      componentWithTemplate(`<div fxFlex="1 1 0px"></div>`);

      fixture.detectChanges();
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 0%',
        'box-sizing': 'border-box',
      }, styler);

      expectNativeEl(fixture).not.toHaveStyle({
        'max-width': '*'
      }, styler);
    });

    it('should add correct styles for noshrink with basis', () => {
      componentWithTemplate(`<div fxFlex="1 0 50%"></div>`);

      fixture.detectChanges();
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 0 50%',
        'box-sizing': 'border-box',
      }, styler);

      expectNativeEl(fixture).not.toHaveStyle({
        'max-width': '*'
      }, styler);
    });

    it('should add correct styles for `fxFlex="2%"` usage', () => {
      componentWithTemplate(`<div fxFlex='2%'></div>`);

      fixture.detectChanges();
      expectNativeEl(fixture).toHaveStyle({
        'max-width': '2%',
        'flex': '1 1 100%',
        'box-sizing': 'border-box',
      }, styler);
    });

    it('should work with percentage values', () => {
      componentWithTemplate(`<div fxFlex='37%'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 100%',
        'max-width': '37%',
        'box-sizing': 'border-box',
      }, styler);
    });
    it('should work with pixel values', () => {
      componentWithTemplate(`<div fxFlex='37px'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 37px',
        'box-sizing': 'border-box',
      }, styler);
    });
    it('should work with "1 0 auto" values', () => {
      componentWithTemplate(`<div fxFlex='1 0 auto'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 0 auto',
        'box-sizing': 'border-box',
      }, styler);
    });

    it('should work fxLayout parents', () => {
      componentWithTemplate(`
        <div fxLayout='column' class='test'>
          <div fxFlex='30px' fxFlex.gt-sm='50'  >  </div>
        </div>
      `);
      fixture.detectChanges();
      let parent = queryFor(fixture, '.test')[0];
      let element = queryFor(fixture, '[fxFlex]')[0];

      // parent flex-direction found with 'column' with child height styles
      expectEl(parent).toHaveStyle({'flex-direction': 'column', 'display': 'flex'}, styler);
      expectEl(element).toHaveStyle({'min-height': '30px'}, styler);
      expectEl(element).not.toHaveStyle({'min-width': '30px'}, styler);
    });

    it('should work fxLayout parents default in column mode', () => {
      componentWithTemplate(`
        <div fxLayout='column' class='test'>
          <div fxFlex>  </div>
        </div>
      `);
      fixture.detectChanges();
      let parent = queryFor(fixture, '.test')[0];
      let element = queryFor(fixture, '[fxFlex]')[0];

      // parent flex-direction found with 'column' with child height styles
      expectEl(parent).toHaveStyle({'flex-direction': 'column', 'display': 'flex'}, styler);

      if (platform.BLINK) {
        expectEl(element).toHaveStyle({
          'flex': '1 1 1e-09px',
          'box-sizing': 'border-box',
        }, styler);
      } else if (platform.FIREFOX) {
        expectEl(element).toHaveStyle({
          'flex': '1 1 1e-9px',
          'box-sizing': 'border-box',
        }, styler);
      } else if (platform.EDGE) {
        expectEl(element).toHaveStyle({
          'flex': '1 1 0px',
          'box-sizing': 'border-box',
        }, styler);
      } else {
        expectEl(element).toHaveStyle({
          'flex': '1 1 0.000000001px',
          'box-sizing': 'border-box',
        }, styler);
      }
    });

    it('should CSS stylesheet and not inject flex-direction on parent', () => {
      componentWithTemplate(`
        <style>
          .test { flex-direction:column; display: flex; }
        </style>
        <div class='test'>
          <div fxFlex='30px' fxFlex.gt-sm='50'></div>
        </div>
      `);

      fixture.detectChanges();
      let parent = queryFor(fixture, '.test')[0];
      let element = queryFor(fixture, '[fxFlex]')[0];

      // TODO(CaerusKaru): Domino is unable to detect this style
      if (!isPlatformServer(platformId)) {
        // parent flex-direction found with 'column' with child height styles
        expectEl(parent).toHaveCSS({'flex-direction': 'column', 'display': 'flex'}, styler);
        expectEl(element).toHaveStyle({'min-height': '30px'}, styler);
        expectEl(element).not.toHaveStyle({'min-width': '30px'}, styler);
      }
    });

    it('should work with non-direct-parent fxLayouts', fakeAsync(() => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div class='test'>
            <div fxFlex='40px' fxFlex.gt-sm='50'></div>
          </div>
        </div>
      `);

      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0];
      let parent = queryFor(fixture, '.test')[0];

      // The parent flex-direction not found;
      // A flex-direction should have been auto-injected to the parent...
      // fallback to 'row' and set child width styles accordingly
      expectEl(parent).toHaveStyle({'flex-direction': 'row'}, styler);
      expectEl(element).toHaveStyle({'min-width': '40px'}, styler);
      expectEl(element).not.toHaveStyle({'min-height': '40px'}, styler);

    }));

    it('should work with styled-parent flex directions', () => {
      componentWithTemplate(`
        <div fxLayout='row'>
          <div style='flex-direction: column' class='parent'>
            <div fxFlex='60px'></div>
          </div>
        </div>
      `);
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0];
      let parent = queryFor(fixture, '.parent')[0];

      // parent flex-direction found with 'column'; set child with height styles
      expectEl(element).toHaveStyle({'min-height': '60px'}, styler);
      expectEl(parent).toHaveStyle({'flex-direction': 'column'}, styler);
    });

    it('should work with "1 1 auto" values', () => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div fxFlex='auto' fxFlex.gt-sm='50'  >  </div>
          <div fxFlex='auto' fxFlex.gt-sm='24.4'>  </div>
          <div fxFlex='auto' fxFlex.gt-sm='25.6'>  </div>
        </div>
      `);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes.length).toEqual(3);
      expectEl(nodes[1]).not.toHaveStyle({'max-height': '*', 'min-height': '*'}, styler);
      expectEl(nodes[1]).toHaveStyle({
        'flex': '1 1 auto',
        'box-sizing': 'border-box'
      }, styler);
    });

    // Note: firefox is disabled due to a current bug with Firefox 57
    it('should work with calc values', () => {
      // @see http://caniuse.com/#feat=calc for IE issues with calc()
      componentWithTemplate(`<div fxFlex='calc(30vw - 10px)'></div>`);
      if (!(platform.FIREFOX || platform.EDGE)) {
        expectNativeEl(fixture).toHaveStyle({
          'box-sizing': 'border-box',
          'flex-grow': '1',
          'flex-shrink': '1',
          'flex-basis': 'calc(30vw - 10px)'
        }, styler);
      }
    });

    it('should work with calc without internal whitespaces', fakeAsync(() => {
      // @see http://caniuse.com/#feat=calc for IE issues with calc()
      componentWithTemplate('<div fxFlex="calc(75%-10px)"></div>');
      if (!(platform.FIREFOX || platform.EDGE)) {
        fixture.detectChanges();
        expectNativeEl(fixture).toHaveStyle({
          'box-sizing': 'border-box',
          'flex-grow': '1',
          'flex-shrink': '1',
          'flex-basis': 'calc(75% - 10px)' // correct version has whitespace
        }, styler);
      }
    }));

    it('should work with "auto" values', () => {
      componentWithTemplate(`<div fxFlex='auto'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 auto'
      }, styler);
    });
    it('should work with "nogrow" values', () => {
      componentWithTemplate(`<div fxFlex='nogrow'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '0 1 auto'
      }, styler);
    });
    it('should work with "grow" values', () => {
      componentWithTemplate(`<div fxFlex='grow'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 100%'
      }, styler);
    });
    it('should work with "initial" values', () => {
      componentWithTemplate(`<div fxFlex='initial'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '0 1 auto'
      }, styler);
    });
    it('should work with "noshrink" values', () => {
      componentWithTemplate(`<div fxFlex='noshrink'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 0 auto'
      }, styler);
    });
    it('should work with "none" values', () => {
      componentWithTemplate(`<div fxFlex='none'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '0 0 auto'
      }, styler);
    });

    it('should work with full-spec values', () => {
      componentWithTemplate(`<div fxFlex='1 2 0.9em'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 2 0.9em'
      }, styler);
    });
    it('should set a min-width when the shrink == 0', () => {
      componentWithTemplate(`<div fxFlex='1 0 37px'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 0 37px',
        'min-width': '37px',
        'box-sizing': 'border-box',
      }, styler);
    });
    it('should set a min-width and max-width when the grow == 0 and shrink == 0', () => {
      componentWithTemplate(`<div fxFlex='0 0 375px'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '0 0 375px',
        'max-width': '375px',
        'min-width': '375px',
        'box-sizing': 'border-box',
      }, styler);
    });

    it('should not set max-width to 69px when fxFlex="1 0 69px"', () => {
      componentWithTemplate(`<div fxFlex='1 0 69px'></div>`);
      expectNativeEl(fixture).not.toHaveStyle({
        'max-width': '69px',
      }, styler);
    });

    it('should not set a max-width when the shrink == 0', () => {
      componentWithTemplate(`<div fxFlex='1 0 303px'></div>`);
      fixture.detectChanges();
      let dom = fixture.debugElement.children[0];
      expectEl(dom).not.toHaveStyle({'max-width': '*'}, styler);
    });

    it('should not set min-width to 96px when fxFlex="0 1 96px"', () => {
      componentWithTemplate(`<div fxFlex='0 1 96px'></div>`);
      expectNativeEl(fixture).not.toHaveStyle({
        'min-width': '96px',
      }, styler);
    });

    it('should not set a min-width when the grow == 0', () => {
      componentWithTemplate(`<div fxFlex='0 1 313px'></div>`);
      fixture.detectChanges();
      let dom = fixture.debugElement.children[0];
      expectEl(dom).not.toHaveStyle({'min-width': '*'}, styler);
    });

    it('should set a min-width when basis is a Px value', () => {
      componentWithTemplate(`<div fxFlex='312px'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 312px',
        'max-width': '312px',
        'min-width': '312px'
      }, styler);
    });

    it('should set a min-width and max-width when basis is a rem value', () => {
      componentWithTemplate(`<div fxFlex='12rem'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 12rem',
        'max-width': '12rem',
        'min-width': '12rem'
      }, styler);
    });

    describe('', () => {

      it('should ignore fxLayout settings on same element', () => {
        componentWithTemplate(`
          <div fxLayout='column' fxFlex='37%'>
          </div>
        `);
        expectNativeEl(fixture)
            .not.toHaveStyle({
          'flex-direction': 'row',
          'flex': '1 1 37%',
          'max-height': '37%',
        }, styler);
      });

      it('should set max-height for `fxFlex="<%val>"` with parent using fxLayout="column" ', () => {
        let template = `
          <div fxLayout='column'>
            <div fxFlex='37%'></div>
          </div>
        `;

        componentWithTemplate(template);
        fixture.detectChanges();
        expectEl(queryFor(fixture, '[fxFlex]')[0])
            .toHaveStyle({
              'flex': '1 1 100%',
              'max-height': '37%',
            }, styler);
      });

      it('should set max-width for `fxFlex="<%val>"`', () => {
        componentWithTemplate(`<div fxFlex='37%'></div>`);
        expectNativeEl(fixture).toHaveStyle({
          'flex': '1 1 100%',
          'max-width': '37%',
        }, styler);
      });

      it('should set max-width for `fxFlex="2%"` usage', () => {
        componentWithTemplate(`<div fxFlex='2%'></div>`);
        expectNativeEl(fixture).toHaveStyle({
          'flex': '1 1 100%',
          'max-width': '2%',
        }, styler);
      });

    });
  });

  describe('with responsive features', () => {
    afterEach(() => {
      mediaController.clearAll();
    });

    it('should initialize the component with the smallest lt-xxx matching breakpoint', () => {
      componentWithTemplate(`
         <div fxFlex="25px"  fxFlex.lt-lg='50%' fxFlex.lt-sm='33%'>
         </div>
       `);

      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 25px',
        'max-width': '25px'
      }, styler);

      mediaController.activate('xl', true);
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 25px',
        'max-width': '25px'
      }, styler);

      mediaController.activate('md', true);
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 100%',
        'max-width': '50%'
      }, styler);

      mediaController.activate('xs', true);
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 100%',
        'max-width': '33%'
      }, styler);

    });

    it('should initialize the component with the largest gt-xxx matching breakpoint', () => {
      componentWithTemplate(`
        <div  fxFlex='auto'
              fxFlex.gt-xs='33%'
              fxFlex.gt-sm='50%' >
        </div>
      `);

      mediaController.activate('xl', true);
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 100%',
        'max-width': '50%'
      }, styler);

      mediaController.activate('sm', true);
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 100%',
        'max-width': '33%'
      }, styler);
    });

    it('should fallback properly to default flex values', () => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div fxFlex='auto' fxFlex.gt-sm='50'  >  </div>
          <div fxFlex='auto' fxFlex.gt-sm='24.4'>  </div>
          <div fxFlex='auto' fxFlex.gt-sm='25.6'>  </div>
        </div>
      `);

      mediaController.useOverlaps = true;
      mediaController.activate('sm');
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(3);
      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[1]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[2]).toHaveStyle({'flex': '1 1 auto'}, styler);

      mediaController.activate('xl');
      fixture.detectChanges();

      nodes = queryFor(fixture, '[fxFlex]');
      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 100%', 'max-height': '50%'}, styler);
      expectEl(nodes[1]).toHaveStyle({'flex': '1 1 100%', 'max-height': '24.4%'}, styler);
      expectEl(nodes[2]).toHaveStyle({'flex': '1 1 100%', 'max-height': '25.6%'}, styler);

      mediaController.activate('sm');
      fixture.detectChanges();

      nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(3);
      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[1]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[2]).toHaveStyle({'flex': '1 1 auto'}, styler);

      expectEl(nodes[0]).not.toHaveStyle({'max-height': '50%'}, styler);
      expectEl(nodes[1]).not.toHaveStyle({'max-height': '24.4%'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'max-height': '25.6%'}, styler);
      expectEl(nodes[0]).not.toHaveStyle({'max-height': '*'}, styler);
      expectEl(nodes[1]).not.toHaveStyle({'max-height': '*'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'max-height': '*'}, styler);
    });

    it('should fallback to the default layout from gt-md selectors', () => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div fxFlex='auto' fxFlex.gt-md='50'  >  </div>
          <div fxFlex='auto' fxFlex.gt-md='24.4'>  </div>
          <div fxFlex='auto' fxFlex.gt-md='25.6'>  </div>
        </div>
      `);

      mediaController.activate('md');
      fixture.detectChanges();
      let nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes.length).toEqual(3);
      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[1]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[2]).toHaveStyle({'flex': '1 1 auto'}, styler);

      mediaController.activate('sm');
      fixture.detectChanges();
      nodes = queryFor(fixture, '[fxFlex]');

      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[1]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[2]).toHaveStyle({'flex': '1 1 auto'}, styler);

      mediaController.activate('lg', true);
      fixture.detectChanges();
      nodes = queryFor(fixture, '[fxFlex]');

      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 100%', 'max-height': '50%'}, styler);
      expectEl(nodes[1]).toHaveStyle({'flex': '1 1 100%', 'max-height': '24.4%'}, styler);
      expectEl(nodes[2]).toHaveStyle({'flex': '1 1 100%', 'max-height': '25.6%'}, styler);
    });

    it('should fallback to the default layout from lt-md selectors', () => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div fxFlex='auto' fxFlex.lt-md='50'  >  </div>
        </div>
      `);

      mediaController.activate('md', true);
      fixture.detectChanges();
      let nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes.length).toEqual(1);
      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 auto'}, styler);

      mediaController.activate('sm', true);
      fixture.detectChanges();
      nodes = queryFor(fixture, '[fxFlex]');

      expectEl(nodes[0]).toHaveStyle({
        'flex': '1 1 100%',
        'max-height': '50%'
      }, styler);

      mediaController.activate('lg', true);
      fixture.detectChanges();
      nodes = queryFor(fixture, '[fxFlex]');

      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 auto'}, styler);
    });
  });

  describe('with API directive queries', () => {
    beforeEach(inject(
        [MatchMedia, StyleUtils, Platform, PLATFORM_ID],
        (_matchMedia: MockMatchMedia, _styler: StyleUtils, _platform: Platform,
     _platformId: Object) => {

      mediaController = _matchMedia;
      styler = _styler;
      platform = _platform;
      platformId = _platformId;

    }));

    afterEach(() => {
      mediaController.clearAll();
    });

    it('should query the ViewChild `fxLayout` directive properly', () => {
      fixture = TestBed.createComponent(TestQueryWithFlexComponent);
      fixture.detectChanges();

      const layout: DefaultLayoutDirective = fixture.debugElement.componentInstance.layout;

      expect(layout).toBeDefined();
      expect(layout.activatedValue).toBe('');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      }, styler);

      layout.activatedValue = 'column';
      expect(layout.activatedValue).toBe('column');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column'
      }, styler);
    });

    it('should query the ViewChild `fxFlex` directive properly', () => {
      fixture = TestBed.createComponent(TestQueryWithFlexComponent);
      fixture.detectChanges();

      const flex: DefaultFlexDirective = fixture.debugElement.componentInstance.flex;

      // Test for percentage value assignments
      expect(flex).toBeDefined();
      expect(flex.activatedValue).toBe('50%');

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(1);
      expectEl(nodes[0]).toHaveStyle({'max-width': '50%'}, styler);

      // Test for raw value assignments that are converted to percentages
      flex.activatedValue = '35';
      expect(flex.activatedValue).toBe('35');

      nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(1);
      expectEl(nodes[0]).toHaveStyle({'max-width': '35%'}, styler);

      // Test for pixel value assignments
      flex.activatedValue = '27.5px';
      expect(flex.activatedValue).toBe('27.5px');

      nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(1);
      expectEl(nodes[0]).toHaveStyle({'max-width': '27.5px'}, styler);
    });

    it('should restore `fxFlex` value after breakpoint activations', () => {
      fixture = TestBed.createComponent(TestQueryWithFlexComponent);
      fixture.detectChanges();

      const flex: DefaultFlexDirective = fixture.debugElement.componentInstance.flex;

      // Test for raw value assignments that are converted to percentages
      expect(flex).toBeDefined();
      flex.activatedValue = '35';
      expect(flex.activatedValue).toBe('35');

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(1);
      expectEl(nodes[0]).toHaveStyle({'max-width': '35%'}, styler);

      mediaController.activate('sm');
      fixture.detectChanges();

      // Test for breakpoint value changes
      expect(flex.activatedValue).toBe('71%');
      nodes = queryFor(fixture, '[fxFlex]');
      expectEl(nodes[0]).toHaveStyle({'max-width': '71%'}, styler);

      mediaController.activate('lg');
      fixture.detectChanges();

      // Confirm activatedValue was restored properly when `sm` deactivated
      expect(flex.activatedValue).toBe('35');
      nodes = queryFor(fixture, '[fxFlex]');
      expectEl(nodes[0]).toHaveStyle({'max-width': '35%'}, styler);
    });
  });

  describe('with flex token enabled', () => {
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FlexLayoutModule.withConfig({addFlexToParent: true, serverLoaded: true}),
        ],
        declarations: [TestFlexComponent, TestQueryWithFlexComponent],
        providers: [MockMatchMediaProvider]
      });
    });

    afterEach(() => {
      mediaController.clearAll();
    });

    it('should work with non-direct-parent fxLayouts', fakeAsync(() => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div class='test'>
            <div fxFlex='40px' fxFlex.gt-sm='50'></div>
          </div>
        </div>
      `);
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0];
      let parent = queryFor(fixture, '.test')[0];

      // The parent flex-direction not found;
      // A flex-direction should have been auto-injected to the parent...
      // fallback to 'row' and set child width styles accordingly
      expectEl(parent).toHaveStyle({'flex-direction': 'row'}, styler);
      expectEl(element).toHaveStyle({'min-width': '40px'}, styler);
      expectEl(element).not.toHaveStyle({'min-height': '40px'}, styler);

    }));
  });

  describe('with prefixes disabled', () => {
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FlexLayoutModule.withConfig({
            disableVendorPrefixes: true,
            serverLoaded: true,
          }),
        ],
        declarations: [TestFlexComponent, TestQueryWithFlexComponent],
        providers: [MockMatchMediaProvider]
      });
    });

    afterEach(() => {
      mediaController.clearAll();
    });

    it('should work with non-direct-parent fxLayouts', fakeAsync(() => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div class='test'>
            <div fxFlex='40px' fxFlex.gt-sm='50'></div>
          </div>
        </div>
      `);
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0];
      let parent = queryFor(fixture, '.test')[0];

      // The parent flex-direction not found;
      // A flex-direction should have been auto-injected to the parent...
      // fallback to 'row' and set child width styles accordingly
      expect(parent.nativeElement.getAttribute('style')).not.toContain('-webkit-flex-direction');
      expectEl(element).toHaveStyle({'min-width': '40px'}, styler);
      expectEl(element).not.toHaveStyle({'min-height': '40px'}, styler);

    }));
  });

  describe('with column basis zero disabled', () => {
    let styleBuilder: FlexStyleBuilder;

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FlexLayoutModule.withConfig({
            useColumnBasisZero: false,
            serverLoaded: true,
          }),
        ],
        declarations: [TestFlexComponent, TestQueryWithFlexComponent],
        providers: [MockMatchMediaProvider]
      });
    });

    afterEach(() => {
      mediaController.clearAll();
    });

    it('should set flex basis to auto', () => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div fxFlex></div>
        </div>
      `);
      styleBuilder = TestBed.get(FlexStyleBuilder);

      // Reset the cache because the layout config is only set at startup
      styleBuilder.shouldCache = false;
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0];
      expectEl(element).toHaveStyle({'flex': '1 1 auto'}, styler);
    });
  });

  describe('with custom builder', () => {
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FlexLayoutModule.withConfig({
            useColumnBasisZero: false,
            serverLoaded: true,
          }),
        ],
        declarations: [TestFlexComponent, TestQueryWithFlexComponent],
        providers: [
          MockMatchMediaProvider,
          {
            provide: FlexStyleBuilder,
            useClass: MockFlexStyleBuilder,
          }
        ]
      });
    });

    afterEach(() => {
      mediaController.clearAll();
    });

    it('should set flex basis to input', fakeAsync(() => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div fxFlex="25"></div>
        </div>
      `);
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0];
      expectEl(element).toHaveStyle({'flex': '1 1 30%'}, styler);
    }));
  });

});

@Injectable()
export class MockFlexStyleBuilder extends StyleBuilder {
  shouldCache = false;

  buildStyles(_input: string) {
    return {'flex': '1 1 30%'};
  }
}

// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-layout',
  template: `<span>PlaceHolder Template HTML</span>`
})
class TestFlexComponent {
  direction = 'column';
  els = new Array(5);
}

@Component({
  selector: 'test-query-with-flex',
  template: `
    <div fxLayout>
      <div fxFlex='50%' fxFlex.sm='71%'></div>
    </div>
  `
})
class TestQueryWithFlexComponent {
  @ViewChild(DefaultFlexDirective, {static: true}) flex!: DefaultFlexDirective;
  @ViewChild(DefaultLayoutDirective, {static: true}) layout!: DefaultLayoutDirective;
}
