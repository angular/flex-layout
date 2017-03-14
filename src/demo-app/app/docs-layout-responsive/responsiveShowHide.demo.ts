import { Component } from '@angular/core';

@Component({
  selector: 'demo-responsive-show-hide',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" >
      <md-card-title>Show & Hide Directives</md-card-title>
      <md-card-subtitle>Use the show hide APIs to responsively show or hide elements:</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div fxLayout="row"  class="coloredContainerX box" >
            <div fxFlex fxHide="false" fxHide.gt-sm> Shown on small device size.<br> Hidden on gt-sm devices.             </div>
            <div fxFlex fxHide="false" fxHide.gt-md> Shown on small and medium size devices.<br> Hidden on gt-md devices.</div>
            <div fxFlex fxShow="false" fxShow.gt-sm> Only show on gt-sm devices.                                         </div>
            <div fxFlex fxShow="false" fxShow.md>    Shown on medium size devices only.                                  </div>
            <div fxFlex fxShow="false" fxShow.gt-lg> Shown on devices larger than 1200px wide only.                      </div>
          </div>
        </div>
      </md-card-content>
    </md-card>
  `
})
export class DemoResponsiveShowHide {  }
