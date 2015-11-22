class LayoutDemoApp {

  constructor($scope) {
    this.$scope = $scope;
    this._initialize();
  }

  // ************************************************
  // Private Methods
  // ************************************************

  _initialize() {
    this.$scope.layoutDemo = {
      mainAxis: 'center',
      crossAxis: 'center',
      direction: 'row'
    };

    this.$scope.layoutAlign = () => {
      let box = this.$scope.layoutDemo;
      return `${box.mainAxis} ${box.crossAxis}`;
    };
  }
}

// ************************************************************
// Module Export
// ************************************************************

export default ["$scope", LayoutDemoApp ];
