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

    // Private properties
    this._isActive      = false;
    this._$destroyed    = false;
    this._unWatch       = NOOP;
    this._mqAlias       = extractAlias(className);
    this._className     = className;

    // Public properties
    this.scope          = scope;
    this.element        = element;
    this.attrs          = attrs;

    // Expose utils (css modernizer, $log) for universal subclass access
    angular.forEach(utils,(value, key)=>{
      this[key] = value;

      // this.$log = utils.$log;
      // this.modernizr = utils.modernizer
    });
  }

  // ************************************************
  // Private Methods
  // ************************************************

  /**
   * Make sure the element has a shared controller
   * so multiple layout attributes on the same element tag
   * can share
   */
  _initialize() {
    // Start watching the attribute's value
    this._watch();
  }

  /**
   * Watch the attribute value (which may be an interpolated
   * expression) and call `::updateCss( )` with the validated
   * value
   */
  _watch() {
    if ( this._unWatch === NOOP ) {
      let stopObserver = this.attrs.$observe( this.key, this.updateCSS.bind(this) );
      this._unWatch = this.scope.$on("$destroy", () => {
        stopObserver();
        this._unWatch();

        this._unWatch     = NOOP;
        this._isActive    = false;
        this._$destroyed  = true;

        stopObserver = undefined;
      });
    }
  }


  // ************************************************
  // Abstract Methods
  // ************************************************

  /**
   * Inject the style CSS for this injector type
   */
  updateCSS() {
    $log.warn("Unexpected call to abtract method AbstractInjector::updateCSS()!");
  }

  /**
   * Reset the style CSS that was injected during updateCSS()
   */
  resetCSS() {
    $log.warn("Unexpected call to abtract method AbstractInjector::resetCSS()!");
  }


  // ************************************************
  // Public Methods
  // ************************************************

  /**
   * Notification function called by $mdLayout watchers
   * when the mediaQuery associated with this Layout has
   * `entered` or activated
   */
  activate() {
    if ( !this._$destroyed ) {
      this._isActive = true;
      this._initialize();
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
    if ( this.isActive ) {
      this.resetCSS();
      this._unWatch();
      this._isActive = false;
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
    return this.attrs.$normalize(this._className);
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
  get isActive() { return this._isActive;  }

  /**
   * Get the mediaQuery alias for this element's attribute
   * If the markup === ' flex-gt-md ' then the
   * alias === 'gt-md'.
   */
  get mqAlias() { return this._mqAlias; }

  /**
   * Determine the attribute/directive name without a breakpoint suffix
   */
  get root() {
    return this._className.replace(SUFFIX, "");
  }

  get className() {
    return this._className;
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

