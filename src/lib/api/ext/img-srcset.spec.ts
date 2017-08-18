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

import {DEFAULT_BREAKPOINTS_PROVIDER} from '../../media-query/breakpoints/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {FlexLayoutModule} from '../../module';

import {customMatchers} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, queryFor} from '../../utils/testing/helpers';
import {expect} from '../../utils/testing/custom-matchers';
import {_dom as _} from '../../utils/testing/dom-tools';

const SRCSET_URLS_MAP = {
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

describe('img-srcset directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let breakpoints: BreakPointRegistry;

  let componentWithTemplate = (template: string) => {
    fixture = makeCreateTestComponent(() => TestSrcsetComponent)(template);

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
      declarations: [TestSrcsetComponent],
      providers: [
        BreakPointRegistry, DEFAULT_BREAKPOINTS_PROVIDER,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });

  it('should work without a <picture> wrapper element', () => {
    const template = `
      <img src="${DEFAULT_SRC}" srcset="${SRCSET_URLS_MAP['gt-xs'][0]}">
    `;
    componentWithTemplate(template);
    fixture.detectChanges();

    let sources = queryFor(fixture, 'source');
    let pictures = queryFor(fixture, 'picture');

    expect(sources.length).toBe(0);
    expect(pictures.length).toBe(0);
  });

  it('should preserve the static img.srcset attribute', () => {
    const template = `
      <img srcset="https://dummyimage.com/300x300/c72538/ffffff.png">
    `;
    componentWithTemplate(template);
    fixture.detectChanges();

    const img = queryFor(fixture, 'img')[0].nativeElement;
    expect(img).toHaveAttributes({
      srcset: 'https://dummyimage.com/300x300/c72538/ffffff.png'
    });

  });

  it('should preserve bindable img.srcset attribute', () => {
    const template = `
       <img src="${DEFAULT_SRC}" [srcset]="lgSrcSet">
    `;
    componentWithTemplate(template);
    fixture.detectChanges();

    let sources = queryFor(fixture, 'source');
    let pictures = queryFor(fixture, 'picture');
    let img = queryFor(fixture, 'img')[0].nativeElement;

    expect(sources.length).toBe(0);
    expect(pictures.length).toBe(0);
    expect(img).toBeDefined();
    expect(img).toHaveAttributes({
      src: 'https://dummyimage.com/300x300/c72538/ffffff.png',
      srcset: fixture.componentInstance.lgSrcSet
    });
  });

  it('should work when no "srcset" directive is used', () => {
    const template = `
        <picture>
          <img style="width:auto;" src="${DEFAULT_SRC}" >
        </picture>
    `;
    componentWithTemplate(template);
    fixture.detectChanges();

    const nodes = queryFor(fixture, 'source');
    const pictureElt = queryFor(fixture, 'picture')[0].nativeElement;

    expect(nodes.length).toBe(0);
    expect(pictureElt.children.length).toEqual(1);
    expect(_.tagName(_.lastElementChild(pictureElt))).toEqual('IMG');
  });

  it('should keep img as the last child tag of <picture>', () => {
    const template = `
      <div>
        <picture>
          <img  style="width:auto;"
                src="${DEFAULT_SRC}"
                srcset.gt-xs="${SRCSET_URLS_MAP['gt-xs'][0]}"
                srcset.lt-lg="${SRCSET_URLS_MAP['lt-lg'][0]}" >
        </picture>
      </div>
    `;
    componentWithTemplate(template);
    fixture.detectChanges();

    const pictureElt = queryFor(fixture, 'picture')[0].nativeElement;

    expect(_.tagName(_.lastElementChild(pictureElt))).toEqual('IMG');
  });

  it('should inject source elements from largest to smallest corresponding media queries', () => {
    const template = `
      <picture>
          <img  style="width:auto;"
                src="${DEFAULT_SRC}"
                srcset.xs="${SRCSET_URLS_MAP['xs'][0]}"
                srcset.lg="${SRCSET_URLS_MAP['lg'][0]}"
                srcset.md="${SRCSET_URLS_MAP['md'][0]}" >
      </picture>
    `;
    componentWithTemplate(template);
    fixture.detectChanges();

    const nodes = queryFor(fixture, 'source');

    expect(nodes.length).toBe(3);
    expect(nodes[0].nativeElement).toHaveAttributes({
      srcset: `${SRCSET_URLS_MAP['lg'][0]}`,
      media: breakpoints.findByAlias('lg').mediaQuery
    });
    expect(nodes[1].nativeElement).toHaveAttributes({
      srcset: `${SRCSET_URLS_MAP['md'][0]}`,
      media: breakpoints.findByAlias('md').mediaQuery
    });
    expect(nodes[2].nativeElement).toHaveAttributes({
      srcset: `${SRCSET_URLS_MAP['xs'][0]}`,
      media: breakpoints.findByAlias('xs').mediaQuery
    });
  });

  it('should update source elements srcset values when srcset input properties change', () => {
    const template = `
      <picture>
          <img  style="width:auto;"
                src="${DEFAULT_SRC}"
                [srcset.xs]="xsSrcSet"
                [srcset.lg]="lgSrcSet"
                [srcset.md]="mdSrcSet" >
      </picture>
    `;
    componentWithTemplate(template);
    fixture.detectChanges();

    fixture.componentInstance.xsSrcSet = SRCSET_URLS_MAP['xs'][1];
    fixture.componentInstance.mdSrcSet = SRCSET_URLS_MAP['md'][1];
    fixture.componentInstance.lgSrcSet = SRCSET_URLS_MAP['lg'][1];
    fixture.detectChanges();

    let nodes = queryFor(fixture, 'source');

    expect(nodes.length).toBe(3);
    expect(nodes[0].nativeElement).toHaveAttributes({
      srcset: `${SRCSET_URLS_MAP['lg'][1]}`,
      media: breakpoints.findByAlias('lg').mediaQuery
    });
    expect(nodes[1].nativeElement).toHaveAttributes({
      srcset: `${SRCSET_URLS_MAP['md'][1]}`,
      media: breakpoints.findByAlias('md').mediaQuery
    });
    expect(nodes[2].nativeElement).toHaveAttributes({
      srcset: `${SRCSET_URLS_MAP['xs'][1]}`,
      media: breakpoints.findByAlias('xs').mediaQuery
    });
  });

  it('should work with overlapping breakpoints', () => {
    const template = `
      <picture>
          <img  style="width:auto;"
                src="${DEFAULT_SRC}"
                srcset.lt-xl="${SRCSET_URLS_MAP['lt-xl'][0]}"
                srcset.xs="${SRCSET_URLS_MAP['xs'][0]}"
                srcset.lt-lg="${SRCSET_URLS_MAP['lt-lg'][0]}" >
      </picture>
    `;
    componentWithTemplate(template);
    fixture.detectChanges();

    let nodes = queryFor(fixture, 'source');
    expect(nodes[0].nativeElement).toHaveAttributes({
      srcset: `${SRCSET_URLS_MAP['lt-xl'][0]}`,
      media: breakpoints.findByAlias('lt-xl').mediaQuery
    });
    expect(nodes[1].nativeElement).toHaveAttributes({
      srcset: `${SRCSET_URLS_MAP['lt-lg'][0]}`,
      media: breakpoints.findByAlias('lt-lg').mediaQuery
    });
    expect(nodes[2].nativeElement).toHaveAttributes({
      srcset: `${SRCSET_URLS_MAP['xs'][0]}`,
      media: breakpoints.findByAlias('xs').mediaQuery
    });
  });

  describe('with responsive api', () => {

    it('should work with a isolated image element and responsive srcset(s)', () => {
      componentWithTemplate(`
        <img [srcset]="xsSrcSet"
             [srcset.md]="mdSrcSet">
      `);

      let img = queryFor(fixture, 'img')[0].nativeElement;

      matchMedia.activate('md');
      fixture.detectChanges();
      expect(img).toBeDefined();
      expect(img).toHaveAttributes({
        src: fixture.componentInstance.mdSrcSet
      });

      // When activating an unused breakpoint, fallback to default [srcset] value
      matchMedia.activate('xl');
      fixture.detectChanges();
      expect(img).toHaveAttributes({
        src: fixture.componentInstance.xsSrcSet
      });
    });

    it('should work use [src] if default [srcset] is not defined', () => {
      componentWithTemplate(`
         <img src="${DEFAULT_SRC}"
              [srcset.md]="mdSrcSet">
       `);
      fixture.detectChanges();
      let img = queryFor(fixture, 'img')[0].nativeElement;

      matchMedia.activate('md');
      fixture.detectChanges();

      expect(img).toBeDefined();
      expect(img).toHaveAttributes({
        src: fixture.componentInstance.mdSrcSet
      });

      // When activating an unused breakpoint, fallback to default [srcset] value
      matchMedia.activate('xl');
      fixture.detectChanges();
      expect(img).toHaveAttributes({
        src: DEFAULT_SRC
      });
    });

    it('should work with lookup from `src` when the default `srcset` is not defined', () => {
      componentWithTemplate(`
        <picture>
            <img  src="https://dummyimage.com/400x200/c7c224/000.png&text=default"
                  srcset.md="https://dummyimage.com/500x200/76c720/fff.png&text=md">
        </picture>
      `);
      matchMedia.activate('md');
      fixture.detectChanges();

      let sources = queryFor(fixture, 'source');
      let defaultSourceEl = sources[sources.length - 1].nativeElement;
      expect(defaultSourceEl).toHaveAttributes({
        srcset: 'https://dummyimage.com/500x200/76c720/fff.png&text=md'
      });

      // When activating an unused breakpoint, fallback to default [srcset] value
      matchMedia.activate('xs');
      fixture.detectChanges();
      expect(defaultSourceEl).toHaveAttributes({
        srcset: 'https://dummyimage.com/400x200/c7c224/000.png&text=default'
      });
    });
  });
});

// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-srcset-api',
  template: ''
})
export class TestSrcsetComponent implements OnInit {
  xsSrcSet: string;
  mdSrcSet: string;
  lgSrcSet: string;

  constructor() {
    this.xsSrcSet = SRCSET_URLS_MAP['xs'][0];
    this.mdSrcSet = SRCSET_URLS_MAP['md'][0];
    this.lgSrcSet = SRCSET_URLS_MAP['lg'][0];
  }

  ngOnInit() {
  }
}
