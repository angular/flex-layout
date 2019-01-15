import { Component } from '@angular/core';

@Component({
  selector: 'demo-grid-overlay',
  template: `
    <mat-card class="card-demo">
      <mat-card-title>Grid with Overlay</mat-card-title>
      <mat-card-content class="containerX">
        <div class="colorNested box" style="height: auto;">
          <div gdGap="10px" gdColumns="120px 120px 120px"
               gdAreas="header  header  header | sidebar content content">
            <div class="box" gdArea="header">Header</div>
            <div class="box" gdArea="sidebar">Sidebar</div>
            <div class="box" gdArea="content">Content</div>
            <div class="overlay" gdColumn="content-start / content-end"
                 gdRow="header-start / content-end">
              overlay
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.box {
    border-radius: 5px;
    padding: 20px;
  }`, `.overlay {
    background-color: red;
    z-index: 10;
  }`]
})
export class GridOverlayComponent {
}
