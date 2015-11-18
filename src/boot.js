
import angular from 'angular'
import mdMediaQuery from 'mq/MediaQuery.es6'
import mdLayouts from 'flexbox/Layout.es6'


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
          .module( appName, [ mdMediaQuery, mdLayouts ] )
          .controller("TestController", function() {
            let vm = this;
            vm.box1Width = "11";
            vm.direction = "column";
            vm.hideBox = false;

          });

    angular.bootstrap( body, [ app.name ], { strictDi: false })

  });



