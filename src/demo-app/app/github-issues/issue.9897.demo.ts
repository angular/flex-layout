import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-issue-9897',
  styleUrls: [
    'issue.5345.demo.css',
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" (click)="toggleDirection()" style="cursor: pointer;">
      <md-card-title><a href="https://github.com/angular/material/issues/9897" target="_blank">Issue #9897</a></md-card-title>
      <md-card-subtitle>Safari bug with layout-wrap and flex % values</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div [fx-layout]="row" [fx-layout-wrap]="wrapDirection" class="colored wrapped box" >
            
              <div fx-flex="30"> fx-flex="30" </div>
              <div fx-flex="45"> fx-flex="45" </div>
              <div fx-flex="19"> fx-flex="19" </div>
              <div fx-flex="33"> fx-flex="33" </div>
              <div fx-flex="67"> fx-flex="67" </div>
              <div fx-flex="50"> fx-flex="50" </div>
              <div fx-flex>      fx-flex      </div>
              
            </div>            
        </div>        
      </md-card-content>
      <md-card-footer>
        <div class="hint">&lt;div fx-layout="row" fx-layout-wrap="{{ wrapDirection }}" &gt;</div>
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
