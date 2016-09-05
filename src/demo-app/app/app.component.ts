import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-app',
  styleUrls : ['app.component.css'],
  templateUrl: `
      <simple-row-column class="small-demo"></simple-row-column>
      
      <flex-row-fill class="small-demo" ></flex-row-fill>
      
      <flex-row-fill-wrap class="small-demo" ></flex-row-fill-wrap>
      
  `,
  encapsulation: ViewEncapsulation.None,
})
export class LayoutDemosComponent {
}
