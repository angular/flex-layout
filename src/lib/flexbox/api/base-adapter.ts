/**
 * Adapted BaseFxDirective abtract class version so it can be used via composition.
 *
 * @see BaseFxDirective
 */
import {BaseFxDirective} from './base';
import {ResponsiveActivation} from './../responsive/responsive-activation';
import {MediaQuerySubscriber} from '../../media-query/media-change';

export class BaseFxDirectiveAdapter extends BaseFxDirective {
  get inputMap() {
    return this._inputMap;
  }

  /**
   *  Save the property value.
   */
  cacheInput(key?: string, source?: any) {
    if (Array.isArray(source)) {
      this._cacheInputArray(key, source);
    } else if (typeof source === 'object') {
      this._cacheInputObject(key, source);
    } else if (typeof source === 'string') {
      this._cacheInputString(key, source);
    } else {
      throw new Error('Invalid class value provided');
    }
  }

  _cacheInputRaw(key?: string, source?: any) {
    this._inputMap[key] = source;
  }

  /**
   *  Save the property value for Array values.
   */
  _cacheInputArray(key?: string, source?: boolean[]) {
    this._inputMap[key] = source.join(' ');
  }

  /**
   *  Save the property value for key/value pair values.
   */
  _cacheInputObject(key?: string, source?: {[key: string]: boolean}) {
    let classes = [];
    for (let prop in source) {
      if (!!source[prop]) {
        classes.push(prop);
      }
    }
    this._inputMap[key] = classes.join(' ');
  }

  /**
   *  Save the property value for string values.
   */
  _cacheInputString(key?: string, source?: string) {
    this._inputMap[key] = source;
  }

  /**
   * @see BaseFxDirective._listenForMediaQueryChanges
   */
  listenForMediaQueryChanges(key: string,
                             defaultValue: any,
                             onMediaQueryChange: MediaQuerySubscriber): ResponsiveActivation {
    return this._listenForMediaQueryChanges(key, defaultValue, onMediaQueryChange);
  }

  /**
   * @see BaseFxDirective._queryInput
   */
  queryInput(key) {
    return this._queryInput(key);
  }

  /**
   * @see BaseFxDirective._mqActivation
   */
  get mqActivation(): ResponsiveActivation {
    return this._mqActivation;
  }
}
