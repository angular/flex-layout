/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Flex-Layout Module
/**
 * Since the equivalent results are easily achieved with a css class attached to each
 * layout child, these have been deprecated and removed from the API.
 *
 *  import {LayoutPaddingDirective} from './api/flexbox/layout-padding';
 *  import {LayoutMarginDirective} from './api/flexbox/layout-margin';
 */
import {NgModule, Optional, PLATFORM_ID, Inject} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {SERVER_TOKEN} from '@angular/flex-layout/core';
import {FlexModule} from '@angular/flex-layout/flex';
import {ExtendedModule} from '@angular/flex-layout/extended';

/**
 *
 */
@NgModule({
  imports: [FlexModule, ExtendedModule],
  exports: [FlexModule, ExtendedModule]
})
export class FlexLayoutModule {

  constructor (
    @Optional() @Inject(SERVER_TOKEN) serverModuleLoaded: boolean,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    if (isPlatformServer(platformId) && !serverModuleLoaded) {
      console.warn('Warning: Flex Layout loaded on the server without FlexLayoutServerModule');
    }
  }
}
