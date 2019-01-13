import {Directive, ElementRef, Inject, Output} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {fromEvent, Observable} from 'rxjs';
import {map, switchMap, takeUntil, tap} from 'rxjs/operators';

@Directive({
  selector: '[ngxSplitHandle]',
  host: {
    class: 'ngx-split-handle',
    title: 'Drag to resize'
  }
})
export class SplitHandleDirective {
  @Output() drag: Observable<{ x: number, y: number }>;

  constructor(ref: ElementRef, @Inject(DOCUMENT) _document: any) {
    let prevX = 0;
    let prevY = 0;
    const getMouseEventPosition = (event: MouseEvent) => {
      const movement = {x: event.screenX - prevX, y: event.screenY - prevY};
      prevX = event.screenX;
      prevY = event.screenY;
      return movement;
    };

    const mousedown$ = fromEvent(ref.nativeElement, 'mousedown').pipe(map(getMouseEventPosition));
    const mousemove$ = fromEvent(_document, 'mousemove').pipe(map(getMouseEventPosition));
    const mouseup$ = fromEvent(_document, 'mouseup').pipe(
      tap(() => {
        prevX = 0;
        prevY = 0;
      }),
      map(getMouseEventPosition)
    );

    this.drag = mousedown$.pipe(switchMap(() => mousemove$.pipe(takeUntil(mouseup$))));
  }
}
