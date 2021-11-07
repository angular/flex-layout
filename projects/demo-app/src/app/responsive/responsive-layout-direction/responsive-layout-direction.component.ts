import {Component} from '@angular/core';

@Component({
  selector: 'demo-responsive-layout-direction',
  template: `
    <mat-card class="card-demo">
      <mat-card-title>Responsive Layout Directions</mat-card-title>
      <mat-card-subtitle>Layout direction changes to 'column' for 'xs' or 'sm' viewport sizes:
      </mat-card-subtitle>
      <mat-card-content>
        <div class="containerX">
          <div fxLayout="row" fxLayout.xs="column" fxLayout.sm="column" fxFlex
               class="coloredContainerX box">
            <div fxFlex> I'm above on mobile, and to the left on larger devices.</div>
            <div fxFlex> I'm below on mobile, and to the right on larger devices.</div>
          </div>
        </div>
      </mat-card-content>
      <mat-card-footer style="width:95%">
        <media-query-status></media-query-status>
      </mat-card-footer>
    </mat-card>
  `
})
export class ResponsiveLayoutDirectionComponent {}
