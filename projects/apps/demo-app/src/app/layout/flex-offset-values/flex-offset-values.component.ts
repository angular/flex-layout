import {Component} from '@angular/core';

@Component({
  selector: 'demo-flex-offset-values',
  template: `
    <mat-card class="card-demo">
      <mat-card-title>Flex Offset Values</mat-card-title>
      <mat-card-subtitle>Explore impact of values for the 'flex-offset' API:</mat-card-subtitle>
      <mat-card-content>
        <div class="containerX">
          <div fxLayout="row" class="colored box nopad">
            <div fxFlex="66" fxFlexOffset="15"> [fxFlex="66"] [fxFlexOffset="15"]</div>
            <div fxFlex> [fxFlex]</div>
          </div>
        </div>
      </mat-card-content>
      <mat-card-footer>
        <div class="hint">&lt;div fxLayout="row" &gt;</div>
      </mat-card-footer>
    </mat-card>
  `
})
export class FlexOffsetValuesComponent {}
