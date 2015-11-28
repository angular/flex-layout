
class RowWrapController {

  constructor() {
    this._initialize();
  }

  // ************************************************
  // Private Methods
  // ************************************************

  _initialize() {
    this.wrapWith = "wrap";
  }
}

// ************************************************************
// Module Export
// ************************************************************

export default ["$scope", RowWrapController ];
