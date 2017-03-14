import { Component } from '@angular/core';

@Component({
    selector: 'demos-docs-layout',
    template: `
      <demo-responsive-layout-direction  class="small-demo">  </demo-responsive-layout-direction>
      <demo-responsive-row-column class="small-demo">  </demo-responsive-row-column>
      <demo-responsive-flex-directive  class="small-demo">  </demo-responsive-flex-directive>
      <demo-responsive-flex-order  class="small-demo">  </demo-responsive-flex-order>
      <demo-responsive-show-hide  class="small-demo">  </demo-responsive-show-hide>
      <demo-responsive-style  class="small-demo">  </demo-responsive-style>
    `
})
export class DemosResponsiveLayout { }

import {NgModule}            from '@angular/core';
import {CommonModule}        from "@angular/common";
import {FormsModule}         from "@angular/forms";
import {MaterialModule}      from "@angular/material";
import {FlexLayoutModule}    from "../../../lib";     // `gulp build:components` to deploy to node_modules manually

import {DemoResponsiveRows}  from "./responsiveRowColumns.demo";
import {DemoResponsiveLayoutDirection }  from "./responsiveLayoutDirections.demo";
import {DemoResponsiveShowHide} from "./responsiveShowHide.demo";
import {DemoResponsiveFlexDirectives} from "./responsiveFlexDirective.demo";
import {DemoResponsiveFlexOrder} from "./responsiveFlexOrder.demo";
import {DemoResponsiveStyle} from "./responsiveStyle.demo";

@NgModule({
  declarations : [
    DemosResponsiveLayout,       // used by the Router with the root app component

    DemoResponsiveRows,
    DemoResponsiveLayoutDirection,
    DemoResponsiveFlexDirectives,
    DemoResponsiveFlexOrder,
    DemoResponsiveShowHide,
    DemoResponsiveStyle,
  ],
  imports : [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule
  ]

})
export class DemosResponsiveLayoutsModule { }
