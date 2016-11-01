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
          <div [fl-layout]="row" [fl-layout-wrap]="wrapDirection" class="colored wrapped box" >
            
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
        <div class="hint">&lt;div fl-layout="row" fl-layout-wrap="{{ wrapDirection }}" &gt;</div>
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
