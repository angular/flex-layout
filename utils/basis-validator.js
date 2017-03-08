/**
 * The flex API permits 3 or 1 parts of the value:
 *    - `flex-grow flex-shrink flex-basis`, or
 *    - `flex-basis`
 * Flex-Basis values can be complicated short-hand versions such as:
 *   - "3 3 calc(15em + 20px)"
 *   - "calc(15em + 20px)"
 *   - "calc(15em+20px)"
 *   - "37px"
 *   = "43%"
 */
/**
 * The flex API permits 3 or 1 parts of the value:
 *    - `flex-grow flex-shrink flex-basis`, or
 *    - `flex-basis`
 * Flex-Basis values can be complicated short-hand versions such as:
 *   - "3 3 calc(15em + 20px)"
 *   - "calc(15em + 20px)"
 *   - "calc(15em+20px)"
 *   - "37px"
 *   = "43%"
 */ export function validateBasis(basis, grow, shrink) {
    if (grow === void 0) { grow = "1"; }
    if (shrink === void 0) { shrink = "1"; }
    var parts = [grow, shrink, basis];
    var j = basis.indexOf('calc');
    if (j > 0) {
        parts[2] = _validateCalcValue(basis.substring(j).trim());
        var matches = basis.substr(0, j).trim().split(" ");
        if (matches.length == 2) {
            parts[0] = matches[0];
            parts[1] = matches[1];
        }
    }
    else if (j == 0) {
        parts[2] = _validateCalcValue(basis.trim());
    }
    else {
        var matches = basis.split(" ");
        parts = (matches.length === 3) ? matches : [
            grow, shrink, basis
        ];
    }
    return parts;
}
/**
 * Calc expressions require whitespace before & after the operator
 * This is a simple, crude whitespace padding solution.
 */
function _validateCalcValue(calc) {
    var operators = ["+", "-", "*", "/"];
    var findOperator = function () { return operators.reduce(function (index, operator) {
        return index || (calc.indexOf(operator) + 1);
    }, 0); };
    if (findOperator() > 0) {
        calc = calc.replace(/[\s]/g, "");
        var offset = findOperator() - 1;
        calc = calc.substr(0, offset) + " " + calc.charAt(offset) + " " + calc.substr(offset + 1);
    }
    return calc;
}
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/utils/basis-validator.js.map