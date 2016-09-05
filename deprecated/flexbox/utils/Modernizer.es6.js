
/**
 * Modernizes the Layout injector CSS.
 * Eliminates the need for external CSS and a modernizer task
 *
 */
export default function modernizr(target) {
  angular.forEach(target, (value, key)=>{

    switch( key ) {
      case 'display':
        if ( value == 'flex' ) {
          // @TOOD - detect Browser and adjust value
          //  display: -webkit-flex;
          //  display: -ms-flexbox;
        }
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
        break;
    }

  });

  return target;
}
