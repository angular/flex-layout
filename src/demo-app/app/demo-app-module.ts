import { NgModule }       from '@angular/core';
import { RouterModule }   from "@angular/router";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { BrowserModule }  from '@angular/platform-browser';
import { MaterialModule } from "@angular/material";

import {FlexLayoutModule}    from "@angular/flex-layout";     // `gulp build:components` to deploy to node_modules manually

import { DemoApp }                  from './demo-app/demo-app';
import { DEMO_APP_ROUTES }          from "./demo-app-routes";
import { DemosStackOverflowModule } from "./stack-overflow/DemosStackOverflow";
import { DemosGithubIssuesModule }  from './github-issues/DemosGithubIssues';
import { DemosLayoutAPIModule }     from './docs-layout/DemosLayoutAPI';
import { DemosResponsiveLayoutsModule } from './docs-layout-responsive/DemosResponsiveLayouts';


@NgModule({
  declarations    : [ DemoApp ],
  bootstrap       : [ DemoApp ],
  imports         : [
    BrowserModule,
    RouterModule.forRoot(DEMO_APP_ROUTES),
    MaterialModule.forRoot(),
    FlexLayoutModule.forRoot(),

    /* Internal Demo App Modules */
    DemosStackOverflowModule,
    DemosGithubIssuesModule,
    DemosLayoutAPIModule,
    DemosResponsiveLayoutsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class DemoAppModule { }
