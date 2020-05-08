/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';


const STYLES = new Map()
  .set('margin', {value: '0', priority: 0})
  .set('width', {value: '100%', priority: 0})
  .set('height', {value: '100%', priority: 0})
  .set('min-width', {value: '100%', priority: 0})
  .set('min-height', {value: '100%', priority: 0});

export class Fill extends Tag {
  readonly tag = 'fill';

  build(): Map<string, ValuePriority> {
    return STYLES;
  }
}
