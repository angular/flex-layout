/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NgModule} from '@angular/core';

import {BROWSER_PROVIDER} from './browser-provider';
import {ObservableMediaProvider} from './observable-media/observable-media';

/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */

@NgModule({
  providers: [BROWSER_PROVIDER, ObservableMediaProvider]
})
export class CoreModule {
}
