
export default class Logger{

  constructor($log) {
    this.$log = $log || window.console.log.bind(window.console);
  }

  /**
   * Log injector activity and include the current injector value
   */
  debug (action, injector, overrides) {
    let prefix =`<div ${injector.className}="${injector.value}">`;
    if ( injector.attrs["id"] ) {
      prefix = `<div ${injector.attrs["id"]} ${injector.className}="${injector.value}">`;
    }

    this.$log.debug(`${prefix}::${action}(${JSON.stringify(overrides)})`);
  }

  /**
   * Log injector activity
   */
  debugNoValue(action, injector, overrides) {
    let prefix = `<div ${injector.className}>`;
    if ( injector.attrs["id"] ) {
      prefix = `<div ${injector.attrs["id"]} ${injector.className}>`;
    }

    this.$log.debug(`${prefix}::${action}(${JSON.stringify(overrides)})`);
  }

}
