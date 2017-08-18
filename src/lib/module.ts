/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ModuleWithProviders, NgModule} from '@angular/core';
import {MediaQueriesModule} from './media-query/_module';

import {BreakPoint} from './media-query/breakpoints/break-point';
import {
  BreakPointProviderOptions,
  DEFAULT_BREAKPOINTS_PROVIDER,
  CUSTOM_BREAKPOINTS_PROVIDER_FACTORY
} from './media-query/breakpoints/break-points-provider';
import {MEDIA_MONITOR_PROVIDER} from './media-query/media-monitor-provider';
import {OBSERVABLE_MEDIA_PROVIDER} from './media-query/observable-media-provider';

import {FlexDirective} from './flexbox/api/flex';
import {LayoutDirective} from './flexbox/api/layout';
import {ShowHideDirective} from './flexbox/api/show-hide';
import {FlexAlignDirective} from './flexbox/api/flex-align';
import {FlexFillDirective} from './flexbox/api/flex-fill';
import {FlexOffsetDirective} from './flexbox/api/flex-offset';
import {FlexOrderDirective} from './flexbox/api/flex-order';
import {LayoutAlignDirective} from './flexbox/api/layout-align';
import {LayoutWrapDirective} from './flexbox/api/layout-wrap';
import {LayoutGapDirective} from './flexbox/api/layout-gap';
import {ClassDirective} from './flexbox/api/class';
import {StyleDirective} from './flexbox/api/style';
import {ImgSrcsetDirective} from './flexbox/api/img-srcset';

/**
 * Since the equivalent results are easily achieved with a css class attached to each
 * layout child, these have been deprecated and removed from the API.
 *
 *  import {LayoutPaddingDirective} from './flexbox/api/layout-padding';
 *  import {LayoutMarginDirective} from './flexbox/api/layout-margin';
 */

const ALL_DIRECTIVES = [
  LayoutDirective,
  LayoutWrapDirective,
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
  ImgSrcsetDirective
];

/**
 *
 */
@NgModule({
  imports: [MediaQueriesModule],
  exports: [MediaQueriesModule, ...ALL_DIRECTIVES],
  declarations: [...ALL_DIRECTIVES],
  providers: [
    MEDIA_MONITOR_PROVIDER,
    DEFAULT_BREAKPOINTS_PROVIDER,   // Extend defaults with internal custom breakpoints
    OBSERVABLE_MEDIA_PROVIDER
  ]
})
export class FlexLayoutModule {
  /**
   * External uses can easily add custom breakpoints AND include internal orientations
   * breakpoints; which are not available by default.
   *
   * !! Selector aliases are not auto-configured. Developers must subclass
   * the API directives to support extra selectors for the orientations breakpoints !!
   */
  static provideBreakPoints(breakpoints: BreakPoint[],
                            options ?: BreakPointProviderOptions): ModuleWithProviders {
    return {
      ngModule: FlexLayoutModule,
      providers: [
        CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(breakpoints, options || {orientations: false})
      ]
    };
  }
}
