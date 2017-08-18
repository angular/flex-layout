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

import {FlexDirective} from './api/flexbox/flex';
import {LayoutDirective} from './api/flexbox/layout';
import {FlexAlignDirective} from './api/flexbox/flex-align';
import {FlexFillDirective} from './api/flexbox/flex-fill';
import {FlexOffsetDirective} from './api/flexbox/flex-offset';
import {FlexOrderDirective} from './api/flexbox/flex-order';
import {LayoutAlignDirective} from './api/flexbox/layout-align';
import {LayoutWrapDirective} from './api/flexbox/layout-wrap';
import {LayoutGapDirective} from './api/flexbox/layout-gap';

import {ShowHideDirective} from './api/ext/show-hide';
import {ClassDirective} from './api/ext/class';
import {StyleDirective} from './api/ext/style';
import {ImgSrcDirective} from './api/ext/img-src';

/**
 * Since the equivalent results are easily achieved with a css class attached to each
 * layout child, these have been deprecated and removed from the API.
 *
 *  import {LayoutPaddingDirective} from './api/flexbox/layout-padding';
 *  import {LayoutMarginDirective} from './api/flexbox/layout-margin';
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
  ImgSrcDirective
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
