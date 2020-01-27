/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';
import {
  ALIGN_SELF,
  CENTER,
  END,
  JUSTIFY_SELF,
  START,
  STRETCH
} from '../../constants';


export class Align extends Tag {
  readonly tag = 'gridAlign';

  build(input: string): Map<string, ValuePriority> {
    input = input || 'stretch';
    const styles: Map<string, ValuePriority> = new Map();
    const [rowAxis, columnAxis] = input.split(' ');

    // Row axis
    switch (rowAxis) {
      case END:
      case CENTER:
      case STRETCH:
      case START:
        styles.set(JUSTIFY_SELF, {value: rowAxis, priority: 0});
        break;
      default:
        styles.set(JUSTIFY_SELF, {value: STRETCH, priority: 0});
    }

    // Column axis
    switch (columnAxis) {
      case END:
      case CENTER:
      case STRETCH:
      case START:
        styles.set(ALIGN_SELF, {value: rowAxis, priority: 0});
        break;
      default:
        styles.set(ALIGN_SELF, {value: STRETCH, priority: 0});
    }

    return styles;
  }
}
