import {Component} from '@angular/core';

@Component({
  selector: 'demo-issue-135',
  styleUrls : [
    '../demo-app/material2.css'
  ],
  template: `
    <md-card class="card-demo" >
      <md-card-title><a href="https://github.com/angular/flex-layout/issues/135" target="_blank">Issue #135</a></md-card-title>
      <md-card-subtitle>Layout with fxFlex="auto" not restoring max-height values properly:</md-card-subtitle>
      <md-card-content>
        <div class="containerX">
          <div fxLayout="column" class="coloredContainerX box">
            <div fxFlex="auto" fxFlex.gt-sm="70"  > &lt;div fxFlex="auto" fxFlex.gt-sm="70"  &gt; </div>
            <div fxFlex="auto" fxFlex.gt-sm="14.6"> &lt;div fxFlex="auto" fxFlex.gt-sm="14.6"&gt; </div>
            <div fxFlex="auto" fxFlex.gt-sm="15.4"> &lt;div fxFlex="auto" fxFlex.gt-sm="15.4"&gt; </div>
          </div>       
        </div>
      </md-card-content>
      <md-card-footer style="width:95%">
        <media-query-status></media-query-status>
      </md-card-footer>      
    </md-card>
  `
})
export class DemoIssue135 { }
