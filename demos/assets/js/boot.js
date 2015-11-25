
import 'angular-material/angular-material.css!'

// Load Angular libraries

import material from 'angular-material'

// Load Layout modules

import mdLayouts from 'src/Layout.es6.js'

// Demo Apps and Controllers

import TestController from 'demo/controllers/TestController.es6'
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
          .controller("LayoutDemoApp" , LayoutDemoApp);

    angular.bootstrap( body, [ app.name ], { strictDi: false })

  });



