import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-flex-row-fill-wrap',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" (click)="toggleDirection()">
      <md-card-title>'Flex' with Layout-Wrap</md-card-title>
      <md-card-subtitle>Using "layout-wrap" to wrap positioned items within a layout container</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div [fxLayout]="direction" fxLayoutWrap class="colored wrapped box" (click)="toggleDirection()" style="cursor: pointer;">
            
              <div fxFlex="30"> fxFlex="30" </div>
              <div fxFlex="45"> fxFlex="45" </div>
              <div fxFlex="19"> fxFlex="19" </div>
              <div fxFlex="33"> fxFlex="33" </div>
              <div fxFlex="67"> fxFlex="67" </div>
              <div fxFlex="50"> fxFlex="50" </div>
              <div fxFlex>      fxFlex      </div>
              
            </div>            
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;div fxLayout="{{ direction }}" &gt;</div>
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
