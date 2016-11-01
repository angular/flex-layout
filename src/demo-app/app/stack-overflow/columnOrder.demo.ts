import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-complex-column-ordering',
  styleUrls : [
    'columnOrder.demo.css',
    '../demo-app/material2.css'
  ],
  template: `
   <md-card class="card-demo" >
    <md-card-title> <a href="http://stackoverflow.com/questions/36988183/flex-box-out-of-borders?rq=1" target="_blank">StackOverflow</a></md-card-title>
    <md-card-subtitle>Complex column ordering to wrap items to align to items above </md-card-subtitle>
    <md-card-content>
      <div class="containerX" (click)="toggleDirection()" [ng-layout]="direction" ng-layout-wrap>
        <div class="one   flexitem "                    > 1 <div class="markup">&lt;div ng-flex-order="1"&gt;</div> </div>
        <div class="two   flexitem "  ng-flex-order="3" > 2 <div class="markup">&lt;div ng-flex-order="3"&gt;</div> </div>
        <div class="three flexitem "  ng-flex-order="5" > 3 <div class="markup">&lt;div ng-flex-order="5"&gt;</div> </div>
        <div class="four  flexitem "                    > 4 <div class="markup">&lt;div ng-flex-order="2"&gt;</div> </div>
        <div class="five  flexitem "  ng-flex-order="4" > 5 <div class="markup">&lt;div ng-flex-order="4"&gt;</div> </div>
      </div>
    </md-card-content>
    <md-card-footer class="bottomPad">
      <div class="hint">&lt;ng-layout = "{{ direction }}"&gt;</div>
    </md-card-footer>
  </md-card>
  `
})
export class DemoComplexColumnOrder {
  direction = "column";

  toggleDirection() {
    let next = (DIRECTIONS.indexOf(this.direction) +1 ) % DIRECTIONS.length;
    this.direction = DIRECTIONS[next];
  }
}
const DIRECTIONS = ['column', 'column-reverse'];
