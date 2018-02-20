import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule, MatCheckboxModule} from '@angular/material';

import {DocsResponsiveComponent} from './docs-responsive/docs-responsive.component';
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
import {RoutingModule} from './routing.module';
import {MediaQueryStatusModule} from '../media-query-status/media-query-status.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatCheckboxModule,
    RoutingModule,
    MediaQueryStatusModule,
  ],
  declarations: [
    DocsResponsiveComponent,
    ResponsiveLayoutDirectionComponent,
    ResponsiveRowColumnComponent,
    ResponsiveFlexDirectiveComponent,
    ResponsiveFlexOrderComponent,
    ResponsiveShowHideComponent,
    ResponsiveStyleComponent
  ]
})
export class DocsResponsiveModule {}
