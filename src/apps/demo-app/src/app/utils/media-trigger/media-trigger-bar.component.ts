import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MediaTriggerService} from './media-trigger.service';

// tslint:disable-line:max-line-length
@Component({
  selector: 'media-trigger-bar',
  template: `
    <div fxLayout="row"
           fxLayoutGap="20px"
           style="height:40px; min-height:40px;">
      <button mat-button color="primary" (click)="adaptTo('xs')"> XS </button>
      <button mat-button color="primary" (click)="adaptTo('web.landscape, gt-md')">
        Web Landscape
      </button>
      <button mat-button color="primary" (click)="adaptTo('print')"> Print </button>
      <button mat-button color="primary" (click)="media.restore()"> Restore() </button>
    </div>
  `,
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class MediaTriggerBarComponent {
  constructor(public media: MediaTriggerService) {
  }

  adaptTo(query: string) {
    this.media.activate([...query.split(',')]);
  }
}
