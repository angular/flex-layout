import {Component, Inject, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import 'rxjs/add/operator/filter';

import {MediaChange} from "../../../lib/media-query/media-change";
import { ObservableMedia } from "../../../lib/media-query/observable-media";

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
            
            <div class="colorNested box" fxLayout="row" *ngIf="isVisible">
              <div  [fxLayout]="firstCol" 
                    [fxLayout.xs]="firstColXs" 
                    [fxLayout.md]="firstColMd" 
                    [fxLayout.lg]="firstColLg"  
                    [fxLayout.gt-lg]="firstColGtLg" 
                    fxFlex="50%" 
                    fxFlex.gt-sm="25"
                    fxHide.md 
                    (click)="toggleLayoutFor(1)" style="cursor: pointer;">
                <div fxFlex>Col #1: First item in row</div>
                <div fxFlex>Col #1: Second item in row</div>
              </div>
              <div [fxLayout]="secondCol" fxFlex (click)="toggleLayoutFor(2)" style="cursor: pointer;">
                <div fxFlex>Col #2: First item in column</div>
                <div fxFlex>Col #2: Second item in column</div>
              </div>
            </div>
        </div>
      </md-card-content>
      <!--<md-card-actions fxLayout="row" fxLayoutAlign="center">-->
        <!--<button md-raised-button (click)="isVisible = !isVisible">{{ isVisible ? 'Remove' : 'Show' }}</button>-->
      <!--</md-card-actions>-->
      <md-card-footer style="width:95%">
         <div fxLayout="row" class="hint" fxLayoutAlign="space-around" > 
            <div>&lt;div fxLayout="{{ firstCol }}" fxFlex="50%" fxFlex.gt-sm="25%" fxHide.md &gt;</div>
            <div fxFlex></div>
            <div>&lt;div  fxLayout="{{ secondCol }}" fxFlex &gt;</div>
         </div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoResponsiveRows implements OnDestroy {
  private _activeMQC : MediaChange;
  private _watcher : Subscription;

  firstCol = "row";
  firstColXs = 'column';
  firstColMd = 'column';
  firstColLg = 'invalid';
  firstColGtLg = "column";

  secondCol = "column";

  isVisible = true;

  constructor(private _media$ : ObservableMedia ) {
    this._watcher = this._media$
        .subscribe((e:MediaChange) => {
          this._activeMQC = e;
        });
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }

  toggleLayoutFor(col) {
    switch( col ) {
      case 1:

        col = `firstCol${this._activeMQC ? this._activeMQC.suffix : ""}`;
        this[col] = (this[col] === "column") ? "row" : "column";
        break;

      case 2:
        col = "secondCol";
        this[col] = (this[col] == "row") ? "column" : "row";
        break;
    }
  }
}
