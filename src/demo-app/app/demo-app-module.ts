import {NgModule}         from '@angular/core';
import {BrowserModule}    from '@angular/platform-browser';

import {DemoApp}          from './demo-app/demo-app';
import {SharedModule}     from './shared/_module';
import {DemoRoutesModule} from "./demo-app/demo-routes";

import {DemosStackOverflowModule} from "./stack-overflow/_module";
import {DemosGithubIssuesModule}  from './github-issues/_module';
import {DemosLayoutAPIModule}     from './docs-layout/_module';
import {DemosResponsiveLayoutsModule} from './docs-layout-responsive/_module';

@NgModule({
  declarations: [DemoApp],
  bootstrap: [DemoApp],
  imports: [
    BrowserModule,
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
}
