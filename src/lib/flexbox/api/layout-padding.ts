import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer,
  SimpleChanges, AfterContentInit,
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';

/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
@Directive({selector: `
  [fx-layout-padding],
  [fx-layout-padding.xs]
  [fx-layout-padding.gt-xs],
  [fx-layout-padding.sm],
  [fx-layout-padding.gt-sm]
  [fx-layout-padding.md],
  [fx-layout-padding.gt-md]
  [fx-layout-padding.lg],
  [fx-layout-padding.gt-lg],
  [fx-layout-padding.xl]
`})
export class LayoutPaddingDirective extends BaseFxDirective implements AfterContentInit, OnChanges {
  @Input('fx-layout-padding')       set padding(val)     { this._cacheInput('padding', val); }
  @Input('fx-layout-padding.xs')    set paddingXs(val)   { this._cacheInput('paddingXs', val); }
  @Input('fx-layout-padding.gt-xs') set paddingGtXs(val) { this._cacheInput('paddingGtXs', val); };
  @Input('fx-layout-padding.sm')    set paddingSm(val)   { this._cacheInput('paddingSm', val); };
  @Input('fx-layout-padding.gt-sm') set paddingGtSm(val) { this._cacheInput('paddingGtSm', val); };
  @Input('fx-layout-padding.md')    set paddingMd(val)   { this._cacheInput('paddingMd', val); };
  @Input('fx-layout-padding.gt-md') set paddingGtMd(val) { this._cacheInput('paddingGtMd', val); };
  @Input('fx-layout-padding.lg')    set paddingLg(val)   { this._cacheInput('paddingLg', val); };
  @Input('fx-layout-padding.gt-lg') set paddingGtLg(val) { this._cacheInput('paddingGtLg', val); };
  @Input('fx-layout-padding.xl')    set paddingXl(val)   { this._cacheInput('paddingXl', val); };

  constructor(monitor : MediaMonitor, elRef: ElementRef, renderer: Renderer ){
    super(monitor, elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges(changes: SimpleChanges) {
    if (changes['padding'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngAfterContentInit() {
    this._listenForMediaQueryChanges('padding', '0', (changes: MediaChange) =>{
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
    value = value || this._queryInput("padding") || '0';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    // For each `element` child, set the padding styles...
    this._applyStyleToElements(this._buildCSS(value), this.childrenNodes.filter( it => it.nodeType === 1));
  }

  private _buildCSS(value) {
    return { 'padding' : value };
  }

}
