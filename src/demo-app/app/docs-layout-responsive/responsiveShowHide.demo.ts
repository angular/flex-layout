import { Component } from '@angular/core';

@Component({
  selector: 'demo-responsive-show-hide',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" >
      <md-card-title>Show & Hide Directives</md-card-title>
      <md-card-subtitle>Use the show hide APIs to responsively show or hide elements:</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div ng-layout="row"  class="coloredContainerX box" >
            <div ng-flex ng-hide="false" ng-hide.gt-sm> Shown on small device size.<br> Hidden on gt-sm devices.             </div>
            <div ng-flex ng-hide="false" ng-hide.gt-md> Shown on small and medium size devices.<br> Hidden on gt-md devices.</div>
            <div ng-flex ng-show="false" ng-show.gt-sm> Only show on gt-sm devices.                                         </div>
            <div ng-flex ng-show="false" ng-show.md>    Shown on medium size devices only.                                  </div>
            <div ng-flex ng-show="false" ng-show.gt-lg> Shown on devices larger than 1200px wide only.                      </div>
          </div>
        </div>
      </md-card-content>
    </md-card>
  `
})
export class DemoResponsiveShowHide {  }
