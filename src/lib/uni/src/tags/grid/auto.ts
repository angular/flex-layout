/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';


export class Auto extends Tag {
  readonly tag = 'auto';

  build(input: string): Map<string, ValuePriority> {
    input = input || 'initial';
    let [direction, dense] = input.split(' ');
    if (direction !== 'column' && direction !== 'row' && direction !== 'dense') {
      direction = 'row';
    }

    dense = (dense === 'dense' && direction !== 'dense') ? ' dense' : '';

    return new Map()
      .set('display', {value: 'grid', priority: 0})
      .set('grid-auto-flow', {value: direction + dense, priority: 0});
  }
}
