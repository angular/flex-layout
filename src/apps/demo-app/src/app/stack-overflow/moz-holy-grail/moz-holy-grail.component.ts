import {Component} from '@angular/core';

@Component({
  selector: 'demo-moz-holy-grail',
  templateUrl: './moz-holy-grail.component.html',
  styleUrls: ['./moz-holy-grail.component.scss']
})
export class MozHolyGrailComponent {
  direction = 'row';

  toggleDirection() {
    this.direction = (this.direction === 'column') ? 'row' : 'column';
  }
}
