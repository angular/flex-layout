/**
 * Build configuration for the packaging tool. This file will be automatically detected and used
 * to build the different packages inside of Layout.
 */
const {join} = require('path');

const package = require('./package.json');

/** Current version of the project*/
const buildVersion = package.version;

/**
 * Required Angular version for all Angular Layout packages. This version will be used
 * as the peer dependency version for Angular in all release packages.
 */
const angularVersion = '^6.0.0 || ^6.0.0-rc.1';

/**
 * Required Angular CDK version for all Angular Layout packages. This version will be used
 * as the peer dependency version for Angular in all release packages.
 */
const cdkVersion = '^6.0.0 || ^6.0.0-rc.0';

/**
 * Required RxJS version for all Angular Layout packages. This version will be used
 * as the peer dependency version for Angular in all release packages.
 */
const rxjsVersion = '^6.0.0-rc.0';

/** License that will be placed inside of all created bundles. */
const buildLicense = `/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */`;

module.exports = {
  projectVersion: buildVersion,
  angularVersion: angularVersion,
  cdkVersion: cdkVersion,
  rxjsVersion: rxjsVersion,
  projectDir: __dirname,
  packagesDir: join(__dirname, 'src'),
  outputDir: join(__dirname, 'dist'),
  licenseBanner: buildLicense
};
