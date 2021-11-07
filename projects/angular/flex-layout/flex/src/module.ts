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

import {DefaultLayoutDirective} from './layout/layout';
import {DefaultLayoutGapDirective} from './layout-gap/layout-gap';
import {DefaultFlexDirective} from './flex/flex';
import {DefaultFlexOrderDirective} from './flex-order/flex-order';
import {DefaultFlexOffsetDirective} from './flex-offset/flex-offset';
import {DefaultFlexAlignDirective} from './flex-align/flex-align';
import {FlexFillDirective} from './flex-fill/flex-fill';
import {DefaultLayoutAlignDirective} from './layout-align/layout-align';


const ALL_DIRECTIVES = [
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  DefaultLayoutAlignDirective,
  DefaultFlexOrderDirective,
  DefaultFlexOffsetDirective,
  FlexFillDirective,
  DefaultFlexAlignDirective,
  DefaultFlexDirective,
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
