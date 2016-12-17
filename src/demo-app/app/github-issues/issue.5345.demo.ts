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
          <div [fx-layout]="direction" class="md-whiteframe-2dp">
            <div fx-flex fx-flex-offset="20" class="one">&lt;div <b>fx-flex-offset="20"</b> fx-flex &gt;</div>
            <div fx-flex="150px" class="two">&lt;div fx-flex="150px"&gt;</div>
          </div>
          <div [fx-layout]="direction" class="md-whiteframe-3dp">
            <div fx-flex fx-flex-offset="50%" class="three">&lt;div <b>fx-flex-offset="50%"</b> fx-flex &gt;</div>
            <div fx-flex class="four">&lt;div fx-flex&gt;</div>
          </div>
          <div [fx-layout]="direction" class="md-whiteframe-3dp">
            <div fx-flex="25%" fx-flex-offset="25" class="five">&lt;div <b>fx-flex-offset="25"</b> fx-flex="25%" &gt;</div>
            <div fx-flex="50" fx-flex-offset="20" class="six">&lt;div <b>fx-flex-offset="20"</b> fx-flex="50" &gt;</div>
          </div>
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;div fx-layout="{{ direction }}" &gt;</div>
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
