import {Component} from '@angular/core';


@Component({
  selector: 'demo-layout-fill',
  styleUrls : [
      'layoutAlignment.demo.css',
      '../demo-app/material2.css'
    ],
  template: `
  <md-card class="card-demo" >
    <md-card-title> <a href="" target="_blank">Layout Fill</a></md-card-title>
    <md-card-subtitle>Using 'fx-fill' to fill available width and height of parent container.</md-card-subtitle>
    <md-card-content class="large">
      <div fx-layout="column" fx-fill>
          <div fx-layout fx-flex >
              <div class="one" fx-flex="20" fx-layout-align="center center"> A </div>
              <div class="two" fx-flex="80" fx-layout-align="center center"> B </div>
          </div>
      </div>      
    </md-card-content>
    <md-card-footer class="bottomPad">
      <div class="hint" ></div>
    </md-card-footer>
  </md-card>
  `
})
export class DemoLayoutFill {
  public direction = "row";
  public mainAxis = "space-around";
  public crossAxis = "center";

  layoutAlign () {
      return `${this.mainAxis} ${this.crossAxis}`;
  }
}
