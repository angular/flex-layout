/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {customMatchers, expect} from '../testing/custom-matchers';
import {NgStyleRawList, NgStyleMap, ngStyleUtils as _} from './style-transforms';

describe('ngStyleUtils', () => {
  beforeEach(() => {
      jasmine.addMatchers(customMatchers);
  });

  it('should parse a raw string of key:value pairs', () => {
    let list: NgStyleRawList = _.buildRawList(`
      color:'red';
      font-size :16px;
      background-color:rgba(116, 37, 49, 0.72);
    `);

    expect(list[0]).toEqual(`color:'red'`);
    expect(list[1]).toEqual('font-size :16px');
    expect(list[2]).toEqual('background-color:rgba(116, 37, 49, 0.72)');
  });

  it('should build an iterable map from a raw string of key:value pairs', () => {
    let map: NgStyleMap = _.buildMapFromList(_.buildRawList(`
      color:'red';
      font-size :16px;
      background-color:rgba(116, 37, 49, 0.72);
    `));

    expect(map).toHaveMap({
      'color': 'red',
      'font-size': '16px',
      'background-color': 'rgba(116, 37, 49, 0.72)'
    });
  });

  it('should build an iterable map from an Array of key:value strings', () => {
    let map: NgStyleMap = _.buildMapFromList(_.buildRawList(`
      color:'red';
      font-size :16px;
      background-color:rgba(116, 37, 49, 0.72);
    `));

    expect(map).toHaveMap({
      'color': 'red',
      'font-size': '16px',
      'background-color': 'rgba(116, 37, 49, 0.72)'
    });
  });

  it('should build an iterable map from an Set of key:value pairs', () => {
      let customSet = new Set<string>();
      customSet.add('color:"red"');
      customSet.add('font-size :16px;');
      customSet.add('background-color:rgba(116, 37, 49, 0.72)');

      let map: NgStyleMap = _.buildMapFromSet(customSet);

      expect(map).toHaveMap({
        'color': 'red',
        'font-size': '16px',
        'background-color': 'rgba(116, 37, 49, 0.72)'
      });
    });

});
