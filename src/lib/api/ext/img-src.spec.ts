/**
 * @license
 * Copyright Google LLC All Rights Reserved.
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

import {customMatchers} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, queryFor} from '../../utils/testing/helpers';
import {expect} from '../../utils/testing/custom-matchers';
import {_dom as _} from '../../utils/testing/dom-tools';

const SRC_URLS = {
  'xs': [
    'https://dummyimage.com/300x200/c7751e/fff.png',
    'https://dummyimage.com/300x200/c7751e/000.png'
  ],
  'gt-xs': [
    'https://dummyimage.com/400x250/c7c224/fff.png',
    'https://dummyimage.com/400x250/c7c224/000.png'
  ],
  'md': [
    'https://dummyimage.com/500x300/76c720/fff.png',
    'https://dummyimage.com/500x300/76c720/000.png'
  ],
  'lt-lg': [
    'https://dummyimage.com/600x350/25c794/fff.png',
    'https://dummyimage.com/600x350/25c794/000.png'
  ],
  'lg': [
    'https://dummyimage.com/700x400/258cc7/fff.png',
    'https://dummyimage.com/700x400/258cc7/000.png'
  ],
  'lt-xl': [
    'https://dummyimage.com/800x500/b925c7/ffffff.png',
    'https://dummyimage.com/800x500/b925c7/000.png'
  ]
};
const DEFAULT_SRC = 'https://dummyimage.com/300x300/c72538/ffffff.png';

describe('img-src directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let breakpoints: BreakPointRegistry;

  let componentWithTemplate = (template: string) => {
    fixture = makeCreateTestComponent(() => TestSrcComponent)(template);

    inject([MatchMedia, BreakPointRegistry],
        (_matchMedia: MockMatchMedia, _breakpoints: BreakPointRegistry) => {
          matchMedia = _matchMedia;
          breakpoints = _breakpoints;
        })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule],
      declarations: [TestSrcComponent],
      providers: [
        BreakPointRegistry, DEFAULT_BREAKPOINTS_PROVIDER,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });

  describe('with static api', () => {
    it('should preserve the static src attribute', () => {
      let url = 'https://dummyimage.com/300x300/c72538/ffffff.png';
      componentWithTemplate(`
        <img src="${url}">
      `);
      const img = queryFor(fixture, 'img')[0].nativeElement;

      fixture.detectChanges();
      expect(_.getAttribute( img,  'src')).toEqual(url);
    });

    it('should work with empty src attributes', () => {
      componentWithTemplate(`
        <img src="">
      `);
      const img = queryFor(fixture, 'img')[0].nativeElement;

      fixture.detectChanges();
      expect(img).toHaveAttributes({
        src: ''
      });
    });

    it('should work standard input bindings', () => {
      componentWithTemplate(`
        <img [src]="defaultSrc" [src.xs]="xsSrc">
      `);
      const img = queryFor(fixture, 'img')[0].nativeElement;

      fixture.detectChanges();
      expect(img).toHaveAttributes({
        src: 'https://dummyimage.com/300x300/c72538/ffffff.png'
      });

      let url = 'https://dummyimage.com/700x400/258cc7/fff.png';
      fixture.componentInstance.defaultSrc = url;
      fixture.detectChanges();
      expect(img).toHaveAttributes({ src: url });

    });

    it('should work when `src` value is not defined', () => {
      componentWithTemplate(`
        <img src >
      `);

      const img = queryFor(fixture, 'img')[0].nativeElement;
      fixture.detectChanges();
      expect(img).toHaveAttributes({
        src: ''
      });
    });

    it('should only work with "<img>" elements.', () => {
      componentWithTemplate(`
        <iframe src.xs="none.png" >
      `);

      const img = queryFor(fixture, 'iframe')[0].nativeElement;
      fixture.detectChanges();
      expect(img).not.toHaveAttributes({
        src: ''
      });
    });

  });

  describe('with responsive api', () => {

    it('should work with a isolated image element and responsive srcs', () => {
      componentWithTemplate(`
        <img [src]="xsSrc"
             [src.md]="mdSrc">
      `);
      fixture.detectChanges();

      let img = queryFor(fixture, 'img')[0].nativeElement;

      matchMedia.activate('md');
      fixture.detectChanges();
      expect(img).toBeDefined();
      expect(img).toHaveAttributes({
        src: SRC_URLS['md'][0]
      });

      // When activating an unused breakpoint, fallback to default [src] value
      matchMedia.activate('xl');
      fixture.detectChanges();
      expect(img).toHaveAttributes({
        src: SRC_URLS['xs'][0]
      });
    });

    it('should work if default [src] is not defined', () => {
      componentWithTemplate(`
         <img [src.md]="mdSrc">
       `);
      fixture.detectChanges();
      matchMedia.activate('md');
      fixture.detectChanges();

      let img = queryFor(fixture, 'img')[0].nativeElement;
      expect(img).toBeDefined();
      expect(img).toHaveAttributes({
        src: SRC_URLS['md'][0]
      });

      // When activating an unused breakpoint, fallback to default [src] value
      matchMedia.activate('xl');
      fixture.detectChanges();
      expect(img).toHaveAttributes({
        src: ''
      });
    });

  });
});

// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-src-api',
  template: ''
})
export class TestSrcComponent {
  defaultSrc = '';
  xsSrc = '';
  mdSrc = '';
  lgSrc = '';

  constructor() {
    this.defaultSrc = DEFAULT_SRC;
    this.xsSrc = SRC_URLS['xs'][0];
    this.mdSrc = SRC_URLS['md'][0];
    this.lgSrc = SRC_URLS['lg'][0];

  }
}


