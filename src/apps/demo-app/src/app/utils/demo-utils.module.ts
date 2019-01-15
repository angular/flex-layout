import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

import {MediaQueryStatusComponent} from './media-query-status/media-query-status.component';
import {MediaTriggerBarComponent} from './media-trigger/media-trigger-bar.component';
import {SplitModule} from './split-divider/split.module';
import {WatermarkComponent} from './watermark/watermark.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SplitModule
  ],
  declarations: [
    MediaQueryStatusComponent, MediaTriggerBarComponent,
    WatermarkComponent
  ],
  exports: [
    MediaQueryStatusComponent, MediaTriggerBarComponent,
    WatermarkComponent
  ]
})
export class DemoUtilsModule { }
