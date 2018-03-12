/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NgModule} from '@angular/core';
import {BidiModule} from '@angular/cdk/bidi';
import {
  BROWSER_PROVIDER,
  CoreModule,
  STYLESHEET_MAP_PROVIDER,
  StylesheetMap,
  StyleUtils
} from '@angular/flex-layout/core';

import {LayoutDirective} from './layout/layout';
import {LayoutGapDirective} from './layout-gap/layout-gap';
import {FlexDirective} from './flex/flex';
import {FlexOrderDirective} from './flex-order/flex-order';
import {FlexOffsetDirective} from './flex-offset/flex-offset';
import {FlexAlignDirective} from './flex-align/flex-align';
import {FlexFillDirective} from './flex-fill/flex-fill';
import {LayoutAlignDirective} from './layout-align/layout-align';


const ALL_DIRECTIVES = [
  LayoutDirective,
  LayoutGapDirective,
  LayoutAlignDirective,
  FlexDirective,
  FlexOrderDirective,
  FlexOffsetDirective,
  FlexFillDirective,
  FlexAlignDirective,
];

/**
 * *****************************************************************
 * Define module for the Flex API
 * *****************************************************************
 */

@NgModule({
  imports: [CoreModule, BidiModule],
  declarations: [...ALL_DIRECTIVES],
  exports: [...ALL_DIRECTIVES],
  providers: [
    StylesheetMap,
    StyleUtils,
    BROWSER_PROVIDER,
    STYLESHEET_MAP_PROVIDER,
  ]
})
export class FlexModule {
}
