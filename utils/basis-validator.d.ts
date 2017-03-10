/**
 * The flex API permits 3 or 1 parts of the value:
 *    - `flex-grow flex-shrink flex-basis`, or
 *    - `flex-basis`
 */
export declare function validateBasis(basis: string, grow?: string, shrink?: string): string[];
