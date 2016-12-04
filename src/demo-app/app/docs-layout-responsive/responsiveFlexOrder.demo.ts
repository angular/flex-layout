import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import 'rxjs/add/operator/filter';

import {MediaChange} from "../../../lib/media-query/media-change";
import {Media$} from "../../../lib/media-query/providers/match-media-provider";

@Component({
  selector: 'demo-responsive-flex-order',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" >
      <md-card-title>Responsive Flex Ordering</md-card-title>
      <md-card-subtitle>Add the flex-order directive to a layout child to set its order position within the layout container:</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div fx-layout="row"  class="coloredContainerX box" >
            <div fx-flex fx-flex-order="-1">
              <p>[flex-order="-1"]</p>
            </div>
            <div fx-flex fx-flex-order="1" fx-flex-order.gt-md="3">
              <p fx-hide="false" fx-hide.gt-md>   [flex-order="1"]        </p>
              <p fx-show="false" fx-show.gt-md>   [flex-order.gt-md="3"]  </p>
            </div>
            <div fx-flex fx-flex-order="2">
              <p>[flex-order="2"]</p>
            </div>
            <div fx-flex fx-flex-order="3" fx-flex-order.gt-md="1">
              <p fx-hide="false" fx-hide.gt-md>   [flex-order="3"]        </p>
              <p fx-show="false" fx-show.gt-md>   [flex-order.gt-md="1"]  </p>
            </div>
          </div>          
        </div>
      </md-card-content>
      <md-card-footer style="width:95%">
        <div class="hint" >Active mediaQuery: <span style="paddifl-left: 20px; color: rgba(0, 0, 0, 0.54)">{{  activeMediaQuery }}</span></div>
      </md-card-footer>      
    </md-card>
  `
})
export class DemoResponsiveFlexOrder implements OnInit, OnDestroy {
  public activeMediaQuery = "";
  private _watcher : Subscription;

  constructor(@Inject(Media$)  private _media$) { }

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
