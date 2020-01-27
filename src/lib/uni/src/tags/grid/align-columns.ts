/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';
import {
  ALIGN_CONTENT,
  ALIGN_ITEMS,
  CENTER,
  END,
  SPACE_AROUND,
  SPACE_BETWEEN,
  SPACE_EVENLY,
  START,
  STRETCH,
} from '../../constants';


export class AlignColumns extends Tag {
  readonly tag = 'alignColumns';

  build(input: string): Map<string, ValuePriority> {
    const [mainAxis, crossAxis] = input.split(' ');
    const styles: Map<string, ValuePriority> = new Map();

    // Main axis
    switch (mainAxis) {
      case CENTER:
      case SPACE_AROUND:
      case SPACE_BETWEEN:
      case SPACE_EVENLY:
      case END:
      case START:
      case STRETCH:
        styles.set(ALIGN_CONTENT, {value: mainAxis, priority: 0});
        break;
      default:
        styles.set(ALIGN_CONTENT, {value: DEFAULT_MAIN, priority: 0});
    }

    // Cross-axis
    switch (crossAxis) {
      case START:
      case CENTER:
      case END:
      case STRETCH:
        styles.set(ALIGN_ITEMS, {value: crossAxis, priority: 0});
        break;
      default:
        styles.set(ALIGN_ITEMS, {value: DEFAULT_CROSS, priority: 0});
    }

    return styles;
  }
}

const DEFAULT_MAIN = 'start';
const DEFAULT_CROSS = 'stretch';
