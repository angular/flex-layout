import {Component} from '@angular/core';

@Component({
  selector: 'demos-docs-layout',
  template: `
    <demo-layout-alignment class="small-demo"></demo-layout-alignment>
    <demo-layout-fill class="small-demo"></demo-layout-fill>
    <demo-flex-row-fill class="small-demo"></demo-flex-row-fill>
    <demo-flex-row-fill-wrap class="small-demo"></demo-flex-row-fill-wrap>
    <demo-flex-attribute-values class="small-demo"></demo-flex-attribute-values>
    <demo-flex-offset-values class="small-demo"></demo-flex-offset-values>
    <demo-flex-align-self class="small-demo"></demo-flex-align-self>
  `
})
export class DemosLayoutAPI {
}

import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/_module';

import {DemoLayoutAlignment} from './layoutAlignment.demo';
import {DemoLayoutFill} from './layoutFill.demo';
import {DemoFlexRowFill} from './flexRowFill.demo';
import {DemoFlexRowFillWrap} from './flexRowFillWrap.demo';
import {DemoFlexAttributeValues} from './flexOtherValues.demo';
import {DemoFlexOffsetValues} from './flexOffetValues.demo';
import {DemoFlexAlignSelf} from './FlexAlignSelf.demo';

@NgModule({
  declarations: [
    DemosLayoutAPI,       // used by the Router with the root app component

    DemoLayoutAlignment,
    DemoLayoutFill,
    DemoFlexRowFill,
    DemoFlexRowFillWrap,
    DemoFlexAttributeValues,
    DemoFlexOffsetValues,
    DemoFlexAlignSelf
  ],
  imports: [
    SharedModule,
    FormsModule
  ]
})
export class DemosLayoutAPIModule {
}
