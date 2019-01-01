/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {BaseDirective2} from '@angular/flex-layout/core';
import {buildLayoutCSS} from '../utils/layout-validator';

export class BaseFlexFlowDirective extends BaseDirective2 {
  /**
   * Determine the DOM element's Flexbox flow (flex-direction).
   *
   * Check inline style first then check computed (stylesheet) style.
   * And optionally add the flow value to element's inline style.
   */
  protected getFlexFlowDirection(target: HTMLElement, addIfMissing = false): string {
    if (target) {
      const [value, hasInlineValue] = this.styler.getFlowDirection(target);

      if (!hasInlineValue && addIfMissing) {
        const style = buildLayoutCSS(value);
        const elements = [target];
        this.styler.applyStyleToElements(style, elements);
      }

      return value.trim();
    }

    return 'row';
  }
}
