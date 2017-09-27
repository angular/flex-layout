import {Component} from '@angular/core';

import {MediaChange} from '@angular/flex-layout';
import {ObservableMedia} from '@angular/flex-layout';
import {Observable} from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector : 'media-query-status',
  template : `
    <div class="mqInfo" *ngIf="change$ | async as change">
      <span title="Active MediaQuery">{{  buildMQInfo(change) }}</span>
    </div>
  `,
  styles: [
      ` .mqInfo {
      padding-left: 5px;
      margin-bottom: 5px;
      margin-top: 10px;
    }`,
      ` .mqInfo > span {
      padding-left: 0px;
      color: rgba(0, 0, 0, 0.54);
      font-size: 0.8em;
    }`,
      ` .mqInfo > span:before {
      content: attr(title) ': ';
    }`
  ]
})
export class MediaQueryStatus {
  change$: Observable<MediaChange> = this.media$.asObservable();

  constructor(private media$: ObservableMedia) {
  }

  buildMQInfo(change: MediaChange): string {
    if (change.mediaQuery.indexOf('orientation') > -1) {
      return '';
    }
    return change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
  }
}
