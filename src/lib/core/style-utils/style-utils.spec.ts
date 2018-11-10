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

import {customMatchers} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, expectNativeEl} from '../../utils/testing/helpers';
import {StyleUtils} from './style-utils';

describe('styler', () => {
  let styler: StyleUtils;
  let fixture: ComponentFixture<any>;
  let platformId: Object;

  let componentWithTemplate = (template: string, styles?: any) => {
    fixture = makeCreateTestComponent(() => TestLayoutComponent)(template, styles);

    inject([StyleUtils, PLATFORM_ID], (_styler: StyleUtils, _platformId: Object) => {
      styler = _styler;
      platformId = _platformId;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [TestLayoutComponent],
    });
  });

  describe('testing display styles', () => {

    it('should not have a default for <div></div>', () => {
      componentWithTemplate(`
        <div></div>
      `);
      expectNativeEl(fixture).not.toHaveStyle({'display': 'block'}, styler);
    });

    it('should find to "display" for inline style <div></div>', () => {
      componentWithTemplate(`
        <div style="display: flex;"></div>
      `);
      expectNativeEl(fixture).toHaveCSS({'display': 'flex'}, styler);
    });

    it('should find `display` from html style element', () => {
      componentWithTemplate(`
        <style>
          div.special { display: inline-block; }
        </style>
        <div class="special"></div>
      `);

      // TODO(CaerusKaru): Domino is unable to detect this style
      if (!isPlatformServer(platformId)) {
        expectNativeEl(fixture).toHaveCSS({'display': 'inline-block'}, styler);
      }
    });

    it('should find `display` from component styles', () => {
      componentWithTemplate(`<div class="extra"></div>`, ['div.extra { display:table; }']);

      // TODO(CaerusKaru): Domino is unable to detect this style
      if (!isPlatformServer(platformId)) {
        expectNativeEl(fixture).toHaveCSS({'display': 'table'}, styler);
      }
    });
  });
});


// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-style-utils',
  template: `<span>PlaceHolder Template HTML</span>`
})
class TestLayoutComponent {
}
