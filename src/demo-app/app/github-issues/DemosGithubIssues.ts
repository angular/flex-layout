import {Component} from '@angular/core';

@Component({
  selector: 'demos-github-issues',
  template: `
      <demo-issue-5345></demo-issue-5345>
      <demo-issue-9897></demo-issue-9897>
      <demo-issue-135> </demo-issue-135>
      <demo-issue-181></demo-issue-181>
      <demo-issue-197></demo-issue-197>
  `
})
export class DemosGithubIssues {
}

import {NgModule}         from '@angular/core';
import {CommonModule}     from "@angular/common";
import {MaterialModule}   from "@angular/material";
import {FlexLayoutModule} from "../../../lib";     // `gulp build:components` to deploy to node_modules manually

import {DemoIssue5345}    from "./issue.5345.demo";
import {DemoIssue9897}    from "./issue.9897.demo";
import {DemoIssue135}     from "./issue.135.demo";
import {DemoIssue181}     from './issue.181.demo';
import {DemoIssue197}     from './issue.197.demo';

@NgModule({
  declarations: [
    DemosGithubIssues,      // used by the Router with the root app component
    DemoIssue5345,
    DemoIssue9897,
    DemoIssue135,
    DemoIssue181,
    DemoIssue197
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class DemosGithubIssuesModule {
}
