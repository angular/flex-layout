import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AppRoutingModule} from './app-routing.module';
import {CustomMaterialModule} from './custom-material.module';
import {DemoUtilsModule} from './utils/demo-utils.module';

import {LAYOUT_CONFIG, BREAKPOINT_PROVIDERS} from './utils/breakpoints/custom-breakpoint';

import {AppComponent} from './app-shell/app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    BrowserAnimationsModule,
    CustomMaterialModule,
    AppRoutingModule,
    DemoUtilsModule,
    FlexLayoutModule.withConfig(LAYOUT_CONFIG),
  ],
  providers: [ ...BREAKPOINT_PROVIDERS ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
