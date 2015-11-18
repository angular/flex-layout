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

  constructor(className, scope, element, attrs, $log) {
    super(className, scope,element, attrs, $log);

    let self;
    privates.set(this, self = {

      _origCSS : (()=>{
        let key = this.root == "layout-padding" ? "padding" : "margin";
        let styles = window.getComputedStyle(element[0]);
        let css = { };

          css[key] = styles[key];

        return css;
      })(),

      /**
       * Build the CSS that should be assigned to the element instance
       */
      buildCSS : (value) => {
        let key = this.root == "layout-padding" ? "padding" : "margin";
        let css = { };

          css[key] = self.validateValue(value);

        return css;
      },

      /**
       * Update element and immediate children to 'stretch' as needed...
       */
      padChildren : (overrides) => {

        angular.forEach(this.element[0].childNodes, (node)=>{
          switch( node.nodeType ) {
            case NodeType.ELEMENT_NODE :
            case NodeType.TEXT_NODE :
              angular.element(node).css( overrides);
              break;
          }
        });
      },

      /**
       * Does the current element have 1 or more Layout injectors ?
       * Layout-Padding is only support for `layout` containers and their
       * immediate children
       */
      hasLayout : () => {
        let found = false;
        angular.forEach(this.attrs,(value,key)=>{
          if (key.indexOf("layout") > -1) {
            found = true;
          }
        });
        return found;
      },

      /**
       * Convert the specified or calculated value
       * to a px-based value
       */
      validateValue : (value) => {
        value = value || self.calculatePadding();
        if ( value.indexOf("px") < 0 ) {
          value = value + "px";
        }
        return value;
      },

      calculatePadding : () => {
        let result;
        switch(this.mqAlias) {
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


    });
  }

  /**
   * Update the CSS if active!
   * Will update when the observed value changes or the media
   * query range becomes active (onEnter())
   */
  updateCSS(value) {
    let self = privates.get(this);
    if ( this.isActive && self.hasLayout() ) {
      let overrides = self.buildCSS(value || this.value);
      logActivity("updateCSS", this, overrides, this.$log);

      this.element.css( overrides );
      self.padChildren(overrides);
    }
  }

  /**
   * When a breakpoint 'leave' is received, a reset is issued because the primary
   * injector (without breakpoints) will NOT be issued a breakpoint 'enter' notification
   */
  resetCSS(value) {
    let self = privates.get(this);
    if ( this.isActive && self.hasLayout() ) {
      this.element.css(self._origCSS);
    }
  }

}

// ************************************************************
// Module Export
// ************************************************************


export default MarginPadding;


// ************************************************************
// Private static variables
// ************************************************************

/**
 * Private cache for each Class instances' private data and methods.
 */
const privates = new WeakMap();

const  LAYOUT_GUTTER_WIDTH = 16;

const  NodeType = {
  ELEMENT_NODE                :  1,
  ATTRIBUTE_NODE              :  2,
  TEXT_NODE                   :  3,
  CDATA_SECTION_NODE          :  4,
  ENTITY_REFERENCE_NODE       :  5,
  ENTITY_NODE                 :  6,
  PROCESSING_INSTRUCTION_NODE :  7,
  COMMENT_NODE                :  8,
  DOCUMENT_NODE               :  9,
  DOCUMENT_TYPE_NODE          : 10,
  DOCUMENT_FRAGMENT_NODE      : 11,
  NOTATION_NODE               : 12
};



// ************************************************************
// Debugging
// ************************************************************

function logActivity(action, injector, overrides, $log) {
  let prefix = `<div ${injector.className}>`;
  if ( injector.attrs["id"] ) {
    prefix = `<div ${injector.attrs["id"]} ${injector.className}>="${injector.value}"`;
  }

  $log.debug(`${prefix}::${action}(${JSON.stringify(overrides)})`);
}

