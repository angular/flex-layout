import {Component} from '@angular/core';


@Component({
  selector: 'demo-flex-align-self',
  styleUrls : [
      'layoutAlignment.demo.css',
      '../demo-app/material2.css'
    ],
  templateUrl: 'flexAlignSelf.demo.html'
})
export class DemoFlexAlignSelf {
  public alignTo = "center";

  toggleAlignment () {
      let j = ALIGN_OPTIONS.indexOf(this.alignTo);
      this.alignTo = ALIGN_OPTIONS[ (j + 1) % ALIGN_OPTIONS.length ];
  }
}

const ALIGN_OPTIONS = ["auto", "start", "center", "baseline", "end", "stretch"];
