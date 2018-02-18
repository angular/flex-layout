/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Inject, ModuleWithProviders, NgModule, Optional, PLATFORM_ID} from '@angular/core';
import {isPlatformServer} from '@angular/common';

import {MediaQueriesModule} from './media-query/_module';
import {BreakPoint} from './media-query/breakpoints/break-point';
import {
  BreakPointProviderOptions,
  CUSTOM_BREAKPOINTS_PROVIDER_FACTORY
} from './media-query/breakpoints/break-points-provider';

import {FlexDirective} from './api/flexbox/flex';
import {LayoutDirective} from './api/flexbox/layout';
import {FlexAlignDirective} from './api/flexbox/flex-align';
import {FlexFillDirective} from './api/flexbox/flex-fill';
import {FlexOffsetDirective} from './api/flexbox/flex-offset';
import {FlexOrderDirective} from './api/flexbox/flex-order';
import {LayoutAlignDirective} from './api/flexbox/layout-align';
import {LayoutGapDirective} from './api/flexbox/layout-gap';

import {ShowHideDirective} from './api/ext/show-hide';
import {ClassDirective} from './api/ext/class';
import {StyleDirective} from './api/ext/style';
import {ImgSrcDirective} from './api/ext/img-src';

import {BidiModule} from './bidi/bidi-module';
import {BROWSER_PROVIDER} from './utils/styling/browser-provider';
import {StyleUtils} from './utils/styling/style-utils';
import {ServerStylesheet} from './utils/styling/server-stylesheet';
import {SERVER_TOKEN} from './utils/styling/server-token';

/**
 * Since the equivalent results are easily achieved with a css class attached to each
 * layout child, these have been deprecated and removed from the API.
 *
 *  import {LayoutPaddingDirective} from './api/flexbox/layout-padding';
 *  import {LayoutMarginDirective} from './api/flexbox/layout-margin';
 */

const ALL_DIRECTIVES = [
  LayoutDirective,
  LayoutGapDirective,
  LayoutAlignDirective,
  FlexDirective,
  FlexOrderDirective,
  FlexOffsetDirective,
  FlexFillDirective,
  FlexAlignDirective,
  ShowHideDirective,
  ClassDirective,
  StyleDirective,
  ImgSrcDirective
];

/**
 *
 */
@NgModule({
  imports: [MediaQueriesModule, BidiModule],
  exports: [MediaQueriesModule, ...ALL_DIRECTIVES],
  declarations: [...ALL_DIRECTIVES],
  providers: [
    ServerStylesheet,
    StyleUtils,
    BROWSER_PROVIDER,
  ]
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
