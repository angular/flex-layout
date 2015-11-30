import angular  from 'angular'                  // Load Angular library
import material from 'angular-material'         // Load Angular Material library
import 'angular-material/angular-material.css!' // Load Material CSS styles

import mdLayouts from 'src/Layout.es6.js'       // Load Gen2 Layout modules

// Demo Apps and Controllers

import TestController from 'demo/controllers/TestController.es6'
import RowWrapController from 'demo/controllers/RowWrapController.es6'
import LayoutDemoApp from 'demo/controllers/LayoutDemoApp.es'


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
          .module( appName, [ mdLayouts, 'ngMaterial'] )
          .controller("TestController", TestController)
          .controller("RowWrapController", RowWrapController)
          .controller("LayoutDemoApp" , LayoutDemoApp);

    angular.bootstrap( body, [ app.name ], { strictDi: false })

  });



