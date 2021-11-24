import {Component} from '@angular/core';
import {Direction} from '@angular/cdk/bidi';

@Component({
  selector: 'demo-layout-with-direction',
  templateUrl: './layout-with-direction.component.html'
})
export class LayoutWithDirectionComponent {
  direction: Direction = 'ltr';

  toggleDirection() {
    this.direction = this.direction === 'ltr' ? 'rtl' : 'ltr';
  }
}
