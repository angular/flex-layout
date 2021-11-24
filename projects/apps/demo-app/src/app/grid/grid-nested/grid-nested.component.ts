import { Component } from '@angular/core';

// Example taken from https://gridbyexample.com/examples/example21/
@Component({
  selector: 'demo-grid-nested',
  template: `
    <mat-card class="card-demo">
      <mat-card-title>Nested Grid</mat-card-title>
      <mat-card-content class="containerX">
        <div class="colorNested" style="height: auto;">
          <div gdGap="20px" gdColumns="repeat(4, [col] 150px)" gdRows="repeat(2, [row] auto)">
            <div class="box" gdColumn="col / span 2" gdRow="row">A</div>
            <div class="box" gdColumn="col 3 / span 2" gdRow="row">B</div>
            <div class="box" gdColumn="col / span 2" gdRow="row 2">C</div>
            <div class="box" gdColumn="col 3 / span 2" gdRow="row 2" gdGap="10px"
                 gdColumns="1fr 1fr">
              <div class="box one" gdColumn="1 / 3" gdRow="1">E</div>
              <div class="box two" gdColumn="1" gdRow="2">F</div>
              <div class="box three" gdColumn="2" gdRow="2">G</div>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.box {
    border-radius: 5px;
    padding: 20px;
    font-size: 150%;
  }`]
})
export class GridNestedComponent {
}
