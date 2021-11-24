import {Component} from '@angular/core';

@Component({
  selector: 'demo-issue-181',
  templateUrl: './issue-181.component.html'
})
export class Issue181Component {
  direction = 'column';

  pivot() {
    this.direction = (this.direction === 'row') ? 'column' : 'row';
  }
}
