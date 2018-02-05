import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SplitDirective} from './split.directive';
import {SplitAreaDirective} from './split-area.directive';
import {SplitHandleDirective} from './split-handle.directive';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
  ],
  declarations: [SplitDirective, SplitAreaDirective, SplitHandleDirective],
  exports: [SplitDirective, SplitAreaDirective, SplitHandleDirective]
})
export class SplitModule {}
