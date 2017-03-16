/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare const LAYOUT_VALUES: string[];
/**
 * Validate the direction|"direction wrap" value and then update the host's inline flexbox styles
 */
export declare function buildLayoutCSS(value: string): {
    'display': string;
    'box-sizing': string;
    'flex-direction': any;
    'flex-wrap': any;
};
/**
 * Convert layout-wrap="<value>" to expected flex-wrap style
 */
export declare function validateWrapValue(value: any): any;
