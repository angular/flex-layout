import {Component} from '@angular/core';

@Component({
  selector: 'demo-responsive-flex-directive',
  template: `
    <mat-card class="card-demo">
      <mat-card-title>Responsive Flex Directives</mat-card-title>
      <mat-card-subtitle>Use the show hide APIs to responsively show or hide elements:
      </mat-card-subtitle>
      <mat-card-content>
        <div class="containerX">
          <div fxLayout="row" class="coloredContainerX box">
            <div fxFlex.gt-sm="67" fxFlex="33"> flex 33% on mobile, <br>and 66% on gt-sm devices.
            </div>
            <div fxFlex.gt-sm="33" fxFlex="67"> flex 67% on mobile, <br>and 33% on gt-sm devices.
            </div>
          </div>
        </div>
      </mat-card-content>
      <mat-card-footer style="width:95%">
        <media-query-status></media-query-status>
      </mat-card-footer>
    </mat-card>
  `
})
export class ResponsiveFlexDirectiveComponent {}
