import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-issue-9897',
  styleUrls: [
    'issue.5345.demo.css',
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" (click)="toggleDirection()">
      <md-card-title><a href="https://github.com/angular/material/issues/9897" target="_blank">Issue #9897</a></md-card-title>
      <md-card-subtitle>Safari bug with layout-wrap and flex % values</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div [ng-layout]="row" [ng-layout-wrap]="wrapDirection" class="colored wrapped box" >
            
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
        <div class="hint">&lt;div ng-layout="row" ng-layout-wrap="{{ wrapDirection }}" &gt;</div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoIssue9897  {
  wrapDirection = "wrap";

  toggleDirection() {
    let next = (DIRECTIONS.indexOf(this.wrapDirection) +1 ) % DIRECTIONS.length;
    this.wrapDirection = DIRECTIONS[next];
  }
}

const DIRECTIONS = ['wrap', 'wrap-reverse'];
