import {Component} from '@angular/core';

@Component({
  selector: 'demos-stackoverflow',
  template: `
    <demo-complex-column-ordering></demo-complex-column-ordering>
  `
})
export class DemosStackOverflow { }

import {NgModule}                 from '@angular/core';
import {CommonModule}             from "@angular/common";
import {MaterialModule}           from "@angular/material";

import {LayoutsModule}            from "../../../lib/flexbox/flexbox-module";

import { DemoComplexColumnOrder } from "./columnOrder.demo";

@NgModule({
  declarations : [
    DemosStackOverflow,     // used by the Router with the root app component
    DemoComplexColumnOrder
  ],
  imports : [
    CommonModule,
    MaterialModule,
    LayoutsModule
  ]
})
export class DemosStackOverflowModule{  }
