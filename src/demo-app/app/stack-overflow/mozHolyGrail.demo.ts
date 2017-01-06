import {Component} from '@angular/core';


/**
 * See the Mozilla Holy Grail example implemented here with Flex-Layout
 * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes
 *
 */
@Component({
  selector: 'demo-moz-holy-grail',
  styleUrls : [
      '../demo-app/material2.css',
      './mozHolyGrail.demo.css'
    ],
  template: `
    <md-card class="card-demo" >
      <md-card-title>
        <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes" target="_blank">
          Mozilla Holy-Grail Layout
        </a>
      </md-card-title>
      <md-card-subtitle>
      Illustrated here is the case where the page layout suited to a browser window must be optimized for a smart phone window. Not only must the elements reduce in size, but the order in which they are presented must change. Flexbox makes this very simple
       </md-card-subtitle>
      <md-card-content>
        <div class="containerX">
            <div class="colorNested box" fxLayout="column">
              <header>header</header>
              <div id="main" [fxLayout]="direction" fxLayout.xs="column" fxFlex (click)="toggleDirection()">
                <nav     fxFlex="1 6 20%" fxFlexOrder fxFlexOrder.xs="2"> nav     </nav>
                <article fxFlex="3 1 60%" fxFlexOrder fxFlexOrder.xs="1"> article </article>
                <aside   fxFlex="1 6 20%" fxFlexOrder fxFlexOrder.xs="3"> aside   </aside>
              </div>
              <footer>footer</footer>
            </div>
        </div>
      </md-card-content>
      <md-card-footer class="bottomPad">
        <div class="hint">&lt;div fxLayout="{{ direction }}" fxLayout.xs="column" &gt;</div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoMozHolyGrail  {
  public direction = "row";
  toggleDirection() {
    this.direction = (this.direction === "column") ? "row" : "column";
  }
}
