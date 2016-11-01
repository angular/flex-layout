import {Routes} from '@angular/router';

import {DemosLayoutAPI}         from "./docs-layout/DemosLayoutAPI";
import {DemosResponsiveLayout}  from "./docs-layout-responsive/DemosResponsiveLayouts";
import {DemosGithubIssues}      from "./github-issues/DemosGithubIssues";
import {DemosStackOverflow}     from "./stack-overflow/DemosStackOverflow";

export const DEMO_APP_ROUTES: Routes = [
  {path: ''             , redirectTo: '/docs', pathMatch: 'full'},
  {path: 'docs'         , component: DemosLayoutAPI},
  {path: 'responsive'   , component: DemosResponsiveLayout},
  {path: 'issues'       , component: DemosGithubIssues},
  {path: 'stackoverflow', component: DemosStackOverflow}
];
