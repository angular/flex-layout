import {Component} from '@angular/core';

@Component({
  selector: 'demo-docs-grid',
  template: `
    <demo-grid-layout class="small-demo"></demo-grid-layout>
    <demo-grid-nested class="small-demo"></demo-grid-nested>
    <demo-grid-minmax class="small-demo"></demo-grid-minmax>
    <demo-grid-position class="small-demo"></demo-grid-position>
    <demo-grid-overlay class="small-demo"></demo-grid-overlay>
  `
})
export class DocsGridComponent {}
