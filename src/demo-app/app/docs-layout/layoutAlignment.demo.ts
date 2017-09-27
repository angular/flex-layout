import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-layout-alignment',
  styleUrls: ['layoutAlignment.demo.css'],
  templateUrl: 'layoutAlignment.demo.html'
})
export class DemoLayoutAlignment {
  options = {
    direction :  'row',
    mainAxis  : 'space-around',
    crossAxis :  'center'
  };

  layoutAlign() {
    return `${this.options.mainAxis} ${this.options.crossAxis}`;
  }
}
