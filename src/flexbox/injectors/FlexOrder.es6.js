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
class FlexOrder extends AbstractInjector {

  constructor(className, scope, element, attrs, utils) {
    super(className, scope,element, attrs, utils);

    let self;
    privates.set(this, self = {

      _css : this.modernizr({
          order : window.getComputedStyle(element[0]).order || "0"
      }),

      /**
       * Build the CSS that should be assigned to the element instance
       */
      buildCSS : (value) => {
        value = parseInt(value, 10);

        return this.modernizr({
          order : isNaN(value) ? 0 : value
        });
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
      let overrides = self.buildCSS(value || this.value);
      this.$log.debug("updateCSS", this, overrides);

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
      this.element.css(self._css);
    }
  }

}

// ************************************************************
// Module Export
// ************************************************************


export default FlexOrder;


// ************************************************************
// Private static variables
// ************************************************************

/**
 * Private cache for each Class instances' private data and methods.
 */
const privates = new WeakMap();


function isTrue(value) {
  return (value == "true" || value == "1" || value == "");
}
