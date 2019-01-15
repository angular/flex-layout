import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DocsLayoutComponent} from './docs-layout/docs-layout.component';
import {LayoutAlignmentComponent} from './layout-alignment/layout-alignment.component';
import {LayoutFillComponent} from './layout-fill/layout-fill.component';
import {FlexRowFillComponent} from './flex-row-fill/flex-row-fill.component';
import {FlexRowFillWrapComponent} from './flex-row-fill-wrap/flex-row-fill-wrap.component';
import {
  FlexAttributeValuesComponent
} from './flex-attribute-values/flex-attribute-values.component';
import {FlexOffsetValuesComponent} from './flex-offset-values/flex-offset-values.component';
import {FlexAlignSelfComponent} from './flex-align-self/flex-align-self.component';
import {LayoutRoutingModule} from './layout-routing.module';
import {
  LayoutWithDirectionComponent
} from './layout-with-direction/layout-with-direction.component';
import {LayoutGapComponent} from './layout-gap/layout-gap.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    FlexLayoutModule,
    LayoutRoutingModule
  ],
  declarations: [
    DocsLayoutComponent,
    LayoutAlignmentComponent,
    LayoutFillComponent,
    FlexRowFillComponent,
    FlexRowFillWrapComponent,
    FlexAttributeValuesComponent,
    FlexOffsetValuesComponent,
    FlexAlignSelfComponent,
    LayoutWithDirectionComponent,
    LayoutGapComponent,
  ]
})
export class DocsLayoutModule {}
