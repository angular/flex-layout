import {ApplicationRef, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DemoApp} from './app/demo-app/demo-app';
import {SharedModule} from './app/shared/_module';
import {DemoRoutesModule} from './app/demo-app/demo-routes';

import {DemosStackOverflowModule} from './app/stack-overflow/_module';
import {DemosGithubIssuesModule} from './app/github-issues/_module';
import {DemosLayoutAPIModule} from './app/docs-layout/_module';
import {DemosResponsiveLayoutsModule} from './app/docs-layout-responsive/_module';

@NgModule({
  entryComponents: [
    DemoApp
  ],
  declarations: [
    DemoApp
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    DemoRoutesModule,

    /* Internal Demo App Modules */
    DemosStackOverflowModule,
    DemosGithubIssuesModule,
    DemosLayoutAPIModule,
    DemosResponsiveLayoutsModule
  ]
})
export class DemoAppModule {
  constructor(private _appRef: ApplicationRef) {
  }

  ngDoBootstrap() {
    this._appRef.bootstrap(DemoApp);
  }
}
