import {Component} from '@angular/core';

const DIRECTIONS = ['column', 'column-reverse'];

@Component({
  selector: 'demo-complex-column-ordering',
  templateUrl: './complex-column-ordering.component.html',
  styleUrls: ['./complex-column-ordering.component.scss']
})
export class ComplexColumnOrderingComponent {
  direction = 'column';

  toggleDirection() {
    const next = (DIRECTIONS.indexOf(this.direction) + 1) % DIRECTIONS.length;
    this.direction = DIRECTIONS[next];
  }
}
