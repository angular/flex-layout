/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

 /**
 * The flex API permits 3 or 1 parts of the value:
 *    - `flex-grow flex-shrink flex-basis`, or
 *    - `flex-basis`
 */
export function validateBasis(basis: string, grow = '1', shrink = '1'): string[] {
  let parts = [grow, shrink, basis];

  let j = basis.indexOf('calc');
  if (j > 0) {
    parts[2] = _validateCalcValue(basis.substring(j).trim());
    let matches = basis.substr(0, j).trim().split(' ');
    if (matches.length == 2) {
      parts[0] = matches[0];
      parts[1] = matches[1];
    }
  } else if (j == 0) {
    parts[2] = _validateCalcValue(basis.trim());
  } else {
    let matches = basis.split(' ');
    parts = (matches.length === 3) ? matches : [
          grow, shrink, basis
        ];
  }

  return parts;
}


/**
 * Calc expressions require whitespace before & after any expression operators
 * This is a simple, crude whitespace padding solution.
 *   - '3 3 calc(15em + 20px)'
 *   - calc(100% / 7 * 2)
 *   - 'calc(15em + 20px)'
 *   - 'calc(15em+20px)'
 *   - '37px'
 *   = '43%'
 */
function _validateCalcValue(calc: string): string {
  return calc.replace(/[\s]/g, '').replace(/[\/\*\+\-]/g, ' $& ');
}
