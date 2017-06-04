import {Component} from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'demo-layout-alignment',
  styleUrls: [
    'layoutAlignment.demo.css',
  ],
  template: `
    <md-card class="card-demo">
      <md-card-title>Layout Children with 'layout-align'</md-card-title>
      <md-card-subtitle></md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div class="colorNested box" [class.taller]="direction != 'row'">
            <div [fxLayout]="direction" [fxLayoutAlign]="layoutAlign()" style="height: 100%;">
              <div class="blocks one">1</div>
              <div class="blocks" [class.two_h]="direction == 'row'"
                   [class.two_w]="direction != 'row'">2
              </div>
              <div class="blocks three">3</div>
              <div class="blocks" [class.four_h]="direction == 'row'"
                   [class.four_w]="direction != 'row'">4
              </div>
              <div class="blocks fives">5</div>
            </div>
          </div>
        </div>
      </md-card-content>
      <md-card-actions fxLayout="row" fxLayoutAlign="center" fxHide fxHide.gt-sm="false">
        <div fxLayout="row" fxLayout.xs="column" fxLayoutAlign="space-around stretch"
             class="demo_controls">
          <div>
            <div>Layout Direction</div>
            <md-radio-group [(ngModel)]="direction" fxLayout="column">
              <md-radio-button value="row">row</md-radio-button>
              <md-radio-button value="column">column</md-radio-button>
            </md-radio-group>
          </div>
          <div>
            <div>Alignment in Layout Direction
              ({{direction == 'row' ? 'horizontal' : 'vertical'}})
            </div>
            <md-radio-group name="mainAxisOptions" [(ngModel)]="mainAxis" fxLayout="column">
              <md-radio-button value="">none</md-radio-button>
              <md-radio-button value="start">start (default)</md-radio-button>
              <md-radio-button value="center">center</md-radio-button>
              <md-radio-button value="end">end</md-radio-button>
              <md-radio-button value="space-around">space-around</md-radio-button>
              <md-radio-button value="space-between">space-between</md-radio-button>
            </md-radio-group>
          </div>
          <div>
            <div>Alignment in Perpendicular Direction
              ({{direction == 'column' ? 'horizontal' : 'vertical'}})
            </div>
            <md-radio-group name="crossAxisOptions" [(ngModel)]="crossAxis" fxLayout="column">
              <md-radio-button value="none"><em>none</em></md-radio-button>
              <md-radio-button value="start">start</md-radio-button>
              <md-radio-button value="center">center</md-radio-button>
              <md-radio-button value="end">end</md-radio-button>
              <md-radio-button value="stretch">stretch (default)</md-radio-button>
            </md-radio-group>
          </div>
        </div>
      </md-card-actions>
      <md-card-footer style="width:95%;">
        <div class="hint forceAbove">
          &lt;div fxLayout="{{ direction }}"
          <span style="padding-left: 30px">fxLayoutAlign="{{ layoutAlign() }}"</span>
          &gt;
        </div>
      </md-card-footer>
    </md-card>
  `
})
export class DemoLayoutAlignment {
  public direction = 'row';
  public mainAxis = 'space-around';
  public crossAxis = 'center';

  layoutAlign() {
    return `${this.mainAxis} ${this.crossAxis}`;
  }
}
