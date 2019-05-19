/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  DoCheck,
  ElementRef,
  Inject,
  Optional,
  PLATFORM_ID,
  SecurityContext,
  Self,
} from '@angular/core';
import {isPlatformServer, NgStyle, ɵNgStyleImpl, ɵNgStyleR2Impl} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {
  BaseDirective2,
  StyleUtils,
  MediaMarshaller,
  SERVER_TOKEN,
} from '@angular/flex-layout/core';

import {
  NgStyleRawList,
  NgStyleType,
  NgStyleSanitizer,
  buildRawList,
  getType,
  buildMapFromSet,
  NgStyleMap,
  NgStyleKeyValue,
  stringToKeyValue,
  keyValuesToMap,
} from './style-transforms';

export class StyleDirective extends BaseDirective2 implements DoCheck {

  protected DIRECTIVE_KEY = 'ngStyle';
  protected fallbackStyles: NgStyleMap;
  protected isServer: boolean;

  constructor(protected elementRef: ElementRef,
              protected styler: StyleUtils,
              protected marshal: MediaMarshaller,
              protected delegate: ɵNgStyleImpl,
              protected sanitizer: DomSanitizer,
              @Optional() @Self() private readonly ngStyleInstance: NgStyle,
              @Optional() @Inject(SERVER_TOKEN) serverLoaded: boolean,
              @Inject(PLATFORM_ID) platformId: Object) {
    super(elementRef, null!, styler, marshal);
    if (!this.ngStyleInstance) {
      // Create an instance NgClass Directive instance only if `ngClass=""` has NOT been
      // defined on the same host element; since the responsive variations may be defined...
      this.ngStyleInstance = new NgStyle(this.delegate);
    }
    this.init();
    const styles = this.nativeElement.getAttribute('style') || '';
    this.fallbackStyles = this.buildStyleMap(styles);
    this.isServer = serverLoaded && isPlatformServer(platformId);
  }

  /** Add generated styles */
  protected updateWithValue(value: any) {
    const styles = this.buildStyleMap(value);
    this.ngStyleInstance.ngStyle = {...this.fallbackStyles, ...styles};
    if (this.isServer) {
      this.applyStyleToElement(styles);
    }
    this.ngStyleInstance.ngDoCheck();
  }

  /** Remove generated styles */
  protected clearStyles() {
    this.ngStyleInstance.ngStyle = this.fallbackStyles;
    this.ngStyleInstance.ngDoCheck();
  }

  /**
   * Convert raw strings to ngStyleMap; which is required by ngStyle
   * NOTE: Raw string key-value pairs MUST be delimited by `;`
   *       Comma-delimiters are not supported due to complexities of
   *       possible style values such as `rgba(x,x,x,x)` and others
   */
  protected buildStyleMap(styles: NgStyleType): NgStyleMap {
    // Always safe-guard (aka sanitize) style property values
    const sanitizer: NgStyleSanitizer = (val: any) =>
      this.sanitizer.sanitize(SecurityContext.STYLE, val) || '';
    if (styles) {
      switch (getType(styles)) {
        case 'string':  return buildMapFromList(buildRawList(styles),
          sanitizer);
        case 'array' :  return buildMapFromList(styles as NgStyleRawList, sanitizer);
        case 'set'   :  return buildMapFromSet(styles, sanitizer);
        default      :  return buildMapFromSet(styles, sanitizer);
      }
    }

    return {};
  }

  // ******************************************************************
  // Lifecycle Hooks
  // ******************************************************************

  /** For ChangeDetectionStrategy.onPush and ngOnChanges() updates */
  ngDoCheck() {
    this.ngStyleInstance.ngDoCheck();
  }
}

const inputs = [
  'ngStyle',
  'ngStyle.xs', 'ngStyle.sm', 'ngStyle.md', 'ngStyle.lg', 'ngStyle.xl',
  'ngStyle.lt-sm', 'ngStyle.lt-md', 'ngStyle.lt-lg', 'ngStyle.lt-xl',
  'ngStyle.gt-xs', 'ngStyle.gt-sm', 'ngStyle.gt-md', 'ngStyle.gt-lg'
];

const selector = `
  [ngStyle],
  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],
  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],
  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]
`;

// tslint:disable-next-line:variable-name
export const LayoutNgStyleImplProvider = {
  provide: ɵNgStyleImpl,
  useClass: ɵNgStyleR2Impl
};

/**
 * Directive to add responsive support for ngStyle.
 *
 */
@Directive({selector, inputs, providers: [LayoutNgStyleImplProvider]})
export class DefaultStyleDirective extends StyleDirective implements DoCheck {
  protected inputs = inputs;
}

/** Build a styles map from a list of styles, while sanitizing bad values first */
function buildMapFromList(styles: NgStyleRawList, sanitize?: NgStyleSanitizer): NgStyleMap {
  const sanitizeValue = (it: NgStyleKeyValue) => {
    if (sanitize) {
      it.value = sanitize(it.value);
    }
    return it;
  };

  return styles
    .map(stringToKeyValue)
    .filter(entry => !!entry)
    .map(sanitizeValue)
    .reduce(keyValuesToMap, {} as NgStyleMap);
}
