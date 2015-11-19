
import 'angular-material/angular-material.css!'

// Load Angular libraries

import material from 'angular-material'

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
          .module( appName, [ mdMediaQuery, mdLayouts, 'ngMaterial'] )
          .controller("TestController", function() {
            let vm = this;
            vm.box1Width = "11";
            vm.direction = "column";
            vm.hideBox = false;

          })
          .controller("LayoutDemoApp", ($scope) => {
            $scope.layoutDemo = {
                mainAxis: 'center',
                crossAxis: 'center',
                direction: 'row'
              };
              $scope.layoutAlign = function() {
                return $scope.layoutDemo.mainAxis + ' ' + $scope.layoutDemo.crossAxis;
              };
          });

    angular.bootstrap( body, [ app.name ], { strictDi: false })

  });



