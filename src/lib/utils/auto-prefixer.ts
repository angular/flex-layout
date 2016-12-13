/** @internal Applies CSS prefixes to appropriate style keys.*/
export function applyCssPrefixes(target) {
  for (let key in target) {

    let value = target[key];

    switch (key) {
      case 'display':
        target['display'] = value;
        // also need 'display : -webkit-box' and 'display : -ms-flexbox;'
        break;

      case 'flex':
        target['-ms-flex'] = value;
        target['-webkit-box-flex'] = value.split(" ")[0];
        break;

      case 'flex-direction':
        value = value || "row";
        target['flex-direction'] = value;
        target['-ms-flex-direction'] = value;
        target['-webkit-box-orient'] = toBoxOrient(value);
        target['-webkit-box-direction'] = toBoxDirection(value);
        break;

      case 'flex-wrap':
        target['-ms-flex-wrap'] = value;
        break;

      case 'order':
        if ( isNaN(value) ) value = "0";
        target['order'] = value;
        target['-ms-flex-order'] = value;
        target['-webkit-box-ordinal-group'] = toBoxOrdinal(value);
        break;

      case 'justify-content':
        target['-ms-flex-pack'] = toBoxValue(value);
        target['-webkit-box-pack'] = toBoxValue(value);
        break;

      case 'align-items':
        target['-ms-flex-align'] =  toBoxValue(value);
        target['-webkit-box-align'] = toBoxValue(value);
        break;

      case 'align-self':
        target['-ms-flex-item-align'] =  toBoxValue(value);
        break;

      case 'align-content':
        target['-ms-flex-line-pack'] =  toBoxValue(value);
        break;
    }
  }
  return target;
}

/** @internal Convert flex values flex-start, flex-end to start, end. */
export function toBoxValue(value:string = "") {
  return (value == 'flex-start') ? 'start' : ((value == 'flex-end') ? 'end' : value);
}

/** @internal Convert flex Direction to Box orientation */
export function toBoxOrient(flexDirection = 'row') {
  return flexDirection.indexOf('column') === -1 ? 'horizontal' : 'vertical';
}

/** @internal Convert flex Direction to Box direction type */
export function toBoxDirection(flexDirection = 'row') {

  return flexDirection.indexOf('reverse')  !== -1 ? 'reverse' : 'normal';
}

/** @internal Convert flex order to Box ordinal group */
export function  toBoxOrdinal(order = '0') {
  let value = order ? parseInt(order) + 1 : 1;
  return isNaN(value) ? "0" : value.toString();
}
