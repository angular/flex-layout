/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Inject, ModuleWithProviders, NgModule, Optional, PLATFORM_ID} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {
  BreakPoint,
  BreakPointProviderOptions,
  CUSTOM_BREAKPOINTS_PROVIDER_FACTORY,
  CoreModule,
  SERVER_TOKEN,
} from '@angular/flex-layout/core';
import {ExtendedModule} from '@angular/flex-layout/extended';
import {FlexModule} from '@angular/flex-layout/flex';


/**
 * Since the equivalent results are easily achieved with a css class attached to each
 * layout child, these have been deprecated and removed from the API.
 *
 *  import {LayoutPaddingDirective} from './api/flexbox/layout-padding';
 *  import {LayoutMarginDirective} from './api/flexbox/layout-margin';
 */

/**
 *
 */
@NgModule({
  imports: [FlexModule, ExtendedModule, CoreModule],
  exports: [FlexModule, ExtendedModule, CoreModule]
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

  /**
   * External uses can easily add custom breakpoints AND include internal orientations
   * breakpoints; which are not available by default.
   *
   * !! Selector aliases are not auto-configured. Developers must subclass
   * the API directives to support extra selectors for the orientations breakpoints !!
   */
  static provideBreakPoints(breakpoints: BreakPoint[],
                            options?: BreakPointProviderOptions): ModuleWithProviders {
    return {
      ngModule: FlexLayoutModule,
      providers: [
        CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(breakpoints, options || {orientations: false})
      ]
    };
  }
}
