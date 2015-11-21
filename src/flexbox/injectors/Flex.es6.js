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
class Flex extends AbstractInjector {

  constructor(className, scope, element, attrs, utils) {
    super(className, scope,element, attrs, utils);

    // The parent layout direction is required for flex item styling
    this._direction = undefined;
  }

  // ************************************************
  // Private Methods
  // ************************************************


  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    let css;

    switch(value || "") {
      case UNDEFINED  : css = { 'flex'  : '1'        ,'max-width'  : null , 'max-height' : null  }; break;
      case GROW       : css = { 'flex'  : "1 1 100%" ,'max-width'  : null , 'max-height' : null  }; break;
      case INITIAL    : css = { 'flex'  : "0 1 auto" ,'max-width'  : null , 'max-height' : null  }; break;
      case AUTO       : css = { 'flex'  : "1 1 auto" ,'max-width'  : null , 'max-height' : null  }; break;
      case NONE       : css = { 'flex'  : "0 0 auto" ,'max-width'  : null , 'max-height' : null  }; break;
      default :
        let isPercent = String(value).indexOf("%")  > -1;
        let isPx      = String(value).indexOf("px") > -1;

        if ( value === "33" ) value = (100/3);
        if ( value === "66" ) value = (200/3);
        if (!isPx && !isPercent) {
          // Defaults to percentage sizing unless `px` is explicitly set
          value = value + '%';
        }

        css =  {
          'flex'       : `1 1 ${value}`,
          'max-width'  : (this.direction == "row") ? value  : '100%',
          'max-height' : (this.direction == "row") ? '100%' : value,
        };
        break;
    }

    return this.modernizr( angular.extend(css, { 'box-sizing' : 'border-box' } ));
  }

  // ************************************************
  // Public Methods
  // ************************************************


  resetCSS() {
    if ( this.isActive ) {
      let flexValue = this.attrs[this.root] || "";  // root === "flex"
      this.element.css(this._buildCSS( flexValue ));
    }
  }

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

  // ************************************************
  // Public Accessor
  // ************************************************

  /**
   * Accessor for Layout direction (as specified by Layout parent)....
   */
  get direction() {
    return this._direction || "row";
  }

  /**
   * Mutator for Layout direction (as specified by Layout parent)....
   */
  set direction(value) {
    if ( ["row","column"].indexOf(value) > -1) {
      if (this._direction != value) {
        this._direction = value;
        this.updateCSS(this.value);
      }
    }
  }
}

// ************************************************************
// Private static variables
// ************************************************************

const UNDEFINED = "";
const GROW      = "grow";
const INITIAL   = "initial";
const AUTO      = "auto";
const NONE      = "none";


// ************************************************************
// Module Export
// ************************************************************


export default Flex;
