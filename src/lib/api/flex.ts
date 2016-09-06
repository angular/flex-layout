import { NgModule, Directive, Input, HostBinding } from '@angular/core';


/**
 *
 */
@Directive({
  selector:'[flex]'
})
export class FlexDirective {
    @Input() shrink:number = 1;
    @Input() grow:number = 1;
    @Input() flex:string;

    @HostBinding('style.flex')
    get style_flex(){
        let basis = (this.flex === '') ? '0' : this.flex;
        return `${this.grow} ${this.shrink} ${basis}%`;
    }

    @HostBinding('style.max-width')
    get maxWidth() {
      let basis = (this.flex === '') ? '100' : this.flex;
      return `${basis}%`
    }

    @HostBinding('style.max-height')
    get maxHeight() {
      let basis = 100;
      return `${basis}%`
    }
}

/**
 * Define module for all Layout API - Flex directives
 */

@NgModule({
  exports: [
    FlexDirective
  ],
  declarations: [
    FlexDirective
  ],
})
export class NgFlexModule { }
