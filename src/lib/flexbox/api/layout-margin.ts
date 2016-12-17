import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer,
  SimpleChanges, AfterContentInit,
} from '@angular/core';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';



/**
 * 'layout-margin' styling directive
 *  Defines padding of child elements in a layout container
 */
@Directive({selector: `
  [fx-layout-margin],
  [fx-layout-margin.xs]
  [fx-layout-margin.gt-xs],
  [fx-layout-margin.sm],
  [fx-layout-margin.gt-sm]
  [fx-layout-margin.md],
  [fx-layout-margin.gt-md]
  [fx-layout-margin.lg],
  [fx-layout-margin.gt-lg],
  [fx-layout-margin.xl]
`})
export class LayoutMarginDirective extends BaseFxDirective implements AfterContentInit, OnChanges {
  @Input('fx-layout-margin')       set margin(val)     { this._cacheInput('margin', val); }
  @Input('fx-layout-margin.xs')    set marginXs(val)   { this._cacheInput('marginXs', val); }
  @Input('fx-layout-margin.gt-xs') set marginGtXs(val) { this._cacheInput('marginGtXs', val); };
  @Input('fx-layout-margin.sm')    set marginSm(val)   { this._cacheInput('marginSm', val); };
  @Input('fx-layout-margin.gt-sm') set marginGtSm(val) { this._cacheInput('marginGtSm', val); };
  @Input('fx-layout-margin.md')    set marginMd(val)   { this._cacheInput('marginMd', val); };
  @Input('fx-layout-margin.gt-md') set marginGtMd(val) { this._cacheInput('marginGtMd', val); };
  @Input('fx-layout-margin.lg')    set marginLg(val)   { this._cacheInput('marginLg', val); };
  @Input('fx-layout-margin.gt-lg') set marginGtLg(val) { this._cacheInput('marginGtLg', val); };
  @Input('fx-layout-margin.xl')    set marginXl(val)   { this._cacheInput('marginXl', val); };

  constructor(monitor : MediaMonitor, elRef: ElementRef, renderer: Renderer ){
    super(monitor, elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges(changes: SimpleChanges) {
    if (changes['margin'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngAfterContentInit() {
    this._listenForMediaQueryChanges('margin', '0', (changes: MediaChange) =>{
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   *
   */
  private _updateWithValue(value?: string) {
    value = value || this._queryInput("margin") || '0';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    // For each `element` child, set the padding styles...
    this._applyStyleToElements(this._buildCSS(value), this.childrenNodes.filter( it => it.nodeType === 1));
  }

  private _buildCSS(value) {
    return { 'margin' : value };
  }

}
