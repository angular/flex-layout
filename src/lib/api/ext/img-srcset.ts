/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import {ɵgetDOM as getDom} from '@angular/platform-browser';

import {BaseFxDirective} from '../core/base';
import {MediaMonitor} from '../../media-query/media-monitor';
import {BreakPointX} from '../core/responsive-activation';
import {extendObject} from '../../utils/object-extend';

const DEFAULT_SRCSET = 'srcset';

/**
 * This directive provides a responsive API for the HTML 'srcset' attribute; and
 * supports two (2) uses:
 *    1) standalone <img>, or
 *    2) nested <picture><img></picture>.
 *
 * In both cases the expression/value assigned is simply the appropriate image url.
 * e.g.
 *      <img srcset="defaultScene.jpg" srcset.xs="mobileScene.jpg"></img>
 *      <picture>
 *        <img srcset="defaultScene.jpg" srcset.xs="mobileScene.jpg"></img>
 *      </picture>
 *
 * For standalone (1) usages, this directive will update the img.src property with the responsive
 * activated input value. For picture (2) usages, this directive will inject
 * [into the parent <picture> element] <source> elements with media and srcset attributes.
 * Note that <source> elements are sorted according to the related media query :
 *      from largest to smallest
 *
 * > For browsers not supporting the <picture> element, the Picturefill polyfill is still needed.
 *
 * @see https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture
 * @see https://www.html5rocks.com/en/tutorials/responsive/picture-element/
 * @see https://caniuse.com/#search=picture
 * @see http://scottjehl.github.io/picturefill/
 */
@Directive({
  selector: `
  img[srcset],
  img[srcset.xs], img[srcset.sm], img[srcset.md], img[srcset.lg], img[srcset.xl],
  img[srcset.lt-sm], img[srcset.lt-md], img[srcset.lt-lg], img[srcset.lt-xl],
  img[srcset.gt-xs], img[srcset.gt-sm], img[srcset.gt-md], img[srcset.gt-lg]
`
})
export class ImgSrcsetDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  /**
   * Intercept srcset assignment so we cache the default static value.
   * When the responsive breakpoint deactivates,it is possible that fallback static
   * value (which is used to clear the deactivated value) will be used
   * (if no other breakpoints activate)
   */
  @Input('srcset')        set srcsetBase(val) { this._cacheInput('srcset', val);    }

  @Input('srcset.xs')     set srcsetXs(val)   { this._cacheInput('srcsetXs', val);  }
  @Input('srcset.sm')     set srcsetSm(val)   { this._cacheInput('srcsetSm', val);  }
  @Input('srcset.md')     set srcsetMd(val)   { this._cacheInput('srcsetMd', val);  }
  @Input('srcset.lg')     set srcsetLg(val)   { this._cacheInput('srcsetLg', val);  }
  @Input('srcset.xl')     set srcsetXl(val)   { this._cacheInput('srcsetXl', val);  }

  @Input('srcset.lt-sm')  set srcsetLtSm(val) { this._cacheInput('srcsetLtSm', val);  }
  @Input('srcset.lt-md')  set srcsetLtMd(val) { this._cacheInput('srcsetLtMd', val);  }
  @Input('srcset.lt-lg')  set srcsetLtLg(val) { this._cacheInput('srcsetLtLg', val);  }
  @Input('srcset.lt-xl')  set srcsetLtXl(val) { this._cacheInput('srcsetLtXl', val);  }

  @Input('srcset.gt-xs')  set srcsetGtXs(val) { this._cacheInput('srcsetGtXs', val);  }
  @Input('srcset.gt-sm')  set srcsetGtSm(val) { this._cacheInput('srcsetGtSm', val);  }
  @Input('srcset.gt-md')  set srcsetGtMd(val) { this._cacheInput('srcsetGtMd', val);  }
  @Input('srcset.gt-lg')  set srcsetGtLg(val) { this._cacheInput('srcsetGtLg', val);  }
  /* tslint:enable */

  constructor(elRef: ElementRef, renderer: Renderer2, monitor: MediaMonitor) {
    super(monitor, elRef, renderer);
  }

  /**
   * Configure the Picture element with injected <source> elements or support responsive
   * activation of the standalone- Img element.
   */
  ngOnInit() {
    super.ngOnInit();

    this._configureIsolatedImg();
    this._configureDefaultSrcset();
    this._injectSourceElements();

    // Only responsively update srcset values for stand-alone image elements
    // Fallback to [srcset] value for responsive deactivation
    this._listenForMediaQueryChanges('src', '', () => {
      this._updateSrcset();
    });

    this._updateSrcset();
  }

  /**
   * Update the srcset of the relevant injected <source> elements with the new data-bound input
   * properties. <source> elements are injected once through ngOnInit
   */
  ngOnChanges() {
    if (this.hasInitialized) {
      this._updateSrcset();
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    // remove reference to dom elements to avoid memory leaks
    this._injectedSourceElements = null;
  }

  /**
   * Responsive activation is used ONLY for standalone images
   *
   * Image tags nested in Picture containers, however, ignore responsive activations
   * as injected <sources> are used. Changes to srcset values for nested images
   * directly update the injected source elements.
   *
   * For stand-alone img elements with responsive srcset attributes, the
   * img.src property will be responsively updated.
   */
  protected _updateSrcset() {
    const activatedKey = this._mqActivation ? this._mqActivation.activatedInputKey : 'src';
    const findSource = () => {
      return !this._mqActivation ? this.nativeElement : this._findInjectSourceBy(activatedKey);
    };
    const attrKey = !this.hasPictureParent ? 'src' : activatedKey;
    const attrVal = this._mqActivation ? this._mqActivation.activatedInput : this._queryInput(attrKey); // tslint:disable-line:max-line-length
    const target = !this.hasPictureParent ? this.nativeElement : findSource();

    if (target) {
      this._renderer.setAttribute(target, attrKey, attrVal);
    }
  }

  /**
   * Identify the correct source instance in order to update its `srcset`
   * attribute with the new value
   */
  protected _findInjectSourceBy(activatedKey: string) {
    return this._injectedSourceElements[activatedKey];
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
    if (isBrowser && this.hasPictureParent) {

      // If <picture><img></picture>, create a <source> elements inside the <picture> container;
      // @see https://www.html5rocks.com/en/tutorials/responsive/picture-element/

      this._breakpointsInUse().forEach((bpX: BreakPointX) => {
        const sourceElt = this._renderer.createElement('source');
        this._injectedSourceElements[bpX.key] = sourceElt;

        this._renderer.setAttribute(sourceElt, 'media', bpX.mediaQuery);
        this._renderer.setAttribute(sourceElt, DEFAULT_SRCSET, this._queryInput(bpX.key));
        this._renderer.insertBefore(this.parentElement, sourceElt, this.nativeElement);
      });
    }
  }

  /**
   * Get a list of breakpoints that will be used (defined via @Input assignments);
   * sorted from largest media range to smallest.
   */
  protected _breakpointsInUse(): BreakPointX[] {
    return this._mediaMonitor
        .breakpoints
        .map(bp => {
          return <BreakPointX> extendObject({}, bp, {
            key: 'srcset' + bp.suffix  // e.g.  layoutGtSm, layoutMd, layoutGtLg
          });
        })
        .filter(bp => {
          return this._queryInput(bp.key) !== undefined;
        })
        .reverse();
  }

  /**
   *  If only the <img> is defined with srcsets then use that as the target entry
   *  add responsively update the property srcset based on activated input value
   */
  protected _configureIsolatedImg() {
    if (!this.hasPictureParent) {
      this._configureDefaultSrcset();

      // If databinding is used, then the attribute is removed and
      // `ng-reflect-srcset-base` is used; so let's manually restore the attribute.

      let target = this.nativeElement;
      this._renderer.setAttribute(target, DEFAULT_SRCSET, this._queryInput(DEFAULT_SRCSET));
      this._renderer.setProperty(target, DEFAULT_SRCSET, this._queryInput(DEFAULT_SRCSET));
    }
  }

  /**
   * If [srcset] is not defined AND responsive API is in use
   * then set [srcset] from the [src] property
   */
  protected _configureDefaultSrcset() {
    const numInputsUsed = Object.keys(this._inputMap).length;
    const defaultSrcsetVal = this._queryInput(DEFAULT_SRCSET);

    if (typeof defaultSrcsetVal == 'undefined' && numInputsUsed) {
      this._cacheInput(DEFAULT_SRCSET, this.defaultSrc);
    }
  }

  /**
   * Does the image (with srcset usages) have a <picture> parent;
   * which is used as container for <source> element ?
   * @see https://www.html5rocks.com/en/tutorials/responsive/picture-element/
   *
   */
  protected get hasPictureParent() {
    return this.parentElement.nodeName == 'PICTURE';
  }

  /**
   * Empty values are maintained; undefined values are exposed as ''
   */
  protected get defaultSrc(): string {
    let attrVal = getDom().getAttribute(this.nativeElement, 'src');
    return this._queryInput('src') || attrVal || '';
  }


  /** Reference to injected source elements to be used when there is a need to update their
   * attributes. */
  private _injectedSourceElements: { [input: string]: any } = {};
}
