
/**
 * Modernizes the Layout injector CSS.
 * Eliminates the need for external CSS and a modernizer task
 *
 */
export default function modernizr(target) {
  for (var key in target) {
    let value = target[key];

    switch( key ) {
      case 'display':
        target[ 'display' ]                = value;
        break;
      case 'flex' :
        target['-ms-flex']                 = value;
        target['-webkit-flex']             = value;
        break;

      case 'flex-direction' :
        target['-ms-flex-direction']       = value;
        target['-webkit-flex-direction']   = value;
        break;

      case 'flex-wrap' :
        target['-ms-flex-wrap']            = value;
        target['-webkit-flex-wrap']        = value;
        break;

      case 'order' :
        target['-webkit-order']            = value;
        target['-ms-flex-order']           = value;
        break;

      case 'justify-content' :
        target['-ms-flex-pack']            = value;
        target['-webkit-justify-content']  = value;
        break;

      case 'align-items' :
        target['-ms-flex-align']           = value;
        target['-webkit-align-items']      = value;
        target['-webkit-box-align']        = toBoxAlign(value);
        break;
    }
  }

  return target;
}

function toBoxAlign(value) {
  return (value == 'flex-start)') ? 'start' :
         (value == 'flex-end)')   ? 'end'   : value;
}
