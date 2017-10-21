import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {MediaChange} from '@angular/flex-layout';
import {ObservableMedia} from '@angular/flex-layout';

@Component({
  moduleId: module.id,
  selector: 'demo-responsive-row-column',
  template: `
    <mat-card class="card-demo">
      <mat-card-title>Multiple Responsive Columns</mat-card-title>
      <mat-card-subtitle>Simple row with nested layout containers. Note: the 1st column is
        responsive.
      </mat-card-subtitle>
      <mat-card-content>
        <div class="containerX">

          <div class="colorNested box" fxLayout="row" *ngIf="isVisible">
            <div [fxLayout]="firstCol"
                 [fxLayout.xs]="firstColXs"
                 [fxLayout.md]="firstColMd"
                 [fxLayout.lg]="firstColLg"
                 [fxLayout.gt-lg]="firstColGtLg"
                 fxFlex="50%"
                 fxFlex.gt-sm="25"
                 fxHide.md
                 (click)="toggleLayoutFor(1)" style="cursor: pointer;">
              <div fxFlex>Col #1: First item in row</div>
              <div fxFlex>Col #1: Second item in row</div>
            </div>
            <div [fxLayout]="secondCol" fxFlex (click)="toggleLayoutFor(2)"
                 style="cursor: pointer;">
              <div fxFlex>Col #2: First item in column</div>
              <div fxFlex>Col #2: Second item in column</div>
            </div>
          </div>
        </div>
      </mat-card-content>
      <mat-card-footer style="width:95%; font-size: 0.9em; padding-left: 25px;">
        <div fxLayout="row" class="hint" fxLayoutAlign="space-around">
          <div>&lt;div fxLayout="{{ firstCol }}" fxFlex="50%" fxFlex.gt-sm="25%" fxHide.md &gt;
          </div>
          <div fxFlex></div>
          <div>&lt;div fxLayout="{{ secondCol }}" fxFlex &gt;</div>
        </div>
      </mat-card-footer>
    </mat-card>
  `
})
export class DemoResponsiveRows implements OnDestroy {
  private _activeMQC: MediaChange;
  private _watcher: Subscription;

  firstCol = 'row';
  firstColXs = 'column';
  firstColMd = 'column';
  firstColLg = 'invalid';
  firstColGtLg = 'column';

  secondCol = 'column';

  isVisible = true;

  constructor(private _media$: ObservableMedia) {
    this._watcher = this._media$
        .subscribe((e: MediaChange) => {
          this._activeMQC = e;
        });
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }

  toggleLayoutFor(col) {
    switch (col) {
      case 1:

        col = `firstCol${this._activeMQC ? this._activeMQC.suffix : ''}`;
        this[col] = (this[col] === 'column') ? 'row' : 'column';
        break;

      case 2:
        col = 'secondCol';
        this[col] = (this[col] == 'row') ? 'column' : 'row';
        break;
    }
  }
}
