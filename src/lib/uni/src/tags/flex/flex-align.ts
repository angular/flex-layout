/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';
import {ALIGN_SELF, END, FLEX_END, FLEX_START, START, STRETCH} from '../../constants';


export class FlexAlign extends Tag {
  readonly tag = 'flexAlign';

  build(input: string): Map<string, ValuePriority> {
    input = input || STRETCH;
    const styles: Map<string, ValuePriority> = new Map();

    // Cross-axis
    switch (input) {
      case START:
        styles.set(ALIGN_SELF, {value: FLEX_START, priority: 0});
        break;
      case END:
        styles.set(ALIGN_SELF, {value: FLEX_END, priority: 0});
        break;
      default:
        styles.set(ALIGN_SELF, {value: input, priority: 0});
        break;
    }

    return styles;
  }
}
