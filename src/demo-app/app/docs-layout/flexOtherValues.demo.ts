import {Component} from '@angular/core';

@Component({
  selector: 'demo-flex-attribute-values',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo">
      <md-card-title>Flex Attribute Values </md-card-title>
      <md-card-subtitle>Explore impact of non-numerical values for the 'flex' API:</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div fl-layout="row" fl-layout-wrap class="colored box nopad" >
            <div fl-flex="none">     [flex="none"]       </div>
            <div fl-flex>            [flex]              </div>
            <div fl-flex="nogrow">   [flex="nogrow"]     </div>
            <div fl-flex="grow">     [flex="grow"]       </div>
            <div fl-flex="initial">  [flex="initial"]    </div>
            <div fl-flex="auto">     [flex="auto"]       </div>
            <div fl-flex="noshrink"> [flex="noshrink"]   </div>
            <div fl-flex="0">        [flex="0"]          </div>
          </div>          
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt; fl-layout = "row" fl-layout-wrap &gt;</div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoFlexAttributeValues {  }
