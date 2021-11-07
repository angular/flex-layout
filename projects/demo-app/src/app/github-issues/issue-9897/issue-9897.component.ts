import {Component} from '@angular/core';

const DIRECTIONS = ['wrap', 'wrap-reverse'];

@Component({
  selector: 'demo-issue-9897',
  templateUrl: './issue-9897.component.html'
})
export class Issue9897Component {
  wrapDirection = 'wrap';

  toggleDirection() {
    const next = (DIRECTIONS.indexOf(this.wrapDirection) + 1 ) % DIRECTIONS.length;
    this.wrapDirection = DIRECTIONS[next];
  }
}
