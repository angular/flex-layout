import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LayoutsModule } from "../lib/all/all";

import { LayoutDemosComponent } from './app/app.component';

@NgModule({

  declarations    : [ LayoutDemosComponent ],
  imports         : [ LayoutsModule, BrowserModule ],
  bootstrap       : [ LayoutDemosComponent ]
})
export class DemoAppModule { }

