import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

import {
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdRadioModule
} from '@angular/material';

import {MediaQueryStatus} from './media-query-status';

/**
 * NgModule that includes all Material modules that are required to serve the demo-app.
 */
@NgModule({
  exports: [
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdRadioModule
  ]
})
export class MaterialDemosModule {}

/**
 * Shared ngModule used by all route-modules
 */
@NgModule({
  imports: [
    CommonModule,
    MaterialDemosModule,
    FlexLayoutModule
  ],
  exports: [
    CommonModule,
    MaterialDemosModule,
    FlexLayoutModule,
    MediaQueryStatus
  ],
  declarations: [
      MediaQueryStatus
  ]
})
export class SharedModule {
}
