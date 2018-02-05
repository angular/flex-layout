import {Component} from '@angular/core';

@Component({
  selector: 'demo-docs-layout',
  template: `
    <demo-layout-alignment class="small-demo"></demo-layout-alignment>
    <demo-layout-fill class="small-demo"></demo-layout-fill>
    <demo-flex-row-fill class="small-demo"></demo-flex-row-fill>
    <demo-flex-row-fill-wrap class="small-demo"></demo-flex-row-fill-wrap>
    <demo-flex-attribute-values class="small-demo"></demo-flex-attribute-values>
    <demo-flex-offset-values class="small-demo"></demo-flex-offset-values>
    <demo-flex-align-self class="small-demo"></demo-flex-align-self>
    <demo-layout-with-direction class="small-demo"></demo-layout-with-direction>
  `
})
export class DocsLayoutComponent {}
