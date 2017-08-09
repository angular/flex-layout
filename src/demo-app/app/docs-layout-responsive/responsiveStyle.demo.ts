import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-responsive-style',
  template: `

    <md-card class="card-demo" >
      <md-card-title>Responsive Style</md-card-title>
      <md-card-subtitle>
        Use the fxClass and fxStyle APIs to responsively apply styles to elements:
      </md-card-subtitle>

      <md-card-content>
        <div class="containerX">
          <div fxLayout="row" fxFlex class="coloredContainerX box">
            <div
              fxFlex
              class="fxClass-all"
              class.xs="fxClass-xs"
              [class.sm]="{'fxClass-sm': hasStyle}"
              [class.md]="{'fxClass-md': hasStyle, 'fxClass-md2': hasStyle}"
              [class.lg]="['fxClass-lg', 'fxClass-lg2']">
              Sample Text #1
              <br/>
              <md-checkbox
                [(ngModel)]="hasStyle"
                fxShow="false"
                [fxShow.sm]="true"
                [fxShow.md]="true">
                Use Responsive Styles
              </md-checkbox>
            </div>
          </div>
        </div>
      </md-card-content>
      <md-card-content>
        <pre>
        &lt;div
          fxFlex
          class="fxClass-all"
          class.xs="fxClass-xs"
          [class.sm]="&#123;'fxClass-sm': hasStyle&#125;"
          [class.md]="&#123;'fxClass-md': hasStyle, 'fxClass-md2': hasStyle&#125;"
          [class.lg]="['fxClass-lg', 'fxClass-lg2']"&gt;
        &lt;/div&gt;
        </pre>
      </md-card-content>

      <md-card-content>
        <div class="containerX">
          <div fxLayout="row"
               fxFlex
               class="coloredContainerX box">
            <div fxFlex
              style="font-style: italic"
              [style.xs]="{'font-size.px': 10, 'background-color': '#ddd', color: 'blue'}"
              [style.sm]="{'font-size.px': 20, 'background-color': 'grey', color: '#482b00'}"
              [style.md]="{'font-size.px': 30, 'background-color': 'black', color: 'orange'}"
              [style.lg]="styleLgExp">
                Sample Text #2
            </div>
          </div>
        </div>
      </md-card-content>
      <md-card-content>
        <pre>
        &lt;div
          style="font-style: italic"
          [style.xs]="&#123;'font-size.px': 10, color: 'blue'&#125;"
          [style.sm]="&#123;'font-size.px': 20, color: 'lightblue'&#125;"
          [style.md]="&#123;'font-size.px': 30, color: 'orange'&#125;"
          [style.lg]="styleLgExp"&gt;
        &lt;/div&gt;
        </pre>
      </md-card-content>


      <md-card-footer style="width:95%">
        <media-query-status></media-query-status>
      </md-card-footer>
    </md-card>
  `
})
export class DemoResponsiveStyle  {
  public hasStyle: boolean = false;
  public styleLgExp = {
    'font-size': '40px',
    color: 'lightgreen'
  };

}
