import {NgModule}         from '@angular/core';
import {BrowserModule}    from '@angular/platform-browser';
import {SharedModule}     from './shared/shared.module';

import {DemoApp}          from './demo-app/demo-app';
import {DemoAppRoutingModule} from "./demo-app/demo-app-routes";
import {DemosStackOverflowModule} from "./stack-overflow/DemosStackOverflow";
import {DemosGithubIssuesModule}  from './github-issues/DemosGithubIssues';
import {DemosLayoutAPIModule}     from './docs-layout/DemosLayoutAPI';
import {DemosResponsiveLayoutsModule} from './docs-layout-responsive/DemosResponsiveLayouts';

@NgModule({
  declarations: [DemoApp],
  bootstrap: [DemoApp],
  imports: [
    BrowserModule,
    SharedModule,
    DemoAppRoutingModule,

    /* Internal Demo App Modules */
    DemosStackOverflowModule,
    DemosGithubIssuesModule,
    DemosLayoutAPIModule,
    DemosResponsiveLayoutsModule
  ]
})
export class DemoAppModule {
}
