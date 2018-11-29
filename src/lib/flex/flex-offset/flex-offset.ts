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
  Optional,
  SimpleChanges,
  SkipSelf,
  Injectable,
} from '@angular/core';
import {Directionality} from '@angular/cdk/bidi';
import {
  BaseDirective,
  MediaChange,
  MediaMonitor,
  StyleBuilder,
  StyleDefinition,
  StyleUtils,
} from '@angular/flex-layout/core';
import {Subscription} from 'rxjs';

import {Layout, LayoutDirective} from '../layout/layout';
import {isFlowHorizontal} from '../../utils/layout-validator';

export interface FlexOffsetParent {
  layout: string;
  isRtl: boolean;
}

@Injectable({providedIn: 'root'})
export class FlexOffsetStyleBuilder extends StyleBuilder {
  buildStyles(offset: string, parent: FlexOffsetParent) {
    const isPercent = String(offset).indexOf('%') > -1;
    const isPx = String(offset).indexOf('px') > -1;
    if (!isPx && !isPercent && !isNaN(+offset)) {
      offset = offset + '%';
    }
    const horizontalLayoutKey = parent.isRtl ? 'margin-right' : 'margin-left';
    const styles = isFlowHorizontal(parent.layout) ? {[horizontalLayoutKey]: `${offset}`} :
      {'margin-top': `${offset}`};

    return styles;
  }
}

/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
@Directive({selector: `
  [fxFlexOffset],
  [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md], [fxFlexOffset.lg], [fxFlexOffset.xl],
  [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md], [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl],
  [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm], [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]
`})
export class FlexOffsetDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {
  private _directionWatcher: Subscription;

  /* tslint:disable */
  @Input('fxFlexOffset')       set offset(val: string)     { this._cacheInput('offset', val); }
  @Input('fxFlexOffset.xs')    set offsetXs(val: string)   { this._cacheInput('offsetXs', val); }
  @Input('fxFlexOffset.sm')    set offsetSm(val: string)   { this._cacheInput('offsetSm', val); };
  @Input('fxFlexOffset.md')    set offsetMd(val: string)   { this._cacheInput('offsetMd', val); };
  @Input('fxFlexOffset.lg')    set offsetLg(val: string)   { this._cacheInput('offsetLg', val); };
  @Input('fxFlexOffset.xl')    set offsetXl(val: string)   { this._cacheInput('offsetXl', val); };

  @Input('fxFlexOffset.lt-sm') set offsetLtSm(val: string) { this._cacheInput('offsetLtSm', val); };
  @Input('fxFlexOffset.lt-md') set offsetLtMd(val: string) { this._cacheInput('offsetLtMd', val); };
  @Input('fxFlexOffset.lt-lg') set offsetLtLg(val: string) { this._cacheInput('offsetLtLg', val); };
  @Input('fxFlexOffset.lt-xl') set offsetLtXl(val: string) { this._cacheInput('offsetLtXl', val); };

  @Input('fxFlexOffset.gt-xs') set offsetGtXs(val: string) { this._cacheInput('offsetGtXs', val); };
  @Input('fxFlexOffset.gt-sm') set offsetGtSm(val: string) { this._cacheInput('offsetGtSm', val); };
  @Input('fxFlexOffset.gt-md') set offsetGtMd(val: string) { this._cacheInput('offsetGtMd', val); };
  @Input('fxFlexOffset.gt-lg') set offsetGtLg(val: string) { this._cacheInput('offsetGtLg', val); };

  /* tslint:enable */
  constructor(monitor: MediaMonitor,
              elRef: ElementRef,
              @Optional() @SkipSelf() protected _container: LayoutDirective,
              private _directionality: Directionality,
              styleUtils: StyleUtils,
              styleBuilder: FlexOffsetStyleBuilder) {
    super(monitor, elRef, styleUtils, styleBuilder);

    this._directionWatcher =
        this._directionality.change.subscribe(this._updateWithValue.bind(this));

    this.watchParentFlow();
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * For @Input changes on the current mq activation property, see onMediaQueryChanges()
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['offset'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * Cleanup
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._layoutWatcher) {
      this._layoutWatcher.unsubscribe();
    }
    if (this._directionWatcher) {
      this._directionWatcher.unsubscribe();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    super.ngOnInit();

    this._listenForMediaQueryChanges('offset', 0 , (changes: MediaChange) => {
      this._updateWithValue(changes.value);
    });
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /** The flex-direction of this element's host container. Defaults to 'row'. */
  protected _layout = {direction: 'row', wrap: false};

  /**
   * Subscription to the parent flex container's layout changes.
   * Stored so we can unsubscribe when this directive is destroyed.
   */
  protected _layoutWatcher?: Subscription;

  /**
   * If parent flow-direction changes, then update the margin property
   * used to offset
   */
  protected watchParentFlow() {
    if (this._container) {
      // Subscribe to layout immediate parent direction changes (if any)
      this._layoutWatcher = this._container.layout$.subscribe((layout) => {
        // `direction` === null if parent container does not have a `fxLayout`
        this._onLayoutChange(layout);
      });
    }
  }

  /**
   * Caches the parent container's 'flex-direction' and updates the element's style.
   * Used as a handler for layout change events from the parent flex container.
   */
  protected _onLayoutChange(layout?: Layout) {
    this._layout = layout || this._layout || {direction: 'row', wrap: false};
    this._updateWithValue();
  }

  /**
   * Using the current fxFlexOffset value, update the inline CSS
   * NOTE: this will assign `margin-left` if the parent flex-direction == 'row',
   *       otherwise `margin-top` is used for the offset.
   */
  protected _updateWithValue(value?: string|number) {
    value = value || this._queryInput('offset') || 0;
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    // The flex-direction of this element's flex container. Defaults to 'row'.
    const layout = this._getFlexFlowDirection(this.parentElement, true);
    const isRtl = this._directionality.value === 'rtl';
    if (layout === 'row' && isRtl) {
      this._styleCache = flexOffsetCacheRowRtl;
    } else if (layout === 'row' && !isRtl) {
      this._styleCache = flexOffsetCacheRowLtr;
    } else if (layout === 'column' && isRtl) {
      this._styleCache = flexOffsetCacheColumnRtl;
    } else if (layout === 'column' && !isRtl) {
      this._styleCache = flexOffsetCacheColumnLtr;
    }
    this.addStyles((value && (value + '') || ''), {layout, isRtl});
  }
}

const flexOffsetCacheRowRtl: Map<string, StyleDefinition> = new Map();
const flexOffsetCacheColumnRtl: Map<string, StyleDefinition> = new Map();
const flexOffsetCacheRowLtr: Map<string, StyleDefinition> = new Map();
const flexOffsetCacheColumnLtr: Map<string, StyleDefinition> = new Map();
