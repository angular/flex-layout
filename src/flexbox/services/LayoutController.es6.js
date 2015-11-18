import Flex from 'flexbox/injectors/Flex.es6'
import Layout from 'flexbox/injectors/Layout.es6'

/**
 * Class LayoutController
 *
 * Establishes coupling of dependent Flex child items
 * (`flex` directives) to their immediate Layout parent
 */
class LayoutController {
  constructor(mediaQueries, $timeout, $log) {
    let self;

    this.$log = $log;

    privates.set(this, self = {
      asyncCount     : 0,
      asyncTimer     : undefined,
      children       : [], // flex=""   directives
      parents        : [], // layout="" directives

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
      processAsync : () => {
        $timeout.cancel(self.asyncTimer);
        self.asyncTimer = $timeout(()=>{
          self.asyncTimer = undefined;

          if ( self.parents.length < 1 ) {
            if ( ++self.asyncCount < 20 ) {
              self.processAsync();
            }
            return;
          }

          self.processLayoutInjectors(self.parents);
          self.processFlexInjectors( self.children, self.parents);

          self.parents   = undefined;
          self.children  = undefined;

        },0,false);
      },

      /**
       * Sort the layout injectors so `layout="row"`
       * is first; as this is the baseline
       */
      processLayoutInjectors : (list) => {
        if ( !list.length ) return;

        list = validatePrimary(list, (source) => {
          return source.cloneAs("layout");
        });

        list.forEach(layout => {
          mediaQueries.subscribe(layout);
        });
      },

      /**
       * Only flush Flex injectors if the parent has been registered
       */
      processFlexInjectors : (list, layouts) => {
        if ( !list.length ) return;

        list.forEach(flex => {
          angular.forEach(layouts, (layout) =>{
              layout.addChild(flex);
          });
          mediaQueries.subscribe(flex);
        });
      }
    });
  }

  /**
   * Store each 'layout' injector based on its DOM element
   */
  addParent(target) {
    let self = privates.get(this);
    if ( target ) {
      storeInjector(target, self.parents, this.$log);
      self.processAsync();
    }
  }


  /**
   * Store each 'flex' injector based on its DOM element
   */
  addChild(target) {
    let self = privates.get(this);
    if ( target ) {
      storeInjector(target, self.children, this.$log);
      self.processAsync();
    }
  }

}


/**
 * Find or create the primary injector: the flexbox directive
 * without a breakpoint suffix.
 *
 */
function validatePrimary(list, makeInjector) {
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
function storeInjector(injector, registry, $log) {
    logActivity(injector,  $log);
    registry.push(injector);
}

// ************************************************************
// Module Export
// ************************************************************


export default LayoutController;


// ************************************************************
// Private static variables
// ************************************************************

/**
 * Private cache for each Class instances' private data and methods.
 */
const privates = new WeakMap();

function logActivity(injector, $log) {
  let node =`<div ${injector.className}="${injector.value}">`;
  if ( injector.attrs["id"] ) node = `<div ${injector.attrs["id"]} ${injector.className}="${injector.value}">`;
  $log.error(`register: ${node}`);
}
