/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';


/**
 * 'grid-gap' CSS Grid styling directive
 * Configures the gap between items in the grid
 * Syntax: <row gap> [<column-gap>]
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-17
 */
export class GridGap extends Tag {
  readonly tag = 'gridGap';

  build(input: string): Map<string, ValuePriority> {
    input = input || '0';
    return new Map()
      .set('display', {value: 'grid', priority: -1})
      .set('grid-gap', {value: input, priority: 0});
  }
}
