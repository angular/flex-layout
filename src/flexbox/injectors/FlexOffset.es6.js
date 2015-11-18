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
class FlexOffset extends AbstractInjector {

  constructor(className, scope, element, attrs, utils) {
    super(className, scope,element, attrs, utils);

    let self;
    privates.set(this, self = {

      _offset : window.getComputedStyle(element[0]).margin-left || "0",

      /**
       * Build the CSS that should be assigned to the element instance
       */
      buildCSS : (value) => {
        if ( value === "33" ) value = (100/3);
        if ( value === "66" ) value = (200/3);
        if (String(value).indexOf("px") < 0) {
          // Defaults to percentage sizing unless `px` is explicitly set
          value = value + '%';
        }

        return {
          'margin-left' : `${value}`
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
      this.element.css({ 'margin-left' : self._offset });
    }
  }

}

// ************************************************************
// Module Export
// ************************************************************


export default FlexOffset;


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
