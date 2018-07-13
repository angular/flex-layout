import {Component} from '@angular/core';

@Component({
  selector: 'demo-docs-responsive',
  template: `
    <demo-responsive-layout-direction  class='small-demo'>  </demo-responsive-layout-direction>
    <demo-responsive-row-column class='small-demo'>  </demo-responsive-row-column>
    <demo-responsive-flex-directive  class='small-demo'>  </demo-responsive-flex-directive>
    <demo-responsive-flex-order  class='small-demo'>  </demo-responsive-flex-order>
    <demo-responsive-show-hide  class='small-demo'>  </demo-responsive-show-hide>
    <demo-responsive-style  class='small-demo'>  </demo-responsive-style>
  `
})
export class DocsResponsiveComponent {}
