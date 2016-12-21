import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-flex-row-fill',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" (click)="toggleDirection()">
      <md-card-title>'Flex' to Fill Row </md-card-title>
      <md-card-subtitle>Simple row using "flex" on 3rd element to fill available main axis.</md-card-subtitle>
      <md-card-content>
        <div class="containerX"> 
          <div [fxLayout]="direction" (click)="toggleDirection()" class="colored box" style="cursor: pointer;">
            <div [fxFlex]="someValue">  fxFlex="20"  </div>
            <div fxFlex="60">  fxFlex="60"  </div>
            <div fxFlex >      fxFlex       </div>
          </div>
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;div  fxLayout="{{ direction }}" &gt;</div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoFlexRowFill {
  direction = "row";
  someValue = 20;

  toggleDirection() {
    let next = (DIRECTIONS.indexOf(this.direction) +1 ) % DIRECTIONS.length;
    this.direction = DIRECTIONS[next];
  }
}
const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
