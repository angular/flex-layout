/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, inject} from '@angular/core/testing';

import {DEFAULT_BREAKPOINTS_PROVIDER} from '../../media-query/breakpoints/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {FlexLayoutModule} from '../../module';

import {customMatchers, expect} from '../../utils/testing/custom-matchers';
import {_dom as _} from '../../utils/testing/dom-tools';

import {
  makeExpectDOMFrom,
  makeCreateTestComponent,
  queryFor
} from '../../utils/testing/helpers';

describe('flex directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let expectDOMFrom = makeExpectDOMFrom(() => TestFlexComponent);
  let componentWithTemplate = (template: string) => {
    fixture = makeCreateTestComponent(() => TestFlexComponent)(template);

    inject([MatchMedia], (_matchMedia: MockMatchMedia) => {
      matchMedia = _matchMedia;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule],
      declarations: [TestFlexComponent],
      providers: [
        BreakPointRegistry, DEFAULT_BREAKPOINTS_PROVIDER,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });

  describe('with static features', () => {

    it('should add correct styles for default `fxFlexOffset` usage', () => {
      componentWithTemplate(`<div fxFlexOffset='32px' fxFlex></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0].nativeElement;
      let isBox = _.hasStyle(dom, 'margin-left', '32px');
      let hasFlex = _.hasStyle(dom, 'flex', '1 1 1e-09px') ||         // IE
          _.hasStyle(dom, 'flex', '1 1 1e-9px') ||          // Chrome
          _.hasStyle(dom, 'flex', '1 1 0.000000001px') ||   // Safari
          _.hasStyle(dom, 'flex', '1 1 0px');

      expect(isBox).toBeTruthy();
      expect(hasFlex).toBe(true);
    });


    it('should work with percentage values', () => {
      expectDOMFrom(`<div fxFlexOffset='17' fxFlex='37'></div>`).toHaveStyle({
        'flex': '1 1 100%',
        'box-sizing': 'border-box',
        'margin-left': '17%'
      });
    });

    it('should work fxLayout parents', () => {
      componentWithTemplate(`
        <div fxLayout='column' class='test'>
          <div fxFlex='30px' fxFlexOffset='17px'>  </div>
        </div>
      `);
      fixture.detectChanges();
      let parent = queryFor(fixture, '.test')[0].nativeElement;
      let element = queryFor(fixture, '[fxFlex]')[0].nativeElement;

      // parent flex-direction found with 'column' with child height styles
      expect(parent).toHaveStyle({'flex-direction': 'column', 'display': 'flex'});
      expect(element).toHaveStyle({'margin-top': '17px'});
    });

    it('should CSS stylesheet and not inject flex-direction on parent', () => {
      componentWithTemplate(`
        <style>
          .test { flex-direction:column; display: flex; }
        </style>
        <div class='test'>
          <div fxFlexOffset='41px' fxFlex='30px'></div>
        </div>
      `);

      fixture.detectChanges();
      let parent = queryFor(fixture, '.test')[0].nativeElement;
      let element = queryFor(fixture, '[fxFlex]')[0].nativeElement;

      // parent flex-direction found with 'column' with child height styles
      expect(parent).toHaveStyle({'flex-direction': 'column', 'display': 'flex'});
      expect(element).toHaveStyle({'margin-top': '41px'});
    });

    it('should work with styled-parent flex directions', () => {
      componentWithTemplate(`
        <div fxLayout='row'>
          <div style='flex-direction:column' class='parent'>
            <div fxFlex='60px' fxFlexOffset='21'>  </div>
          </div>
        </div>
      `);
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0].nativeElement;
      let parent = queryFor(fixture, '.parent')[0].nativeElement;

      // parent flex-direction found with 'column'; set child with height styles
      expect(element).toHaveStyle({'margin-top': '21%'});
      expect(parent).toHaveStyle({'flex-direction': 'column'});
    });

    it('should ignore fxLayout settings on same element', () => {
      expectDOMFrom(`
          <div fxLayout='column' fxFlex='37%' fxFlexOffset='52px' >
          </div>
        `)
          .not.toHaveStyle({
        'flex-direction': 'row',
        'flex': '1 1 100%',
        'margin-left': '52px',
      });
    });

  });

});


// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-component-shell',
  template: `<span>PlaceHolder Template HTML</span>`
})
export class TestFlexComponent {
  public direction = 'column';
}


