import {Component} from '@angular/core';

const DIRECTIONS = ['row', 'row-reverse'];

@Component({
  selector: 'demo-issue-5345',
  templateUrl: './issue-5345.component.html',
  styleUrls: ['./issue-5345.component.scss']
})
export class Issue5345Component {
  direction = 'row';

  toggleDirection() {
    const next = (DIRECTIONS.indexOf(this.direction) + 1 ) % DIRECTIONS.length;
    this.direction = DIRECTIONS[next];
  }
}
