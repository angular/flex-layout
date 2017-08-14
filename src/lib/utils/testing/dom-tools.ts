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
export const _dom = {
  hasStyle,
  getDistributedNodes,
  getShadowRoot,
  getText,
  getStyle,
  childNodes,
  childNodesAsList,
  hasClass,
  hasShadowRoot,
  isCommentNode,
  isElementNode,
  isPresent,
  isShadowRoot,
  tagName
};

// ******************************************************************************************
// These functions are cloned from
//  *  @angular/platform-browser/src/browser/GenericBrowserDomAdapter
// and are to be used ONLY internally in custom-matchers.ts and Unit Tests
// ******************************************************************************************

function getStyle(element: any, stylename: string): string {
  return element.style[stylename];
}

function hasStyle(element: any,
                  styleName: string,
                  styleValue: string = null,
                  inlineOnly = true): boolean {
  let value = getStyle(element, styleName) || '';
  if ( !value && !inlineOnly ) {
    // Search stylesheets
    value = getComputedStyle(element).getPropertyValue(styleName) || '';
  }
  return styleValue ? value == styleValue : value.length > 0;
}

function getDistributedNodes(el: HTMLElement): Node[] {
  return (<any>el).getDistributedNodes();
}

function getShadowRoot(el: HTMLElement): DocumentFragment {
  return (<any>el).shadowRoot;
}

function getText(el: Node): string {
  return el.textContent;
}

function childNodesAsList(el: Node): any[] {
  const childNodes = el.childNodes;
  const res = new Array(childNodes.length);
  for (let i = 0; i < childNodes.length; i++) {
    res[i] = childNodes[i];
  }
  return res;
}

function hasClass(element: any, className: string): boolean {
  return element.classList.contains(className);
}

function childNodes(el: any): Node[] {
  return el.childNodes;
}

function hasShadowRoot(node: any): boolean {
  return isPresent(node.shadowRoot) && node instanceof HTMLElement;
}

function isCommentNode(node: Node): boolean {
  return node.nodeType === Node.COMMENT_NODE;
}

function isElementNode(node: Node): boolean {
  return node.nodeType === Node.ELEMENT_NODE;
}

function isShadowRoot(node: any): boolean {
  return node instanceof DocumentFragment;
}

function isPresent(obj: any): boolean {
  return obj != null;
}

function tagName(element: any): string {
  return element.tagName;
}
