import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-app',
  styleUrls : [ 'demo-app.css' ],
  template: `
    <md-toolbar class="bigger" style="padding:0 20px;padding-bottom:30px;">
      <md-toolbar-row>
        <div fxLayout="row" 
             fxLayoutAlign="start center"
             fxLayoutGap="20px" 
             style="height:40px; min-height:40px;">
          <h2>Layout Demos: </h2>
          <button md-raised-button color="primary" [routerLink]="['']">               Static        </button>
          <button md-raised-button color="primary" [routerLink]="['responsive']">     Responsive    </button>
          <button md-raised-button color="primary" [routerLink]="['issues']">         Github        </button>
          <button md-raised-button color="primary" [routerLink]="['stackoverflow']">  StackOverflow </button>
        </div>
        <div fxFlex="15px"></div>
      </md-toolbar-row>
      <md-toolbar-row fxFlex fxLayout="column"  
                      fxLayoutAlign="left top"
                      style="font-size: 0.85em; margin-top: 0px; padding-bottom:20px; white-space:normal">
           These Layout demos are curated from the Angular Material v1.x documentation, GitHub Issues, StackOverflow, 
           and CodePen.      
          <span class="title" style="font-size: 0.7em; font-weight:normal;">
            Hint: Click on any of the samples below to toggle the layout direction(s).
          </span>
      </md-toolbar-row>
    </md-toolbar>
    
    <div class="demo-content">
      <router-outlet></router-outlet>
    </div>
  `,
  encapsulation : ViewEncapsulation.None
})
export class DemoApp {
}
