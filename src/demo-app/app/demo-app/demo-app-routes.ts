import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";

import {DemosLayoutAPI}         from "../docs-layout/DemosLayoutAPI";
import {DemosResponsiveLayout}  from "../docs-layout-responsive/DemosResponsiveLayouts";
import {DemosGithubIssues}      from "../github-issues/DemosGithubIssues";
import {DemosStackOverflow}     from "../stack-overflow/DemosStackOverflow";

const DemoAppRoutes: Routes = [
  {path: ''             , redirectTo: 'docs', pathMatch: 'full'},
  {path: 'docs'         , component: DemosLayoutAPI},
  {path: 'responsive'   , component: DemosResponsiveLayout},
  {path: 'issues'       , component: DemosGithubIssues},
  {path: 'stackoverflow', component: DemosStackOverflow}
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(DemoAppRoutes)
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class DemoAppRoutingModule { }

// These components are already exported in their associated Feature modules
// export const DemoAppRoutingComponents = [DemosLayoutAPI, DemosResponsiveLayout, DemosGithubIssues, DemosStackOverflow];
