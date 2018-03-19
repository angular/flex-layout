import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule, BREAKPOINT} from '@angular/flex-layout';

import {RoutingModule} from './routing.module';
import {AppComponent} from './app.component';
import {DemoMaterialModule} from './material.module';

const PRINT_BREAKPOINTS = [{
  alias: 'xs.print',
  suffix: 'XsPrint',
  mediaQuery: 'print and (max-width: 297px)',
  overlapping: false
}];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    RoutingModule,
    DemoMaterialModule,
    FlexLayoutModule,
  ],
  providers: [{provide: BREAKPOINT, useValue: PRINT_BREAKPOINTS, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
