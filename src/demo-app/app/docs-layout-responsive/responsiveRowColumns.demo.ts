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
            
            <div class="colorNested box" fl-layout="row" *ngIf="isVisible">
              <div  [fl-layout]="firstCol" 
                    [fl-layout.xs]="firstColXs" 
                    [fl-layout.md]="firstColMd" 
                    [fl-layout.lg]="firstColLg"  
                    [fl-layout.gt-lg]="firstColGtLg" 
                    fl-flex="50%" 
                    fl-flex.gt-sm="25"
                    fl-show="true"
                    fl-show.md="false" 
                    (click)="toggleLayoutFor(1)" >
                <div fl-flex>Col #1: First item in row</div>
                <div fl-flex>Col #1: Second item in row</div>
              </div>
              <div [fl-layout]="secondCol" fl-flex (click)="toggleLayoutFor(2)">
                <div fl-flex>Col #2: First item in column</div>
                <div fl-flex>Col #2: Second item in column</div>
              </div>
            </div>
        </div>
      </md-card-content>
      <!--<md-card-actions fl-layout="row" fl-layout-align="center">-->
        <!--<button md-raised-button (click)="isVisible = !isVisible">{{ isVisible ? 'Remove' : 'Show' }}</button>-->
      <!--</md-card-actions>-->
      <md-card-footer style="width:95%">
         <div fl-layout="row" class="hint" fl-layout-align="space-around" > 
            <div>&lt; fl-layout="{{ firstCol }}" fl-flex="50%" fl-flex.gt-sm="25%" fl-show.md="false" &gt;</div>
            <div fl-flex></div>
            <div>&lt;div fl-layout="{{ secondCol }}" fl-flex&gt;</div>
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
