import angular           from 'angular'
import buildRegistry     from 'flexbox/services/DirectiveRegistry.es6'
import LayoutMqlService  from 'flexbox/services/LayoutMqlService.es6'


/**
 * This Layout module  provides `flexbox` Grid features for Angular Material.
 * Published as 'material.layout', this module interprets the follow HTML attributes as commands:
 *
 *  - layout
 *  - flex
 *  - flex-order
 *  - layout-align
 *  - layout-margin
 *  - layout-offset
 *  - layout-padding
 *  - layout-wrap
 *  - layout-fill
 *  - hide
 *  - show
 *
 * More importantly these commands respond to
 *
 *  (a) interpolated attribute value changes, and
 *  (b) mediaQuery change notifications; with default support
 *      for breakpoints: sm, gt-sm, md, gt-md, lg, gt-lg.
 *
 * These directives can be used in combinations to build adaptive,
 * responsive layouts. Below is a sample usage:
 *
 *  <div layout='column' layout-gt-md="row" hide-md>
 *    <div flex flex-gt-sm="30">              </div>
 *    <div hide show-gt-sm flex-gt-sm="40">   </div>
 *    <div flex="30" flex-gt-sm>              </div>
 *  </div>
 *
 */
let mdLayouts = angular
      .module( "material.layout", [ 'material.mediaQuery' ] )
      .service("$mdLayoutMql"       , LayoutMqlService );

  // Register all the Layout flexbox directives

  angular.forEach(buildRegistry(),( constructionFn, normalizedName ) => {
    mdLayouts.directive( normalizedName, constructionFn );
  });


export default mdLayouts.name;

