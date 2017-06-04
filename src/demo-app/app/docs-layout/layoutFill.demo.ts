import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-layout-fill',
  styleUrls: [
    'layoutAlignment.demo.css',
  ],
  template: `
    <md-card class="card-demo">
      <md-card-title><a href="" target="_blank">Layout Fill</a></md-card-title>
      <md-card-subtitle>Using 'fxFill' to fill available width and height of parent container.
      </md-card-subtitle>
      <md-card-content class="large">
        <div fxLayout="column" fxFill>
          <div fxLayout fxFlex>
            <div class="one" fxFlex="20" fxLayoutAlign="center center"> A</div>
            <div class="two" fxFlex="80" fxLayoutAlign="center center"> B</div>
          </div>
        </div>
      </md-card-content>
      <md-card-footer class="bottomPad">
        <div class="hint"></div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoLayoutFill {
  public direction = 'row';
  public mainAxis = 'space-around';
  public crossAxis = 'center';

  layoutAlign() {
    return `${this.mainAxis} ${this.crossAxis}`;
  }
}
