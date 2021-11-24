import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

import { SplitHandleDirective } from './split-handle.directive';
import { SplitDirective } from './split.directive';
import { SplitAreaDirective } from './split-area.directive';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
  ],
  declarations: [SplitHandleDirective, SplitDirective, SplitAreaDirective],
  exports: [SplitHandleDirective, SplitDirective, SplitAreaDirective]
})
export class SplitModule {}
