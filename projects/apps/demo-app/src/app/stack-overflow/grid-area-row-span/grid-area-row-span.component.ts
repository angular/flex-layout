import {Component} from '@angular/core';

const DIRECTIONS = ['', '-reverse'];

@Component({
  selector: 'demo-grid-area-row-span',
  templateUrl: './grid-area-row-span.component.html',
  styleUrls: ['./grid-area-row-span.component.scss']
})
export class GridAreaRowSpanComponent {
  direction = '';

  toggleDirection() {
    const next = (DIRECTIONS.indexOf(this.direction) + 1 ) % DIRECTIONS.length;
    this.direction = DIRECTIONS[next];
  }
}
