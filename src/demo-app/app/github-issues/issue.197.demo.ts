import {Component, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import 'rxjs/add/operator/filter';

import {MediaChange} from "../../../lib/media-query/media-change";
import {ObservableMedia} from "../../../lib/media-query/observable-media-service";

// [ngStyle="{'font-size.px': 10, color: 'rgb(0,0,0)', 'text-align':'left'}"
//  style="font-size:10px; color:black; text-align:left;"
@Component({
  selector: 'demo-issue-197',
  styleUrls: [
    '../demo-app/material2.css'
  ],
  template: `
                  
    <md-card class="card-demo" > 
      <md-card-title><a href="https://github.com/angular/flex-layout/issues/197" target="_blank">Issue #197</a></md-card-title>
      <md-card-subtitle>Responsive Style directive should merge with default inline style:</md-card-subtitle>
      <md-card-content>                                                                                     
        <div class="containerX">
          <div  class="coloredContainerX box fixed">
            <div  class="box1"
                  fxFlexFill
                  style="font-size:12px; color:black; text-align:left;"
                  [style.sm]="{'font-size': '16px', color: '#a63db8', 'text-align': 'center'}"
                  ngStyle.md="font-size: 24px; color : #0000ff; text-align: right;">
                  &lt;div fxFlexFill <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;style="font-size:10px; color:black; text-align:'left';"<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;[style.sm]="&#123;'font-size':'16px', color:#a63db8, text-align:'center' &#125;"<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;ngStyle.md="font-size:24px; color:#00f;" text-align:'right'&gt;<br/>
                  &lt;/div&gt;
            </div>   
          </div>   
        </div>
      </md-card-content>
      <md-card-footer style="width:95%;padding-left:20px;margin-top:-5px;">
        <div class="hint" >Active mediaQuery: <span style="padding-left: 20px; color: rgba(0, 0, 0, 0.54)">{{  activeMediaQuery }}</span></div>
      </md-card-footer>      
    </md-card>
  `
})
export class DemoIssue197 implements OnDestroy {
  public activeMediaQuery = "";

  constructor(media$: ObservableMedia) {
    this._watcher = media$.subscribe((change: MediaChange) => {
      let value = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
      this.activeMediaQuery = value;
    });
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }

  private _watcher: Subscription;
}
