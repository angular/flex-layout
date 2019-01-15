import {Component} from '@angular/core';

@Component({
  selector: 'dashboard',
  template: `
    <media-trigger-bar></media-trigger-bar>
    <demo-responsive-layout-direction  class='small-demo' fxHide.print>
    </demo-responsive-layout-direction>
    <demo-responsive-row-column class='small-demo'>  </demo-responsive-row-column>
    <demo-responsive-flex-directive  class='small-demo'>  </demo-responsive-flex-directive>
    <demo-responsive-flex-order  class='small-demo'>  </demo-responsive-flex-order>
    <demo-responsive-show-hide  class='small-demo'>  </demo-responsive-show-hide>
    <demo-responsive-style  class='small-demo'>  </demo-responsive-style>
  `
})
export class DashboardComponent {}
