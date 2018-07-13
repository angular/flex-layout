import { Component } from '@angular/core';

// Example taken from https://gridbyexample.com/examples/example29/
@Component({
  selector: 'demo-grid-minmax',
  template: `
    <mat-card class="card-demo">
      <mat-card-title>Grid with Minmax</mat-card-title>
      <mat-card-content class="containerX">
        <div class="colorNested" style="height: auto;">
          <div gdGap="10px" gdColumns="repeat(auto-fill, minmax(200px, 1fr))">
            <div class="box" gdColumn="auto / span 2">A</div>
            <div class="box">B</div>
            <div class="box">C</div>
            <div class="box">D</div>
            <div class="box">E</div>
            <div class="box">F</div>
            <div class="box" gdColumn="auto / span 2" gdRow="auto / span 2">G</div>
            <div class="box">H</div>
            <div class="box">I</div>
            <div class="box">J</div>
            <div class="box" gdColumn="auto / span 3">K</div>
            <div class="box">L</div>
            <div class="box">M</div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.box {
    /*background-color: #444;*/
    /*color: #fff;*/
    border-radius: 5px;
    padding: 20px;
    font-size: 150%;

  }`]
})
export class GridMinmaxComponent {
}
