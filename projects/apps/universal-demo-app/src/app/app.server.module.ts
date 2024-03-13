import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import {FlexLayoutServerModule} from '@eresearchqut/flex-layout/server';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    FlexLayoutServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
