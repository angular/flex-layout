/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NgModule} from '@angular/core';
import {BidiModule} from '@angular/cdk/bidi';
import {CoreModule} from '@angular/flex-layout/core';

import {DefaultLayoutDirective, LayoutDirective} from './layout/layout';
import {DefaultLayoutGapDirective, LayoutGapDirective} from './layout-gap/layout-gap';
import {DefaultFlexDirective, FlexDirective} from './flex/flex';
import {DefaultFlexOrderDirective, FlexOrderDirective} from './flex-order/flex-order';
import {DefaultFlexOffsetDirective, FlexOffsetDirective} from './flex-offset/flex-offset';
import {DefaultFlexAlignDirective, FlexAlignDirective} from './flex-align/flex-align';
import {FlexFillDirective} from './flex-fill/flex-fill';
import {DefaultLayoutAlignDirective, LayoutAlignDirective} from './layout-align/layout-align';


const ALL_DIRECTIVES = [
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  DefaultLayoutAlignDirective,
  DefaultFlexOrderDirective,
  DefaultFlexOffsetDirective,
  FlexFillDirective,
  DefaultFlexAlignDirective,
  DefaultFlexDirective,
  FlexDirective,
  FlexAlignDirective,
  FlexOffsetDirective,
  FlexOrderDirective,
  LayoutDirective,
  LayoutAlignDirective,
  LayoutGapDirective,
];

/**
 * *****************************************************************
 * Define module for the Flex API
 * *****************************************************************
 */

@NgModule({
  imports: [CoreModule, BidiModule],
  declarations: [...ALL_DIRECTIVES],
  exports: [...ALL_DIRECTIVES]
})
export class FlexModule {
}
