import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {MediaQueryChange} from "../../../lib/media-query/media-queries";
import {Subscription} from "rxjs";

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
        <div class="hint" >Active mediaQuery: <span style="paddifl-left: 20px; color: rgba(0, 0, 0, 0.54)">{{  activeMediaQuery }}</span></div>
      </md-card-footer>      
    </md-card>
  `
})
export class DemoResponsiveFlexDirectives implements OnInit, OnDestroy {
  private _watcher : Subscription;
  public activeMediaQuery = "";

  constructor(@Inject('mediaQuery$') private _mediaQuery$) { }

  ngOnInit() {
    this._watcher = this.watchMQChanges();
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }

  watchMQChanges() {
    return this._mediaQuery$.subscribe((e:MediaQueryChange) => {
      let value = e ? `'${e.mqAlias}' = ${e.mediaQuery} )` : "";
      this.activeMediaQuery = value;
    });
  }
}
