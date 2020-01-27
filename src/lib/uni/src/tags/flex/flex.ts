/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';
import {isFlowHorizontal} from '../utils';


export class Flex extends Tag {
  readonly tag = 'flex';
  readonly deps = ['parent.layout'];

  build(input: string, layout: string): Map<string, ValuePriority> {
    const styles: Map<string, ValuePriority> = new Map()
      .set('box-sizing', {value: 'border-box', priority: 0});
    const wrap = layout.indexOf('wrap') > -1;
    let [grow, shrink, ...basisParts]: string[] = input.split(' ');
    const zeroIndex = basisParts.indexOf('zero');
    const useColumnBasisZero = zeroIndex > -1;
    let basis = !useColumnBasisZero ? basisParts.join(' ') : basisParts.splice(zeroIndex, 1).join(' ');

    // The flex-direction of this element's flex container. Defaults to 'row'.
    const direction = layout.indexOf('column') > -1 ? 'column' : 'row';
    const max = isFlowHorizontal(direction) ? 'max-width' : 'max-height';
    const min = isFlowHorizontal(direction) ? 'min-width' : 'min-height';
    const hasCalc = basis.indexOf('calc') > -1;
    const usingCalc = hasCalc || (basis === 'auto');
    const isPercent = basis.indexOf('%') > -1 && !hasCalc;
    const hasUnits = basis.indexOf('px') > -1 || basis.indexOf('rem') > -1 ||
      basis.indexOf('em') > -1 || basis.indexOf('vw') > -1 || basis.indexOf('vh') > -1;
    let isValue = (hasCalc || hasUnits);

    // make box inflexible when shrink and grow are both zero
    // should not set a min when the grow is zero
    // should not set a max when the shrink is zero
    const isFixed = !grow && !shrink;

    // flex-basis allows you to specify the initial/starting main-axis size of the element,
    // before anything else is computed. It can either be a percentage or an absolute value.
    // It is, however, not the breaking point for flex-grow/shrink properties
    //
    // flex-grow can be seen as this:
    //   0: Do not stretch. Either size to element's content width, or obey 'flex-basis'.
    //   1: (Default value). Stretch; will be the same size to all other flex items on
    //       the same row since they have a default value of 1.
    //   ≥2 (integer n): Stretch. Will be n times the size of other elements
    //      with 'flex-grow: 1' on the same row.
    switch (basis) {
      case '':
        basis = direction === 'row' ? '0%' : (useColumnBasisZero ? '0.000000001px' : 'auto');
        break;
      // default
      case 'initial':
      case 'nogrow':
        grow = '0';
        basis = 'auto';
        break;
      case 'grow':
        basis = '100%';
        break;
      case 'noshrink':
        shrink = '0';
        basis = 'auto';
        break;
      case 'auto':
        break;
      case 'none':
        grow = '0';
        shrink = '0';
        basis = 'auto';
        break;
      default:
        // Defaults to percentage sizing unless `px` is explicitly set
        if (!isValue && !isPercent && !isNaN(basis as any)) {
          basis = basis + '%';
        }

        // Fix for issue #280
        if (basis === '0%') {
          isValue = true;
        }

        if (basis === '0px') {
          basis = '0%';
        }

        // Fix for issue #5345
        if (hasCalc) {
          styles.set('flex-grow', {value: grow, priority: 0});
          styles.set('flex-shrink', {value: shrink, priority: 0});
          styles.set('flex-basis', {value: isValue ? basis : '100%', priority: 0});
        } else {
          styles.set('flex', {value: `${grow} ${shrink} ${isValue ? basis : '100%'}`, priority: 0});
        }

        break;
    }

    if (!styles.has('flex') || !styles.has('flex-grow')) {
      if (hasCalc) {
        styles.set('flex-grow', {value: grow, priority: 0});
        styles.set('flex-shrink', {value: shrink, priority: 0});
        styles.set('flex-basis', {value: basis, priority: 0});
      } else {
        styles.set('flex', {value: `${grow} ${shrink} ${basis}`, priority: 0});
      }
    }

    // Fix for issues #277, #534, and #728
    if (basis !== '0%' && basis !== '0px' && basis !== '0.000000001px' && basis !== 'auto') {
      if (isFixed) {
        styles.set(min, {value: basis, priority: 0});
        styles.set(max, {value: basis, priority: 0});
      } else {
        if (isValue && grow) {
          styles.set(min, {value: basis, priority: 0});
        }
        if (!usingCalc && shrink) {
          styles.set(max, {value: basis, priority: 0});
        }
      }
    }

    // Fix for issue #528
    if (!styles.has(min) && !styles.has(max)) {
      if (hasCalc) {
        styles.set('flex-grow', {value: grow, priority: 0});
        styles.set('flex-shrink', {value: shrink, priority: 0});
        styles.set('flex-basis', {value: basis, priority: 0});
      } else {
        styles.set('flex', {value: `${grow} ${shrink} ${basis}`, priority: 0});
      }
    } else {
      // Fix for issue #660
      if (wrap) {
        const value = styles.has(max) ? styles.get(max)!.value : styles.get(min)!.value;
        styles.set(hasCalc ? 'flex-basis' : 'flex',
          {value: hasCalc ? value : `${grow} ${shrink} ${value}`, priority: 0});
      }
    }

    return styles;
  }
}
