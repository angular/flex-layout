// Work-around for angular material issue with ts_devserver and ts_web_test_suite.
// Material requires `module.id` to be valid. This symbol is valid in the production
// bundle but not in ts_devserver and ts_web_test_suite.
// See https://github.com/angular/material2/issues/13883.
// TODO(gmagolan): remove this work-around once #13883 is resolved.
var module = {id: ''};
