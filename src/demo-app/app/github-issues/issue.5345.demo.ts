import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-issue-5345',
  styleUrls: [
    'issue.5345.demo.css',
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" (click)="toggleDirection()">
      <md-card-title><a href="https://github.com/angular/material/issues/5345" target="_blank">Issue #5345</a></md-card-title>
      <md-card-subtitle>Visualize the affects of 'flex' and 'flex-offset' with %, px, or raw values.</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div [fl-layout]="direction" class="md-whiteframe-2dp">
            <div fl-flex fl-flex-offset="20" class="one">&lt;div <b>fl-flex-offset="20"</b> fl-flex &gt;</div>
            <div fl-flex="150px" class="two">&lt;div fl-flex="150px"&gt;</div>
          </div>
          <div [fl-layout]="direction" class="md-whiteframe-3dp">
            <div fl-flex fl-flex-offset="50%" class="three">&lt;div <b>fl-flex-offset="50%"</b> fl-flex &gt;</div>
            <div fl-flex class="four">&lt;div fl-flex&gt;</div>
          </div>
          <div [fl-layout]="direction" class="md-whiteframe-3dp">
            <div fl-flex="25%" fl-flex-offset="25" class="five">&lt;div <b>fl-flex-offset="25"</b> fl-flex="25%" &gt;</div>
            <div fl-flex="50" fl-flex-offset="20" class="six">&lt;div <b>fl-flex-offset="20"</b> fl-flex="50" &gt;</div>
          </div>
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;fl-layout = "{{ direction }}"&gt;</div>
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
