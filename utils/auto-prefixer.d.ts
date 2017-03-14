/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Applies CSS prefixes to appropriate style keys.*/
export declare function applyCssPrefixes(target: any): any;
export declare function toAlignContentValue(value: string): string;
/** Convert flex values flex-start, flex-end to start, end. */
export declare function toBoxValue(value?: string): string;
/** Convert flex Direction to Box orientations */
export declare function toBoxOrient(flexDirection?: string): "horizontal" | "vertical";
/** Convert flex Direction to Box direction type */
export declare function toBoxDirection(flexDirection?: string): "reverse" | "normal";
/** Convert flex order to Box ordinal group */
export declare function toBoxOrdinal(order?: string): string;
