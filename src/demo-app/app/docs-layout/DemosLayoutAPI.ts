import { Component } from '@angular/core';

@Component({
    selector: 'demos-docs-layout',
    template: `
      <demo-layout-alignment      class="small-demo">  </demo-layout-alignment>          
      <demo-flex-row-fill         class="small-demo">  </demo-flex-row-fill>
      <demo-flex-row-fill-wrap    class="small-demo">  </demo-flex-row-fill-wrap>
      <demo-flex-attribute-values class="small-demo">  </demo-flex-attribute-values>
      <demo-flex-offset-values    class="small-demo">  </demo-flex-offset-values>
    `
})
export class DemosLayoutAPI { }

import {NgModule}            from '@angular/core';
import {CommonModule}        from "@angular/common";
import {FormsModule}         from "@angular/forms";

import {MaterialModule}      from "@angular/material";
import {FlexLayoutModule}       from "../../../lib/flexbox/flexbox-module";


import {DemoLayoutAlignment} from "./layoutAlignment.demo";
import {DemoFlexRowFill}     from "./flexRowFill.demo";
import {DemoFlexRowFillWrap} from "./flexRowFillWrap.demo";
import {DemoFlexAttributeValues} from "./flexOtherValues.demo";
import {DemoFlexOffsetValues}    from "./flexOffetValues.demo";


@NgModule({
  declarations : [
    DemosLayoutAPI,       // used by the Router with the root app component

    DemoFlexRowFill,
    DemoFlexRowFillWrap,
    DemoLayoutAlignment,
    DemoFlexAttributeValues,
    DemoFlexOffsetValues
  ],
  imports : [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule
  ]

})
export class DemosLayoutAPIModule { }
