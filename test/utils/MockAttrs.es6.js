
const PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;

class MockAttrs {

  constructor(map) {
    // Copy map as properties
    angular.forEach(map || {},(value, key)=>{
      this[key] = value;
    });
  }

  $observe( source, updateFn ) {
    updateFn();
  }

  /**
   * Converts snake_case to camelCase.
   * Also there is special case for Moz prefix starting with upper case letter.
   * @param name Name to normalize
   */
  $normalize(name) {
    return name
      .replace(PREFIX_REGEXP, '')
      .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      });
  }
}



// ************************************************************
// Module Export
// ************************************************************


export default MockAttrs;
