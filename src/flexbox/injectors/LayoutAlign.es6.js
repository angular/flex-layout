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

  constructor(className, scope, element, attrs, $log) {
    super(className, scope,element, attrs, $log);

    let self;
    privates.set(this, self = {

      _align : (() => {
        let styles = window.getComputedStyle(element[0]);
        return {
          'max-width'       : styles['max-width'],
          'box-sizing'      : styles['box-sizing'],
          'align-items'     : styles['align-items'],
          'justify-content' : styles['justify-content']
        };
      })(),

      /**
       * Build the CSS that should be assigned to the element instance
       */
      buildCSS : () => {
        let overrides = { };

        // Main axis
        switch(this.value) {
          case "center":
          case "center center":
          case "center start":
          case "center send":
            overrides['justify-content'] = "center";
            break;

          case "end":
          case "end center":
          case "end start":
          case "end send":
            overrides['justify-content'] = "flex-end";
            break;

          case "space-around":
          case "space-around center":
          case "space-around start":
          case "space-around send":
            overrides['justify-content'] = "space-around";
            break;

          case "space-between":
          case "space-between center":
          case "space-between start":
          case "space-between send":
            overrides['justify-content'] = "space-between";
            break;
        }

        // Cross-axis
        switch( this.value ) {

           case "center-start"        :
           case "start-start"         :
           case "end-start"           :
           case "space-between-start" :
           case "space-around-start"  :
             overrides['align-items'] = "flex-start";
             break;

          case "center-center"        :
          case "start-center"         :
          case "end-center"           :
          case "space-between-center" :
          case "space-around-center"  :
            overrides['align-items'] = "center";
            break;

          case "center-end"        :
          case "start-end"         :
          case "end-end"           :
          case "space-between-end" :
          case "space-around-end"  :
            overrides['align-items'] = "flex-end";
            break;
        }

        return overrides;
      },

      /**
       * Update element and immediate children to 'stretch' as needed...
       */
      stretchChildren : () => {
        switch(this.value) {
          case "center-center"        :
          case "start-center"         :
          case "end-center"           :
          case "space-between-center" :
          case "space-around-center"  :
            let overrides = {
              'max-width'  : '100%',
              'box-sizing': "border-box"
            };

            this.element.css(overrides);

            angular.forEach(this.element[0].childNodes, (node)=>{
              switch( node.nodeType ) {
                case NodeType.ELEMENT_NODE :
                case NodeType.TEXT_NODE :
                  angular.element(node).css( overrides);
                  break;
              }
            });
            break;
        }
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
      let overrides = self.buildCSS();
      this.$log.debug("updateCSS", this, overrides);

      this.element.css( overrides );
      self.stretchChildren();
    }
  }

  /**
   * When a breakpoint 'leave' is received, a reset is issued because the primary
   * injector (without breakpoints) will NOT be issued a breakpoint 'enter' notification
   */
  resetCSS(value) {
    let self = privates.get(this);
    if ( this.isActive ) {
      this.element.css(self._align);
    }
  }

}

// ************************************************************
// Module Export
// ************************************************************


export default LayoutAlign;


// ************************************************************
// Private static variables
// ************************************************************

/**
 * Private cache for each Class instances' private data and methods.
 */
const privates = new WeakMap();

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

