import {
  NgModule,
  Directive, Renderer, ElementRef, Input, OnChanges, SimpleChanges
} from '@angular/core';

export type StyleUpdateFn = (el:any,key:string,value:string) => { };

/**
 *
 */
@Directive({
  selector: '[layout]'
})
export class LayoutDirective implements OnChanges{
  @Input() layout:any;

  elStyle : StyleUpdateFn;

  constructor(public el: ElementRef, public renderer: Renderer) {
    this.el = el.nativeElement;
    this.elStyle = this.renderer.setElementStyle.bind(this.renderer);
  }

  ngOnChanges(changes:SimpleChanges) {
    let direction = (this.layout === 'column') ? 'column':'row';

    this.elStyle(this.el, 'display'       , 'flex');
    this.elStyle(this.el, 'flex-direction', direction);
  }
}

/**
 * Define module for all Layout API - Layout directives
 */

@NgModule({
  exports: [
    LayoutDirective
  ],
  declarations: [
    LayoutDirective
  ],
})
export class NgLayoutModule { }
