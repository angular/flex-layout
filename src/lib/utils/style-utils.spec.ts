/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestBed} from '@angular/core/testing';

import {customMatchers} from './testing/custom-matchers';
import {makeExpectDOMFrom} from './testing/helpers';

describe('style-utils directive', () => {
  let expectDOMFrom = makeExpectDOMFrom(() => TestLayoutComponent);

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [TestLayoutComponent]
    });
  });

  describe('testing display styles', () => {

    it('should default to "display:block" for <div></div>', () => {
      expectDOMFrom(`
        <div></div>
      `).toHaveCSS({'display': 'block'});
    });

    it('should find to "display" for inline style <div></div>', () => {
      expectDOMFrom(`
        <div style="display: flex;"></div>
      `).toHaveCSS({'display': 'flex'});
    });

    it('should find `display` from html style element', () => {
      expectDOMFrom(`
        <style>
          div.special { display: inline-block; }
        </style>
        <div class="special"></div>
      `).toHaveCSS({'display': 'inline-block'});
    });

    it('should find `display` from component styles', () => {
      let expectStyledDOM = makeExpectDOMFrom(() => TestLayoutComponent, [
          'div.extra { display:table; }'
      ]);
      expectStyledDOM(`
        <div class="extra"></div>
      `).toHaveCSS({'display': 'table'});
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
export class TestLayoutComponent {
}
