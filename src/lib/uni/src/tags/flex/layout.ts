/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';
import {validateValue} from '../utils';


export class Layout extends Tag {
  readonly tag = 'layout';

  build(input: string): Map<string, ValuePriority> {
    const [direction, wrap, isInline] = validateValue(input);
    const styles: Map<string, ValuePriority> = new Map()
      .set('display', {value: isInline ? 'inline-flex' : 'flex', priority: 1})
      .set('box-sizing', {value: 'border-box', priority: 0})
      .set('flex-direction', {value: direction, priority: 0});
    if (!!wrap) {
      styles.set('flex-wrap', {value: wrap, priority: 0});
    }
    return styles;
  }
}
