import {__platform_browser_private__} from '@angular/platform-browser';

let getDOM = __platform_browser_private__.getDOM;

/**
 * NOTE: These custom JASMINE Matchers are used only
 *       in the Karma/Jasmine testing for the Layout Directives
 *       in `src/lib/flex/api`
 */
let customMatchers : jasmine.CustomMatcherFactories = {

    toHaveCssClass: function() {
      return {compare: buildError(false), negativeCompare: buildError(true)};

      function buildError(isNot: boolean) {
        return function(actual: any, className: string) {
          return {
            pass: getDOM().hasClass(actual, className) == !isNot,
            get message() {
              return `Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}to contain the CSS class "${className}"`;
            }
          };
        };
      }
    },

    toHaveCssStyle: function() {
      return {
        compare: function(actual: any, styles: {[k: string]: string}|string) {
          let allPassed: boolean;
          if (typeof styles === 'string') {
            allPassed = getDOM().hasStyle(actual, styles);
          } else {
            allPassed = Object.keys(styles).length !== 0;
            Object.keys(styles).forEach(prop => {
              allPassed = allPassed && getDOM().hasStyle(actual, prop, styles[prop]);
            });
          }

          return {
            pass: allPassed,
            get message() {
              const expectedValueStr = typeof styles === 'string' ? styles : JSON.stringify(styles);
              return `Expected ${actual.outerHTML} ${!allPassed ? ' ' : 'not '}to contain the
                      CSS ${typeof styles === 'string' ? 'property' : 'styles'} "${expectedValueStr}"`;
            }
          };
        }
      };
    }

  };

function elementText(n: any): string {
  const hasNodes = (n: any) => {
    const children = getDOM().childNodes(n);
    return children && children["length"];
  };

  if (n instanceof Array) {
    return n.map(elementText).join('');
  }

  if (getDOM().isCommentNode(n)) {
    return '';
  }

  if (getDOM().isElementNode(n) && getDOM().tagName(n) == 'CONTENT') {
    return elementText(Array.prototype.slice.apply(getDOM().getDistributedNodes(n)));
  }

  if (getDOM().hasShadowRoot(n)) {
    return elementText(getDOM().childNodesAsList(getDOM().getShadowRoot(n)));
  }

  if (hasNodes(n)) {
    return elementText(getDOM().childNodesAsList(n));
  }

  return getDOM().getText(n);
}


export { customMatchers };
