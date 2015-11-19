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
    super(className, scope,element, attrs, utils);

    let self;
    privates.set(this, self = {
      _display : this.captureCss(),

      /**
       * Build the CSS that should be assigned to the element instance
       */
      buildCSS : (value) => {
        let css = { };
        switch( this.root ) {
          case SHOW:
            css = this.modernizr({ display : isTrue(value) ? self._display : NONE });
            break;

          case HIDE:
            css = this.modernizr({ display : isTrue(value) ? NONE : self._display });
            break;
        }
        return css;
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

  resetCSS(value) {
    let self = privates.get(this);
    if ( this.isActive ) {
      let style = this.modernizr({
        // Initial captures do not consider breakpoints
        display : angular.isDefined(this.attrs[HIDE]) ? NONE : self._display
      });

      this.element.css(style);
    }
  }

  captureCss() {
    return window.getComputedStyle(this.element[0]).display || "block";
  }

}

// ************************************************************
// Module Export
// ************************************************************


export default ShowHide;


// ************************************************************
// Private static variables
// ************************************************************

/**
 * Private cache for each Class instances' private data and methods.
 */
const privates = new WeakMap();
const HIDE = "hide";
const SHOW = "show";
const NONE = "none";



function isTrue(value) {
  return (value == "true" || value == "1" || value == "");
}

