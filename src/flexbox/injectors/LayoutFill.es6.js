import AbstractInjector from 'flexbox/injectors/AbstractInjector.es6'

/**
 * Layout is a Directive class used for the <div layout='row'></div> element
 * attribute. This class supports
 *
 *   - notifications of media query breakpoint changes
 *   - observes interpolate attribute values
 *
 * to update the element's css with flexbox settings for the 'layout'
 * attribute.
 *
 */
class LayoutFill extends AbstractInjector {

  constructor(className, scope, element, attrs, $log) {
    super(className, scope,element, attrs, $log);

    let self;
    privates.set(this, self = {

      _fill : (()=>{
        let styles = window.getComputedStyle(element[0]);
        return {
          'margin'    : styles.margin,
          'width'     : styles.width,
          'min-height': styles['min-height'],
          'height'    : styles.height
        };
      })(),

      /**
       * Build the CSS that should be assigned to the element instance
       */
      buildCSS : () => {
        return {
          'margin'    : 0,
          'width'     : '100%',
          'min-height': '100%',
          'height'    : '100%'
        };
      }

    });
  }

  /**
   * Update the CSS if active!
   * Will update when the observed value changes or the media
   * query range becomes active (onEnter())
   */
  updateCSS(value) {
    let self = privates.get(this);
    if ( this.isActive ) {
      let overrides = self.buildCSS();
      logActivity("updateCSS", this, overrides, this.$log);

      this.element.css( overrides );
    }
  }

  /**
   * When a breakpoint 'leave' is received, a reset is issued because the primary
   * injector (without breakpoints) will NOT be issued a breakpoint 'enter' notification
   */
  resetCSS(value) {
    let self = privates.get(this);
    if ( this.isActive ) {
      this.element.css(self._fill);
    }
  }

}

// ************************************************************
// Module Export
// ************************************************************


export default LayoutFill;


// ************************************************************
// Private static variables
// ************************************************************

/**
 * Private cache for each Class instances' private data and methods.
 */
const privates = new WeakMap();


function logActivity(action, injector, overrides, $log) {
  let prefix = `<div ${injector.className}>`;
  if ( injector.attrs["id"] ) prefix = `<div ${injector.attrs["id"]} ${injector.className}>`;

  $log.debug(`${prefix}::${action}(${JSON.stringify(overrides)})`);
}
