/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NgModule} from '@angular/core';

import {BROWSER_PROVIDER} from './browser-provider';


/**
 * *****************************************************************
 * Define module for common Angular Layout utilities
 * *****************************************************************
 */
@NgModule({
  providers: [BROWSER_PROVIDER]
})
export class CoreModule {
}
