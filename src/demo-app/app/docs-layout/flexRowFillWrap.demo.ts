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
          <div [fl-layout]="direction" fl-layout-wrap class="colored wrapped box" (click)="toggleDirection()">
            
              <div fl-flex="30"> fl-flex="30" </div>
              <div fl-flex="45"> fl-flex="45" </div>
              <div fl-flex="19"> fl-flex="19" </div>
              <div fl-flex="33"> fl-flex="33" </div>
              <div fl-flex="67"> fl-flex="67" </div>
              <div fl-flex="50"> fl-flex="50" </div>
              <div fl-flex>      fl-flex      </div>
              
            </div>            
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;fl-layout = "{{ direction }}"&gt;</div>
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
