/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ElementRef} from '@angular/core';
import {BaseFxDirectiveAdapter} from './base-adapter';
import {expect} from '../../utils/testing/custom-matchers';

export class MockElementRef extends ElementRef {
  constructor() {
    const nEl = document.createElement('DIV');
    super(nEl);
    this.nativeElement = nEl;
  }
}

describe('BaseFxDirectiveAdapter class', () => {
  let component;
  beforeEach(() => {
    component = new BaseFxDirectiveAdapter(null, null, new MockElementRef(), null);
  });
  describe('cacheInput', () => {
    it('should call _cacheInputArray when source is an array', () => {
      spyOn(component, '_cacheInputArray');
      component.cacheInput('key', []);
      expect(component._cacheInputArray).toHaveBeenCalled();
    });
    it('should call _cacheInputObject when source is an object', () => {
      spyOn(component, '_cacheInputObject');
      component.cacheInput('key', {});
      expect(component._cacheInputObject).toHaveBeenCalled();
    });
    it('should call _cacheInputString when source is a string', () => {
      spyOn(component, '_cacheInputString');
      component.cacheInput('key', '');
      expect(component._cacheInputString).toHaveBeenCalled();
    });
    it('should throw when source is not an object, array or string', () => {
      expect(component.cacheInput.bind(null, true)).toThrow();
    });
  });

});



