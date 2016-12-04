import {Component} from '@angular/core';


@Component({
  selector: 'demo-layout-alignment',
  styleUrls : [
      'layoutAlignment.demo.css',
      '../demo-app/material2.css'
    ],
  templateUrl: 'layoutAlignment.demo.html'
})
export class DemoLayoutAlignment {
  public direction = "row";
  public mainAxis = "space-around";
  public crossAxis = "center";

  layoutAlign () {
      return `${this.mainAxis} ${this.crossAxis}`;
  }
}
