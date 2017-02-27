/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare type NgStyleRawList = string[];
export declare type NgStyleMap = {
    [klass: string]: string;
};
export declare type NgStyleType = string | Set<string> | NgStyleRawList | NgStyleMap;
/**
 * Callback function for SecurityContext.STYLE sanitization
 */
export declare type NgStyleSanitizer = (val: any) => string;
/**
 * NgStyle allowed inputs
 */
export declare class NgStyleKeyValue {
    key: string;
    value: string;
    constructor(key: string, value: string, noQuotes?: boolean);
}
/**
 * Transform Operators for @angular/flex-layout NgStyle Directive
 */
export declare const ngStyleUtils: {
    getType: (target: any) => string;
    buildRawList: (source: any, delimiter?: string) => string[];
    buildMapFromList: (styles: string[], sanitize?: NgStyleSanitizer) => NgStyleMap;
    buildMapFromSet: (source: any, sanitize?: NgStyleSanitizer) => NgStyleMap;
};
