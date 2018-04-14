import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DocsGridComponent} from './docs-grid/docs-grid.component';
import {GridLayoutComponent} from './grid-layout/grid-layout.component';
import {RoutingModule} from './routing.module';
import {GridNestedComponent} from './grid-nested/grid-nested.component';
import {GridMinmaxComponent} from './grid-minmax/grid-minmax.component';
import {GridPositionComponent} from './grid-position/grid-position.component';
import {GridOverlayComponent} from './grid-overlay/grid-overlay.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    FlexLayoutModule,
    RoutingModule,
  ],
  declarations: [
    DocsGridComponent,
    GridLayoutComponent,
    GridNestedComponent,
    GridMinmaxComponent,
    GridPositionComponent,
    GridOverlayComponent,
  ]
})
export class DocsGridModule {}
