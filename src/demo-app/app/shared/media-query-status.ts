import {ChangeDetectionStrategy, Component} from '@angular/core';

import {MediaChange} from '@angular/flex-layout';
import {ObservableMedia} from '@angular/flex-layout';
import {Observable} from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector : 'media-query-status',
  template : `
    <div class="mqInfo" *ngIf="media$ | async as event">
      <span title="Active MediaQuery">{{  extractQuery(event) }}</span>
    </div>
  `,
  styles: [
      ` .mqInfo {
      padding-left: 25px;
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
  ],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class MediaQueryStatus {
  media$: Observable<MediaChange> = this.mediaService.asObservable();

  constructor(private mediaService: ObservableMedia) {
  }

  extractQuery(change: MediaChange): string {
    return change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
  }
}
