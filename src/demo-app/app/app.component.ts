import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'demo-app',
  styleUrls : ['app.component.css'],
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutDemosComponent implements  OnInit {

  ngOnInit() {
    console.log("testing ngOnit(Saving);")
  }
}
