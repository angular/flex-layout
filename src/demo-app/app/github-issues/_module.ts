import {Component} from '@angular/core';

@Component({
  selector: 'demos-github-issues',
  template: `
    <demo-issue-266 class="small-demo"></demo-issue-266>
    <demo-issue-5345 class="small-demo"></demo-issue-5345>
    <demo-issue-9897 class="small-demo"></demo-issue-9897>
    <demo-issue-135 class="small-demo"></demo-issue-135>
    <demo-issue-181 class="small-demo"></demo-issue-181>
    <demo-issue-197 class="small-demo"></demo-issue-197>
  `
})
export class DemosGithubIssues {
}

import {NgModule} from '@angular/core';
import {SplitModule} from './splitter/split.module';

import {DemoIssue5345} from './issue.5345.demo';
import {DemoIssue9897} from './issue.9897.demo';
import {DemoIssue135} from './issue.135.demo';
import {DemoIssue181} from './issue.181.demo';
import {DemoIssue197} from './issue.197.demo';
import {DemoIssue266} from './issue.266.demo';
import {SharedModule} from '../shared/_module';


@NgModule({
  declarations: [
    DemosGithubIssues,      // used by the Router with the root app component
    DemoIssue5345,
    DemoIssue9897,
    DemoIssue135,
    DemoIssue181,
    DemoIssue197,
    DemoIssue266
  ],
  imports: [
    SharedModule, SplitModule
  ]
})
export class DemosGithubIssuesModule {
}
