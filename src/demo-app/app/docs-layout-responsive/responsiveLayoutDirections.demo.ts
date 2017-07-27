import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-responsive-layout-direction',
  template: `
    <md-card class="card-demo">
      <md-card-title>Responsive Layout Directions</md-card-title>
      <md-card-subtitle>Layout direction changes to 'column' for 'xs' or 'sm' viewport sizes:
      </md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div fxLayout="row" fxLayout.xs="column" fxLayout.sm="column" fxFlex
               class="coloredContainerX box">
            <div fxFlex> I'm above on mobile, and to the left on larger devices.</div>
            <div fxFlex> I'm below on mobile, and to the right on larger devices.</div>
          </div>
        </div>
      </md-card-content>
      <md-card-footer style="width:95%">
        <media-query-status></media-query-status>
      </md-card-footer>
    </md-card>
  `
})
export class DemoResponsiveLayoutDirection {
}
