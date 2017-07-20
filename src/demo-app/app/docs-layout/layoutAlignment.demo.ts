import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-layout-alignment',
  styleUrls: ['layoutAlignment.demo.css'],
  templateUrl: 'layoutAlignment.demo.html'
})
export class DemoLayoutAlignment {
  public direction = 'row';
  public mainAxis = 'space-around';
  public crossAxis = 'center';

  layoutAlign() {
    return `${this.mainAxis} ${this.crossAxis}`;
  }
}
