import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {MediaChange} from '@angular/flex-layout';
import {ObservableMedia} from '@angular/flex-layout';

@Component({
  moduleId: module.id,
  selector : 'media-query-status',
  template : `
    <div class="mqInfo" >
      <span title="Active MediaQuery">{{  activeMediaQuery }}</span>
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
export class MediaQueryStatus implements OnDestroy, OnInit {
  private _watcher: Subscription;
  activeMediaQuery: string;

  constructor(private media$: ObservableMedia) {

  }

  ngOnInit() {
    this.watchMediaQueries();
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }

  private watchMediaQueries() {
    this._watcher = this.media$.subscribe((change: MediaChange) => {
      if (change.mediaQuery.indexOf('orientation') > -1) { return; }
      let value = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      this.activeMediaQuery = value;
    });
  }
}
