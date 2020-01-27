/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';


export class Column extends Tag {
  readonly tag = 'column';

  build(input: string): Map<string, ValuePriority> {
    input = input || 'auto';
    return new Map().set('grid-column', {value: input, priority: 0});
  }
}
