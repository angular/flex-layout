/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {applyCssPrefixes} from './auto-prefixer';
import {extendObject} from './object-extend';

describe('auto-prefixer for ', () => {

  /**
   * display
   */
  describe('css `display:<xxx>`', () => {

    it('should not apply a prefix', () => {
      let input = {'display': 'block'};
      let expected = {'display': 'block'};
      let actual = applyCssPrefixes(input);
      checkCssPrefix('display', actual, expected);
    });

    it('should apply prefixes for display', () => {
      let input = {'display': 'flex'};
      let actual = applyCssPrefixes(input);

      expect(Array.isArray(actual['display'])).toBeTruthy();

      // `display:flex` should be last
      expect(actual['display'][0]).toEqual('-webkit-flex');
      expect(actual['display'][1]).toEqual('flex');
    });

  });

  /**
   * flex
   */
  describe('css `flex:<xxx>`', () => {

    it('should apply prefixes for single values', () => {
      let input = {'flex': '100'};
      let expected = extendObject({}, input, {
        '-webkit-flex': '100'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('flex', actual, expected);
    });

    it('should apply prefixes for multiple values', () => {
      let input = {'flex': '2 1 50%'};
      let expected = extendObject({}, input, {
        '-webkit-flex': '2 1 50%'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('flex', actual, expected);
    });

  });

  /**
   * flex-direction
   */
  describe('css `flex-direction:<xxx>`', () => {

    it('should apply prefixes for value == "row"', () => {
      let input = {'flex-direction': 'row'};
      let expected = extendObject({}, input, {
        '-webkit-flex-direction': 'row'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('flex-direction', actual, expected);
    });

    it('should apply prefixes for value == "row-reverse"', () => {
      let input = {'flex-direction': 'row-reverse'};
      let expected = extendObject({}, input, {
        '-webkit-flex-direction': 'row-reverse'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('flex-direction', actual, expected);
    });

    it('should apply prefixes for value == "column"', () => {
      let input = {'flex-direction': 'column'};
      let expected = extendObject({}, input, {
        '-webkit-flex-direction': 'column'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('flex-direction', actual, expected);
    });

    it('should apply prefixes for value == "column-reverse"', () => {
      let input = {'flex-direction': 'column-reverse'};
      let expected = extendObject({}, input, {
        '-webkit-flex-direction': 'column-reverse'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('flex-direction', actual, expected);
    });

  });

  /**
   * flex-wrap
   */
  describe('css `flex-wrap:<xxx>`', () => {

    it('should apply a prefix', () => {
      let input = {'flex-wrap': 'nowrap'};
      let expected = extendObject({}, input, {
        '-webkit-flex-wrap' : 'nowrap'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('flex-wrap', actual, expected);
    });
  });

  /**
   * order
   */
  describe('css `order:<xxx>`', () => {

    it('should apply a prefix', () => {
      let input = {'order': '1'};
      let expected = extendObject({}, input, {
        '-webkit-order' : '1'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('order', actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {'order': 'invalid'};
      let expected = extendObject({}, input, {
        'order': '0',
        '-webkit-order' : '0'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('order', actual, expected);
    });

  });


  /**
   * justify-content
   */
  describe('css `justify-content:<xxx>`', () => {

    it('should apply a prefix', () => {
      let input = {'justify-content': 'flex-start'};
      let expected = extendObject({}, input, {
        '-webkit-justify-content': 'flex-start'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('justify-content', actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {'justify-content': 'flex-end'};
      let expected = extendObject({}, input, {
        '-webkit-justify-content': 'flex-end'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('justify-content', actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {'justify-content': 'center'};
      let expected = extendObject({}, input, {
        '-webkit-justify-content': 'center'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('justify-content', actual, expected);
    });
  });

  /**
   * align-items
   */
  describe('css `align-item:<xxx>`', () => {

    it('should apply a prefix', () => {
      let input = {'align-items': 'flex-start'};
      let expected = extendObject({}, input, {
        '-webkit-align-items': 'flex-start'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('align-items', actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {'align-items': 'flex-end'};
      let expected = extendObject({}, input, {
        '-webkit-align-items': 'flex-end'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('align-items', actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {'align-items': 'center'};
      let expected = extendObject({}, input, {
        '-webkit-align-items': 'center'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('align-items', actual, expected);
    });


  });


  /**
   * align-self
   */
  describe('css `align-self:<xxx>`', () => {

    it('should apply a prefix', () => {
      let input = {'align-self': 'flex-start'};
      let expected = extendObject({}, input, {
        '-webkit-align-self' : 'flex-start'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('align-self', actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {'align-self': 'flex-end'};
      let expected = extendObject({}, input, {
        '-webkit-align-self' : 'flex-end'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('align-self', actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {'align-self': 'center'};
      let expected = extendObject({}, input, {
        '-webkit-align-self' : 'center'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('align-self', actual, expected);
    });

  });

  /**
   * align-self
   */
  describe('css `align-content:<xxx>`', () => {

    it('should apply a prefix', () => {
      let input = {'align-content': 'flex-start'};
      let expected = extendObject({}, input, {
        '-webkit-align-content': 'flex-start'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('align-content', actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {'align-content': 'flex-end'};
      let expected = extendObject({}, input, {
        '-webkit-align-content' : 'flex-end'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('align-content', actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {'align-content': 'center'};
      let expected = extendObject({}, input, {
        '-webkit-align-content': 'center'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('align-content', actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {'align-content': 'stretch'};
      let expected = extendObject({}, input, {
        '-webkit-align-content': 'stretch'
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix('align-content', actual, expected);
    });
  });


});

/**
 * Internal checks to `expect().toEqual()`
 */
function checkCssPrefix(key: string,
                        actual: {[key: string]: string},
                        expected: {[key: string]: string}) {
  expect(actual[key]).toEqual(expected[key]);
  switch (key) {
    case 'display':
      expect(actual['display']).toEqual(expected[key]);
      break;

    case 'align-items':
    case 'align-self':
    case 'align-content':
    case 'flex':
    case 'flex-direction':
    case 'flex-wrap':
    case 'flex-grow':
    case 'flex-shrink':
    case 'flex-basis':
    case 'flex-flow':
    case 'justify-content':
    case 'order':
      expect(actual[key]).toEqual(expected['-webkit-' + key]);
      break;
  }
}
