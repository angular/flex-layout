import {Directive, ElementRef, Inject, Output, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

import {Observable} from 'rxjs/Observable';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {switchMap} from 'rxjs/operators/switchMap';
import {map} from 'rxjs/operators/map';
import {takeUntil} from 'rxjs/operators/takeUntil';


@Directive({
  selector: '[ngxSplitHandle]',
  host: {
    class: 'ngx-split-handle',
    title: 'Drag to resize'
  }
})
export class SplitHandleDirective {

  @Output() drag: Observable<{ x: number, y: number }>;

  constructor(
    ref: ElementRef,
    @Inject(DOCUMENT) _document: any,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    const getMouseEventPosition = (event: MouseEvent) => ({x: event.movementX, y: event.movementY});

   if ( isPlatformBrowser(PLATFORM_ID) ) {
    /* tslint:disable */
    const mousedown$ = fromEvent(ref.nativeElement, 'mousedown').pipe(map(getMouseEventPosition));
    const mousemove$ = fromEvent(_document, 'mousemove').pipe(map(getMouseEventPosition));
    const mouseup$ = fromEvent(_document, 'mouseup').pipe(map(getMouseEventPosition));

    /* tslint:enable*/
    this.drag = mousedown$.pipe(switchMap(_ => mousemove$.pipe(takeUntil(mouseup$))));
   }

  }

}
