import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'simple-row-column',
  template: `
    <div class="colorNested" layout="row">
      <div [layout]="firstCol" flex (click)="toggleLayoutFor(1)">
        <div flex>First item in row</div>
        <div flex>Second item in row</div>
      </div>
      <div [layout]="secondCol" flex (click)="toggleLayoutFor(2)">
        <div flex>First item in column</div>
        <div flex>Second item in column</div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class SimpleRowColumnComponent {
  firstCol = "row";
  secondCol = "column";

  toggleLayoutFor(col) {
    let key = (col == "2") ? "secondCol" : "firstCol" ;
    this[key] = (this[key] == "row") ? "column" : "row";
  }
}
