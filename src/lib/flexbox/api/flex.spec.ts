/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, inject} from '@angular/core/testing';

import {BreakPointsProvider} from '../../media-query/breakpoints/break-points';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {FlexLayoutModule} from '../_module';

import {__platform_browser_private__} from '@angular/platform-browser';
import {customMatchers, expect } from '../../utils/testing/custom-matchers';
import {
  makeExpectDOMFrom,
  makeExpectDOMForQuery,
  makeCreateTestComponent,
  expectNativeEl
} from '../../utils/testing/helpers';

const getDOM = __platform_browser_private__.getDOM;
const isIE = !!document["documentMode"];

describe('flex directive', () => {
  let matchMedia : MockMatchMedia;
  let fixture: ComponentFixture<any>;
  let createTestComponent = makeCreateTestComponent(() => TestFlexComponent);
  let expectDOMFrom = makeExpectDOMFrom(() => TestFlexComponent);
  let expectDomForQuery = makeExpectDOMForQuery(() => TestFlexComponent);
  let componentWithTemplate = makeCreateTestComponent(() => TestFlexComponent);
  let activateMediaQuery = (alias, allowOverlaps=true) => {
    if ( !matchMedia ) {
      matchMedia = fixture.debugElement.injector.get(MatchMedia);
    }
    matchMedia.activate(alias, allowOverlaps);
  };

  beforeEach(() => { jasmine.addMatchers(customMatchers); });
  afterEach(() => {
    if (fixture) {
      fixture.debugElement.injector.get(MatchMedia).clearAll();
      fixture = null;
    }
  });

  describe('with static features', () => {

    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        imports: [CommonModule, FlexLayoutModule],
        declarations: [TestFlexComponent],
        providers: [
          BreakPointRegistry, BreakPointsProvider,
          {provide: MatchMedia, useClass: MockMatchMedia}
        ]
      });
    });

    it('should add correct styles for default `fxFlex` usage', () => {
      let fRef = componentWithTemplate(`<div fxFlex></div>`);
      fRef.detectChanges();

      let dom = fRef.debugElement.children[0].nativeElement;
      let isBox = getDOM().hasStyle(dom, 'box-sizing', 'border-box');
      let hasFlex =  getDOM().hasStyle(dom, 'flex', '1 1 1e-09px') ||         // IE
                     getDOM().hasStyle(dom, 'flex', '1 1 1e-9px') ||          // Chrome
                     getDOM().hasStyle(dom, 'flex', '1 1 0.000000001px') ||   // Safari
                     getDOM().hasStyle(dom, 'flex', '1 1 0px');

      expect(isBox).toBeTruthy();
      expect(hasFlex).toBeTruthy();
    });

    it('should add correct styles for `fxFlex="0%"` usage', () => {
      expectDOMFrom(`<div fxFlex="2%"></div>`).toHaveCssStyle({
        'max-width': '2%',
        'flex': '1 1 100%',
        'box-sizing': 'border-box',
      });
    });

    it('should work with percentage values', () => {
      expectDOMFrom(`<div fxFlex="37%"></div>`).toHaveCssStyle({
        'flex': '1 1 100%',
        'max-width': '37%',
        'box-sizing': 'border-box',
      });
    });
    it('should work with pixel values', () => {
      expectDOMFrom(`<div fxFlex="37px"></div>`).toHaveCssStyle({
        'flex': '1 1 37px',
        'box-sizing': 'border-box',
      });
    });
    it('should work with "1 0 auto" values', () => {
      expectDOMFrom(`<div fxFlex="1 0 auto"></div>`).toHaveCssStyle({
        'flex': '1 0 auto',
        'box-sizing': 'border-box',
      });
    });
    it('should work with "1 1 auto" values', () => {
      expectDOMFrom(`<div fxFlex="1 1 auto"></div>`).toHaveCssStyle({
        'flex': '1 1 auto',
        'box-sizing': 'border-box',
      });
    });
    it('should work with calc values', () => {
      // @see http://caniuse.com/#feat=calc for IE issues with calc()
      if ( !isIE ) {
        expectDOMFrom(`<div fxFlex="calc(30vw - 10px)"></div>`).toHaveCssStyle({
          'box-sizing': 'border-box',
          'flex': '1 1 calc(30vw - 10px)'
        });
      }
    });

    it('should work with "auto" values', () => {
      expectDOMFrom(`<div fxFlex="auto"></div>`).toHaveCssStyle({
        'flex': '1 1 auto'
      });
    });
    it('should work with "nogrow" values', () => {
      expectDOMFrom(`<div fxFlex="nogrow"></div>`).toHaveCssStyle({
        'flex': '0 1 auto'
      });
    });
    it('should work with "grow" values', () => {
      expectDOMFrom(`<div fxFlex="grow"></div>`).toHaveCssStyle({
        'flex': '1 1 100%'
      });
    });
    it('should work with "initial" values', () => {
      expectDOMFrom(`<div fxFlex="initial"></div>`).toHaveCssStyle({
        'flex': '0 1 auto'
      });
    });
    it('should work with "noshrink" values', () => {
      expectDOMFrom(`<div fxFlex="noshrink"></div>`).toHaveCssStyle({
        'flex': '1 0 auto'
      });
    });
    it('should work with "none" values', () => {
      expectDOMFrom(`<div fxFlex="none"></div>`).toHaveCssStyle({
        'flex': '0 0 auto'
      });
    });

    it('should work with full-spec values', () => {
      expectDOMFrom(`<div fxFlex="1 2 0.9em"></div>`).toHaveCssStyle({
        'flex': '1 2 0.9em'
      });
    });
    it('should set a min-width when the shrink == 0', () => {
      expectDOMFrom(`<div fxFlex="1 0 37px"></div>`).toHaveCssStyle({
        'flex': '1 0 37px',
        'min-width': '37px',
        'box-sizing': 'border-box',
      });
    });
    it('should set a min-width and max-width when the grow == 0 and shrink == 0', () => {
      expectDOMFrom(`<div fxFlex="0 0 375px"></div>`).toHaveCssStyle({
        'flex': '0 0 375px',
        'max-width': '375px',
        'min-width': '375px',
        'box-sizing': 'border-box',
      });
    });


    it('should not set max-width to 69px when fxFlex="1 0 69px"', () => {
      expectDOMFrom(`<div fxFlex="1 0 69px"></div>`).not.toHaveCssStyle({
        'max-width': '69px',
      });
    });

    it('should not set a max-width when the shrink == 0', () => {
      let fRef = componentWithTemplate(`<div fxFlex="1 0 303px"></div>`);
      fRef.detectChanges();

      let dom = fRef.debugElement.children[0].nativeElement;
      let maxWidthStyle = getDOM().getStyle(dom, 'max-width');

      expect(maxWidthStyle).toBeFalsy();
    });

    it('should not set min-width to 96px when fxFlex="0 1 96px"', () => {
      expectDOMFrom(`<div fxFlex="0 1 96px"></div>`).not.toHaveCssStyle({
        'min-width': '96px',
      });
    });

    it('should not set a min-width when the grow == 0', () => {
      let fRef = componentWithTemplate(`<div fxFlex="0 1 313px"></div>`);
      fRef.detectChanges();

      let dom = fRef.debugElement.children[0].nativeElement;
      let minWidthStyle = getDOM().getStyle(dom, 'min-width');

      expect(minWidthStyle).toBeFalsy();
    });

    it('should set a min-width when basis is a Px value', () => {
      expectDOMFrom(`<div fxFlex="312px"></div>`).toHaveCssStyle({
        'flex': '1 1 312px',
        'max-width': '312px',
        'min-width': '312px'
      });
    });

    describe('', () => {

      it('should ignore fxLayout settings on same element', () => {
        expectDOMFrom(`
          <div fxLayout="column" fxFlex="37%">
          </div>
        `)
            .not.toHaveCssStyle({
          'flex-direction': 'row',
          'max-height': '37%',
        });
      });

      it('should set max-height for `fxFlex="<%val>"` with parent using fxLayout="column" ', () => {
        let template = `
          <div fxLayout="column">
            <div fxFlex="37%"></div>
          </div>
        `;

        expectDomForQuery(template, "[fxFlex]")
            .toHaveCssStyle({
              'max-height': '37%',
            });
      });

      it('should set max-width for `fxFlex="<%val>"`', () => {
        expectDOMFrom(`<div fxFlex="37%"></div>`).toHaveCssStyle({
          'max-width': '37%',
        });
      });

      it('should set max-width for `fxFlex="2%"` usage', () => {
        expectDOMFrom(`<div fxFlex="2%"></div>`).toHaveCssStyle({
          'max-width': '2%',
        });
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
export class TestFlexComponent implements OnInit {
  public direction = "column";

  constructor() {
  }

  ngOnInit() {
  }
}



