
import 'angular-material/angular-material.css!'

// Load Angular libraries

import material from 'angular-material'

import mdMediaQuery from 'mq/MediaQuery.es6'
import mdLayouts from 'flexbox/Layout.es6'

// Demo Apps and Controllers

import TestController from 'demo/TestController.es6'
import LayoutDemoApp from 'demo/LayoutDemoApp.es'


/**
 * Manually bootstrap the application when AngularJS and
 * the application classes have been loaded.
 */
angular
  .element( document )
  .ready( function() {

    let appName = 'test-app';

    let body = document.getElementsByTagName("body")[0];
    let app  = angular
          .module( appName, [ mdMediaQuery, mdLayouts, 'ngMaterial'] )
          .controller("TestController", TestController)
          .controller("LayoutDemoApp" , LayoutDemoApp);

    angular.bootstrap( body, [ app.name ], { strictDi: false })

  });



