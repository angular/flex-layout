import { Component } from '@angular/core';

import { MediaQueries } from '../../../lib/media-query/';

@Component({
  selector: 'demo-responsive-row-column',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" >
      <md-card-title>Multiple Responsive Columns</md-card-title>
      <md-card-subtitle>Simple row with nested layout containers. Note: the 1st column is responsive.</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
            
            <div class="colorNested box" ng-layout="row" *ngIf="isVisible">
              <div  [ng-layout]="firstCol" 
                    [ng-layout.xs]="firstColXs" 
                    [ng-layout.md]="firstColMd" 
                    [ng-layout.lg]="firstColLg"  
                    [ng-layout.gt-lg]="firstColGtLg" 
                    ng-flex="50%" 
                    ng-flex.gt-sm="25"
                    ng-show="true"
                    ng-show.md="false" 
                    (click)="toggleLayoutFor(1)" >
                <div ng-flex>Col #1: First item in row</div>
                <div ng-flex>Col #1: Second item in row</div>
              </div>
              <div [ng-layout]="secondCol" ng-flex (click)="toggleLayoutFor(2)">
                <div ng-flex>Col #2: First item in column</div>
                <div ng-flex>Col #2: Second item in column</div>
              </div>
            </div>
        </div>
      </md-card-content>
      <!--<md-card-actions ng-layout="row" ng-layout-align="center">-->
        <!--<button md-raised-button (click)="isVisible = !isVisible">{{ isVisible ? 'Remove' : 'Show' }}</button>-->
      <!--</md-card-actions>-->
      <md-card-footer style="width:95%">
         <div ng-layout="row" class="hint" ng-layout-align="space-around" > 
            <div>&lt; ng-layout="{{ firstCol }}" ng-flex="50%" ng-flex.gt-sm="25%" ng-show.md="false" &gt;</div>
            <div ng-flex></div>
            <div>&lt;div ng-layout="{{ secondCol }}" ng-flex&gt;</div>
         </div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoResponsiveRows {
  firstCol = "row";
  firstColXs = 'column';
  firstColMd = 'column';
  firstColLg = 'invalid';
  firstColGtLg = "column";

  secondCol = "column";

  isVisible = true;

  constructor( public $mdMedia : MediaQueries ) {
  }

  toggleLayoutFor(col) {
    switch( col ) {
      case 1:
        let bp = this.$mdMedia.active;
        
        col = `firstCol${bp ? bp.suffix : ""}`;
        this[col] = (this[col] === "column") ? "row" : "column";
        break;

      case 2:
        col = "secondCol";
        this[col] = (this[col] == "row") ? "column" : "row";
        break;
    }
  }
}
