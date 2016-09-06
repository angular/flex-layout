import {
  NgModule,
  Directive, Renderer, ElementRef, Input, OnChanges, SimpleChanges
} from '@angular/core';

import { StyleBaseDirective } from "../StyleBaseDirective";

// ************************************************************
// Private static variables
// ************************************************************

const COLUMN = "column";
const ROW = "row";
const LAYOUT_VALUES = [ ROW, COLUMN ];

/**
 * Flexbox Styling directive for 'layout'
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

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges( changes:SimpleChanges ) {
    let direction = (this.layout === 'column') ? 'column':'row';
    this._updateStyle(this._buildCSS(direction));
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    /**
     *  BUG - min-height on a column flex container won’t apply to its flex item children in IE 10-11.
     *  Use height instead if possible.
     */
    return this._modernizer({
      'display'         : 'flex',
      'box-sizing'      : 'border-box',
      'flex-direction'  : this._validateValue(value)
    });
  }

  /**
   * Validate the value to be one of the acceptable value options
   * Use default fallback of "row"
   */
  _validateValue(value) {
    return LAYOUT_VALUES.find(x => x === value) ? value : LAYOUT_VALUES[0];  // "row"
  }

}


/**
 * Flexbox Styling directive for 'layout-wrap'
 */
@Directive({
  selector: '[layout-wrap]'
})
export class LayoutWrapDirective extends StyleBaseDirective implements OnChanges{
  @Input('layout-wrap')
  wrap : string = 'wrap';

  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer)
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges( changes:SimpleChanges ) {
    this._updateStyle( this._buildCSS(this.wrap || 'wrap') );
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    return this._modernizer({
      'flex-wrap' : this._validateValue(value)
    });
  }
  
  /**
   * Convert layout-wrap="<value>" to expected flex-wrap style
   */
  _validateValue( value ) {
    switch(value) {

      case "reverse":
      case "wrap-reverse":
        value = "wrap-reverse";
        break;

      case "no":
      case "none":
      case "nowrap":
        value = "nowrap";
        break;

      // All other values fallback to "wrap"
      default :
        value = "wrap";
        break;
    }
    return value;
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
