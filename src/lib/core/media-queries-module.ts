/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NgModule} from '@angular/core';
import {CoreModule} from './module';


/**
 * @deprecated use Core Module instead
 * @deletion-target 5.0.0-beta.15
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */
@NgModule({
  imports: [CoreModule],
  exports: [CoreModule],
})
export class MediaQueriesModule {
}
