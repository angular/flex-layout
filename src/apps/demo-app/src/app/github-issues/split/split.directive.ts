import {
  AfterContentInit,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import {FlexDirective} from '@angular/flex-layout';
import {Subscription} from 'rxjs';

import {SplitHandleDirective} from './split-handle.directive';
import {SplitAreaDirective} from './split-area.directive';


@Directive({
  selector: '[ngxSplit]',
  host: {
    class: 'ngx-split'
  }
})
export class SplitDirective implements AfterContentInit, OnDestroy {
  @Input('ngxSplit') direction = 'row';
  @ContentChild(SplitHandleDirective, {static: true}) handle: SplitHandleDirective;
  @ContentChildren(SplitAreaDirective) areas: QueryList<SplitAreaDirective>;

  private watcher: Subscription;

  constructor(private elementRef: ElementRef) {}

  ngAfterContentInit(): void {
    this.watcher = this.handle.drag.subscribe(this.onDrag.bind(this));
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  /**
   * While dragging, continually update the `flex.activatedValue` for each area
   * managed by the splitter.
   */
  onDrag({x, y}: {x: number, y: number}): void {
    const dragAmount = (this.direction === 'row') ? x : y;

    this.areas.forEach((area, i) => {
      // get the cur flex and the % in px
      const flex = (area.flex as FlexDirective);
      const delta = (i === 0) ? dragAmount : -dragAmount;
      const currentValue = flex.activatedValue;

      // Update Flex-Layout value to build/inject new flexbox CSS
      flex.activatedValue = `${this.calculateSize(currentValue, delta)}`;
    });
  }

  /**
   * Use the pixel delta change to recalculate the area size (%)
   * Note: flex value may be '', %, px, or '<grow> <shrink> <basis>'
   */
  calculateSize(value: string, delta: number): number {
    const containerSizePx = this.elementRef.nativeElement.clientWidth;
    const elementSizePx = Math.round(valueToPixel(value, containerSizePx));

    const elementSize = ((elementSizePx + delta) / containerSizePx) * 100;
    return Math.round(elementSize * 100) / 100;
  }
}

/** Convert the pixel or percentage value to a raw pixel float value */
function valueToPixel(value: string, parentWidth: number): number {
  const size = parseFloat(value);
  return !value.includes('px') ? parentWidth * (size / 100) : size;
}
