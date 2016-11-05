import {Component} from '@angular/core';

@Component({
    selector: 'demos-github-issues',
    template: `
        <demo-issue-5345></demo-issue-5345>
        <demo-issue-9897></demo-issue-9897>
    `
})
export class DemosGithubIssues { }

import {NgModule}            from '@angular/core';
import {CommonModule}        from "@angular/common";

import {MaterialModule}      from "@angular/material";
import {FlexLayoutModule}       from "../../../lib/flexbox/flexbox-module";

import { DemoIssue5345 }     from "./issue.5345.demo";
import { DemoIssue9897 }     from "./issue.9897.demo";

@NgModule({
  declarations : [
    DemosGithubIssues,      // used by the Router with the root app component
    DemoIssue5345,
    DemoIssue9897
  ],
  imports : [
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class DemosGithubIssuesModule{ }
