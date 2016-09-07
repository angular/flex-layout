import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'flex-row-fill',
  template: `
    <div [layout]="direction" (click)="toggleDirection()" class="colored" style="height:200px;">
      <div flex="20">
        flex="20"
      </div>
      <div flex="60">
        flex="60"
      </div>
      <div flex >
        flex
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class FlexRowFillComponent  {
  direction = 'row';

  /**
   *
   */
  toggleDirection() {
    this.direction = (this.direction === "row") ? "column" : "row";
  }
}
