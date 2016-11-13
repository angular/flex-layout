import {Directive, ElementRef, Renderer} from '@angular/core';
import {BaseStyleDirective} from './abstract';


/**
 * 'fx-flex-fill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: [fx-flexFill] is NOT responsive fx-flex
 */
@Directive({selector: '[fx-flex-fill]'})
export class FlexFillDirective extends BaseStyleDirective {
  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer);
    this._updateStyle(this._buildCSS());
  }

  _buildCSS() {
    return {
      'margin': 0,
      'width': '100%',
      'height': '100%',
      'min-width': '100%',
      'min-height': '100%'
    };
  }
}
