/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare type MediaQuerySubscriber = (changes: MediaChange) => void;
/**
 * Class instances emitted [to observers] for each mql notification
 */
export declare class MediaChange {
    matches: boolean;
    mediaQuery: string;
    mqAlias: string;
    suffix: string;
    property: string;
    value: any;
    constructor(matches?: boolean, mediaQuery?: string, mqAlias?: string, suffix?: string);
    clone(): MediaChange;
}
