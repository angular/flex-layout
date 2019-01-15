import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {MediaChange, MediaObserver} from '@angular/flex-layout';

@Component({
  selector: 'media-query-status',
  styleUrls: ['./media-query-status.component.scss'],
  template: `
    <div class="mqInfo">
      Active MediaQuery(s):
      <ul>
        <li *ngFor="let change of (media$ | async) as changes">
          {{change.mqAlias}} = {{change.mediaQuery}}
        </li>
      </ul>
    </div>
  `,
})
export class MediaQueryStatusComponent {
  media$: Observable<MediaChange[]>;

  constructor(media: MediaObserver) {
    this.media$ = media.asObservable();
  }
}
