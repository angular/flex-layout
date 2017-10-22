/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

import {BaseFxDirective} from '../core/base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';

/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
@Directive({
  selector: `
  [fxFlexAlign],
  [fxFlexAlign.xs], [fxFlexAlign.sm], [fxFlexAlign.md], [fxFlexAlign.lg], [fxFlexAlign.xl],
  [fxFlexAlign.lt-sm], [fxFlexAlign.lt-md], [fxFlexAlign.lt-lg], [fxFlexAlign.lt-xl],
  [fxFlexAlign.gt-xs], [fxFlexAlign.gt-sm], [fxFlexAlign.gt-md], [fxFlexAlign.gt-lg]
`
})
export class FlexAlignDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('fxFlexAlign')       set align(val)  { this._cacheInput('align', val);  };
  @Input('fxFlexAlign.xs')    set alignXs(val)  { this._cacheInput('alignXs', val);  };
  @Input('fxFlexAlign.sm')    set alignSm(val)  { this._cacheInput('alignSm', val); };
  @Input('fxFlexAlign.md')    set alignMd(val)  { this._cacheInput('alignMd', val); };
  @Input('fxFlexAlign.lg')    set alignLg(val)  { this._cacheInput('alignLg', val); };
  @Input('fxFlexAlign.xl')    set alignXl(val)  { this._cacheInput('alignXl', val); };

  @Input('fxFlexAlign.lt-sm') set alignLtSm(val) { this._cacheInput('alignLtSm', val); };
  @Input('fxFlexAlign.lt-md') set alignLtMd(val) { this._cacheInput('alignLtMd', val); };
  @Input('fxFlexAlign.lt-lg') set alignLtLg(val) { this._cacheInput('alignLtLg', val); };
  @Input('fxFlexAlign.lt-xl') set alignLtXl(val) { this._cacheInput('alignLtXl', val); };

  @Input('fxFlexAlign.gt-xs') set alignGtXs(val)  { this._cacheInput('alignGtXs', val); };
  @Input('fxFlexAlign.gt-sm') set alignGtSm(val)  { this._cacheInput('alignGtSm', val); };
  @Input('fxFlexAlign.gt-md') set alignGtMd(val)  { this._cacheInput('alignGtMd', val); };
  @Input('fxFlexAlign.gt-lg') set alignGtLg(val)  { this._cacheInput('alignGtLg', val); };

  /* tslint:enable */
  constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2) {
    super(monitor, elRef, renderer);
  }


  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * For @Input changes on the current mq activation property, see onMediaQueryChanges()
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['align'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    super.ngOnInit();

    this._listenForMediaQueryChanges('align', 'stretch', (changes: MediaChange) => {
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  protected _updateWithValue(value?: string|number) {
    value = value || this._queryInput('align') || 'stretch';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }

  protected _buildCSS(align) {
    let css = {};

    // Cross-axis
    switch (align) {
      case 'start':
        css['align-self'] = 'flex-start';
        break;
      case 'end':
        css['align-self'] = 'flex-end';
        break;
      default:
        css['align-self'] = align;
        break;
    }

    return css;
  }
}
