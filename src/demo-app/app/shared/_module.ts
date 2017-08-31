import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DemoMaterialModule} from './demo-material-module';

import {MediaQueryStatus} from './media-query-status';

/**
 * Shared ngModule used by all route-modules
 */
@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    DemoMaterialModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    DemoMaterialModule,
    MediaQueryStatus
  ],
  declarations: [
      MediaQueryStatus
  ]
})
export class SharedModule {
}
