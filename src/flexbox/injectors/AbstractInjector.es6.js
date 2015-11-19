const NOOP   = angular.noop;
const SUFFIX = /-(gt-)?(xs|sm|md|lg|xl)/;

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
class AbstractInjector {

  constructor(className, scope, element, attrs, utils) {
    let self;

    this.scope      = scope;
    this.element    = element;
    this.attrs      = attrs;

    // Expose utils (css modernizer, $log) for universal subclass access
    angular.forEach(utils,(value, key)=>{
      this[key] = value;
    });

    privates.set(this, self = {

      className : className,
      isActive  : false,
      mqAlias   : extractAlias(className),

      $destroyed: false,
      unWatch   : NOOP,
      stopListener : NOOP,

      /**
       * Make sure the element has a shared controller
       * so multiple layout attributes on the same element tag
       * can share
       */
      initialize : () => {

        // Start watching the attribute's value
        if ( self.unWatch === NOOP ) {
          privates.get(this).watch();
        }
      },

      /**
       * Watch the attribute value (which may be an interpolated
       * expression) and call `::updateCss( )` with the validated
       * value
       */
      watch : () => {
        self.unWatch = attrs.$observe( this.key, this.updateCSS.bind(this) );
        self.stopListener = this.scope.$on("$destroy", () => {
          self.unWatch();
          self.unWatch = NOOP;
          self.isActive = false;
          self.$destroyed = true;
        });
      }

    });

  }


  // ************************************************
  // Abstract Methods
  // ************************************************

  /**
   * Inject the style CSS for this injector type
   */
  updateCSS() { }

  /**
   * Reset the style CSS that was injected during updateCSS()
   */
  resetCSS() { }


  // ************************************************
  // Public Methods
  // ************************************************

  /**
   * Notification function called by $mdLayout watchers
   * when the mediaQuery associated with this Layout has
   * `entered` or activated
   */
  activate() {
    let self = privates.get(this);
    if ( !self.$destroyed ) {
      self.isActive = true;

      self.initialize();
      this.updateCSS();
    }
    return this;
  }

  /**
   * Notification function called by $mdLayout watchers
   * when the mediaQuery associated with this Layout has
   * `left` due to a different mediaQuery activating
   */
  deactivate() {
    let self = privates.get(this);
    if ( self.isActive ) {
      this.resetCSS();

      self.unWatch();
      self.stopListener();
      self.unwatch = self.stopListener = NOOP;

      self.isActive = false;
    }
    return this;
  }


  // ************************************************
  // Read-only Accessors
  // ************************************************

  /**
   * Get the normalized attribute key
   * e.g.   layout-gt-sm ===> layoutGtSm
   */
  get key() {
    let self = privates.get(this);
    return this.attrs.$normalize(self.className);
  }

  /**
   * Get the current, validated value for this attribute directive
   */
  get value() {
    return (this.attrs[this.key]);
  }

  /**
   * Read-only accessor to the active state
   */
  get isActive() { return privates.get(this).isActive;  }

  /**
   * Get the mediaQuery alias for this element's attribute
   * If the markup === ' flex-gt-md ' then the
   * alias === 'gt-md'.
   */
  get mqAlias() { return privates.get(this).mqAlias; }

  /**
   * Determine the attribute/directive name without a breakpoint suffix
   */
  get root() {
    let self = privates.get(this);
    return self.className.replace(SUFFIX, "");
  }

  get className() {
    let self = privates.get(this);
    return self.className;
  }

}

function extractAlias(className) {
  let mqAlias = SUFFIX.exec(className);
  return !mqAlias    ? ""                      :
          mqAlias[1] ? mqAlias[1] + mqAlias[2] : mqAlias[2];
}

// ************************************************************
// Module Export
// ************************************************************


export default AbstractInjector;


// ************************************************************
// Private static variables
// ************************************************************

/**
 * Private cache for each Class instances' private data and methods.
 */
const privates = new WeakMap();



