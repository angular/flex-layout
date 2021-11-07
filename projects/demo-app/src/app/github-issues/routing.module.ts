import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {GithubIssuesComponent} from './github-issues/github-issues.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: GithubIssuesComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class RoutingModule {}
