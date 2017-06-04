import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-responsive-flex-order',
  template: `
    <md-card class="card-demo">
      <md-card-title>Responsive Flex Ordering</md-card-title>
      <md-card-subtitle>Add the flex-order directive to a layout child to set its order position
        within the layout container:
      </md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div fxLayout="row" class="coloredContainerX box">
            <div fxFlex fxFlexOrder="-1">
              <p>[flex-order="-1"]</p>
            </div>
            <div fxFlex fxFlexOrder="1" fxFlexOrder.gt-md="3">
              <p fxHide="false" fxHide.gt-md> [flex-order="1"] </p>
              <p fxShow="false" fxShow.gt-md> [flex-order.gt-md="3"] </p>
            </div>
            <div fxFlex fxFlexOrder="2">
              <p>[flex-order="2"]</p>
            </div>
            <div fxFlex fxFlexOrder="3" fxFlexOrder.gt-md="1">
              <p fxHide="false" fxHide.gt-md> [flex-order="3"] </p>
              <p fxShow="false" fxShow.gt-md> [flex-order.gt-md="1"] </p>
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
export class DemoResponsiveFlexOrder {
}
