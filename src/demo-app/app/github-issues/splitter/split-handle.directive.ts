import {Directive, ElementRef, Inject, Output} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {Observable} from 'rxjs/Observable';

import {fromEvent} from 'rxjs/observable/fromEvent';
import {map} from 'rxjs/operators/map';
import {switchMap} from 'rxjs/operators/switchMap';
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

  constructor(ref: ElementRef, @Inject(DOCUMENT) _document: any) {
    const getMouseEventPosition = (event: MouseEvent) => ({x: event.movementX, y: event.movementY});

    const mousedown$ = fromEvent(ref.nativeElement, 'mousedown').pipe(map(getMouseEventPosition));
    const mousemove$ = fromEvent(_document, 'mousemove').pipe(map(getMouseEventPosition));
    const mouseup$ = fromEvent(_document, 'mouseup').pipe(map(getMouseEventPosition));

    this.drag = mousedown$.pipe(switchMap(_ => mousemove$.pipe(takeUntil(mouseup$))));
  }

}
