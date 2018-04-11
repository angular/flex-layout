/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformServer} from '@angular/common';
import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {DIR_DOCUMENT} from '@angular/cdk/bidi';
import {SERVER_TOKEN, StyleUtils} from '@angular/flex-layout/core';

import {FlexModule} from '../module';
import {customMatchers} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent,
  queryFor,
  expectEl,
  expectNativeEl,
} from '../../utils/testing/helpers';

describe('flex-offset directive', () => {
  let fixture: ComponentFixture<any>;
  let fakeDocument: {body: {dir?: string}, documentElement: {dir?: string}};
  let styler: StyleUtils;
  let platformId: Object;
  let componentWithTemplate = (template: string) => {
    fixture = makeCreateTestComponent(() => TestFlexComponent)(template);

    inject([StyleUtils, PLATFORM_ID],
      (_styler: StyleUtils, _platformId: Object) => {
      styler = _styler;
      platformId = _platformId;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    fakeDocument = {body: {}, documentElement: {}};

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexModule],
      declarations: [TestFlexComponent],
      providers: [
        {provide: DIR_DOCUMENT, useValue: fakeDocument},
        {provide: SERVER_TOKEN, useValue: true}
      ]
    });
  });

  describe('with static features', () => {

    it('should add correct styles for default `fxFlexOffset` usage', () => {
      componentWithTemplate(`<div fxFlexOffset='32px' fxFlex></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0];
      expectEl(dom).toHaveStyle({'margin-left': '32px'}, styler);
      expectEl(dom).toHaveStyle({'flex': '1 1 0%'}, styler);
    });


    it('should work with percentage values', () => {
      componentWithTemplate(`<div fxFlexOffset='17' fxFlex='37'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 100%',
        'box-sizing': 'border-box',
        'margin-left': '17%'
      }, styler);
    });

    it('should work fxLayout parents', () => {
      componentWithTemplate(`
        <div fxLayout='column' class='test'>
          <div fxFlex='30px' fxFlexOffset='17px'>  </div>
        </div>
      `);
      fixture.detectChanges();
      let parent = queryFor(fixture, '.test')[0];
      let element = queryFor(fixture, '[fxFlex]')[0];

      // parent flex-direction found with 'column' with child height styles
      expectEl(parent).toHaveStyle({'flex-direction': 'column', 'display': 'flex'}, styler);
      expectEl(element).toHaveStyle({'margin-top': '17px'}, styler);
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
      let parent = queryFor(fixture, '.test')[0];
      let element = queryFor(fixture, '[fxFlex]')[0];

      // TODO(CaerusKaru): Domino is unable to detect these styles properly
      if (!isPlatformServer(platformId)) {
        // parent flex-direction found with 'column' with child height styles
        expectEl(parent).toHaveStyle({'flex-direction': 'column', 'display': 'flex'}, styler);
        expectEl(element).toHaveStyle({'margin-top': '41px'}, styler);
      }
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
      let element = queryFor(fixture, '[fxFlex]')[0];
      let parent = queryFor(fixture, '.parent')[0];

      // parent flex-direction found with 'column'; set child with height styles
      expectEl(element).toHaveStyle({'margin-top': '21%'}, styler);
      expectEl(parent).toHaveStyle({'flex-direction': 'column'}, styler);
    });

    it('should ignore fxLayout settings on same element', () => {
      componentWithTemplate(`
          <div fxLayout='column' fxFlex='37%' fxFlexOffset='52px' >
          </div>
        `);
      expectNativeEl(fixture).not.toHaveStyle({
        'flex-direction': 'row',
        'flex': '1 1 100%',
        'margin-left': '52px',
      }, styler);
    });

    it('should set margin-right for rtl layouts on document body', () => {
      fakeDocument.body.dir = 'rtl';
      componentWithTemplate(`
        <div fxLayout='row' class='test'>
          <div fxFlex='30px' fxFlexOffset='17px'>  </div>
        </div>
      `);
      fixture.detectChanges();

      let element = queryFor(fixture, '[fxFlex]')[0];
      expectEl(element).toHaveStyle({'margin-right': '17px'}, styler);
    });

    it('should set margin-right for rtl layouts on documentElement', () => {
      fakeDocument.documentElement.dir = 'rtl';
      componentWithTemplate(`
        <div fxLayout='row' class='test'>
          <div fxFlex='30px' fxFlexOffset='17px'>  </div>
        </div>
      `);
      fixture.detectChanges();

      let element = queryFor(fixture, '[fxFlex]')[0];
      expectEl(element).toHaveStyle({'margin-right': '17px'}, styler);
    });

    it('should set margin-left for ltr layouts', () => {
      componentWithTemplate(`
        <div fxLayout='row' class='test'>
          <div fxFlex='30px' fxFlexOffset='17px'>  </div>
        </div>
      `);
      fixture.detectChanges();

      let element = queryFor(fixture, '[fxFlex]')[0];
      expectEl(element).toHaveStyle({'margin-left': '17px'}, styler);
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
class TestFlexComponent {
  direction = 'column';
}


