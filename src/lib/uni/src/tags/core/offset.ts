/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Direction} from '@angular/cdk/bidi';

import {Tag, ValuePriority} from '../tag';
import {isFlowHorizontal} from '../utils';


export class Offset extends Tag {
  readonly tag = 'flexOffset';
  readonly deps = ['parent.layout', 'directionality'];

  build(input: string, layout: string, direction: Direction): Map<string, ValuePriority> {
    input = input || '0';
    const isRtl = direction === 'rtl';
    const isPercent = input.indexOf('%') > -1;
    const isPx = input.indexOf('px') > -1;
    if (!isPx && !isPercent && !isNaN(+input)) {
      input = input + '%';
    }
    const horizontalLayoutKey = isRtl ? 'margin-right' : 'margin-left';
    const key = isFlowHorizontal(layout) ? horizontalLayoutKey : 'margin-top';
    return new Map().set(key, input);
  }
}
