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
  [fx-layout-gap],
  [fx-layout-gap.xs]
  [fx-layout-gap.gt-xs],
  [fx-layout-gap.sm],
  [fx-layout-gap.gt-sm]
  [fx-layout-gap.md],
  [fx-layout-gap.gt-md]
  [fx-layout-gap.lg],
  [fx-layout-gap.gt-lg],
  [fx-layout-gap.xl]
`})
export class LayoutGapDirective extends BaseFxDirective implements AfterContentInit, OnChanges {
  @Input('fx-layout-gap')       set gap(val)     { this._cacheInput('gap', val); }
  @Input('fx-layout-gap.xs')    set gapXs(val)   { this._cacheInput('gapXs', val); }
  @Input('fx-layout-gap.gt-xs') set gapGtXs(val) { this._cacheInput('gapGtXs', val); };
  @Input('fx-layout-gap.sm')    set gapSm(val)   { this._cacheInput('gapSm', val); };
  @Input('fx-layout-gap.gt-sm') set gapGtSm(val) { this._cacheInput('gapGtSm', val); };
  @Input('fx-layout-gap.md')    set gapMd(val)   { this._cacheInput('gapMd', val); };
  @Input('fx-layout-gap.gt-md') set gapGtMd(val) { this._cacheInput('gapGtMd', val); };
  @Input('fx-layout-gap.lg')    set gapLg(val)   { this._cacheInput('gapLg', val); };
  @Input('fx-layout-gap.gt-lg') set gapGtLg(val) { this._cacheInput('gapGtLg', val); };
  @Input('fx-layout-gap.xl')    set gapXl(val)   { this._cacheInput('gapXl', val); };

  constructor(monitor : MediaMonitor, elRef: ElementRef, renderer: Renderer ){
    super(monitor, elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gap'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngAfterContentInit() {
    this._listenForMediaQueryChanges('gap', '0', (changes: MediaChange) =>{
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
    let items = this.childrenNodes
          .filter( el => (el.nodeType === 1))   // only Element types
          .filter( (el, j) => j > 0 );          // skip first element since gaps are needed
    this._applyStyleToElements(this._buildCSS(value), items );
  }

  private _buildCSS(value) {
    return { 'margin-left' : value };
  }

}
