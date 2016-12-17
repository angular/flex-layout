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
      <div class="containerX" [fx-layout]="'row'+direction" (click)="toggleDirection()"  style="cursor: pointer;">
        <div fx-flex [fx-layout]="'column'">
          <div class="one   flexitem " fx-flex> A  </div>
          <div class="two   flexitem " fx-flex> B  </div>
          <div class="three flexitem " fx-flex> C  </div>        
        </div>
        <div fx-flex="67" [fx-layout]="'column'+direction">
            <div fx-layout="row" fx-flex="33%">
              <div class="five  flexitem " fx-flex> E </div>
              <div class="five  flexitem " fx-flex> F </div>                              
            </div>
            <div class="four  flexitem " fx-flex> D </div>
        </div>
      </div>
    </md-card-content>
    <md-card-footer class="bottomPad">
      <div class="hint" >Current direction: &lt;fx-layout="row{{ direction }}"&gt;</div>
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
