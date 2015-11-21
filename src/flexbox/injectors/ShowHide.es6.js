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
class ShowHide extends AbstractInjector {

  constructor(className, scope, element, attrs, utils) {
    super(className, scope, element, attrs, utils);
    this._display = this._captureCSS();
  }

  // ************************************************
  // Private Methods
  // ************************************************

  /**
   * Capture initialize styles for this injector's element
   */
  _captureCSS() {
    let styles = window.getComputedStyle(this.element[0]);
    return styles.display || "block";
  }

  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    let css = { };
    switch( this.root ) {
      case SHOW:
        css = this.modernizr({ display : this._isTrue(value) ? this._display : NONE });
        break;

      case HIDE:
        css = this.modernizr({ display : this._isTrue(value) ? NONE : this._display });
        break;
    }
    return css;
  }

  _isTrue(value) {
    return (value == "true" || value == "1" || value == "");
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
      let overrides = this._buildCSS(value || this.value);
      this.$log.debug("updateCSS", this, overrides);

      this.element.css( overrides );
    }
  }

  resetCSS(value) {
    if ( this.isActive ) {
      let style = this.modernizr({
        // Initial captures do not consider breakpoints
        display : angular.isDefined(this.attrs[HIDE]) ? NONE : this._display
      });

      this.element.css(style);
    }
  }

}

// ************************************************************
// Module Export
// ************************************************************


export default ShowHide;


// ************************************************************
// Private static variables
// ************************************************************

const HIDE = "hide";
const SHOW = "show";
const NONE = "none";





