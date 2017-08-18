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
  OnChanges,
  Renderer2,
  SimpleChanges,
  Self,
  AfterContentInit,
  Optional,
  OnDestroy,
  NgZone,
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {BaseFxDirective} from './base';
import {LayoutDirective} from './layout';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';
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
export class LayoutGapDirective extends BaseFxDirective implements AfterContentInit, OnChanges,
    OnDestroy {
  protected _layout = 'row';  // default flex-direction
  protected _layoutWatcher: Subscription;
  protected _observer: MutationObserver;

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
              renderer: Renderer2,
              @Optional() @Self() container: LayoutDirective,
              private _zone: NgZone) {
    super(monitor, elRef, renderer);

    if (container) {  // Subscribe to layout direction changes
      this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
    }
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
          let validatedChanges = (it: MutationRecord): boolean => {
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
  protected _onLayoutChange(direction) {
    this._layout = (direction || '').toLowerCase();
    if (!LAYOUT_VALUES.find(x => x === this._layout)) {
      this._layout = 'row';
    }
    this._updateWithValue();
  }

  /**
   *
   */
  protected _updateWithValue(value?: string) {
    value = value || this._queryInput('gap') || '0';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    // Gather all non-hidden Element nodes
    let items = this.childrenNodes
        .filter(el => el.nodeType === 1 && this._getDisplayStyle(el) != 'none');
    let numItems = items.length;

    if (numItems > 1) {
      let lastItem = items[numItems - 1];

      // For each `element` children EXCEPT the last,
      // set the margin right/bottom styles...
      items = items.filter((_, j) => j < numItems - 1);
      this._applyStyleToElements(this._buildCSS(value), items);

      // Clear all gaps for all visible elements
      this._applyStyleToElements(this._buildCSS(), [lastItem]);
    }
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
      case 'column-reverse':
        key = 'margin-bottom';
        break;
      case 'row' :
      case 'row-reverse':
      default :
        key = 'margin-right';
        break;
    }
    margins[key] = value;

    return margins;
  }

}
