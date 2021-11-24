/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, Input, Injectable} from '@angular/core';
import {
  BaseDirective2,
  StyleUtils,
  StyleBuilder,
  MediaMarshaller,
  StyleDefinition,
} from '@angular/flex-layout/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

const DEFAULT_VALUE = 'initial';

export interface GridAutoParent {
  inline: boolean;
}

@Injectable({providedIn: 'root'})
export class GridAutoStyleBuilder extends StyleBuilder {
  buildStyles(input: string, parent: GridAutoParent) {
    let [direction, dense] = (input || DEFAULT_VALUE).split(' ');
    if (direction !== 'column' && direction !== 'row' && direction !== 'dense') {
      direction = 'row';
    }

    dense = (dense === 'dense' && direction !== 'dense') ? ' dense' : '';

    return {
      'display': parent.inline ? 'inline-grid' : 'grid',
      'grid-auto-flow': direction + dense
    };
  }
}

@Directive()
export class GridAutoDirective extends BaseDirective2 {
  @Input('gdInline')
  get inline(): boolean { return this._inline; }
  set inline(val: boolean) { this._inline = coerceBooleanProperty(val); }
  protected _inline = false;

  protected DIRECTIVE_KEY = 'grid-auto';

  constructor(elementRef: ElementRef,
              styleBuilder: GridAutoStyleBuilder,
              styler: StyleUtils,
              marshal: MediaMarshaller) {
    super(elementRef, styleBuilder, styler, marshal);
    this.init();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  protected updateWithValue(value: string) {
    this.styleCache = this.inline ? autoInlineCache : autoCache;
    this.addStyles(value, {inline: this.inline});
  }
}

const autoCache: Map<string, StyleDefinition> = new Map();
const autoInlineCache: Map<string, StyleDefinition> = new Map();

const inputs = [
  'gdAuto',
  'gdAuto.xs', 'gdAuto.sm', 'gdAuto.md', 'gdAuto.lg', 'gdAuto.xl',
  'gdAuto.lt-sm', 'gdAuto.lt-md', 'gdAuto.lt-lg', 'gdAuto.lt-xl',
  'gdAuto.gt-xs', 'gdAuto.gt-sm', 'gdAuto.gt-md', 'gdAuto.gt-lg'
];
const selector = `
  [gdAuto],
  [gdAuto.xs], [gdAuto.sm], [gdAuto.md], [gdAuto.lg], [gdAuto.xl],
  [gdAuto.lt-sm], [gdAuto.lt-md], [gdAuto.lt-lg], [gdAuto.lt-xl],
  [gdAuto.gt-xs], [gdAuto.gt-sm], [gdAuto.gt-md], [gdAuto.gt-lg]
`;

/**
 * 'grid-auto-flow' CSS Grid styling directive
 * Configures the auto placement algorithm for the grid
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-23
 */
@Directive({selector, inputs})
export class DefaultGridAutoDirective extends GridAutoDirective {
  protected inputs = inputs;
}
