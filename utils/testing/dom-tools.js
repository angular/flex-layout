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
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */ export var _dom = {
    hasStyle: hasStyle,
    getDistributedNodes: getDistributedNodes,
    getShadowRoot: getShadowRoot,
    getText: getText,
    getStyle: getStyle,
    childNodes: childNodes,
    childNodesAsList: childNodesAsList,
    hasClass: hasClass,
    hasShadowRoot: hasShadowRoot,
    isCommentNode: isCommentNode,
    isElementNode: isElementNode,
    isPresent: isPresent,
    isShadowRoot: isShadowRoot,
    tagName: tagName
};
// ******************************************************************************************
// These functions are cloned from
//  *  @angular/platform-browser/src/browser/GenericBrowserDomAdapter
// and are to be used ONLY internally in custom-matchers.ts and Unit Tests
// ******************************************************************************************
function getStyle(element, stylename) {
    return element.style[stylename];
}
function hasStyle(element, styleName, styleValue) {
    if (styleValue === void 0) { styleValue = null; }
    var value = this.getStyle(element, styleName) || '';
    return styleValue ? value == styleValue : value.length > 0;
}
function getDistributedNodes(el) {
    return el.getDistributedNodes();
}
function getShadowRoot(el) {
    return el.shadowRoot;
}
function getText(el) {
    return el.textContent;
}
function childNodesAsList(el) {
    var childNodes = el.childNodes;
    var res = new Array(childNodes.length);
    for (var i = 0; i < childNodes.length; i++) {
        res[i] = childNodes[i];
    }
    return res;
}
function hasClass(element, className) {
    return element.classList.contains(className);
}
function childNodes(el) {
    return el.childNodes;
}
function hasShadowRoot(node) {
    return isPresent(node.shadowRoot) && node instanceof HTMLElement;
}
function isCommentNode(node) {
    return node.nodeType === Node.COMMENT_NODE;
}
function isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}
function isShadowRoot(node) {
    return node instanceof DocumentFragment;
}
function isPresent(obj) {
    return obj != null;
}
function tagName(element) {
    return element.tagName;
}
//# sourceMappingURL=dom-tools.js.map