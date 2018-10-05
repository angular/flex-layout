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
  Inject,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {
  BaseDirective,
  MediaMonitor,
  SERVER_TOKEN,
  StyleUtils,
} from '@angular/flex-layout/core';


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
export class ImgSrcDirective extends BaseDirective implements OnInit, OnChanges {

  /* tslint:disable */
  @Input('src')        set srcBase(val: string) { this.cacheDefaultSrc(val);           }

  @Input('src.xs')     set srcXs(val: string)   { this._cacheInput('srcXs', val);  }
  @Input('src.sm')     set srcSm(val: string)   { this._cacheInput('srcSm', val);  }
  @Input('src.md')     set srcMd(val: string)   { this._cacheInput('srcMd', val);  }
  @Input('src.lg')     set srcLg(val: string)   { this._cacheInput('srcLg', val);  }
  @Input('src.xl')     set srcXl(val: string)   { this._cacheInput('srcXl', val);  }

  @Input('src.lt-sm')  set srcLtSm(val: string) { this._cacheInput('srcLtSm', val);  }
  @Input('src.lt-md')  set srcLtMd(val: string) { this._cacheInput('srcLtMd', val);  }
  @Input('src.lt-lg')  set srcLtLg(val: string) { this._cacheInput('srcLtLg', val);  }
  @Input('src.lt-xl')  set srcLtXl(val: string) { this._cacheInput('srcLtXl', val);  }

  @Input('src.gt-xs')  set srcGtXs(val: string) { this._cacheInput('srcGtXs', val);  }
  @Input('src.gt-sm')  set srcGtSm(val: string) { this._cacheInput('srcGtSm', val);  }
  @Input('src.gt-md')  set srcGtMd(val: string) { this._cacheInput('srcGtMd', val);  }
  @Input('src.gt-lg')  set srcGtLg(val: string) { this._cacheInput('srcGtLg', val);  }
  /* tslint:enable */

  constructor(protected _elRef: ElementRef,
              protected _monitor: MediaMonitor,
              protected _styler: StyleUtils,
              @Inject(PLATFORM_ID) protected _platformId: Object,
              @Optional() @Inject(SERVER_TOKEN) protected _serverModuleLoaded: boolean) {
    super(_monitor, _elRef, _styler);
    this._cacheInput('src', _elRef.nativeElement.getAttribute('src') || '');
    if (isPlatformServer(this._platformId) && this._serverModuleLoaded) {
      this.nativeElement.setAttribute('src', '');
    }
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
      if (isPlatformServer(this._platformId) && this._serverModuleLoaded) {
        this._styler.applyStyleToElement(this.nativeElement, {'content': url ? `url(${url})` : ''});
      } else {
        this.nativeElement.setAttribute('src', String(url));
      }
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
