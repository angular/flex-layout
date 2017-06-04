import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-responsive-flex-directive',
  template: `
    <md-card class="card-demo">
      <md-card-title>Responsive Flex Directives</md-card-title>
      <md-card-subtitle>Use the show hide APIs to responsively show or hide elements:
      </md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div fxLayout="row" class="coloredContainerX box">
            <div fxFlex.gt-sm="67" fxFlex="33"> flex 33% on mobile, <br>and 66% on gt-sm devices.
            </div>
            <div fxFlex.gt-sm="33" fxFlex="67"> flex 67% on mobile, <br>and 33% on gt-sm devices.
            </div>
          </div>
        </div>
      </md-card-content>
      <md-card-footer style="width:95%">
        <media-query-status></media-query-status>
      </md-card-footer>
    </md-card>
  `
})
export class DemoResponsiveFlexDirectives {
}
