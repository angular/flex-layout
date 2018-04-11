/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

declare var global: any;
const _global = <any>(typeof window === 'undefined' ? global : window);

import {_dom as _} from './dom-tools';

import {applyCssPrefixes} from '../auto-prefixer';
import {extendObject} from '../object-extend';

export const expect: (actual: any) => NgMatchers = <any> _global.expect;

/**
 * Jasmine matchers that check Angular specific conditions.
 */
export interface NgMatchers extends jasmine.Matchers<any> {
  /**
   * Expect the element to have exactly the given text.
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toHaveText'}
   */
  toHaveText(expected: string): boolean;

  /**
   * Compare key:value pairs as matching EXACTLY
   */
  toHaveMap(expected: { [k: string]: string }): boolean;

  /**
   * Expect the element to have the given CSS class.
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toHaveCssClass'}
   */
  toHaveCssClass(expected: string): boolean;

  /**
   * Expect the element to have the given pairs of attribute name and attribute value
   */
  toHaveAttributes(expected: { [k: string]: string }): boolean;

  /**
   * Expect the element to have the given CSS styles injected INLINE
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toHaveStyle'}
   */
  toHaveStyle(expected: { [k: string]: string } | string): boolean;

  /**
   * Expect the element to have the given CSS inline OR computed styles.
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toHaveStyle'}
   */
  toHaveStyle(expected: { [k: string]: string } | string): boolean;

  /**
   * Invert the matchers.
   */
  not: NgMatchers;
}

/**
 * NOTE: These custom JASMINE Matchers are used only
 *       in the Karma/Jasmine testing for the Layout Directives
 *       in `src/lib/flex/api`
 */
export const customMatchers: jasmine.CustomMatcherFactories = {

  toEqual: function (util) {
    return {
      compare: function (actual: any, expected: any) {
        return {pass: util.equals(actual, expected, [compareMap])};
      }
    };

    function compareMap(actual: any, expected: any) {
      if (actual instanceof Map) {
        let pass = actual.size === expected.size;
        if (pass) {
          actual.forEach((v: any, k: any) => {
            pass = pass && util.equals(v, expected.get(k));
          });
        }
        return pass;
      } else {
        return undefined;
      }
    }
  },

  toHaveText: function () {
    return {
      compare: function (actual: any, expectedText: string) {
        const actualText = elementText(actual);
        return {
          pass: actualText == expectedText,
          get message() {
            return 'Expected ' + actualText + ' to be equal to ' + expectedText;
          }
        };
      }
    };
  },

  toHaveCssClass: function () {
    return {compare: buildError(false), negativeCompare: buildError(true)};

    function buildError(isNot: boolean) {
      return function (actual: any, className: string) {
        return {
          pass: _.hasClass(actual, className) == !isNot,
          get message() {
            return `
              Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}
              to contain the CSS class '${className}'
            `;
          }
        };
      };
    }
  },

  toHaveMap: function () {
    return {
      compare: function (actual: { [k: string]: string }, map: { [k: string]: string }) {
        let allPassed: boolean;
        allPassed = Object.keys(map).length !== 0;
        Object.keys(map).forEach(key => {
          allPassed = allPassed && (actual[key] === map[key]);
        });

        return {
          pass: allPassed,
          get message() {
            return `
              Expected ${JSON.stringify(actual)} ${!allPassed ? ' ' : 'not '} to contain the
              '${JSON.stringify(map)}'
            `;
          }
        };
      }
    };
  },

  toHaveAttributes: function () {
    return {
      compare: function (actual: any, map: { [k: string]: string }) {
        let allPassed: boolean;
        let attributeNames = Object.keys(map);
        allPassed = attributeNames.length !== 0;
        attributeNames.forEach(name => {
          allPassed = allPassed && _.hasAttribute(actual, name)
              && _.getAttribute(actual, name) === map[name];
        });
        return {
          pass: allPassed,
          get message() {
            return `
              Expected ${actual.outerHTML} ${allPassed ? 'not ' : ''} attributes to contain
              '${JSON.stringify(map)}'
            `;
          }
        };
      }
    };
  },

  /**
   * Check element's inline styles only
   */
  toHaveStyle: function () {
    return {
      compare: buildCompareStyleFunction(true)
    };
  },


  /**
   * Check element's css stylesheet only (if not present inline)
   */
  toHaveCSS: function () {
    return {
      compare: buildCompareStyleFunction(false)
    };
  }

};

/**
 * Curried value to function to check styles that are inline or in a stylesheet for the
 * specified DOM element.
 */
function buildCompareStyleFunction(inlineOnly = true) {
  return function (actual: any, styles: { [k: string]: string } | string, styler: any) {
    let found = {};

    let allPassed: boolean;
    if (typeof styles === 'string') {
      styles = {[styles]: ''};
    }

    allPassed = Object.keys(styles).length !== 0;
    Object.keys(styles).forEach(prop => {
      let {elHasStyle, current} = hasPrefixedStyles(actual, prop, styles[prop], inlineOnly, styler);
      allPassed = allPassed && elHasStyle;
      if (!elHasStyle) {
        extendObject(found, current);
      }
    });

    return {
      pass: allPassed,
      get message() {
        const expectedValueStr = (typeof styles === 'string') ? styles :
            JSON.stringify(styles, null, 2);
        const foundValueStr = inlineOnly ? actual.outerHTML : JSON.stringify(found);
        return `
          Expected ${foundValueStr}${!allPassed ? '' : ' not'} to contain the
          CSS ${typeof styles === 'string' ? 'property' : 'styles'} '${expectedValueStr}'
        `;
      }
    };
  };
}

/**
 * Validate presence of requested style or use fallback
 * to possible `prefixed` styles. Useful when some browsers
 * (Safari, IE, etc) will use prefixed style instead of defaults.
 */
function hasPrefixedStyles(actual, key, value, inlineOnly, styler) {
  const current = {};

  value = value !== '*' ? value.trim() : '';
  let elHasStyle = styler.lookupStyle(actual, key, inlineOnly) === value;
  if (!elHasStyle) {
    let prefixedStyles = applyCssPrefixes({[key]: value});
    Object.keys(prefixedStyles).forEach(prop => {
      // Search for optional prefixed values
      elHasStyle = elHasStyle ||
        styler.lookupStyle(actual, prop, inlineOnly) === prefixedStyles[prop];
    });
  }
  // Return BOTH confirmation and current computed key values (if confirmation == false)
  return {elHasStyle, current};
}

function elementText(n: any): string {
  const hasNodes = (m: any) => {
    const children = _.childNodes(m);
    return children && children['length'];
  };

  if (n instanceof Array) {
    return n.map(elementText).join('');
  }

  if (_.isCommentNode(n)) {
    return '';
  }

  if (_.isElementNode(n) && _.tagName(n) == 'CONTENT') {
    return elementText(Array.prototype.slice.apply(_.getDistributedNodes(n)));
  }

  if (_.hasShadowRoot(n)) {
    return elementText(_.childNodesAsList(_.getShadowRoot(n)));
  }

  if (hasNodes(n)) {
    return elementText(_.childNodesAsList(n));
  }

  return _.getText(n);
}

