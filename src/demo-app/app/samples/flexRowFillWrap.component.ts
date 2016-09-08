import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'flex-row-fill-wrap',
  styles : [
    `.wrapped {
        line-height: 22px;
    }`
  ],
  template: `
    <p>Using layout-wrap to wrap items with layout="row"</p>        
    <div [layout]="direction" layout-wrap class="colored wrapped" (click)="toggleDirection()">
    
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
export class flexRowFillWrapComponent  {
  direction = "row";

  /**
   *
   */
  toggleDirection() {
    this.direction = (this.direction === "row") ? "column" : "row";
  }
}
