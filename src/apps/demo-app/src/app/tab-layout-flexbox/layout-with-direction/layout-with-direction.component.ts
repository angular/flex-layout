import {Component} from '@angular/core';

@Component({
  selector: 'demo-layout-with-direction',
  templateUrl: './layout-with-direction.component.html'
})
export class LayoutWithDirectionComponent {
  direction = 'ltr';

  toggleDirection() {
    this.direction = this.direction === 'ltr' ? 'rtl' : 'ltr';
  }
}
