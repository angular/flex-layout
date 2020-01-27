/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ModuleWithProviders, NgModule} from '@angular/core';

import {BreakpointDirective, UnifiedDirective} from './src/unified';
import {FLEX_PROVIDER, GRID_PROVIDER, TAGS_PROVIDER} from './src/tags/tags';
import {BREAKPOINTS_PROVIDER} from './src/breakpoint';


@NgModule({
  declarations: [UnifiedDirective, BreakpointDirective],
  exports: [UnifiedDirective, BreakpointDirective]
})
export class UnifiedModule {
  static withDefaults(withDefaultBp: boolean = true): ModuleWithProviders<UnifiedModule> {
    return {
      ngModule: UnifiedModule,
      providers: withDefaultBp ? [
        TAGS_PROVIDER,
        BREAKPOINTS_PROVIDER,
      ] : [TAGS_PROVIDER],
    };
  }

  static withFlex(withDefaultBp: boolean = true): ModuleWithProviders<UnifiedModule> {
    return {
      ngModule: UnifiedModule,
      providers: withDefaultBp ? [
        FLEX_PROVIDER,
        BREAKPOINTS_PROVIDER
      ] : [FLEX_PROVIDER]
    };
  }

  static withGrid(withDefaultBp: boolean = true): ModuleWithProviders<UnifiedModule> {
    return {
      ngModule: UnifiedModule,
      providers: withDefaultBp ? [
        GRID_PROVIDER,
        BREAKPOINTS_PROVIDER
      ] : [GRID_PROVIDER]
    };
  }
}
