/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Applies CSS prefixes to appropriate style keys.
 *
 * Note: `-ms-`, `-moz` and `-webkit-box` are no longer supported. e.g.
 *    {
 *      display: -webkit-flex;     NEW - Safari 6.1+. iOS 7.1+, BB10
 *      display: flex;             NEW, Spec - Firefox, Chrome, Opera
 *      // display: -webkit-box;   OLD - iOS 6-, Safari 3.1-6, BB7
 *      // display: -ms-flexbox;   TWEENER - IE 10
 *      // display: -moz-flexbox;  OLD - Firefox
 *    }
 */
export function applyCssPrefixes(target: {[key: string]: any | null}) {
  for (let key in target) {
    let value = target[key] || '';

    switch (key) {
      case 'display':
        if (value === 'flex') {
          target['display'] = [
            '-webkit-flex',
            'flex'
          ];
        } else if (value === 'inline-flex') {
          target['display'] = [
            '-webkit-inline-flex',
            'inline-flex'
          ];
        } else {
          target['display'] = value;
        }
        break;

      case 'align-items':
      case 'align-self':
      case 'align-content':
      case 'flex':
      case 'flex-basis':
      case 'flex-flow':
      case 'flex-grow':
      case 'flex-shrink':
      case 'flex-wrap':
      case 'justify-content':
        target['-webkit-' + key] = value;
        break;

      case 'flex-direction':
        value = value || 'row';
        target['-webkit-flex-direction'] = value;
        target['flex-direction'] = value;
        break;

      case 'order':
        target['order'] = target['-webkit-' + key] = isNaN(+value) ? '0' : value;
        break;
    }
  }
  return target;
}
