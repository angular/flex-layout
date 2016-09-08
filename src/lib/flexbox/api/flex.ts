import {
  NgModule,
  Directive, Input, ElementRef, Renderer,
  SimpleChanges, Optional, OnChanges, OnDestroy
} from '@angular/core';

import { BaseStyleDirective } from "./_styleDirective";
import { LayoutDirective } from "./layout";
import { Subscription } from "rxjs/Subscription";


/**
 * FlexBox styling directive for 'flex'
 * Configures the width/height sizing of the element within a layout container
 */
@Directive({
  selector:'[flex]',
})
export class FlexDirective extends BaseStyleDirective implements OnChanges, OnDestroy {
  private _layout = 'row';   // default flex-direction
  private _layoutWatcher : Subscription;

  @Input() shrink:number = 1;
  @Input() grow:number = 1;
  @Input() flex:string;

  constructor(@Optional() public container:LayoutDirective, public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer);
    if (container) {
      // Subscribe to layout parent direction changes
      // @TODO - the element with the Layout directive must be an immediate parent.
      this._layoutWatcher = container.onLayoutChange.subscribe(this._onLayoutChange.bind(this));
    }
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * For any @Input changes, delegate to the onLayoutChange()
   */
  ngOnChanges( changes?:SimpleChanges ) {
    this._onLayoutChange(this._layout);
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
    this._layout = direction;
    this._updateStyle(this._buildCSS());
  }

  /**
   * Build the CSS that should be assigned to the element instance
   *
   *  BUG - min-height on a column flex container won’t apply to its flex item children in IE 10-11.
   *  Use height instead if possible.
   */
  _buildCSS() {
    return this._modernizer(this._validateValue( this.grow, this.shrink, this.flex));
  }

  /**
   * Validate the value to be one of the acceptable value options
   * Use default fallback of "row"
   */
  _validateValue(grow, shrink, basis) {
    let css, direction = (this._layout === 'column') || (this._layout == "column-reverse") ? 'column': 'row';

    switch(basis || "") {
       case ""      : css = { 'flex'  : '1'        }; break;
       case GROW    : css = { 'flex'  : "1 1 100%" }; break;
       case INITIAL : css = { 'flex'  : "0 1 auto" }; break;    // default
       case AUTO    : css = { 'flex'  : "1 1 auto" }; break;
       case NONE    : css = { 'flex'  : "0 0 auto" }; break;

       default      :
         let isPercent = String(basis).indexOf("%")  > -1;
         let isPx      = String(basis).indexOf("px") > -1;

         // Defaults to percentage sizing unless `px` is explicitly set
         if (!isPx && !isPercent && !isNaN(basis))  basis = basis + '%';
         if ( basis === "0px" )                     basis = "0%";

         css = {
           'flex' : `${grow} ${shrink} ${basis}`,
           'max-width'  : (direction == "row") ? basis : '100%',
           'max-height' : (direction == "row") ? '100%' : basis
         };
         break;
     }
     return Object.assign(css, { 'box-sizing' : 'border-box' });
   }
}

/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 */
@Directive({
  selector:'[flex-order]',
})
export class FlexOrderDirective extends BaseStyleDirective implements OnChanges {
  @Input('flex-order') order:number;

  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer);
  }

  ngOnChanges( changes?:SimpleChanges ) {
    this._updateStyle(this._buildCSS(this.order));
  }

  _buildCSS(value) {
    value = parseInt(value, 10);
    return this._modernizer({
      order : isNaN(value) ? 0 : value
    });
  }
}

/**
 * 'flex-offset' flexbox styling directive
 * Configures the margin-left of the element in a layout container
 */
@Directive({
  selector:'[flex-offset]',
})
export class FlexOffsetDirective extends BaseStyleDirective implements OnChanges {
  @Input('flex-offset') offset:number;

  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer);
  }

  ngOnChanges( changes?:SimpleChanges ) {
    this._updateStyle(this._buildCSS( this.offset ));
  }

  _buildCSS(offset) {
    let isPercent = String(offset).indexOf("%")  > -1;
    let isPx      = String(offset).indexOf("px") > -1;
    if (!isPx && !isPercent && !isNaN(offset))  offset = offset + '%';

    return this._modernizer({
      'margin-left' : `${offset}`
    });
  }
}

/**
 * 'flex-fill' flexbox styling directive
 * Maximizes width and height of element in a layout container
 */
@Directive({
  selector: '[flex-fill]'
})
export class FlexFillDirective extends BaseStyleDirective {
  constructor(public elRef: ElementRef, public renderer: Renderer) {
    super(elRef, renderer);

    this._updateStyle( this._buildCSS() );
  }

  _buildCSS() {
    return this._modernizer({
      'margin'    : 0,
      'width'     : '100%',
      'min-width' : '100%',  // @TODO confirm
      'min-height': '100%',
      'height'    : '100%'
    });
  }
}

/**
 * *****************************************************************
 * Define module for all Layout API - Flex directives
 * *****************************************************************
 */

@NgModule({
  exports: [
    FlexDirective,
    FlexOrderDirective,
    FlexOffsetDirective,
    FlexFillDirective
  ],
  declarations: [
    FlexDirective,
    FlexOrderDirective,
    FlexOffsetDirective,
    FlexFillDirective
  ],
})
export class NgFlexModule { }



// ************************************************************
// Private static variables
// ************************************************************

const GROW      = "grow";
const INITIAL   = "initial";
const AUTO      = "auto";
const NONE      = "none";
