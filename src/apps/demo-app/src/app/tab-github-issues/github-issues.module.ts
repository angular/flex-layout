import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';

import {GithubIssuesComponent} from './github-issues/github-issues.component';
import {Issue266Component} from './issue-266/issue-266.component';
import {SplitModule} from '../utils';
import {Issue5345Component} from './issue-5345/issue-5345.component';
import {Issue9897Component} from './issue-9897/issue-9897.component';
import {Issue135Component} from './issue-135/issue-135.component';
import {Issue181Component} from './issue-181/issue-181.component';
import {Issue197Component} from './issue-197/issue-197.component';
import {GithubIssuesRoutingModule} from './github-issues-routing.module';
import {DemoUtilsModule} from '../utils/demo-utils.module';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    FormsModule,

    GithubIssuesRoutingModule,
    SplitModule,
    DemoUtilsModule,
  ],
  declarations: [
    GithubIssuesComponent,
    Issue266Component,
    Issue5345Component,
    Issue9897Component,
    Issue135Component,
    Issue181Component,
    Issue197Component
  ]
})
export class DocsGithubIssuesModule {}
