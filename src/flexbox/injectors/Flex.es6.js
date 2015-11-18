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

    let self;
    privates.set(this, self = {

      // The parent layout direction is required for flex item styling
      '_direction' : undefined,

      /**
       * Build the CSS that should be assigned to the element instance
       */
      buildCSS : (value) => {
        let css;

        switch(value || "") {
          case UNDEFINED  : css = { 'flex'  : '1'        ,'max-width'  : null , 'max-height' : null  }; break;
          case GROW       : css = { 'flex'  : "1 1 100%" ,'max-width'  : null , 'max-height' : null  }; break;
          case INITIAL    : css = { 'flex'  : "0 1 auto" ,'max-width'  : null , 'max-height' : null  }; break;
          case AUTO       : css = { 'flex'  : "1 1 auto" ,'max-width'  : null , 'max-height' : null  }; break;
          case NONE       : css = { 'flex'  : "0 0 auto" ,'max-width'  : null , 'max-height' : null  }; break;
          default :
            if ( value === "33" ) value = (100/3);
            if ( value === "66" ) value = (200/3);
            if (String(value).indexOf("px") < 0) {
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

    });
  }

  resetCSS() {
    let self = privates.get(this);
    if ( this.isActive ) {
      let flexValue = this.attrs[this.root] || "";  // root === "flex"

      this.element.css(self.buildCSS( flexValue ));
    }
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
   * Accessor for Layout direction (as specified by Layout parent)....
   */
  get direction() {
    return privates.get(this)._direction || "row";
  }

  /**
   * Mutator for Layout direction (as specified by Layout parent)....
   */
  set direction(value) {
    let self = privates.get(this);

    // Setter
    if ( ["row","column"].indexOf(value) > -1) {
      if (self._direction != value) {
        self._direction = value;
        this.updateCSS(this.value);
      }
    }
  }
}

// ************************************************************
// Module Export
// ************************************************************


export default Flex;


// ************************************************************
// Private static variables
// ************************************************************

/**
 * Private cache for each Class instances' private data and methods.
 */
const privates = new WeakMap();

const UNDEFINED = "";
const GROW      = "grow";
const INITIAL   = "initial";
const AUTO      = "auto";
const NONE      = "none";

