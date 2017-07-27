import {Component} from '@angular/core';

@Component({
  selector: 'demos-stackoverflow',
  template: `
    <demo-moz-holy-grail class='small-demo'></demo-moz-holy-grail>
    <demo-complex-column-ordering></demo-complex-column-ordering>
    <demo-grid-area-row-span></demo-grid-area-row-span>
    <demo-grid-column-span></demo-grid-column-span>
  `
})
export class DemosStackOverflow {
}

import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DemoComplexColumnOrder} from './columnOrder.demo';
import {DemoGridAreaRowSpan} from './gridArea.demo';
import {DemoGridColumnSpan} from './columnSpan.demo';
import {DemoMozHolyGrail} from './mozHolyGrail.demo';
import {SharedModule} from '../shared/_module';

@NgModule({
  declarations: [
    DemosStackOverflow,     // used by the Router with the root app component
    DemoComplexColumnOrder,
    DemoGridColumnSpan,
    DemoGridAreaRowSpan,
    DemoMozHolyGrail
  ],
  imports: [SharedModule, FlexLayoutModule]
})
export class DemosStackOverflowModule {
}
