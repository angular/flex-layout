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

    this._offset = this._captureCSS();
  }

  // ************************************************
  // Private Methods
  // ************************************************


  /**
    * Capture initialize styles for this injector's element
    */
   _captureCSS() {
     let styles = window.getComputedStyle(this.element[0]);
     return styles['margin-left'] || "0";
   }


  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
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

  // ************************************************
  // Public Methods
  // ************************************************

  /**
   * Update the CSS if active!
   * Will update when the observed value changes or the media
   * query range becomes active (onEnter())
   */
  updateCSS(value) {
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
    if ( this.isActive ) {
      this.element.css({
        'margin-left' : this._offset
      });
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

