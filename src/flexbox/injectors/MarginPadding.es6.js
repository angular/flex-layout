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
class MarginPadding extends AbstractInjector {

  constructor(className, scope, element, attrs, utils) {
    super(className, scope, element, attrs, utils);

    let key = (this.root == "layout-padding") ? "padding" : "margin";
    let styles = window.getComputedStyle(element[0]);

    this._origCSS = {};
    this._origCSS[key] = styles[key]
  }

  // ************************************************
  // Private Methods
  // ************************************************

  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    let css = {};
    let key = (this.root == "layout-padding") ? "padding" : "margin";

    css[key] = this._validateValue(value);

    return css;
  }

  /**
   * Update element and immediate children to 'stretch' as needed...
   */
  _padChildren(overrides) {

    angular.forEach(this.element[0].childNodes, (node)=> {
      switch (node.nodeType) {
        case NodeType.ELEMENT_NODE :
          angular.element(node).css(overrides);
          break;
      }
    });
  }

  /**
   * Does the current element have 1 or more Layout injectors ?
   * Layout-Padding is only supported for `layout` containers and their
   * immediate children
   */
  _hasLayout() {
    let found = false;
    angular.forEach(this.attrs, (value, key)=> {
      if (key.indexOf("layout") > -1) {
        found = true;
      }
    });
    return found;
  }

  /**
   * Convert the specified or calculated value
   * to a px-based value
   */
  _validateValue(value) {
    value = value || this._calculatePadding();
    if (value.indexOf("px") < 0) {
      value = value + "px";
    }
    return value;
  }

  _calculatePadding() {
    let result;
    switch (this.mqAlias) {
      case "xs":
      case "gt-xs":
      case "sm":
        result = LAYOUT_GUTTER_WIDTH / 4;
        break;

      case "gt-md":
      case "lg":
      case "gt-lg":
      case "xl":
      case "gt-xl":
        result = LAYOUT_GUTTER_WIDTH / 1;
        break;

      case "":
      case "gt-sm":
      case "md":
      default :
        result = LAYOUT_GUTTER_WIDTH / 2;
        break;

    }
    return String(result);
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
    if (this.isActive && this._hasLayout()) {
      let overrides = this._buildCSS(value || this.value);
      this.$log.debug("updateCSS", this, overrides);

      this.element.css(overrides);
      this._padChildren(overrides);
    }
  }

  /**
   * When a breakpoint 'leave' is received, a reset is issued because the primary
   * injector (without breakpoints) will NOT be issued a breakpoint 'enter' notification
   */
  resetCSS(value) {
    if (this.isActive && this._hasLayout()) {
      this.element.css(this._origCSS);
    }
  }

}

// ************************************************************
// Private static variables
// ************************************************************

const LAYOUT_GUTTER_WIDTH = 16;

const NodeType = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4,
  ENTITY_REFERENCE_NODE: 5,
  ENTITY_NODE: 6,
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11,
  NOTATION_NODE: 12
};

// ************************************************************
// Module Export
// ************************************************************

export default MarginPadding;

