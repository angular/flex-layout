import {Component} from '@angular/core';

@Component({
  selector: 'demo-github-issues',
  template: `
    <demo-issue-266 class="small-demo"></demo-issue-266>
    <demo-issue-5345 class="small-demo"></demo-issue-5345>
    <demo-issue-9897 class="small-demo"></demo-issue-9897>
    <demo-issue-135 class="small-demo"></demo-issue-135>
    <demo-issue-181 class="small-demo"></demo-issue-181>
    <demo-issue-197 class="small-demo"></demo-issue-197>
  `
})
export class GithubIssuesComponent {}
