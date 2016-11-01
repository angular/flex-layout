import {Component, OnInit} from '@angular/core';
import {MediaQueries, MediaQueryChange} from "../../../lib/media-query/media-queries";
import {BreakPoint} from "../../../lib/media-query/break-points";

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
          <div fl-layout="row"  class="coloredContainerX box" >
            <div fl-flex.gt-sm="67" fl-flex="33"> flex 33% on mobile, <br>and 66% on gt-sm devices.  </div>
            <div fl-flex.gt-sm="33" fl-flex="67"> flex 67%  on mobile, <br>and 33% on gt-sm devices. </div>
          </div>
        </div>
      </md-card-content>
      <md-card-footer style="width:95%">
        <div class="hint" >Active mediaQuery: <span style="paddifl-left: 20px; color: rgba(0, 0, 0, 0.54)">{{  activeMediaQuery }}</span></div>
      </md-card-footer>      
    </md-card>
  `
})
export class DemoResponsiveFlexDirectives implements OnInit {
  public activeMediaQuery = "";

  constructor(private _$mdMedia : MediaQueries) {  }

  ngOnInit() {
    this.watchMQChanges();
  }


  watchMQChanges() {
    this._$mdMedia.observe().subscribe((e:MediaQueryChange) => {
      let current : BreakPoint = this._$mdMedia.active;
      let value = current ? `'${current.alias}' = ${current.mediaQuery} )` : "";

      // console.log(`watchMQChanges( ${value}`);
      this.activeMediaQuery = value;
    });
  }
}
