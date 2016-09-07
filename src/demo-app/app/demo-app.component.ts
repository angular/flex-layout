import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-app',
  styleUrls : ['demo-app.component.css'],
  templateUrl: `
      Hint: Click on any of the samples below to toggle the layout direction.
      
      <simple-row-column class="small-demo"></simple-row-column>
      
      <flex-row-fill class="small-demo" ></flex-row-fill>
      
      <flex-row-fill-wrap class="small-demo" ></flex-row-fill-wrap>
      
  `,
  encapsulation: ViewEncapsulation.None,
})
export class DemoAppComponent {
}
