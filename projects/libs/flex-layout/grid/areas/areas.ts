/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, Injectable, Input} from '@angular/core';
import {
  BaseDirective2,
  StyleUtils,
  StyleBuilder,
  MediaMarshaller,
  StyleDefinition,
} from '@angular/flex-layout/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

const DEFAULT_VALUE = 'none';
const DELIMETER = '|';

export interface GridAreasParent {
  inline: boolean;
}

@Injectable({providedIn: 'root'})
export class GridAreasStyleBuiler extends StyleBuilder {
  buildStyles(input: string, parent: GridAreasParent) {
    const areas = (input || DEFAULT_VALUE).split(DELIMETER).map(v => `"${v.trim()}"`);

    return {
      'display': parent.inline ? 'inline-grid' : 'grid',
      'grid-template-areas': areas.join(' ')
    };
  }
}

@Directive()
export class GridAreasDirective extends BaseDirective2 {

  protected DIRECTIVE_KEY = 'grid-areas';

  @Input('gdInline')
  get inline(): boolean { return this._inline; }
  set inline(val: boolean) { this._inline = coerceBooleanProperty(val); }
  protected _inline = false;

  constructor(elRef: ElementRef,
              styleUtils: StyleUtils,
              styleBuilder: GridAreasStyleBuiler,
              marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    this.init();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  protected updateWithValue(value: string) {
    this.styleCache = this.inline ? areasInlineCache : areasCache;
    this.addStyles(value, {inline: this.inline});
  }
}

const areasCache: Map<string, StyleDefinition> = new Map();
const areasInlineCache: Map<string, StyleDefinition> = new Map();

const inputs = [
  'gdAreas',
  'gdAreas.xs', 'gdAreas.sm', 'gdAreas.md', 'gdAreas.lg', 'gdAreas.xl',
  'gdAreas.lt-sm', 'gdAreas.lt-md', 'gdAreas.lt-lg', 'gdAreas.lt-xl',
  'gdAreas.gt-xs', 'gdAreas.gt-sm', 'gdAreas.gt-md', 'gdAreas.gt-lg'
];

const selector = `
  [gdAreas],
  [gdAreas.xs], [gdAreas.sm], [gdAreas.md], [gdAreas.lg], [gdAreas.xl],
  [gdAreas.lt-sm], [gdAreas.lt-md], [gdAreas.lt-lg], [gdAreas.lt-xl],
  [gdAreas.gt-xs], [gdAreas.gt-sm], [gdAreas.gt-md], [gdAreas.gt-lg]
`;

/**
 * 'grid-template-areas' CSS Grid styling directive
 * Configures the names of elements within the grid
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-14
 */
@Directive({selector, inputs})
export class DefaultGridAreasDirective extends GridAreasDirective {
  protected inputs = inputs;
}
