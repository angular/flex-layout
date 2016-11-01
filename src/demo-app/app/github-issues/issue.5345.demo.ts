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
          <div [ng-layout]="direction" class="md-whiteframe-2dp">
            <div ng-flex ng-flex-offset="20" class="one">&lt;div <b>ng-flex-offset="20"</b> ng-flex &gt;</div>
            <div ng-flex="150px" class="two">&lt;div ng-flex="150px"&gt;</div>
          </div>
          <div [ng-layout]="direction" class="md-whiteframe-3dp">
            <div ng-flex ng-flex-offset="50%" class="three">&lt;div <b>ng-flex-offset="50%"</b> ng-flex &gt;</div>
            <div ng-flex class="four">&lt;div ng-flex&gt;</div>
          </div>
          <div [ng-layout]="direction" class="md-whiteframe-3dp">
            <div ng-flex="25%" ng-flex-offset="25" class="five">&lt;div <b>ng-flex-offset="25"</b> ng-flex="25%" &gt;</div>
            <div ng-flex="50" ng-flex-offset="20" class="six">&lt;div <b>ng-flex-offset="20"</b> ng-flex="50" &gt;</div>
          </div>
        </div>
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;ng-layout = "{{ direction }}"&gt;</div>
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
