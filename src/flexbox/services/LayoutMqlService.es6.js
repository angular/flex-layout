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
    let mediaQuery = breakpoint ? breakpoint.mediaQuery : null;

    logActivity("subscribe", '',  injector, this.$log);

    let subscriber = this.$mdMediaWatcher.attach( mediaQuery, {

      enter : (mq) => {
        this.$timeout(()=>{
          logActivity("enter", '- '+mq,  injector, this.$log);

          // Since injector 'leave' resets CSS on the element, delay so the `leave` event
          // dispatches BEFORE the `enter` event
          injector.activate();

        },0,false)
      },

      leave : (mq) => {
        logActivity("leave", mq,  injector, this.$log);

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

function logActivity(action, mq, injector, $log) {
  let value = injector.value || "";
  let node = injector.attrs["id"] ? `<div ${injector.attrs["id"]} ${injector.className}="${value}">` : `<div ${injector.className}="${value}">`;
  $log.warn(`${action}(${injector.mqAlias}) - ${node} ${mq}`);
}
