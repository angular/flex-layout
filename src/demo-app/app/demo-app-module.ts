import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { MaterialModule }   from "@angular/material";
import { FlexLayoutModule } from "../../lib";     // `gulp build:components` to deploy to node_modules manually

import { DemoApp }          from './demo-app/demo-app';
import { DemoAppRoutingModule } from "./demo-app/demo-app-routes";
import { DemosStackOverflowModule } from "./stack-overflow/DemosStackOverflow";
import { DemosGithubIssuesModule }  from './github-issues/DemosGithubIssues';
import { DemosLayoutAPIModule }     from './docs-layout/DemosLayoutAPI';
import { DemosResponsiveLayoutsModule } from './docs-layout-responsive/DemosResponsiveLayouts';

@NgModule({
  declarations    : [ DemoApp ],
  bootstrap       : [ DemoApp ],
  imports         : [
    BrowserModule,
    MaterialModule.forRoot(),
    FlexLayoutModule.forRoot(),
    DemoAppRoutingModule,

    /* Internal Demo App Modules */
    DemosStackOverflowModule,
    DemosGithubIssuesModule,
    DemosLayoutAPIModule,
    DemosResponsiveLayoutsModule
  ]
})
export class DemoAppModule { }
