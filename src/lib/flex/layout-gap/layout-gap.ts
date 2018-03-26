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
  OnChanges,
  SimpleChanges,
  Self,
  AfterContentInit,
  Optional,
  OnDestroy,
  NgZone,
} from '@angular/core';
import {Directionality} from '@angular/cdk/bidi';
import {
  BaseFxDirective,
  MediaChange,
  MediaMonitor,
  StyleDefinition,
  StyleUtils
} from '@angular/flex-layout/core';
import {Subscription} from 'rxjs';

import {Layout, LayoutDirective} from '../layout/layout';
import {LAYOUT_VALUES} from '../../utils/layout-validator';

/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
@Directive({
  selector: `
  [fxLayoutGap],
  [fxLayoutGap.xs], [fxLayoutGap.sm], [fxLayoutGap.md], [fxLayoutGap.lg], [fxLayoutGap.xl],
  [fxLayoutGap.lt-sm], [fxLayoutGap.lt-md], [fxLayoutGap.lt-lg], [fxLayoutGap.lt-xl],
  [fxLayoutGap.gt-xs], [fxLayoutGap.gt-sm], [fxLayoutGap.gt-md], [fxLayoutGap.gt-lg]
`
})
export class LayoutGapDirective extends BaseFxDirective
  implements AfterContentInit, OnChanges, OnDestroy {
  protected _layout = 'row';  // default flex-direction
  protected _layoutWatcher: Subscription;
  protected _observer: MutationObserver;
  private _directionWatcher: Subscription;

  /* tslint:disable */
 @Input('fxLayoutGap')       set gap(val) { this._cacheInput('gap', val); }
 @Input('fxLayoutGap.xs')    set gapXs(val) { this._cacheInput('gapXs', val); }
 @Input('fxLayoutGap.sm')    set gapSm(val) { this._cacheInput('gapSm', val); };
 @Input('fxLayoutGap.md')    set gapMd(val) { this._cacheInput('gapMd', val); };
 @Input('fxLayoutGap.lg')    set gapLg(val) { this._cacheInput('gapLg', val); };
 @Input('fxLayoutGap.xl')    set gapXl(val) { this._cacheInput('gapXl', val); };

 @Input('fxLayoutGap.gt-xs') set gapGtXs(val) { this._cacheInput('gapGtXs', val); };
 @Input('fxLayoutGap.gt-sm') set gapGtSm(val) { this._cacheInput('gapGtSm', val); };
 @Input('fxLayoutGap.gt-md') set gapGtMd(val) { this._cacheInput('gapGtMd', val); };
 @Input('fxLayoutGap.gt-lg') set gapGtLg(val) { this._cacheInput('gapGtLg', val); };

 @Input('fxLayoutGap.lt-sm') set gapLtSm(val) { this._cacheInput('gapLtSm', val); };
 @Input('fxLayoutGap.lt-md') set gapLtMd(val) { this._cacheInput('gapLtMd', val); };
 @Input('fxLayoutGap.lt-lg') set gapLtLg(val) { this._cacheInput('gapLtLg', val); };
 @Input('fxLayoutGap.lt-xl') set gapLtXl(val) { this._cacheInput('gapLtXl', val); };

  /* tslint:enable */
  constructor(monitor: MediaMonitor,
              elRef: ElementRef,
              @Optional() @Self() container: LayoutDirective,
              private _zone: NgZone,
              private _directionality: Directionality,
              styleUtils: StyleUtils) {
    super(monitor, elRef, styleUtils);

    if (container) {  // Subscribe to layout direction changes
      this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
    }
    this._directionWatcher =
        this._directionality.change.subscribe(this._updateWithValue.bind(this));
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
    this._watchContentChanges();
    this._listenForMediaQueryChanges('gap', '0', (changes: MediaChange) => {
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._layoutWatcher) {
      this._layoutWatcher.unsubscribe();
    }
    if (this._observer) {
      this._observer.disconnect();
    }
    if (this._directionWatcher) {
      this._directionWatcher.unsubscribe();
    }
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Watch for child nodes to be added... and apply the layout gap styles to each.
   * NOTE: this does NOT! differentiate between viewChildren and contentChildren
   */
  protected _watchContentChanges() {
    this._zone.runOutsideAngular(() => {

      if (typeof MutationObserver !== 'undefined') {
        this._observer = new MutationObserver((mutations: MutationRecord[]) => {
          const validatedChanges = (it: MutationRecord): boolean => {
            return (it.addedNodes && it.addedNodes.length > 0) ||
                (it.removedNodes && it.removedNodes.length > 0);
          };

          // update gap styles only for child 'added' or 'removed' events
          if (mutations.some(validatedChanges)) {
            this._updateWithValue();
          }
        });
        this._observer.observe(this.nativeElement, {childList: true});
      }
    });
  }

  /**
   * Cache the parent container 'flex-direction' and update the 'margin' styles
   */
  protected _onLayoutChange(layout: Layout) {
    this._layout = (layout.direction || '').toLowerCase();
    if (!LAYOUT_VALUES.find(x => x === this._layout)) {
      this._layout = 'row';
    }
    this._updateWithValue();
  }

  /**
   *
   */
  protected _updateWithValue(value?: string) {
    let gapValue = value || this._queryInput('gap') || '0';
    if (this._mqActivation) {
      gapValue = this._mqActivation.activatedInput;
    }

    // Gather all non-hidden Element nodes
    const items = this.childrenNodes
      .filter(el => el.nodeType === 1 && this._getDisplayStyle(el) != 'none')
      .sort((a, b) => {
        const orderA = +this._styler.lookupStyle(a, 'order');
        const orderB = +this._styler.lookupStyle(b, 'order');
        if (isNaN(orderA) || isNaN(orderB) || orderA === orderB) {
          return 0;
        } else {
          return orderA > orderB ? 1 : -1;
        }
      });

    if (items.length > 0) {
      if (gapValue.endsWith(GRID_SPECIFIER)) {
        gapValue = gapValue.substring(0, gapValue.indexOf(GRID_SPECIFIER));
        // For each `element` children, set the padding
        this._applyStyleToElements(this._buildGridPadding(gapValue), items);

        // Add the margin to the host element
        this._applyStyleToElement(this._buildGridMargin(gapValue));
      } else {
        const lastItem = items.pop();

        // For each `element` children EXCEPT the last,
        // set the margin right/bottom styles...
        this._applyStyleToElements(this._buildCSS(gapValue), items);

        // Clear all gaps for all visible elements
        this._applyStyleToElements(this._buildCSS(), [lastItem]);
      }
    }
  }

  /**
   *
   */
  private _buildGridPadding(value: string): StyleDefinition {
    let paddingTop = '0px', paddingRight = '0px', paddingBottom = value, paddingLeft = '0px';

    if (this._directionality.value === 'rtl') {
      paddingLeft = value;
    } else {
      paddingRight = value;
    }

    return {'padding': `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`};
  }

  /**
   * Prepare margin CSS, remove any previous explicitly
   * assigned margin assignments
   * Note: this will not work with calc values (negative calc values are invalid)
   */
  private _buildGridMargin(value: string): StyleDefinition {
    let marginTop = '0px', marginRight = '0px', marginBottom = '-' + value, marginLeft = '0px';

    if (this._directionality.value === 'rtl') {
      marginLeft = '-' + value;
    } else {
      marginRight = '-' + value;
    }

    return {'margin': `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`};
  }

  /**
   * Prepare margin CSS, remove any previous explicitly
   * assigned margin assignments
   */
  private _buildCSS(value: any = null) {
    let key, margins = {
      'margin-left': null,
      'margin-right': null,
      'margin-top': null,
      'margin-bottom': null
    };

    switch (this._layout) {
      case 'column':
        key = 'margin-bottom';
        break;
      case 'column-reverse':
        key = 'margin-top';
        break;
      case 'row':
        key = this._directionality.value === 'rtl' ? 'margin-left' : 'margin-right';
        break;
      case 'row-reverse':
        key = this._directionality.value === 'rtl' ? 'margin-right' : 'margin-left';
        break;
      default :
        key = this._directionality.value === 'rtl' ? 'margin-left' : 'margin-right';
        break;
    }
    margins[key] = value;

    return margins;
  }
}

const GRID_SPECIFIER = ' grid';
