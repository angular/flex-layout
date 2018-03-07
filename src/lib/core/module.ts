/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NgModule} from '@angular/core';

import {OBSERVABLE_MEDIA_PROVIDER} from './observable-media/observable-media-provider';

/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */

@NgModule({
  // easy subscription injectable `media$` matchMedia observable
  providers: [OBSERVABLE_MEDIA_PROVIDER]
})
export class CoreModule {
}
