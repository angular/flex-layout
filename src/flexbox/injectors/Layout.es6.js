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

  constructor(className, scope, element, attrs, utils) {
    super(className, scope,element, attrs, utils);

    this._direction = undefined;

    /**
     * 'flex' child items depend upon layout parent direction
     * so when the 'layout' direction changes, all the immediate
     * 'flex' children should be notified.
     */
    this._flexChildren  = [ ];

    // Make sure the parent element has a display:<xxx> setting.
    this._validateParentDisplay();
  }

  // ************************************************
  // Private Methods
  // ************************************************

  /**
   * For all Grid flexChildren of the Layout parent,
   * when the value changes or the active mediaQuery changes
   * then update the Layout css and notify the flexChildren
   * to update accordingly.
   *
   * !! Since the children a flex items simply set their direction value.
   *
   */
  _notifyChildren (direction) {
    this._flexChildren.forEach(child => {
      child.direction = direction;
    });
  }

  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    return this.modernizr({
      'display'         : 'flex',
      'box-sizing'      : 'border-box',
      'flex-direction'  : this._direction = this._validateValue(value)
    });
  }

  /**
   * Validate the value to be one of the acceptable value options
   * Use default fallback of "row"
   */
  _validateValue(value) {
    return VALUES.find(x => x === value) ? value : VALUES[0];  // "row"
  }


  /**
   * If the parent element does not have a 'display' CSS style (eg <ui-view>),
   * then inject a `display:block` style
   */
  _validateParentDisplay() {
    var parent = angular.element(this.element.parent());
    if ( !parent.css('display') ) {
      parent.css({ display : 'block' });
    }
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
      let direction = this._validateValue(value || this.value);
      let overrides = this._buildCSS(direction);

      this.$log.debug("updateCSS", this, overrides);

      this.element.css( overrides );
      this._notifyChildren(direction);
    }
  }


  resetCSS() {
    if ( this.isActive ) {
      let layoutValue = this.attrs[this.root] || "";  // root === "layout"
      let announce = this._direction != layoutValue;

      this.element.css(this._buildCSS( layoutValue ));

      if ( announce ) {
        // Only notify if the value has changed!
        this._notifyChildren(layoutValue);
      }
    }
  }

  /**
   * Add a 'flex' injector as a dependent child; which will be notified
   * any time this parent changes is configuration.
   */
  addChild(target) {
    if ( !this._flexChildren.find(x => x === target) ) {
      this._flexChildren.push(target);
    }

    if ( this.isActive ) {
      target.direction = this.value;
    }
  }

  /**
   * Remove a 'flex' injector as a dependent child
   */
  removeChild(target) {
    this._flexChildren = this._flexChildren.filter((it) =>{
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

const VALUES = ["row", "column"];

