import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-grid-area-row-span',
  styleUrls : [
    'gridArea.demo.css',
    '../demo-app/material2.css'
  ],
  template: `
   <md-card class="card-demo" >
    <md-card-title> <a href="http://stackoverflow.com/questions/37039029/flex-css-rowspan-2-and-colspan-2" target="_blank">StackOverflow</a></md-card-title>
    <md-card-subtitle>Grid Area with Column and Row Span... [Click to change direction!]</md-card-subtitle>
    <md-card-content>
      <div class="containerX" [fxLayout]="'row'+direction" (click)="toggleDirection()"  style="cursor: pointer;">
        <div fxFlex [fxLayout]="'column'">
          <div class="one   flexitem " fxFlex> A  </div>
          <div class="two   flexitem " fxFlex> B  </div>
          <div class="three flexitem " fxFlex> C  </div>        
        </div>
        <div fxFlex="67" [fxLayout]="'column'+direction">
            <div fxLayout="row" fxFlex="33%">
              <div class="five  flexitem " fxFlex> E </div>
              <div class="five  flexitem " fxFlex> F </div>                              
            </div>
            <div class="four  flexitem " fxFlex> D </div>
        </div>
      </div>
    </md-card-content>
    <md-card-footer class="bottomPad">
      <div class="hint" >Current direction: &lt;fxLayout="row{{ direction }}"&gt;</div>
    </md-card-footer>
  </md-card>
  `
})
export class DemoGridAreaRowSpan {
  direction = "";

  toggleDirection() {
    let next = (DIRECTIONS.indexOf(this.direction) +1 ) % DIRECTIONS.length;
    this.direction = DIRECTIONS[next];
  }
}
const DIRECTIONS = ['', '-reverse'];
