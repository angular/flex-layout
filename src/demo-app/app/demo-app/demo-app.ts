import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-app',
  styleUrls : [ 'demo-app.css' ],
  templateUrl: `
    <md-toolbar>
        <div fx-layout="row" fx-layout-align="start center" style="height:40px; min-height:40px;">
          <h2>Layout Demos: </h2>
          <button md-raised-button color="primary" [routerLink]="['']">               Static        </button>
          <button md-raised-button color="primary" [routerLink]="['responsive']">     Responsive    </button>
          <button md-raised-button color="primary" [routerLink]="['issues']">         Github        </button>
          <button md-raised-button color="primary" [routerLink]="['stackoverflow']">  StackOverflow </button>
        </div>
        <div fx-flex="15px"></div>
        <div fx-layout="column">
           These Layout demos are curated from the Angular Material v1.x documentation, GitHub Issues, StackOverflow, 
           and CodePen.      
          <span class="title" style="font-size: 0.7em; font-weight:normal;">
            Hint: Click on any of the samples below to toggle the layout direction(s).
          </span>
        </div>
    </md-toolbar>
    
    <div #root="$implicit" dir="ltr" class="demo-content">
      <router-outlet></router-outlet>
    </div>
  `,
  encapsulation : ViewEncapsulation.None
})
export class DemoApp {
}
