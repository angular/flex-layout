import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

const DEMO_APP_ROUTES: Routes = [
  {path: '', redirectTo: 'docs', pathMatch: 'full'},
  {path: 'grid', loadChildren: './tab-layout-grid/grid.module#DocsGridModule'},
  {path: 'docs', loadChildren: './tab-layout-flexbox/layout.module#DocsLayoutModule'},
  {path: 'responsive', loadChildren: './tab-responsive/responsive.module#DocsResponsiveModule'},
  {path: 'issues', loadChildren: './tab-github-issues/github-issues.module#DocsGithubIssuesModule'},
  {
    path: 'stackoverflow',
    loadChildren: './tab-stack-overflow/stack-overflow.module#DocsStackOverflowModule'
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(DEMO_APP_ROUTES)],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ]
})
export class AppRoutingModule {}
