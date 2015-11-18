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
class Layout extends AbstractInjector {

  constructor(className, scope, element, attrs, $log) {
    super(className, scope,element, attrs, $log);

    let self;
    privates.set(this, self = {

      _direction : undefined,

      /**
       * 'flex' child items depend upon layout parent direction
       * so when the 'layout' direction changes, all the immediate
       * 'flex' children should be notified.
       */
      flexChildren  : [ ],

      /**
       * For all Grid flexChildren of the Layout parent,
       * when the value changes or the active mediaQuery changes
       * then update the Layout css and notify the flexChildren
       * to update accordingly.
       *
       * !! Since the children a flex items simply set their direction value.
       *
       */
      notifyChildren : (direction) => {
        self.flexChildren.forEach(child => {
          child.direction = direction;
        });
      },

      /**
       * Build the CSS that should be assigned to the element instance
       */
      buildCSS : (value) => {
        return {
          'display'         : '-webkit-box',
          'display'         : '-webkit-flex',
          'display'         : '-moz-box',
          'display'         : '-ms-flexbox',
          'display'         : 'flex',
          'box-sizing'      : 'border-box',
          'flex-direction'  : self._direction = self.validateValue(value)
        };
      },

      /**
       * Validate the value to be one of the acceptable value options
       * Use default fallback of "row"
       */
      validateValue : (value) => {
        return VALUES.find(x => x === value) ? value : VALUES[0];  // "row"
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
      let direction = self.validateValue(value || this.value);
      let overrides = self.buildCSS(direction);

      this.$log.debug("updateCSS", this, overrides);

      this.element.css( overrides );
      self.notifyChildren(direction);
    }
  }


  resetCSS() {
    let self = privates.get(this);
    if ( this.isActive ) {
      let layoutValue = this.attrs[this.root] || "";  // root === "layout"
      let announce = self._direction != layoutValue;

      this.element.css(self.buildCSS( layoutValue ));

      if ( announce ) {
        // Only notify if the value has changed!
        self.notifyChildren(layoutValue);
      }
    }
  }

  /**
   * Add a 'flex' injector as a dependent child; which will be notified
   * any time this parent changes is configuration.
   */
  addChild(target) {
    let self = privates.get(this);

    if ( !self.flexChildren.find(x => x === target) ) {
      self.flexChildren.push(target);
    }

    if ( this.isActive ) {
      target.direction = this.value;
    }
  }

  /**
   * Remove a 'flex' injector as a dependent child
   */
  removeChild(target) {
    let self = privates.get(this);
    self.flexChildren = self.flexChildren.filter((it) =>{
      return (it !== target);
    });
  }

}

// ************************************************************
// Module Export
// ************************************************************


export default Layout;


// ************************************************************
// Private static variables
// ************************************************************

/**
 * Private cache for each Class instances' private data and methods.
 */
const privates = new WeakMap();

const VALUES = ["row", "column"];

