import BreakPoints      from 'mq/services/BreakPointsService.es6'
import LayoutController from "flexbox/services/LayoutController.es6"
import Logger           from "flexbox/utils/InjectorLogger.es6"

import Flex             from 'flexbox/injectors/Flex.es6'
import Layout           from 'flexbox/injectors/Layout.es6'
import ShowHide         from 'flexbox/injectors/ShowHide.es6'
import FlexOrder        from 'flexbox/injectors/FlexOrder.es6'
import FlexOffset       from 'flexbox/injectors/FlexOffset.es6'
import LayoutFill       from 'flexbox/injectors/LayoutFill.es6'
import LayoutAlign      from 'flexbox/injectors/LayoutAlign.es6'
import LayoutWrap       from 'flexbox/injectors/LayoutWrap.es6'
import MarginPadding    from 'flexbox/injectors/MarginPadding.es6'

import modernizr        from 'flexbox/utils/Modernizer.es6'

const  CLASS_REGISTRY = {
    'show'            : ShowHide,
    'hide'            : ShowHide,
    'flex-order'      : FlexOrder,
    'flex-offset'     : FlexOffset,
    'layout-fill'     : LayoutFill,
    'layout-align'    : LayoutAlign,
    'layout-padding'  : MarginPadding,
    'layout-margin'   : MarginPadding,
    'layout-wrap'     : LayoutWrap,
    'layout-nowrap'   : LayoutWrap
};

const LAYOUT_CONTROLLER = "$$layoutController";

const SUFFIX = /-(gt-)?(xs|sm|md|lg|xl)/g;

/**
 * For each standard Layout directive, build variants based on
 * the currently configured variants
 *
 */
function buildLayoutDirectives() {
  let allDirectives = { };

  let variants = new BreakPoints().breakpoints;
  let features = [ 'layout', 'flex' ];

  // Build full list of all primary directives (no breakpoints)
  angular.forEach(CLASS_REGISTRY, (value,key)=>{
    features.push(key);
  });

  angular.forEach(features,(directiveName) => {
    // For each breakpoint (sm, gt-sm, md, gt-md, lg, gt-lg, etc), register a directive

    angular.forEach( variants, (breakpoint) => {
      let className = breakpoint.suffix ? `${directiveName}-${breakpoint.suffix}` : `${directiveName}`;
      let normalizedName = directiveNormalize(directiveName);
      let normalizedKey = `${normalizedName}${breakpoint.normalizedSuffix}`;
      allDirectives[normalizedKey] =  buildConstructionFn(className, breakpoint);
    });

  });

  return allDirectives;
}

// ************************************************************
// Module Export
// ************************************************************

export default buildLayoutDirectives;


// ************************************************************
// Internal methods used to build Directive construction
// functions with DI annotations.
// ************************************************************

/**
 * Create a Directive constructor function for a primary Grid
 * Flexbox directive: 'layout'
 */
function buildConstructionFn(className, breakpoint) {
  let rootName = className.replace(SUFFIX, "");

  return ["$mdLayoutMql", "$timeout", "$log",
    ($mdLayoutMql, $timeout, $log) => {

      let utils = { '$log' : new Logger($log), modernizr : modernizr  },
          ddo = {
            restrict : 'A',
            scope    : false,
            priority : calculatePriority(rootName, className, breakpoint)
          };

      switch( rootName ) {

        case 'layout' :
          ddo.compile = ( tElement, tAttrs ) => {
            buildLayoutController(tElement, $mdLayoutMql, $timeout, $log);

            // publish post-link fn
            return (scope, element, attr) => {

              let controller = findLayoutController(element);
              controller.addParent(
                new Layout(className, scope, element, attr, utils)
              );
            };
          };
          break;

        case 'flex' :
          ddo.compile = ( tElement, tAttrs ) => {
            // publish post-link fn
            return (scope, element, attr) => {
              let controller = findLayoutController( element.parent() );
              if ( controller ) {
                controller.addChild( new Flex(className, scope, element, attr, utils) );
              }
              else {
                let node = `<${element[0].nodeName} ${className}>`;
                $log.warn(`Unable to find 'layout' parent for ${node}`)
              }
            };
          };
          break;

        default :
          ddo.compile = ( tElement, tAttrs ) => {
            // publish post-link fn
            return (scope, element, attr) => {
              let injectorClass = CLASS_REGISTRY[rootName];
              if ( injectorClass ) {
                $mdLayoutMql.subscribe( new injectorClass(className, scope, element, attr, utils) );
              }
            };
          };

          break;
      }

      return ddo;

    }];

  /**
   * Build a shared LayoutController for the element with 1..n
   * `layout` directives. This is used by children directives
   * that are dependent upon the 'flex' parent's current
   * 'layout' settings.
   *
   * e.g.  `flex` must know the direction of its `layout` parent
   */
  function buildLayoutController($element, $mdLayoutMql, $timeout, $log) {
    $element = angular.element($element);
    let controller = $element.data(LAYOUT_CONTROLLER);
    if ( !controller ) {
      controller = new LayoutController($mdLayoutMql, $timeout, $log);
      $element.data( LAYOUT_CONTROLLER, controller );
    }
    return controller;
  }

  /**
   * Scan parent element [of the 'flex' element] for a shared layout controller...
   */
  function findLayoutController($element) {
    return angular.element($element).data(LAYOUT_CONTROLLER);
  }

  /**
   * Lookup the directive priority. If the breakpoint is used
   * (eg  layout-sm, flex-gt-lg, etc) then reduce the priority
   * so the root directive (eg layout, flex) always runs FIRST.
   *
   * NOTE: Directives with greater numerical priority are compiled first,
   *       but post-link functions are run in reverse order.
   */
  function calculatePriority(rootName, className, breakpoint) {
    let priority = PRIORITIES[rootName];

    // Lowest priority runs FIRST in post-link
    return priority - breakpoint.order;
  }

}

const PRIORITIES = {
   'layout'        : 400,
   'flex'          : 370,

   'show'          : 350,
   'hide'          : 350,

   'flex-order'    : 330,
   'flex-offset'   : 310,

   'layout-fill'   : 200,
   'layout-align'  : 270,

   'layout-padding': 250,
   'layout-margin' : 250,
   'layout-wrap'   : 250,
   'layout-no-wrap': 250
};

const PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;


/**
 * Converts snake_case to camelCase.
 * Also there is special case for Moz prefix starting with upper case letter.
 * @param name Name to normalize
 */
function directiveNormalize(name) {
  return name
    .replace(PREFIX_REGEXP, '')
    .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
}

