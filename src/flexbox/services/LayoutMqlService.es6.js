/**
 * Class LayoutMqlService
 *
 * This is an adapter service that adapts the Injectors subscriptions to the
 * MediaWatcher API and registers Layout injectors for activate/deactivate notifications
 * from the MediaQueryWatcher
 *
 */
class LayoutMqlService {

  constructor( $mdMediaWatcher, $mdBreakpoints, $timeout, $log ) {
    this.$mdMediaWatcher = $mdMediaWatcher;
    this.$mdBreakpoints  = $mdBreakpoints;
    this.$timeout        = $timeout;
    this.$log            = $log;
  }


  // ************************************************
  // Private Methods
  // ************************************************

  _logActivity(action, mq, injector) {
    let value = injector.value || "";
    let node = injector.attrs["id"] ? `<div ${injector.attrs["id"]} ${injector.className}="${value}">` : `<div ${injector.className}="${value}">`;
    this.$log.warn(`${action}(${injector.mqAlias}) - ${node} ${mq}`);
  }

  // ************************************************
  // Public Methods
  // ************************************************

  /**
   * Subscribe the Layout injector to the MediaQueryWatcher
   * notifications... Delegate subscriber notifications to
   * injector methods
   *
   */
  subscribe(injector) {

    if ( !injector ) return;
    if ( injector.$$subscribed ) return;

    let breakpoint = this.$mdBreakpoints.findBreakpointBy(injector.mqAlias);
    this._logActivity("subscribe", '',  injector, this.$log);

    let subscriber = this.$mdMediaWatcher.attach( breakpoint, {

      enter : (mq) => {
        this.$timeout(()=>{
          this._logActivity("enter", '- '+mq,  injector);

          // Since injector 'leave' resets CSS on the element, delay so the `leave` event
          // dispatches BEFORE the `enter` event
          injector.activate();

        },0,false)
      },

      leave : (mq) => {
        this._logActivity("leave", mq,  injector);

        injector.deactivate();
      }
    });

    // !! Auto-detach on scope destroy

    injector.scope.$on('$destroy',()=>{
      this.$mdMediaWatcher.detach(subscriber);
      subscriber = injector.$$subscribed = undefined;
    });

    injector.$$subscribed = true;
  }

}


// ************************************************************
// Export only the MediaQueryWatcher
// ************************************************************


export default ["$mdMediaWatcher", "$mdBreakpoints", "$timeout", "$log", LayoutMqlService];


