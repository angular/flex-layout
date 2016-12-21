import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-issue-5345',
  styleUrls: [
    'issue.5345.demo.css',
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" (click)="toggleDirection()" style="cursor: pointer;">
      <md-card-title><a href="https://github.com/angular/material/issues/5345" target="_blank">Issue #5345</a></md-card-title>
      <md-card-subtitle>Visualize the affects of 'flex' and 'flex-offset' with %, px, or raw values.</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div [fxLayout]="direction" class="md-whiteframe-2dp">
            <div fxFlex fxFlexOffset="20" class="one">&lt;div <b>fxFlexOffset="20"</b> fxFlex &gt;</div>
            <div fxFlex="150px" class="two">&lt;div fxFlex="150px"&gt;</div>
          </div>
          <div [fxLayout]="direction" class="md-whiteframe-3dp">
            <div fxFlex fxFlexOffset="50%" class="three">&lt;div <b>fxFlexOffset="50%"</b> fxFlex &gt;</div>
            <div fxFlex class="four">&lt;div fxFlex&gt;</div>
          </div>
          <div [fxLayout]="direction" class="md-whiteframe-3dp">
            <div fxFlex="25%" fxFlexOffset="25" class="five">&lt;div <b>fxFlexOffset="25"</b> fxFlex="25%" &gt;</div>
            <div fxFlex="50" fxFlexOffset="20" class="six">&lt;div <b>fxFlexOffset="20"</b> fxFlex="50" &gt;</div>
          </div>
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;div fxLayout="{{ direction }}" &gt;</div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoIssue5345  {
  direction = "row";

    toggleDirection() {
      let next = (DIRECTIONS.indexOf(this.direction) +1 ) % DIRECTIONS.length;
      this.direction = DIRECTIONS[next];
    }
  }
  const DIRECTIONS = ['row', 'row-reverse'];
