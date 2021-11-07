import { Component } from '@angular/core';

// Example taken from https://gridbyexample.com/examples/example16/
@Component({
  selector: 'demo-grid-position',
  template: `
    <mat-card class="card-demo">
      <mat-card-title>Grid with Positioning</mat-card-title>
      <mat-card-content class="containerX">
        <div class="colorNested box" style="height: auto;">
          <div gdGap="10px" gdColumns="200px 200px 200px"
               gdAreas="header  header  header | sidebar content content | footer  footer  footer">
            <div class="box" gdArea="header">Header</div>
            <div class="box" gdArea="sidebar">Sidebar</div>
            <div class="box" gdArea="content" style="position: relative;">Content
              <br /> The four arrows are inline images inside the content area.
              <img src="http://gridbyexample.com/examples/code/arrow-top-left.png"
                   alt="top left" class="topleft" />
              <img src="http://gridbyexample.com/examples/code/arrow-top-right.png"
                   alt="top right" class="topright" />
              <img src="http://gridbyexample.com/examples/code/arrow-bottom-left.png"
                   alt="bottom left" class="bottomleft" />
              <img src="http://gridbyexample.com/examples/code/arrow-bottom-right.png"
                   alt="bottom right" class="bottomright" /></div>
            <div class="box" gdArea="footer">Footer</div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.topleft {
    position: absolute;
    top: 0;
    left: 0;
  }`, `.topright {
    position: absolute;
    top: 0;
    right: 0;
  }`, `.bottomleft {
    position: absolute;
    bottom: 0;
    left: 0;
  }`, `.bottomright {
    position: absolute;
    bottom: 0;
    right: 0;
  }`, `.box {
    border-radius: 5px;
    padding: 50px;
    font-size: 150%;
  }`]
})
export class GridPositionComponent {
}
