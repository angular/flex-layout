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
class LayoutAlign extends AbstractInjector {

  constructor(className, scope, element, attrs, utils) {
    super(className, scope,element, attrs, utils);
    this._align = this._captureCSS();
  }

  // ************************************************
  // Private Methods
  // ************************************************

  /**
   * Capture initialize styles for this injector's element
   */
  _captureCSS() {
    let styles = window.getComputedStyle(this.element[0]);
    return this.modernizr({
      'max-width'       : styles['max-width'],
      'box-sizing'      : styles['box-sizing'],
      'align-items'     : styles['align-items'],
      'align-content'   : styles['align-content'],
      'justify-content' : styles['justify-content']
    });
  }

  /**
    * Build the CSS that should be assigned to the element instance
    */
   _buildCSS(value) {
     let overrides = { };
     let [ main_axis, cross_axis ] = value.split(" ");

     overrides['justify-content'] = "start";     // default
     overrides['align-items']     = "stretch";   // default
     overrides['align-content']   = "stretch";   // default

     // Main axis
     switch( main_axis ){
       case "start":
         overrides['justify-content'] = "start";
         break;

       case "center":
         overrides['justify-content'] = "center";
         break;

       case "end":
         overrides['justify-content'] = "flex-end";
         break;

       case "space-around":
         overrides['justify-content'] = "space-around";
         break;

       case "space-between":
         overrides['justify-content'] = "space-between";
         break;
     }

     // Cross-axis
     switch( cross_axis ){
        case "start" :
          overrides['align-items'] = overrides['align-content'] = "flex-start";
          break;

       case "center" :
         overrides['align-items'] = overrides['align-content'] = "center";
         break;

       case "end" :
         overrides['align-items'] = overrides['align-content'] = "flex-end";
         break;

       case "stretch" :
         overrides['align-items'] = overrides['align-content'] = "stretch";   // default
         break;

       case "baseline" :
         overrides['align-items'] = "baseline";
         break;
     }

     return this.modernizr(overrides);
   }

   /**
    * Update element and immediate children to 'stretch' as needed...
    */
   _stretchChildren(value) {
     let [, cross_axis] = value.split(" ");

     if ( cross_axis == "center") {
         let overrides = {
           'max-width'  : '100%',
           'box-sizing': "border-box"
         };

         this.element.css(overrides);

         angular.forEach(this.element[0].childNodes, (node)=>{
           switch( node.nodeType ) {
             case NodeType.ELEMENT_NODE :
               angular.element(node).css( overrides);
               break;
           }
         });
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
      let overrides = this._buildCSS(this.value);
      this.$log.debug("updateCSS", this, overrides);

      this.element.css( overrides );
      this._stretchChildren.call(this, this.value);
    }
  }

  /**
   * When a breakpoint 'leave' is received, a reset is issued because the primary
   * injector (without breakpoints) will NOT be issued a breakpoint 'enter' notification
   */
  resetCSS(value) {
    if ( this.isActive ) {
      this.element.css(this._align);
    }
  }

}

// ************************************************************
// Private static variables
// ************************************************************

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
// Module Export
// ************************************************************

export default LayoutAlign;
