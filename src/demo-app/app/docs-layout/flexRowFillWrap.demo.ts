import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-flex-row-fill-wrap',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" (click)="toggleDirection()">
      <md-card-title>Fill Row with 'Flex' with Wrap</md-card-title>
      <md-card-subtitle>Using "layout-wrap" to wrap positioned items within a layout container</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div [ng-layout]="direction" ng-layout-wrap class="colored wrapped box" (click)="toggleDirection()">
            
              <div ng-flex="30"> ng-flex="30" </div>
              <div ng-flex="45"> ng-flex="45" </div>
              <div ng-flex="19"> ng-flex="19" </div>
              <div ng-flex="33"> ng-flex="33" </div>
              <div ng-flex="67"> ng-flex="67" </div>
              <div ng-flex="50"> ng-flex="50" </div>
              <div ng-flex>      ng-flex      </div>
              
            </div>            
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;ng-layout = "{{ direction }}"&gt;</div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoFlexRowFillWrap {
  direction = "row";

    toggleDirection() {
      let next = (DIRECTIONS.indexOf(this.direction) +1 ) % DIRECTIONS.length;
      this.direction = DIRECTIONS[next];
    }
}
const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
