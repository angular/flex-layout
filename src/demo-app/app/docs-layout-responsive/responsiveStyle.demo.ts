import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/filter';

import { MediaChange } from "../../../lib/media-query/media-change";
import { ObservableMedia } from "../../../lib/media-query/observable-media-service";

@Component({
  selector: 'demo-responsive-style',
  styleUrls: [
    '../demo-app/material2.css'
  ],
  template: `

    <md-card class="card-demo" >
      <md-card-title>Responsive Style</md-card-title>
      <md-card-subtitle>
        Use the fxClass and fxStyle APIs to responsively apply styles to elements:
      </md-card-subtitle>

      <md-card-content>
        <div class="containerX">
          <div fxLayout="row" fxFlex class="coloredContainerX box">
            <div
              fxFlex
              class="fxClass-all"
              class.xs="fxClass-xs"
              [class.sm]="{'fxClass-sm': hasStyle}"
              [class.md]="{'fxClass-md': hasStyle, 'fxClass-md2': hasStyle}"
              [class.lg]="['fxClass-lg', 'fxClass-lg2']">
              {{ activeMediaQueryAlias }}
              <md-checkbox
                [(ngModel)]="hasStyle"
                fxShow="false"
                [fxShow.sm]="true"
                [fxShow.md]="true">
                Activate styles
              </md-checkbox>
            </div>
          </div>
        </div>
      </md-card-content>
      <md-card-content>
        <pre>
        &lt;div
          fxFlex
          class="fxClass-all"
          class.xs="fxClass-xs"
          [class.sm]="&#123;'fxClass-sm': hasStyle&#125;"
          [class.md]="&#123;'fxClass-md': hasStyle, 'fxClass-md2': hasStyle&#125;"
          [class.lg]="['fxClass-lg', 'fxClass-lg2']"&gt;
        &lt;/div&gt;
        </pre>
      </md-card-content>

      <md-card-content>
        <div class="containerX">
          <div fxLayout="row" fxFlex class="coloredContainerX box">
            <div
              fxFlex
              style="font-style: italic"
              [style.xs]="{'font-size.px': 10, color: 'blue'}"
              [style.sm]="{'font-size.px': 20, color: 'lightblue'}"
              [style.md]="{'font-size.px': 30, color: 'orange'}"
              [style.lg]="styleLgExp">
              {{ activeMediaQueryAlias }}
            </div>
          </div>
        </div>
      </md-card-content>
      <md-card-content>
        <pre>
        &lt;div
          style="font-style: italic"
          [style.xs]="&#123;'font-size.px': 10, color: 'blue'&#125;"
          [style.sm]="&#123;'font-size.px': 20, color: 'lightblue'&#125;"
          [style.md]="&#123;'font-size.px': 30, color: 'orange'&#125;"
          [style.lg]="styleLgExp"&gt;
        &lt;/div&gt;
        </pre>
      </md-card-content>


      <md-card-footer style="width:95%">
        <div class="hint" >Active mediaQuery: <span style="padding-left: 20px; color: rgba(0, 0, 0, 0.54)">{{  activeMediaQuery }}</span></div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoResponsiveStyle implements OnDestroy {
  private _watcher: Subscription;
  public activeMediaQuery = "";
  public activeMediaQueryAlias = "";
  public hasStyle: boolean = false;
  public styleLgExp = {
    'font-size': '40px',
    color: 'lightgreen'
  };

  constructor( private _media$:ObservableMedia ) {
    this._watcher = this._media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = ${change.mediaQuery} )` : "";
      this.activeMediaQueryAlias = change.mqAlias;
    });
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }
}
