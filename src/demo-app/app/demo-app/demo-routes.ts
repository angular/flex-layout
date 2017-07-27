import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import {DemosLayoutAPI} from '../docs-layout/_module';
import {DemosResponsiveLayout} from '../docs-layout-responsive/_module';
import {DemosGithubIssues} from '../github-issues/_module';
import {DemosStackOverflow} from '../stack-overflow/_module';

const DEMO_APP_ROUTES: Routes = [
  {path: '', redirectTo: 'docs', pathMatch: 'full'},
  {path: 'docs', component: DemosLayoutAPI},
  {path: 'responsive', component: DemosResponsiveLayout},
  {path: 'issues', component: DemosGithubIssues},
  {path: 'stackoverflow', component: DemosStackOverflow}
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(DEMO_APP_ROUTES)
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ]
})
export class DemoRoutesModule {
}
