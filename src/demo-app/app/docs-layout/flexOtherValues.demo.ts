import {Component} from '@angular/core';

@Component({
  selector: 'demo-flex-attribute-values',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo">
      <md-card-title>Flex Attribute Values </md-card-title>
      <md-card-subtitle>Explore impact of non-numerical values for the 'fxFlex' API:</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div fxLayout="row wrap" class="colored box nopad" >
            <div fxFlex="none">     [flex="none"]       </div>
            <div fxFlex>            [flex]              </div>
            <div fxFlex="nogrow">   [flex="nogrow"]     </div>
            <div fxFlex="grow">     [flex="grow"]       </div>
            <div fxFlex="initial">  [flex="initial"]    </div>
            <div fxFlex="auto">     [flex="auto"]       </div>
            <div fxFlex="noshrink"> [flex="noshrink"]   </div>
            <div fxFlex="0">        [flex="0"]          </div>
          </div>          
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;div fxLayout="row" fxLayoutWrap &gt;</div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoFlexAttributeValues {  }
