import {Component} from '@angular/core';

@Component({
  selector: 'demo-stack-overflow',
  template: `
    <demo-moz-holy-grail class='small-demo'></demo-moz-holy-grail>
    <demo-complex-column-ordering></demo-complex-column-ordering>
    <demo-grid-area-row-span></demo-grid-area-row-span>
    <demo-grid-column-span></demo-grid-column-span>
  `
})
export class StackOverflowComponent {}
