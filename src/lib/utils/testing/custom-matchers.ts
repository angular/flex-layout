/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

declare var global: any;
const _global = <any>(typeof window === 'undefined' ? global : window);

import {_dom as _} from './dom-tools';
import {applyCssPrefixes} from '../auto-prefixer';

export const expect: (actual: any) => NgMatchers = <any> _global.expect;

/**
 * Jasmine matchers that check Angular specific conditions.
 */
export interface NgMatchers extends jasmine.Matchers {
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
  toHaveMap(expected: {[k: string]: string}): boolean;

  /**
   * Expect the element to have the given CSS class.
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toHaveCssClass'}
   */
  toHaveCssClass(expected: string): boolean;

  /**
   * Expect the element to have the given CSS styles.
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toHaveCssStyle'}
   */
  toHaveCssStyle(expected: {[k: string]: string}|string): boolean;

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

  toHaveMap : function() {
    return {
      compare: function (actual: {[k: string]: string}, map: {[k: string]: string}) {
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

  toHaveCssStyle: function () {
    return {
      compare: function (actual: any, styles: {[k: string]: string}|string) {
        let allPassed: boolean;
        if (typeof styles === 'string') {
          allPassed = _.hasStyle(actual, styles);
        } else {
          allPassed = Object.keys(styles).length !== 0;
          Object.keys(styles).forEach(prop => {
            allPassed = allPassed && hasPrefixedStyles(actual, prop, styles[prop]);
          });
        }

        return {
          pass: allPassed,
          get message() {
            const expectedValueStr = typeof styles === 'string' ? styles : JSON.stringify(styles);
            return `
              Expected ${actual.outerHTML} ${!allPassed ? ' ' : 'not '} to contain the
              CSS ${typeof styles === 'string' ? 'property' : 'styles'} '${expectedValueStr}'
            `;
          }
        };
      }
    };
  }

};

/**
 * Validate presence of requested style or use fallback
 * to possible `prefixed` styles. Useful when some browsers
 * (Safari, IE, etc) will use prefixed style instead of defaults.
 */
function hasPrefixedStyles(actual, key, value) {
  value = value !== '*' ? value.trim() : undefined;
  let elHasStyle = _.hasStyle(actual, key, value);
  if (!elHasStyle) {
    let prefixedStyles = applyCssPrefixes({[key]: value});
    Object.keys(prefixedStyles).forEach(prop => {
      // Search for optional prefixed values
      elHasStyle = elHasStyle || _.hasStyle(actual, prop, prefixedStyles[prop]);
    });
  }
  return elHasStyle;
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

