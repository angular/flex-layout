/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NgModule} from '@angular/core';
import {CoreModule} from '@angular/flex-layout/core';

import {DefaultGridAlignDirective, GridAlignDirective} from './grid-align/grid-align';
import {
  DefaultGridAlignColumnsDirective,
  GridAlignColumnsDirective,
} from './align-columns/align-columns';
import {DefaultGridAlignRowsDirective, GridAlignRowsDirective} from './align-rows/align-rows';
import {DefaultGridAreaDirective, GridAreaDirective} from './area/area';
import {DefaultGridAreasDirective, GridAreasDirective} from './areas/areas';
import {DefaultGridAutoDirective, GridAutoDirective} from './auto/auto';
import {DefaultGridColumnDirective, GridColumnDirective} from './column/column';
import {DefaultGridColumnsDirective, GridColumnsDirective} from './columns/columns';
import {DefaultGridGapDirective, GridGapDirective} from './gap/gap';
import {DefaultGridRowDirective, GridRowDirective} from './row/row';
import {DefaultGridRowsDirective, GridRowsDirective} from './rows/rows';


const ALL_DIRECTIVES = [
  DefaultGridAlignDirective,
  DefaultGridAlignColumnsDirective,
  DefaultGridAlignRowsDirective,
  DefaultGridAreaDirective,
  DefaultGridAreasDirective,
  DefaultGridAutoDirective,
  DefaultGridColumnDirective,
  DefaultGridColumnsDirective,
  DefaultGridGapDirective,
  DefaultGridRowDirective,
  DefaultGridRowsDirective,
  GridAlignColumnsDirective,
  GridAlignRowsDirective,
  GridAreaDirective,
  GridAreasDirective,
  GridAutoDirective,
  GridColumnDirective,
  GridColumnsDirective,
  GridGapDirective,
  GridAlignDirective,
  GridRowDirective,
  GridRowsDirective,
];

/**
 * *****************************************************************
 * Define module for the CSS Grid API
 * *****************************************************************
 */

@NgModule({
  imports: [CoreModule],
  declarations: [...ALL_DIRECTIVES],
  exports: [...ALL_DIRECTIVES]
})
export class GridModule {
}
