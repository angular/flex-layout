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
            <div fxFlex="none">     [fxFlex="none"]       </div>
            <div fxFlex>            [fxFlex]              </div>
            <div fxFlex="nogrow">   [fxFlex="nogrow"]     </div>
            <div fxFlex="grow">     [fxFlex="grow"]       </div>
            <div fxFlex="initial">  [fxFlex="initial"]    </div>
            <div fxFlex="auto">     [fxFlex="auto"]       </div>
            <div fxFlex="noshrink"> [fxFlex="noshrink"]   </div>
            <div fxFlex="0">        [fxFlex="0"]          </div>
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
