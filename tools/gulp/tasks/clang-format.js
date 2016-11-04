/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

'use strict';

// THIS CHECK SHOULD BE THE FIRST THING IN THIS FILE
// This is to ensure that we catch env issues before we error while requiring other dependencies.
// require('./check-environment')({
//   requiredNpmVersion: '>=3.5.3 <4.0.0',
//   requiredNodeVersion: '>=5.4.1 <7.0.0',
// });

const gulp = require('gulp');
const path = require('path');
const os = require('os');


// clang-format entry points
const srcsToFmt = [
  'src/lib/**/*.{js,ts}'
];

// Format the source code with clang-format (see .clang-format)
gulp.task('format', () => {
  const format = require('gulp-clang-format');
  const clangFormat = require('clang-format');
  return gulp.src(srcsToFmt, {base: '.'})
      .pipe(format.format('file', clangFormat))
      .pipe(gulp.dest('.'));
});
