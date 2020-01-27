/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';
import {
  CENTER,
  END,
  JUSTIFY_CONTENT,
  JUSTIFY_ITEMS,
  SPACE_AROUND,
  SPACE_BETWEEN,
  SPACE_EVENLY,
  START,
  STRETCH,
} from '../../constants';


export class AlignRows extends Tag {
  readonly tag = 'alignRows';

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
        styles.set(JUSTIFY_CONTENT, {value: mainAxis, priority: 0});
        break;
      default:
        styles.set(JUSTIFY_CONTENT, {value: DEFAULT_MAIN, priority: 0});
    }

    // Cross-axis
    switch (crossAxis) {
      case START:
      case CENTER:
      case END:
      case STRETCH:
        styles.set(JUSTIFY_ITEMS, {value: crossAxis, priority: 0});
        break;
      default:
        styles.set(JUSTIFY_ITEMS, {value: DEFAULT_CROSS, priority: 0});
    }

    return styles;
  }
}

const DEFAULT_MAIN = 'start';
const DEFAULT_CROSS = 'stretch';
