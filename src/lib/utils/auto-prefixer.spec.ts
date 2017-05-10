/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
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
      let input = {"display": "block"};
      let expected = {"display": "block"};
      let actual = applyCssPrefixes(input);
      checkCssPrefix("display", actual, expected);
    });

    it('should apply prefixes for display', () => {
      let input = {"display": "flex"};
      let actual = applyCssPrefixes(input);
      expect(Array.isArray(actual['display'])).toBeTruthy();
      expect(actual['display'][0]).toEqual('-webkit-box');
      expect(actual['display'][4]).toEqual('flex');
    });
  });

  /**
   * flex
   */
  describe('css `flex:<xxx>`', () => {

    it('should apply prefixes for single values', () => {
      let input = {"flex": "100"};
      let expected = extendObject({}, input, {
        '-ms-flex': "100",
        '-webkit-box-flex': "100"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("flex", actual, expected);
    });

    it('should apply prefixes for multiple values', () => {
      let input = {"flex": "2 1 50%"};
      let expected = extendObject({}, input, {
        '-ms-flex': "2 1 50%",
        '-webkit-box-flex': "2"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("flex", actual, expected);
    });

  });

  /**
   * flex-direction
   */
  describe('css `flex-direction:<xxx>`', () => {

    it('should apply prefixes for value == "row"', () => {
      let input = {"flex-direction": "row"};
      let expected = extendObject({}, input, {
        '-ms-flex-direction': "row",
        '-webkit-box-orient': "horizontal",
        '-webkit-box-direction': "normal"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("flex-direction", actual, expected);
    });

    it('should apply prefixes for value == "row-reverse"', () => {
      let input = {"flex-direction": "row-reverse"};
      let expected = extendObject({}, input, {
        '-ms-flex-direction': "row-reverse",
        '-webkit-box-orient': "horizontal",
        '-webkit-box-direction': "reverse"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("flex-direction", actual, expected);
    });

    it('should apply prefixes for value == "column"', () => {
      let input = {"flex-direction": "column"};
      let expected = extendObject({}, input, {
        '-ms-flex-direction': "column",
        '-webkit-box-orient': "vertical",
        '-webkit-box-direction': "normal"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("flex-direction", actual, expected);
    });

    it('should apply prefixes for value == "column-reverse"', () => {
      let input = {"flex-direction": "column-reverse"};
      let expected = extendObject({}, input, {
        '-ms-flex-direction': "column-reverse",
        '-webkit-box-orient': "vertical",
        '-webkit-box-direction': "reverse"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("flex-direction", actual, expected);
    });

  });

  /**
   * flex-wrap
   */
  describe('css `flex-wrap:<xxx>`', () => {

    it('should apply a prefix', () => {
      let input = {"flex-wrap": "nowrap"};
      let expected = extendObject({}, input, {
        "-ms-flex-wrap": "nowrap"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("flex-wrap", actual, expected);
    });
  });

  /**
   * order
   */
  describe('css `order:<xxx>`', () => {

    it('should apply a prefix', () => {
      let input = {"order": "1"};
      let expected = extendObject({}, input, {
        "-ms-flex-order": "1",
        "-webkit-box-ordinal-group": "2"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("order", actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {"order": "invalid"};
      let expected = extendObject({}, input, {
        "order": "0",
        "-ms-flex-order": "0",
        "-webkit-box-ordinal-group": "1"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("order", actual, expected);
    });

  });


  /**
   * justify-content
   */
  describe('css `justify-content:<xxx>`', () => {

    it('should apply a prefix', () => {
      let input = {"justify-content": "flex-start"};
      let expected = extendObject({}, input, {
        "-ms-flex-pack": "start",
        "-webkit-box-pack": "start"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("justify-content", actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {"justify-content": "flex-end"};
      let expected = extendObject({}, input, {
        "-ms-flex-pack": "end",
        "-webkit-box-pack": "end"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("justify-content", actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {"justify-content": "center"};
      let expected = extendObject({}, input, {
        "-ms-flex-pack": "center",
        "-webkit-box-pack": "center"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("justify-content", actual, expected);
    });
  });

  /**
   * align-items
   */
  describe('css `align-item:<xxx>`', () => {

    it('should apply a prefix', () => {
      let input = {"align-items": "flex-start"};
      let expected = extendObject({}, input, {
        "-ms-flex-align": "start",
        "-webkit-box-align": "start"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("align-items", actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {"align-items": "flex-end"};
      let expected = extendObject({}, input, {
        "-ms-flex-align": "end",
        "-webkit-box-align": "end"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("align-items", actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {"align-items": "center"};
      let expected = extendObject({}, input, {
        "-ms-flex-align": "center",
        "-webkit-box-align": "center"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("align-items", actual, expected);
    });


  });


  /**
   * align-self
   */
  describe('css `align-self:<xxx>`', () => {

    it('should apply a prefix', () => {
      let input = {"align-self": "flex-start"};
      let expected = extendObject({}, input, {
        "-ms-flex-item-align": "start"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("align-self", actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {"align-self": "flex-end"};
      let expected = extendObject({}, input, {
        "-ms-flex-item-align": "end"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("align-self", actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {"align-self": "center"};
      let expected = extendObject({}, input, {
        "-ms-flex-item-align": "center"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("align-self", actual, expected);
    });

  });

  /**
   * align-self
   */
  describe('css `align-content:<xxx>`', () => {

    it('should apply a prefix', () => {
      let input = {"align-content": "flex-start"};
      let expected = extendObject({}, input, {
        "-ms-flex-line-pack": "start"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("align-content", actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {"align-content": "flex-end"};
      let expected = extendObject({}, input, {
        "-ms-flex-line-pack": "end"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("align-content", actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {"align-content": "center"};
      let expected = extendObject({}, input, {
        "-ms-flex-line-pack": "center"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("align-content", actual, expected);
    });

    it('should apply a prefix', () => {
      let input = {"align-content": "stretch"};
      let expected = extendObject({}, input, {
        "-ms-flex-line-pack": "stretch"
      });
      let actual = applyCssPrefixes(input);
      checkCssPrefix("align-content", actual, expected);
    });
  });


});

/**
 * Internal checks to `expect().toEqual()`
 */
function checkCssPrefix(iKey, actual, expected) {
  expect(actual[iKey]).toEqual(expected[iKey]);
  switch (iKey) {
    case 'display':
      expect(actual['display']).toEqual(expected[iKey]);
      break;
    case 'flex':
      expect(actual['-ms-flex']).toEqual(expected['-ms-flex']);
      expect(actual['-webkit-box-flex']).toEqual(expected['-webkit-box-flex'].split(" ")[0]);
      break;

    case 'flex-direction':
      expect(actual['-ms-flex-direction']).toEqual(expected['-ms-flex-direction']);
      expect(actual['-webkit-box-orient']).toEqual(expected['-webkit-box-orient']);
      expect(actual['-webkit-box-direction']).toEqual(expected['-webkit-box-direction']);
      break;

    case 'flex-wrap':
      expect(actual['-ms-flex-wrap']).toEqual(expected['-ms-flex-wrap']);
      break;

    case 'order':
      expect(actual['-ms-flex-order']).toEqual(expected['-ms-flex-order']);
      expect(actual['-webkit-box-ordinal-group']).toEqual(expected['-webkit-box-ordinal-group']);
      break;

    case 'justify-content':
      expect(actual['-ms-flex-pack']).toEqual(expected['-ms-flex-pack']);
      expect(actual['-webkit-box-pack']).toEqual(expected['-webkit-box-pack']);
      break;

    case 'align-items':
      expect(actual['-ms-flex-align']).toEqual(expected['-ms-flex-align']);
      expect(actual['-webkit-box-align']).toEqual(expected['-webkit-box-align']);
      break;

    case 'align-self':
      expect(actual['-ms-flex-item-align']).toEqual(expected['-ms-flex-item-align']);
      break;

    case 'align-content':
      expect(actual['-ms-flex-line-pack']).toEqual(expected['-ms-flex-line-pack']);
      break;


  }
}
