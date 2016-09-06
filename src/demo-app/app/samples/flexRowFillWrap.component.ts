import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'flex-row-fill-wrap',
  styles : [
    `.wrapped {
        height:128px;
        line-height: 22px;
    }`
  ],
  template: `
    <p>Using layout-wrap to row items with layout="row"</p>        
    <div layout="row" layout-wrap class="colored wrapped" >
    
      <div flex="30"> [flex="30"] </div>
      <div flex="45"> [flex="45"] </div>
      <div flex="19"> [flex="19"] </div>
      <div flex="33"> [flex="33"] </div>
      <div flex="67"> [flex="67"] </div>
      <div flex="50"> [flex="50"] </div>
      <div flex>      [flex]      </div>
      
    </div>    
  `,
  encapsulation: ViewEncapsulation.None,
})
export class flexRowFillWrapComponent  { }
