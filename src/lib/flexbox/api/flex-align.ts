/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
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
  Renderer,
  SimpleChanges,
} from '@angular/core';

import {BaseFxDirective} from './base';
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
  [fxFlexAlign.xs],
  [fxFlexAlign.gt-xs],
  [fxFlexAlign.sm],
  [fxFlexAlign.gt-sm],
  [fxFlexAlign.md],
  [fxFlexAlign.gt-md],
  [fxFlexAlign.lg],
  [fxFlexAlign.gt-lg],
  [fxFlexAlign.xl]
`
})
export class FlexAlignDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  @Input('fxFlexAlign')       set align(val) {
    this._cacheInput('align', val);
  }

  @Input('fxFlexAlign.xs')    set alignXs(val) {
    this._cacheInput('alignXs', val);
  }

  @Input('fxFlexAlign.gt-xs') set alignGtXs(val) {
    this._cacheInput('alignGtXs', val);
  };

  @Input('fxFlexAlign.sm')    set alignSm(val) {
    this._cacheInput('alignSm', val);
  };

  @Input('fxFlexAlign.gt-sm') set alignGtSm(val) {
    this._cacheInput('alignGtSm', val);
  };

  @Input('fxFlexAlign.md')    set alignMd(val) {
    this._cacheInput('alignMd', val);
  };

  @Input('fxFlexAlign.gt-md') set alignGtMd(val) {
    this._cacheInput('alignGtMd', val);
  };

  @Input('fxFlexAlign.lg')    set alignLg(val) {
    this._cacheInput('alignLg', val);
  };

  @Input('fxFlexAlign.gt-lg') set alignGtLg(val) {
    this._cacheInput('alignGtLg', val);
  };

  @Input('fxFlexAlign.xl')    set alignXl(val) {
    this._cacheInput('alignXl', val);
  };

  constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer) {
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
    this._listenForMediaQueryChanges('align', 'stretch', (changes: MediaChange) => {
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  private _updateWithValue(value?: string|number) {
    value = value || this._queryInput("align") || 'stretch';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }

  private _buildCSS(align) {
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
