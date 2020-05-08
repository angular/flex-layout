/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';
import {isFlowHorizontal} from '../utils';
import {
  ALIGN_CONTENT,
  ALIGN_ITEMS,
  BASELINE,
  CENTER,
  END,
  FLEX_END,
  FLEX_START,
  JUSTIFY_CONTENT,
  SPACE_AROUND,
  SPACE_BETWEEN,
  SPACE_EVENLY,
  START,
  STRETCH
} from '../../constants';


export class LayoutAlign extends Tag {
  readonly tag = 'layoutAlign';
  readonly deps = ['self.layout', 'directionality'];

  build(input: string, layout: string): Map<string, ValuePriority> {
    layout = layout || 'row';
    const [mainAxis, crossAxis] = input.split(' ');
    const maxKey = crossAxis === STRETCH && isFlowHorizontal(layout) ? 'max-height' : 'max-width';
    const styles: Map<string, ValuePriority> = new Map()
      .set('display', {value: 'flex', priority: -1})
      .set('flex-direction', {value: 'row', priority: -1})
      .set('box-sizing', {value: 'border-box', priority: 0})
      .set(maxKey, {value: '100%', priority: 0});

    switch (mainAxis) {
      case FLEX_START:
      case FLEX_END:
      case SPACE_EVENLY:
      case SPACE_BETWEEN:
      case SPACE_AROUND:
      case CENTER:
        styles.set(JUSTIFY_CONTENT, {value: mainAxis, priority: 0});
        break;
      case END:
        styles.set(JUSTIFY_CONTENT, {value: FLEX_END, priority: 0});
        break;
      case START:
      default:
        styles.set(JUSTIFY_CONTENT, {value: FLEX_START, priority: 0});
    }

    switch (crossAxis) {
      case STRETCH:
      case FLEX_START:
      case FLEX_END:
      case CENTER:
        styles.set(ALIGN_ITEMS, {value: crossAxis, priority: 0});
        styles.set(ALIGN_CONTENT, {value: crossAxis, priority: 0});
        break;
      case START:
        styles.set(ALIGN_ITEMS, {value: FLEX_START, priority: 0});
        styles.set(ALIGN_CONTENT, {value: FLEX_START, priority: 0});
        break;
      case END:
        styles.set(ALIGN_ITEMS, {value: FLEX_END, priority: 0});
        styles.set(ALIGN_CONTENT, {value: FLEX_END, priority: 0});
        break;
      case SPACE_BETWEEN:
      case SPACE_AROUND:
        styles.set(ALIGN_CONTENT, {value: crossAxis, priority: 0});
        styles.set(ALIGN_ITEMS, {value: STRETCH, priority: 0});
        break;
      case BASELINE:
        styles.set(ALIGN_CONTENT, {value: STRETCH, priority: 0});
        styles.set(ALIGN_ITEMS, {value: BASELINE, priority: 0});
        break;
      default:
        styles.set(ALIGN_CONTENT, {value: STRETCH, priority: 0});
        styles.set(ALIGN_ITEMS, {value: STRETCH, priority: 0});
    }

    return styles;
  }
}
