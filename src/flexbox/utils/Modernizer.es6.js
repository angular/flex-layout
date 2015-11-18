
/**
 * Modernizes the Layout injector CSS.
 * Eliminates the need for external CSS and a modernizer task
 *
 */
export default function modernizr(css) {
  angular.forEach(css, (value, key)=>{

    switch( key ) {
      case 'display':
        if ( value == 'flex' ) {
          // @TOOD - detect Browser and adjust value
          //  display: -webkit-flex;
          //  display: -ms-flexbox;
        }
        break;

      case 'flex' :
        css['-ms-flex']                 = value;
        css['-webkit-flex']             = value;
        break;

      case 'flex-direction' :
        css['-ms-flex-direction']       = value;
        css['-webkit-flex-direction']   = value;
        break;

      case 'flex-wrap' :
        css['-ms-flex-wrap']            = value;
        css['-webkit-flex-wrap']        = value;
        break;

      case 'order' :
        css['-webkit-order']            = value;
        css['-ms-flex-order']           = value;
        break;

      case 'justify-content' :
        css['-ms-flex-pack']            = value;
        css['-webkit-justify-content']  = value;
        break;

      case 'align-items' :
        css['-ms-flex-align']           = value;
        css['-webkit-align-items']      = value;
        break;
    }

  });

  return css;
}
