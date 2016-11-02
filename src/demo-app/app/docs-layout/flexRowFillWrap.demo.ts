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
          <div [fx-layout]="direction" fx-layout-wrap class="colored wrapped box" (click)="toggleDirection()">
            
              <div fx-flex="30"> fx-flex="30" </div>
              <div fx-flex="45"> fx-flex="45" </div>
              <div fx-flex="19"> fx-flex="19" </div>
              <div fx-flex="33"> fx-flex="33" </div>
              <div fx-flex="67"> fx-flex="67" </div>
              <div fx-flex="50"> fx-flex="50" </div>
              <div fx-flex>      fx-flex      </div>
              
            </div>            
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;div fx-layout="{{ direction }}" &gt;</div>
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
