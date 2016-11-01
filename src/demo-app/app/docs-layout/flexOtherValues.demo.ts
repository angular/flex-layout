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
          <div ng-layout="row" ng-layout-wrap class="colored box nopad" >
            <div ng-flex="none">     [flex="none"]       </div>
            <div ng-flex>            [flex]              </div>
            <div ng-flex="nogrow">   [flex="nogrow"]     </div>
            <div ng-flex="grow">     [flex="grow"]       </div>
            <div ng-flex="initial">  [flex="initial"]    </div>
            <div ng-flex="auto">     [flex="auto"]       </div>
            <div ng-flex="noshrink"> [flex="noshrink"]   </div>
            <div ng-flex="0">        [flex="0"]          </div>
          </div>          
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt; ng-layout = "row" ng-layout-wrap &gt;</div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoFlexAttributeValues {  }
