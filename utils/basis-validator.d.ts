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
export declare function validateBasis(basis: string, grow?: string, shrink?: string): string[];
