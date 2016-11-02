import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-app',
  styleUrls : [ 'demo-app.css' ],
  templateUrl: `
    <md-toolbar style="min-height:95px">
      <h2>Layout Demos: </h2>
      <button md-raised-button color="primary" [routerLink]="['']">               Static        </button>
      <button md-raised-button color="primary" [routerLink]="['responsive']">     Responsive    </button>
      <button md-raised-button color="primary" [routerLink]="['issues']">         Github        </button>
      <button md-raised-button color="primary" [routerLink]="['stackoverflow']">  StackOverflow </button>
      
      <div fl-flex></div>
      
      <span class="title" style="font-size: 0.6em; font-weight:normal; padding-left: 20px;">
        Hint: Click on any of the samples below to toggle the layout direction(s).
      </span>
    </md-toolbar>
    <div class="intro">
       These Layout demos are curated from the Angular Material v1.x documentation, GitHub Issues, StackOverflow, 
       and CodePen.      
    </div>
    
    <div #root="$implicit" dir="ltr" class="demo-content">
      <router-outlet></router-outlet>
    </div>
  `,
  encapsulation : ViewEncapsulation.None
})
export class DemoApp {
}
