import Layout from 'flexbox/injectors/Layout.es6'

/**
 * Class LayoutController
 *
 * Establishes coupling of dependent Flex child items
 * (`flex` directives) to their immediate Layout parent
 */
class LayoutController {

  constructor(mediaQueries, $timeout, $log) {
    this.$log           = $log;
    this._$timeout      = $timeout;
    this._mediaQueries  = mediaQueries;

    this._asyncCount     = 0;
    this._asyncTimer     = undefined;
    this._children       = []; // flex=""   directives
    this._parents        = []; // layout="" directives
  }

  // ************************************************
  // Private Methods
  // ************************************************

  /**
   * Wait until the elements layout directives (1...n) are
   * registered and the children flex directives are registered
   * Then process and subscribe each for mediaQuery change
   * notifications.
   *
   * Note: A special case is the primary `layout` directive.
   * This 'layout' [without breakpoint suffix] is required
   * and should be activated first!
   */
  _processAsync() {
    this._$timeout.cancel(this._asyncTimer);
    this._asyncTimer = this._$timeout(()=>{
      this._asyncTimer = undefined;

      if ( this._parents.length < 1 ) {
        if ( ++this._asyncCount < 20 ) {
          this._processAsync();
        }
        return;
      }

      this._processLayoutInjectors(this._parents);
      this._processFlexInjectors( this._children, this._parents);

      this._parents   = undefined;
      this._children  = undefined;

    },0,false);
  }

  /**
   * Sort the layout injectors so `layout="row"`
   * is first; as this is the baseline
   */
  _processLayoutInjectors(list) {
    if ( !list.length ) return;

    list = this._validatePrimary(list, (it) => {
      return new Layout("layout", it.scope, it.element, it.attrs, it.$log);
    });

    list.forEach(layout => {
      this._mediaQueries.subscribe(layout);
    });
  }

  /**
   * Only flush Flex injectors if the parent has been registered
   */
  _processFlexInjectors(list, layouts) {
    if ( !list.length ) return;

    list.forEach(flex => {
      angular.forEach(layouts, (layout) =>{
          layout.addChild(flex);
      });
      this._mediaQueries.subscribe(flex);
    });
  }

  _logActivity(injector) {
    let node =`<div ${injector.className}="${injector.value}">`;
    if ( injector.attrs["id"] ) node = `<div ${injector.attrs["id"]} ${injector.className}="${injector.value}">`;
    this.$log.error(`register: ${node}`);
  }


  /**
    * Find or create the primary injector: the flexbox directive
    * without a breakpoint suffix.
    *
    */
   _validatePrimary(list, makeInjector) {
     let primary;

     // Find existing primary injector
     list.forEach(it => {
       // If the alias/breakpoint is empty, it is a primary
       if ( it.mqAlias === "") {
         primary = it;
       }
     });

     // Or make primary injector
     if ( !primary ) {
       primary = makeInjector( list[0] );
     }

     // Filter out primary
     list = list.filter(it => { return it !== primary; }).reverse();

     // Now publish list with primary as FIRST
     return [primary].concat(list);
   }

   /**
    * Each DOM element may have 1...n injectors associated
    * <div layout layout-gt-md="column" layout-lg="row" />
    */
   _storeInjector(injector, registry) {
       this._logActivity(injector);
       registry.push(injector);
   }



  // ************************************************
  // Public Methods
  // ************************************************


  /**
   * Store each 'layout' injector based on its DOM element
   */
  addParent(target) {
    if ( target ) {
      this._storeInjector(target, this._parents, this.$log);
      this._processAsync();
    }
  }


  /**
   * Store each 'flex' injector based on its DOM element
   */
  addChild(target) {
    if ( target ) {
      this._storeInjector(target, this._children, this.$log);
      this._processAsync();
    }
  }

}

// ************************************************************
// Module Export
// ************************************************************


export default LayoutController;
