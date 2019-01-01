import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

export const gridModuleId = './grid/grid.module#DocsGridModule';
export const docsModuleId = './layout/layout.module#DocsLayoutModule';
export const responsiveModuleId = './responsive/responsive.module#DocsResponsiveModule';
export const issuesModuleId = './github-issues/github-issues.module#DocsGithubIssuesModule';
export const stackOverflowModuleId =
  './stack-overflow/stack-overflow.module#DocsStackOverflowModule';

const DEMO_APP_ROUTES: Routes = [
  {path: '', redirectTo: 'docs', pathMatch: 'full'},
  {path: 'grid', loadChildren: gridModuleId},
  {path: 'docs', loadChildren: docsModuleId},
  {path: 'responsive', loadChildren: responsiveModuleId},
  {path: 'issues', loadChildren: issuesModuleId},
  {path: 'stackoverflow', loadChildren: stackOverflowModuleId}
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
export class RoutingModule {}
