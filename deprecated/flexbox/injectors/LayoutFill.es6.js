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

  constructor(className, scope, element, attrs, utils) {
    super(className, scope,element, attrs, utils);
    this._fill = this._captureCSS();
  }

  // ************************************************
  // Private Methods
  // ************************************************

  /**
   * Capture initialize styles for this injector's element
   */
  _captureCSS() {
    let styles = window.getComputedStyle(this.element[0]);
    return this.modernizr({
      'margin'    : styles.margin,
      'width'     : styles.width,
      'min-height': styles['min-height'],
      'height'    : styles.height
    });
  }


  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS() {
    return this.modernizr({
      'margin'    : 0,
      'width'     : '100%',
      'min-height': '100%',
      'height'    : '100%'
    });
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
      let overrides = this._buildCSS();
      this.$log.debugNoValue("updateCSS", this, overrides);

      this.element.css( overrides );
    }
  }

  /**
   * When a breakpoint 'leave' is received, a reset is issued because the primary
   * injector (without breakpoints) will NOT be issued a breakpoint 'enter' notification
   */
  resetCSS(value) {
    if ( this.isActive ) {
      this.element.css(this._fill);
    }
  }

}

// ************************************************************
// Module Export
// ************************************************************


export default LayoutFill;

