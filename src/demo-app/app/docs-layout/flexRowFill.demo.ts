import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-flex-row-fill',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" (click)="toggleDirection()">
      <md-card-title>Fill Row with 'Flex'</md-card-title>
      <md-card-subtitle>Simple row using "flex" on 3rd element to fill available main axis.</md-card-subtitle>
      <md-card-content>
        <div class="containerX"> 
          <div [fx-layout]="direction" (click)="toggleDirection()" class="colored box" >
            <div fx-flex="20">  fx-flex="20"  </div>
            <div fx-flex="60">  fx-flex="60"  </div>
            <div fx-flex >      fx-flex       </div>
          </div>
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;div  fx-layout="{{ direction }}" &gt;</div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoFlexRowFill {
  direction = "row";

  toggleDirection() {
    let next = (DIRECTIONS.indexOf(this.direction) +1 ) % DIRECTIONS.length;
    this.direction = DIRECTIONS[next];
  }
}
const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
