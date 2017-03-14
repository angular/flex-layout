import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import 'rxjs/add/operator/filter';

import {MediaChange} from "../../../lib/media-query/media-change";
import {ObservableMedia} from "../../../lib/media-query/observable-media-service";

@Component({
  selector: 'demo-issue-181',
  styleUrls: [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" > 
      <md-card-title><a href="https://github.com/angular/flex-layout/issues/181" target="_blank">Issue #181</a></md-card-title>
      <md-card-subtitle>Wrong layout when fxHide + fxShow usages do not cooperate properly:</md-card-subtitle>
      <md-card-content>                                                                                     
        <div class="containerX">
          <div class="coloredContainerX box fixed"
               [fxLayout]="direction" 
               (click)="pivot()">
              <div fxHide fxShow.gt-xs class="box1"> Type 1, row a, fxHide fxShow.gt-xs </div>
            	<div fxHide fxShow.gt-xs class="box2"> Type 1, row b, fxHide fxShow.gt-xs </div>
            	<div fxHide fxShow.gt-xs class="box3"> Type 1, row c, fxHide fxShow.gt-xs </div>
            	
            	<div fxShow fxHide.md class="box1"> Type 2, row a, fxShow fxHide.md</div>
            	<div fxShow fxHide.md class="box2"> Type 2, row b, fxShow fxHide.md</div>
            	<div fxShow fxHide.md class="box3"> Type 2, row c, fxShow fxHide.md</div>
          </div>       
        </div>
      </md-card-content>
      <md-card-footer style="width:95%;padding-left:20px;margin-top:-5px;">
        <div class="hint" >Active mediaQuery: <span style="padding-left: 20px; color: rgba(0, 0, 0, 0.54)">{{  activeMediaQuery }}</span></div>
      </md-card-footer>      
    </md-card>
  `
})
export class DemoIssue181 implements OnDestroy {
  public direction = "column";
  public activeMediaQuery = "";

  constructor(media$: ObservableMedia) {
    this._watcher = media$.subscribe((change: MediaChange) => {
      let value = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
      this.activeMediaQuery = value;
    });
  }

  pivot() {
    this.direction = (this.direction === "row") ? "column" : "row";
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }

  private _watcher: Subscription;
}
