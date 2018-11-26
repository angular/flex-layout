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
  KeyValueDiffers,
  Optional,
  Renderer2,
  SecurityContext,
  Self,
} from '@angular/core';
import {NgStyle} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {BaseDirective2, StyleUtils, MediaMarshaller} from '@angular/flex-layout/core';

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

  constructor(protected elementRef: ElementRef,
              protected styler: StyleUtils,
              protected marshal: MediaMarshaller,
              protected keyValueDiffers: KeyValueDiffers,
              protected renderer: Renderer2,
              protected sanitizer: DomSanitizer,
              @Optional() @Self() private readonly ngStyleInstance: NgStyle) {
    super(elementRef, null!, styler, marshal);
    if (!this.ngStyleInstance) {
      // Create an instance NgClass Directive instance only if `ngClass=""` has NOT been
      // defined on the same host element; since the responsive variations may be defined...
      this.ngStyleInstance = new NgStyle(this.keyValueDiffers, this.elementRef, this.renderer);
    }
    this.marshal.init(this.nativeElement, this.DIRECTIVE_KEY, this.updateWithValue.bind(this));
    this.setValue(this.nativeElement.getAttribute('style') || '', '');
  }

  protected updateWithValue(value: any) {
    const styles = this.buildStyleMap(value);
    const defaultStyles = this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY, '');
    const fallback = this.buildStyleMap(defaultStyles);
    this.ngStyleInstance.ngStyle = {...fallback, ...styles};
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

/**
 * Directive to add responsive support for ngStyle.
 *
 */
@Directive({selector, inputs})
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
