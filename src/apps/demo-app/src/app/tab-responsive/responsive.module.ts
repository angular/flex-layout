import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';

import {DashboardComponent} from './dashboard/dashboard.component';
import {
  ResponsiveLayoutDirectionComponent
} from './responsive-layout-direction/responsive-layout-direction.component';
import {
  ResponsiveRowColumnComponent
} from './responsive-row-column/responsive-row-column.component';
import {
  ResponsiveFlexDirectiveComponent
} from './responsive-flex-directive/responsive-flex-directive.component';
import {
  ResponsiveFlexOrderComponent
} from './responsive-flex-order/responsive-flex-order.component';
import {ResponsiveShowHideComponent} from './responsive-show-hide/responsive-show-hide.component';
import {ResponsiveStyleComponent} from './responsive-style/responsive-style.component';
import {ResponsiveRoutingModule} from './responsive-routing.module';
import {DemoUtilsModule} from '../utils/demo-utils.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatCheckboxModule,
    ResponsiveRoutingModule,
    DemoUtilsModule,
  ],
  declarations: [
    DashboardComponent,
    ResponsiveLayoutDirectionComponent,
    ResponsiveRowColumnComponent,
    ResponsiveFlexDirectiveComponent,
    ResponsiveFlexOrderComponent,
    ResponsiveShowHideComponent,
    ResponsiveStyleComponent
  ]
})
export class DocsResponsiveModule {}
