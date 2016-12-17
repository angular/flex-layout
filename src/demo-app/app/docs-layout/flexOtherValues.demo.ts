import {Component} from '@angular/core';

@Component({
  selector: 'demo-flex-attribute-values',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo">
      <md-card-title>Flex Attribute Values </md-card-title>
      <md-card-subtitle>Explore impact of non-numerical values for the 'fx-flex' API:</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div fx-layout="row" fx-layout-wrap class="colored box nopad" >
            <div fx-flex="none">     [flex="none"]       </div>
            <div fx-flex>            [flex]              </div>
            <div fx-flex="nogrow">   [flex="nogrow"]     </div>
            <div fx-flex="grow">     [flex="grow"]       </div>
            <div fx-flex="initial">  [flex="initial"]    </div>
            <div fx-flex="auto">     [flex="auto"]       </div>
            <div fx-flex="noshrink"> [flex="noshrink"]   </div>
            <div fx-flex="0">        [flex="0"]          </div>
          </div>          
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;div fx-layout="row" fx-layout-wrap &gt;</div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoFlexAttributeValues {  }
