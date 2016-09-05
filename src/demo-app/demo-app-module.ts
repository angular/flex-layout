import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LayoutsModule } from "../lib/all/all";

import { LayoutDemosComponent } from './app/app.component';
import { SimpleRowColumnComponent } from './app/samples/simpleRowColumn';
import { FlexRowFillComponent } from './app/samples/flexRowFill.component';
import { flexRowFillWrapComponent } from './app/samples/flexRowFillWrap.component';

@NgModule({

  declarations    : [ LayoutDemosComponent, SimpleRowColumnComponent, FlexRowFillComponent, flexRowFillWrapComponent],
  imports         : [ LayoutsModule, BrowserModule ],
  bootstrap       : [ LayoutDemosComponent ]
})
export class DemoAppModule { }

