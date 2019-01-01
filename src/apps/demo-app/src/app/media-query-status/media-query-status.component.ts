import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Observable} from 'rxjs';

@Component({
  selector: 'media-query-status',
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
  styles: [`
    .mqInfo {
      padding-left: 25px;
      margin-bottom: 5px;
      margin-top: 10px;
    }

    .mqInfo > span {
      padding-left: 0;
      color: rgba(0, 0, 0, 0.54);
      font-size: 0.8em;
    }

    .mqInfo > span::before {
      content: attr(title) ': ';
    }
  `],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class MediaQueryStatusComponent {
  media$: Observable<MediaChange[]>;

  constructor(media: MediaObserver) {
    this.media$ = media.asObservable();
  }
}
