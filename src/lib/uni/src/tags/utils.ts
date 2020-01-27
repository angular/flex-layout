/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export const INLINE = 'inline';
export const LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];

/** Convert layout-wrap='<value>' to expected flex-wrap style */
export function validateWrapValue(value: string) {
  if (!!value) {
    switch (value.toLowerCase()) {
      case 'reverse':
      case 'wrap-reverse':
      case 'reverse-wrap':
        value = 'wrap-reverse';
        break;

      case 'no':
      case 'none':
      case 'nowrap':
        value = 'nowrap';
        break;

      // All other values fallback to 'wrap'
      default:
        value = 'wrap';
    }
  }
  return value;
}

/**
 * Validate the value to be one of the acceptable value options
 * Use default fallback of 'row'
 */
export function validateValue(value: string): [string, string, boolean] {
  value = value ? value.toLowerCase() : '';
  let [direction, wrap, inline] = value.split(' ');

  // First value must be the `flex-direction`
  if (!LAYOUT_VALUES.find(x => x === direction)) {
    direction = LAYOUT_VALUES[0];
  }

  if (wrap === INLINE) {
    wrap = (inline !== INLINE) ? inline : '';
    inline = INLINE;
  }

  return [direction, validateWrapValue(wrap), !!inline];
}

/**
 * Determine if the validated, flex-direction value specifies
 * a horizontal/row flow.
 */
export function isFlowHorizontal(value: string): boolean {
  let [flow, ] = validateValue(value);
  return flow.indexOf('row') > -1;
}
