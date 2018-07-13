/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {validateBasis} from './basis-validator';


describe('validateBasis', () => {

  it('should validate single-value basis with default grow/shrink', () => {
    let result = validateBasis('37px').join(' ');
    expect( result ).toEqual('1 1 37px');
  });

  it('should validate single-value basis with custom grow and shrink', () => {
    let result = validateBasis('37px', '2', '13').join(' ');
    expect( result ).toEqual('2 13 37px');
  });

  it('should validate full `flex` value `2 1 37%`', () => {
    let result = validateBasis('2 1 37%').join(' ');
    expect( result ).toEqual('2 1 37%');
  });

  it('should validate with complex value that includes calc()', () => {
    let result = validateBasis('3 3 calc(15em + 20px)').join(' ');
    expect( result ).toEqual('3 3 calc(15em + 20px)');
  });

  it('should validate calc() expression with multiple operators', () => {
    let result = validateBasis('calc(100% / 7 * 2)').join(' ');
    expect( result ).toEqual('1 1 calc(100% / 7 * 2)');
  });

  it('should validate with complex value that includes a bad calc() expression', () => {
    let result = validateBasis('3 3 calc(15em +20px)').join(' ');
    expect( result ).toEqual('3 3 calc(15em + 20px)');
  });

  it('should validate with complex value that includes ONLY calc()', () => {
    let result = validateBasis('calc(15em + 20px)').join(' ');
    expect( result ).toEqual('1 1 calc(15em + 20px)');
  });

  it('should validate with good calc(x + x) expression()', () => {
      let result = validateBasis('calc(15em + 20px)').join(' ');
      expect( result ).toEqual('1 1 calc(15em + 20px)');
    });

  it('should validate with bad calc(x+x) expression()', () => {
    let result = validateBasis('calc(15em+20px)').join(' ');
    expect( result ).toEqual('1 1 calc(15em + 20px)');
  });

  it('should validate with bad calc(x-x) expression()', () => {
    let result = validateBasis('calc(15em-20px)').join(' ');
    expect( result ).toEqual('1 1 calc(15em - 20px)');
  });

  it('should validate with bad calc(x*x) expression()', () => {
    let result = validateBasis('calc(15em*20px)').join(' ');
    expect( result ).toEqual('1 1 calc(15em * 20px)');
  });

  it('should validate with bad calc(x/x) expression()', () => {
    let result = validateBasis('calc(15em/20px)').join(' ');
    expect( result ).toEqual('1 1 calc(15em / 20px)');
  });
});
