/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  Input,
  OnInit,
  OnChanges,
  ElementRef,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {BaseFxDirective} from './base';
import {MediaMonitor} from '../../media-query/media-monitor';
import {ɵgetDOM as getDom} from '@angular/platform-browser';

/**
 * Directive that injects -in a container <picture> element- <source> elements with media and
 * srcset attributes.
 * <source> elemets are sorted according to the related media query : from largest to smallest
 *
 * For browsers not supporting the <picture> element, the Picturefill polyfill is still needed.
 *
 * @see https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture
 * @see https://www.html5rocks.com/en/tutorials/responsive/picture-element/
 * @see https://caniuse.com/#search=picture
 * @see http://scottjehl.github.io/picturefill/
 */
@Directive({
  selector: `
  [srcset],
  [srcset.xs], [srcset.sm], [srcset.md], [srcset.lg], [srcset.xl],
  [srcset.lt-sm], [srcset.lt-md], [srcset.lt-lg], [srcset.lt-xl],
  [srcset.gt-xs], [srcset.gt-sm], [srcset.gt-md], [srcset.gt-lg]
`
})
export class ImgSrcsetDirective extends BaseFxDirective implements OnInit, OnChanges {

  /** Reference to injected source elements to be used when there is a need to update their
   * attributes. */
  private _registrySourceElements: {[input: string]: any} = {};

  /**
   * Intercept srcset assignment so we cache the default static value.
   * When the responsive breakpoint deactivates,it is possible that fallback static
   * value (which is used to clear the deactivated value) will be used
   * (if no other breakpoints activate)
   */
  @Input('srcset')
  set srcsetBase(val) {
    this._cacheInput('srcset', val);
  }

  /* tslint:disable */
  @Input('srcset.xs') set srcsetXs(val) {this._cacheInput('srcsetXs', val);}
  @Input('srcset.sm') set srcsetSm(val) {this._cacheInput('srcsetSm', val);};
  @Input('srcset.md') set srcsetMd(val) {this._cacheInput('srcsetMd', val);};
  @Input('srcset.lg') set srcsetLg(val) {this._cacheInput('srcsetLg', val);};
  @Input('srcset.xl') set srcsetXl(val) {this._cacheInput('srcsetXl', val);};

  @Input('srcset.lt-sm') set srcsetLtSm(val) {this._cacheInput('srcsetLtSm', val);};
  @Input('srcset.lt-md') set srcsetLtMd(val) {this._cacheInput('srcsetLtMd', val);};
  @Input('srcset.lt-lg') set srcsetLtLg(val) {this._cacheInput('srcsetLtLg', val);};
  @Input('srcset.lt-xl') set srcsetLtXl(val) {this._cacheInput('srcsetLtXl', val);};

  @Input('srcset.gt-xs') set srcsetGtXs(val) {this._cacheInput('srcsetGtXs', val);};
  @Input('srcset.gt-sm') set srcsetGtSm(val) {this._cacheInput('srcsetGtSm', val);};
  @Input('srcset.gt-md') set srcsetGtMd(val) {this._cacheInput('srcsetGtMd', val);};
  @Input('srcset.gt-lg') set srcsetGtLg(val) {this._cacheInput('srcsetGtLg', val);};

  /* tslint:enable */
  constructor(elRef: ElementRef, renderer: Renderer2, monitor: MediaMonitor) {
    super(monitor, elRef, renderer);
  }

  /**
   * Inject <source> elements once based on the used input properties
   */
  ngOnInit() {
    // build ResponsiveActivation proxy. There is no need to subsribe to mediaQuery changes as it is
    // up to the browser to use the relevant injected <source> element
    this._listenForMediaQueryChanges('srcset', '', () => {});
    this._injectSourceElements();
  }

  /**
   * Update the srcset of the relevant injected <source> elements with the new data-bound input
   * properties. <source> elements are injected once through ngOnInit
   */
  ngOnChanges(changes: SimpleChanges) {
    Object.keys(changes).forEach(key => {
      if (!changes[key].firstChange && this._registrySourceElements[key]) {
      this._renderer.setAttribute(
        this._registrySourceElements[key], 'srcset', this._queryInput(key));
      }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    // remove reference to dom elements to avoid memory leaks
    this._registrySourceElements = null;
  }

  /**
   * Inject source elements based on their related media queries from largest to smallest.
   * Keep the <img> element as the last child of the <picture> element: this necessary as the
   * browser process the children of <picture> and uses the first one with the acceptable media
   * query. <img> is defaulted to when no <source> element matches (and providing in the same time
   * backward compatibility)
   */
  protected _injectSourceElements() {
    let isBrowser = getDom().supportsDOMEvents();
    if (!this._mqActivation || !isBrowser) {
      return;
    }
    this._mqActivation.registryFromLargest.forEach(bpX => {
      const sourceElt = this._renderer.createElement('source');
      this._registrySourceElements[bpX.key] = sourceElt;

      this._renderer.insertBefore(this.parentElement, sourceElt, this.nativeElement);
      this._renderer.setAttribute(sourceElt, 'media', bpX.mediaQuery);
      this._renderer.setAttribute(sourceElt, 'srcset', this._queryInput(bpX.key));
    });
  }

}
