import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {Observable} from 'rxjs';

@Component({
  selector: 'media-query-status',
  template: `
    <div class="mqInfo" *ngIf="media$ | async as event">
      <span title="Active MediaQuery">{{  extractQuery(event) }}</span>
    </div>
  `,
  styleUrls: ['./media-query-status.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class MediaQueryStatusComponent {
  media$: Observable<MediaChange> = this.mediaService.asObservable();

  constructor(private mediaService: ObservableMedia) {}

  extractQuery(change: MediaChange): string {
    return change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
  }
}
