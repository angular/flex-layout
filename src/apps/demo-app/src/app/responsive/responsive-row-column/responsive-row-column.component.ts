import {Component, OnDestroy} from '@angular/core';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';

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

  private _activeMQC: MediaChange;
  private _watcher;

  constructor(private _media$: ObservableMedia) {
    this._watcher = this._media$
      .subscribe((e: MediaChange) => {
        this._activeMQC = e;
      });
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }

  toggleLayoutFor(col: number) {
    switch (col) {
      case 1:
        const set1 = `firstCol${this._activeMQC ? this._activeMQC.suffix : ''}`;
        this.cols[set1] = (this.cols[set1] === 'column') ? 'row' : 'column';
        break;

      case 2:
        const set2 = 'secondCol';
        this.cols[set2] = (this.cols[set2] === 'row') ? 'column' : 'row';
        break;
    }
  }
}
