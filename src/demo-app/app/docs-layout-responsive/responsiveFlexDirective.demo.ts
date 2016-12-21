import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import 'rxjs/add/operator/filter';

import {MediaChange} from "../../../lib/media-query/media-change";
import {MatchMediaObservable} from "../../../lib/media-query/match-media";

@Component({
  selector: 'demo-responsive-flex-directive',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" >
      <md-card-title>Responsive Flex Directives</md-card-title>
      <md-card-subtitle>Use the show hide APIs to responsively show or hide elements:</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div fx-layout="row"  class="coloredContainerX box" >
            <div fx-flex.gt-sm="67" fx-flex="33"> flex 33% on mobile, <br>and 66% on gt-sm devices.  </div>
            <div fx-flex.gt-sm="33" fx-flex="67"> flex 67%  on mobile, <br>and 33% on gt-sm devices. </div>
          </div>
        </div>
      </md-card-content>
      <md-card-footer style="width:95%">
        <div class="hint" >Active mediaQuery: <span style="padding-left: 20px; color: rgba(0, 0, 0, 0.54)">{{  activeMediaQuery }}</span></div>
      </md-card-footer>      
    </md-card>
  `
})
export class DemoResponsiveFlexDirectives implements OnInit, OnDestroy {
  private _watcher : Subscription;
  public activeMediaQuery = "";

  constructor(@Inject(MatchMediaObservable)  private _media$) { }

  ngOnInit() {
    this._watcher = this.watchMQChanges();
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }

  watchMQChanges() {
    return this._media$.subscribe((change:MediaChange) => {
      let value = change ? `'${change.mqAlias}' = ${change.mediaQuery} )` : "";
      this.activeMediaQuery = value;
    });
  }
}
