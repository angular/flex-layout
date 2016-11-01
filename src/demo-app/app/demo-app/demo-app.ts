import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-app',
  styleUrls : [ 'demo-app.css' ],
  templateUrl: `
    <md-toolbar ng-layout="row">
      <h2>Demos: </h2>
      <button md-raised-button color="primary" [routerLink]="['']">               Layout Docs         </button>
      <button md-raised-button color="primary" [routerLink]="['responsive']">     Responsive Layouts  </button>
      <button md-raised-button color="primary" [routerLink]="['issues']">         Github Issues       </button>
      <button md-raised-button color="primary" [routerLink]="['stackoverflow']">  StackOverflow       </button>
      
      <div ng-flex></div>
      
      <span class="title" style="font-size: 0.6em; font-weight:normal; padding-left: 20px;">
        Hint: Click on any of the samples below to toggle the layout direction(s).
      </span>
      
    </md-toolbar>
    
    <div #root="$implicit" dir="ltr" class="demo-content">
      <router-outlet></router-outlet>
    </div>
  `,
  encapsulation : ViewEncapsulation.None
})
export class DemoApp {
}
