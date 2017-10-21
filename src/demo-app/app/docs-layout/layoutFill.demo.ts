import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-layout-fill',
  styleUrls: [
    'layoutAlignment.demo.css',
  ],
  template: `
    <mat-card class="card-demo">
      <mat-card-title><a href="" target="_blank">Layout Fill</a></mat-card-title>
      <mat-card-subtitle>Using 'fxFill' to fill available width and height of parent container.
      </mat-card-subtitle>
      <mat-card-content class="large">
        <div fxLayout="column" fxFill>
          <div fxLayout fxFlex>
            <div class="one" fxFlex="20" fxLayoutAlign="center center"> A</div>
            <div class="two" fxFlex="80" fxLayoutAlign="center center"> B</div>
          </div>
        </div>
      </mat-card-content>
      <mat-card-footer class="bottomPad">
        <div class="hint"></div>
      </mat-card-footer>
    </mat-card>
  `
})
export class DemoLayoutFill {
  direction = 'row';
  mainAxis = 'space-around';
  crossAxis = 'center';

  layoutAlign() {
    return `${this.mainAxis} ${this.crossAxis}`;
  }
}
