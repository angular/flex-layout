import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

import {MediaQueryStatusComponent} from './media-query-status.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
  ],
  declarations: [MediaQueryStatusComponent],
  exports: [MediaQueryStatusComponent]
})
export class MediaQueryStatusModule { }
