/**
 * @license
 * Copyright Google LLC All Rights Reserved.
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
  Renderer2
} from '@angular/core';

import {BaseFxDirective} from '../core/base';
import {MediaMonitor} from '../../media-query/media-monitor';

/**
 * This directive provides a responsive API for the HTML <img> 'src' attribute
 * and will update the img.src property upon each responsive activation.
 *
 * e.g.
 *      <img src="defaultScene.jpg" src.xs="mobileScene.jpg"></img>
 *
 * @see https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-src/
 */
@Directive({
  selector: `
  img[src.xs],    img[src.sm],    img[src.md],    img[src.lg],   img[src.xl],
  img[src.lt-sm], img[src.lt-md], img[src.lt-lg], img[src.lt-xl],
  img[src.gt-xs], img[src.gt-sm], img[src.gt-md], img[src.gt-lg]
`
})
export class ImgSrcDirective extends BaseFxDirective implements OnInit, OnChanges {

  /* tslint:disable */
  @Input('src')        set srcBase(val) { this.cacheDefaultSrc(val);           }

  @Input('src.xs')     set srcXs(val)   { this._cacheInput('srcXs', val);  }
  @Input('src.sm')     set srcSm(val)   { this._cacheInput('srcSm', val);  }
  @Input('src.md')     set srcMd(val)   { this._cacheInput('srcMd', val);  }
  @Input('src.lg')     set srcLg(val)   { this._cacheInput('srcLg', val);  }
  @Input('src.xl')     set srcXl(val)   { this._cacheInput('srcXl', val);  }

  @Input('src.lt-sm')  set srcLtSm(val) { this._cacheInput('srcLtSm', val);  }
  @Input('src.lt-md')  set srcLtMd(val) { this._cacheInput('srcLtMd', val);  }
  @Input('src.lt-lg')  set srcLtLg(val) { this._cacheInput('srcLtLg', val);  }
  @Input('src.lt-xl')  set srcLtXl(val) { this._cacheInput('srcLtXl', val);  }

  @Input('src.gt-xs')  set srcGtXs(val) { this._cacheInput('srcGtXs', val);  }
  @Input('src.gt-sm')  set srcGtSm(val) { this._cacheInput('srcGtSm', val);  }
  @Input('src.gt-md')  set srcGtMd(val) { this._cacheInput('srcGtMd', val);  }
  @Input('src.gt-lg')  set srcGtLg(val) { this._cacheInput('srcGtLg', val);  }
  /* tslint:enable */

  constructor(elRef: ElementRef, renderer: Renderer2, monitor: MediaMonitor) {
    super(monitor, elRef, renderer);
    this._cacheInput('src', elRef.nativeElement.getAttribute('src') || '');
  }

  /**
   * Listen for responsive changes to update the img.src attribute
   */
  ngOnInit() {
    super.ngOnInit();

    if (this.hasResponsiveKeys) {
      // Listen for responsive changes
      this._listenForMediaQueryChanges('src', this.defaultSrc, () => {
        this._updateSrcFor();
      });
    }
    this._updateSrcFor();
  }

  /**
   * Update the 'src' property of the host <img> element
   */
  ngOnChanges() {
    if (this.hasInitialized) {
      this._updateSrcFor();
    }
  }

  /**
   * Use the [responsively] activated input value to update
   * the host img src attribute or assign a default `img.src=''`
   * if the src has not been defined.
   *
   * Do nothing to standard `<img src="">` usages, only when responsive
   * keys are present do we actually call `setAttribute()`
   */
  protected _updateSrcFor() {
    if (this.hasResponsiveKeys) {
      let url = this.activatedValue || this.defaultSrc;
      this._renderer.setAttribute(this.nativeElement, 'src', String(url));
    }
  }

  /**
   * Cache initial value of 'src', this will be used as fallback when breakpoint
   * activations change.
   * NOTE: The default 'src' property is not bound using @Input(), so perform
   * a post-ngOnInit() lookup of the default src value (if any).
   */
  protected cacheDefaultSrc(value?: string) {
    this._cacheInput('src', value || '');
  }

  /**
   * Empty values are maintained, undefined values are exposed as ''
   */
  protected get defaultSrc(): string {
    return this._queryInput('src') || '';
  }

  /**
   * Does the <img> have 1 or more src.<xxx> responsive inputs
   * defined... these will be mapped to activated breakpoints.
   */
  protected get hasResponsiveKeys() {
    return Object.keys(this._inputMap).length > 1;
  }

}
