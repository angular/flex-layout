/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';


const INLINE_STYLES = new Map().set('display', {value: 'inline-grid', priority: 1});

export class Inline extends Tag {
  readonly tag = 'inline';

  build(): Map<string, ValuePriority> {
    return INLINE_STYLES;
  }
}
