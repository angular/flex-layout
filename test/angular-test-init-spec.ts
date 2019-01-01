import {TestBed} from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import {patchTestBedToDestroyFixturesAfterEveryTest} from './patch-testbed';

/*
 * Common setup / initialization for all unit tests in Angular Layout.
 */

const testBed = TestBed.initTestEnvironment(
  [BrowserDynamicTestingModule], platformBrowserDynamicTesting());
patchTestBedToDestroyFixturesAfterEveryTest(testBed);

(window as any).module = {};
(window as any).isNode = false;
(window as any).isBrowser = true;
(window as any).global = window;
