/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Exported DOM accessor utility functions
 */
export declare const _dom: {
    hasStyle: (element: any, styleName: string, styleValue?: string) => boolean;
    getDistributedNodes: (el: HTMLElement) => Node[];
    getShadowRoot: (el: HTMLElement) => DocumentFragment;
    getText: (el: Node) => string;
    getStyle: (element: any, stylename: string) => string;
    childNodes: (el: any) => Node[];
    childNodesAsList: (el: Node) => any[];
    hasClass: (element: any, className: string) => boolean;
    hasShadowRoot: (node: any) => boolean;
    isCommentNode: (node: Node) => boolean;
    isElementNode: (node: Node) => boolean;
    isPresent: (obj: any) => boolean;
    isShadowRoot: (node: any) => boolean;
    tagName: (element: any) => string;
};
