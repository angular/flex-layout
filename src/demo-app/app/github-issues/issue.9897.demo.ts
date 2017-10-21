import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-issue-9897',
  styleUrls: [
    'issue.5345.demo.css',
  ],
  template: `
    <mat-card class="card-demo" (click)="toggleDirection()" style="cursor: pointer;">
      <mat-card-title><a href="https://github.com/angular/material/issues/9897" target="_blank">
        Issue #9897
      </a></mat-card-title>
      <mat-card-subtitle>Safari bug with layout-wrap and flex % values</mat-card-subtitle>
      <mat-card-content>
        <div class="containerX">
          <div fxLayout="row" [fxLayoutWrap]="wrapDirection" class="colored wrapped box">

            <div fxFlex="30"> fxFlex="30"</div>
            <div fxFlex="45"> fxFlex="45"</div>
            <div fxFlex="19"> fxFlex="19"</div>
            <div fxFlex="33"> fxFlex="33"</div>
            <div fxFlex="67"> fxFlex="67"</div>
            <div fxFlex="50"> fxFlex="50"</div>
            <div fxFlex> fxFlex</div>

          </div>
        </div>
      </mat-card-content>
      <mat-card-footer>
        <div class="hint">&lt;div fxLayout="row" fxLayoutWrap="{{ wrapDirection }}" &gt;</div>
      </mat-card-footer>
    </mat-card>
  `
})
export class DemoIssue9897 {
  wrapDirection = 'wrap';

  toggleDirection() {
    let next = (DIRECTIONS.indexOf(this.wrapDirection) + 1 ) % DIRECTIONS.length;
    this.wrapDirection = DIRECTIONS[next];
  }
}

const DIRECTIONS = ['wrap', 'wrap-reverse'];
