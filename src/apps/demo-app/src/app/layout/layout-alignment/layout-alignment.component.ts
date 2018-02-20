import {Component} from '@angular/core';

@Component({
  selector: 'demo-layout-alignment',
  templateUrl: './layout-alignment.component.html',
  styleUrls: ['./layout-alignment.component.scss']
})
export class LayoutAlignmentComponent {
  options = {
    direction :  'row',
    mainAxis  : 'space-around',
    crossAxis :  'center'
  };

  layoutAlign() {
    return `${this.options.mainAxis} ${this.options.crossAxis}`;
  }
}
