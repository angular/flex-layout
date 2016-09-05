import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'flex-row-fill',
  template: `
    <div layout="row" class="colored" >
      <div flex="20">
        flex="20"
      </div>
      <div flex="70">
        flex="70"
      </div>
      <div flex >
        flex
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class FlexRowFillComponent  { }
