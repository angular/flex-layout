import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import 'rxjs/add/operator/filter';

import {MediaChange} from "../../../lib/media-query/media-change";
import { ObservableMedia } from "../../../lib/media-query/observable-media-service";

@Component({
  selector: 'demo-issue-135',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" >
      <md-card-title><a href="https://github.com/angular/flex-layout/issues/135" target="_blank">Issue #135</a></md-card-title>
      <md-card-subtitle>Layout with fxFlex="auto" not restoring max-height values properly:</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div fxLayout="column" class="coloredContainerX box">
            <div fxFlex="auto" fxFlex.gt-sm="70"  > &lt;div fxFlex="auto" fxFlex.gt-sm="70"  &gt; </div>
            <div fxFlex="auto" fxFlex.gt-sm="14.6"> &lt;div fxFlex="auto" fxFlex.gt-sm="14.6"&gt; </div>
            <div fxFlex="auto" fxFlex.gt-sm="15.4"> &lt;div fxFlex="auto" fxFlex.gt-sm="15.4"&gt; </div>
          </div>       
        </div>
      </md-card-content>
      <md-card-footer style="width:95%">
        <div class="hint" >Active mediaQuery: <span style="padding-left: 20px; color: rgba(0, 0, 0, 0.54)">{{  activeMediaQuery }}</span></div>
      </md-card-footer>      
    </md-card>
  `
})
export class DemoIssue135 implements OnInit, OnDestroy {
  public activeMediaQuery = "";
  private _watcher : Subscription;

  constructor(private _media$:ObservableMedia) { }

  ngOnInit() {
    this._watcher = this.watchMQChanges();
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }


  watchMQChanges() {
    return this._media$.subscribe((change:MediaChange) => {
      let value = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
      this.activeMediaQuery = value;
    });
  }
}
