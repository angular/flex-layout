import {
  NgModule,
  Directive, Renderer, ElementRef, Input, OnChanges, SimpleChanges
} from '@angular/core';

import { StyleBaseDirective } from "../StyleBaseDirective";

/**
 *
 */
@Directive({
  selector: '[layout]'
})
export class LayoutDirective extends StyleBaseDirective implements OnChanges{
  @Input()
  layout : string = 'row';

  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer)
  }

  ngOnChanges( changes:SimpleChanges ) {
    let direction = (this.layout === 'column') ? 'column':'row';

    this.updateStyle( 'display'       , 'flex' );
    this.updateStyle( 'flex-direction', direction );
  }
}


/**
 *
 */
@Directive({
  selector: '[layout-wrap]'
})
export class LayoutWrapDirective extends StyleBaseDirective implements OnChanges{
  @Input()
  wrap : string = 'wrap';

  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer)
  }

  ngOnChanges( changes:SimpleChanges ) {
    this.updateStyle( 'flex-wrap' , this.wrap || 'wrap');
  }
}

/**
 * Define module for all Layout API - Layout directives
 */

@NgModule({
  exports: [
    LayoutDirective,
    LayoutWrapDirective
  ],
  declarations: [
    LayoutDirective,
    LayoutWrapDirective
  ],
})
export class NgLayoutModule { }
