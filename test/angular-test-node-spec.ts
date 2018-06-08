/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import 'zone.js/dist/zone-node.js';
import 'zone.js/dist/long-stack-trace-zone.js';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test.js';
import 'zone.js/dist/async-test.js';
import 'zone.js/dist/fake-async-test.js';
import 'zone.js/dist/task-tracking.js';
import 'reflect-metadata/Reflect';

// This hack is needed to get jasmine, node and zone working inside bazel.
// 1) we load `jasmine-core` which contains the ENV: it, describe etc...
const jasmineCore: any = require('jasmine-core');
// 2) We create an instance of `jasmine` ENV.
const patchedJasmine = jasmineCore.boot(jasmineCore);
// 3) Save the `jasmine` into global so that `zone.js/dist/jasmine-patch.js` can get a hold of it to
// patch it.
(global as any)['jasmine'] = patchedJasmine;
// 4) Change the `jasmine-core` to make sure that all subsequent jasmine's have the same ENV,
// otherwise the patch will not work.
//    This is needed since Bazel creates a new instance of jasmine and it's ENV and we want to make
//    sure it gets the same one.
jasmineCore.boot = function() {
  return patchedJasmine;
};
// 5) Patch jasmine ENV with code which understands ProxyZone.
import 'zone.js/dist/jasmine-patch.js';

(global as any).isNode = true;
(global as any).isBrowser = false;

// Init TestBed
import {TestBed} from '@angular/core/testing';
import {ServerTestingModule, platformServerTesting} from '@angular/platform-server/testing';

const testBed = TestBed.initTestEnvironment(ServerTestingModule, platformServerTesting());
patchTestBedToDestroyFixturesAfterEveryTest(testBed);

/**
 * Monkey-patches TestBed.resetTestingModule such that any errors that occur during component
 * destruction are thrown instead of silently logged. Also runs TestBed.resetTestingModule after
 * each unit test.
 *
 * Without this patch, the combination of two behaviors is problematic for Angular Material:
 * - TestBed.resetTestingModule catches errors thrown on fixture destruction and logs them without
 *     the errors ever being thrown. This means that any component errors that occur in ngOnDestroy
 *     can encounter errors silently and still pass unit tests.
 * - TestBed.resetTestingModule is only called *before* a test is run, meaning that even *if* the
 *    aforementioned errors were thrown, they would be reported for the wrong test (the test that's
 *    about to start, not the test that just finished).
 */
function patchTestBedToDestroyFixturesAfterEveryTest(testBed) {
  // Original resetTestingModule function of the TestBed.
  const _resetTestingModule = testBed.resetTestingModule;

  // Monkey-patch the resetTestingModule to destroy fixtures outside of a try/catch block.
  // With https://github.com/angular/angular/commit/2c5a67134198a090a24f6671dcdb7b102fea6eba
  // errors when destroying components are no longer causing Jasmine to fail.
  testBed.resetTestingModule = function() {
    try {
      this._activeFixtures.forEach(fixture => fixture.destroy());
    } finally {
      this._activeFixtures = [];
      // Regardless of errors or not, run the original reset testing module function.
      _resetTestingModule.call(this);
    }
  };

  // Angular's testing package resets the testing module before each test. This doesn't work well
  // for us because it doesn't allow developers to see what test actually failed.
  // Fixing this by resetting the testing module after each test.
  // https://github.com/angular/angular/blob/master/packages/core/testing/src/before_each.ts#L25
  afterEach(() => testBed.resetTestingModule());
}
