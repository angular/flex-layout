import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';

import {StackOverflowComponent} from './stack-overflow/stack-overflow.component';
import {GridAreaRowSpanComponent} from './grid-area-row-span/grid-area-row-span.component';
import {GridColumnSpanComponent} from './grid-column-span/grid-column-span.component';
import {MozHolyGrailComponent} from './moz-holy-grail/moz-holy-grail.component';
import {StackOverflowRoutingModule} from './stack-overflow-routing.module';
import {
  CustomHideDirective,
  HideWithCustomBPComponent
} from './hide-custom-bp/hide-with-custom-bp.component';
import {
  ComplexColumnOrderingComponent
} from './complex-column-ordering/complex-column-ordering.component';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatCardModule,
    StackOverflowRoutingModule,
  ],
  declarations: [
    StackOverflowComponent,
    ComplexColumnOrderingComponent,
    GridAreaRowSpanComponent,
    GridColumnSpanComponent,
    MozHolyGrailComponent,
    CustomHideDirective,
    HideWithCustomBPComponent
  ]
})
export class DocsStackOverflowModule {}
