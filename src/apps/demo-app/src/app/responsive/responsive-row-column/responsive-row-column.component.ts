import {Component, OnDestroy} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {Subscription} from 'rxjs';

@Component({
  selector: 'demo-responsive-row-column',
  templateUrl: './responsive-row-column.component.html'
})
export class ResponsiveRowColumnComponent implements OnDestroy {
  cols: {[key: string]: string} = {
    firstCol: 'row',
    firstColXs: 'column',
    firstColMd: 'column',
    firstColLg: 'invalid',
    firstColGtLg: 'column',
    secondCol: 'column'
  };
  isVisible = true;

  private activeMQC: MediaChange;
  private subscription: Subscription;

  constructor(mediaService: MediaObserver) {
    this.subscription = mediaService.asObservable()
      .subscribe((e: MediaChange) => {
        this.activeMQC = e;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleLayoutFor(col: number) {
    switch (col) {
      case 1:
        const set1 = `firstCol${this.activeMQC ? this.activeMQC.suffix : ''}`;
        this.cols[set1] = (this.cols[set1] === 'column') ? 'row' : 'column';
        break;

      case 2:
        const set2 = 'secondCol';
        this.cols[set2] = (this.cols[set2] === 'row') ? 'column' : 'row';
        break;
    }
  }
}
