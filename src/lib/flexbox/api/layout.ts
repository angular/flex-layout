import {
  NgModule,
  Directive, Renderer, ElementRef, Input,
  SimpleChanges, Optional, OnChanges, OnDestroy,
} from '@angular/core';

import { BaseStyleDirective } from "./_styleDirective";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";

/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 */
@Directive({
  selector: '[layout]'
})
export class LayoutDirective extends BaseStyleDirective implements OnChanges {
  /**
   * Create Observable for nested/child 'flex' directives. This allows
   * child flex directives to subscribe/listen for flexbox direction changes.
   */
  private _layout: BehaviorSubject<string> = new BehaviorSubject<string>(this.layout);
  public onLayoutChange: Observable<string> = this._layout.asObservable();

  @Input() layout = 'row';

  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges( changes:SimpleChanges ) {
    let direction = this._validateValue(this.layout);
    this._updateStyle(this._buildCSS(direction));

    // Announce to subscribers a layout direction change
    this._layout.next(direction);
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
      'flex-direction'  : value
    });
  }

  /**
   * Validate the value to be one of the acceptable value options
   * Use default fallback of "row"
   */
  _validateValue(value) {
    value = value.toLowerCase();
    return LAYOUT_VALUES.find(x => x === value) ? value : LAYOUT_VALUES[0];  // "row"
  }

}


/**
 * 'layout-wrap' flexbox styling directive
 * Defines wrapping of child elements in layout container
 * Optional values: reverse, wrap-reverse, none, nowrap, wrap (default)
 */
@Directive({
  selector: '[layout-wrap]'
})
export class LayoutWrapDirective extends BaseStyleDirective implements OnChanges{
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
    switch(value.toLowerCase()) {

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
 * 'layout-align' flexbox styling directive
 *  Defines positioning of child elements along main and cross axis in a layout container
 *  Optional values: {main-axis} values or {main-axis cross-axis} value pairs
 */
@Directive({
  selector:'[layout-align]',
})
export class LayoutAlignDirective extends BaseStyleDirective implements OnChanges, OnDestroy {
  private _layout = 'row';   // default flex-direction
  private _layoutWatcher : Subscription;

  @Input('layout-align') align : string = "start stretch";

  constructor(@Optional() public container:LayoutDirective, public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer);

    if (container) {  // Subscribe to layout direction changes
      this._layoutWatcher = container.onLayoutChange
          .subscribe(this._onLayoutChange.bind(this));
    }
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges( changes?:SimpleChanges ) {
    this._updateStyle(this._buildCSS( this.align ));
  }

  ngOnDestroy(){
    this._layoutWatcher.unsubscribe();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Cache the parent container 'flex-direction' and update the 'flex' styles
   */
  _onLayoutChange(direction) {
    this._layout = direction.toLowerCase();
    if ( this._layout === 'column-reverse') this._layout = "column";

    this._stretchChildren(this.align, this._layout);
  }

  _buildCSS(align) {
    let css = { }, [ main_axis, cross_axis ] = align.split(" ");

    css['justify-content'] = "start";     // default
    css['align-items']     = "stretch";   // default
    css['align-content']   = "stretch";   // default

    // Main axis
    switch( main_axis ){
      case "center"        : css['justify-content'] = "center";        break;
      case "end"           : css['justify-content'] = "flex-end";      break;
      case "space-around"  : css['justify-content'] = "space-around";  break;
      case "space-between" : css['justify-content'] = "space-between"; break;
    }
    // Cross-axis
    switch( cross_axis ){
       case "start"   : css['align-items'] = css['align-content'] = "flex-start";   break;
       case "center"  : css['align-items'] = css['align-content'] = "center";       break;
       case "end"     : css['align-items'] = css['align-content'] = "flex-end";     break;
       case "baseline": css['align-items'] = "baseline";                            break;
    }

    return this._modernizer(css);
  }

   /**
    * Update element and immediate children to 'stretch' as needed...
    */
   _stretchChildren(align, layout) {
     const ELEMENT_NODE = 1;
     let [, cross_axis] = align.split(" ");

     if ( cross_axis == "stretch") {
       let css = { 'box-sizing': "border-box" };
       let key = (layout === 'column') ? 'max-width' : 'max-height';

           css[key] = '100%';

       this._updateStyle(this._modernizer(css));
     }
   }
}


/**
 * *****************************************************************
 * Define module for all Layout API - Layout directives
 * *****************************************************************
 */

@NgModule({
  exports: [
    LayoutDirective,
    LayoutWrapDirective,
    LayoutAlignDirective
  ],
  declarations: [
    LayoutDirective,
    LayoutWrapDirective,
    LayoutAlignDirective
  ],
})
export class NgLayoutModule { }

// ************************************************************
// Private static variables
// ************************************************************

const LAYOUT_VALUES = [ "row", "column", "row-reverse", "column-reverse" ];
const [ ROW, COLUMN, ROW_REVERSE, COLUMN_REVERSE ] = LAYOUT_VALUES;

