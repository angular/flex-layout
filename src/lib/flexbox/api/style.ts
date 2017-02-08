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
  OnDestroy,
  OnInit,
  Renderer,
  OnChanges,
  SimpleChanges,
  KeyValueDiffers
} from '@angular/core';
import { NgStyle } from '@angular/common';

import { BreakPointRegistry } from './../../media-query/breakpoints/break-point-registry';
import { ResponsiveActivation } from './../responsive/responsive-activation';
import { BaseFxDirective } from './base';
import { MediaChange } from '../../media-query/media-change';
import { MediaMonitor } from '../../media-query/media-monitor';

/** NgStyle allowed inputs **/
export type NgStyleType = string | string[] | Set<string> | { [klass: string]: any };

/**
 * Directive to add responsive support for ngStyle.
 *
 */
@Directive({
  selector: `
    [style.xs],
    [style.gt-xs],
    [style.sm],
    [style.gt-sm],
    [style.md],
    [style.gt-md],
    [style.lg],
    [style.gt-lg],
    [style.xl]
  `
})
export class StyleDirective extends NgStyle implements OnInit, OnChanges, OnDestroy {

  @Input('style.xs')
  set styleXs(val: NgStyleType) {
    this._base.cacheInput('styleXs', val);
  }

  @Input('style.gt-xs')
  set styleGtXs(val: NgStyleType) {
    this._base.cacheInput('styleGtXs', val);
  };

  @Input('style.sm')
  set styleSm(val: NgStyleType) {
    this._base.cacheInput('styleSm', val);
  };

  @Input('style.gt-sm')
  set styleGtSm(val: NgStyleType) {
    this._base.cacheInput('styleGtSm', val);
  };

  @Input('style.md')
  set styleMd(val: NgStyleType) {
    this._base.cacheInput('styleMd', val);
  };

  @Input('style.gt-md')
  set styleGtMd(val: NgStyleType) {
    this._base.cacheInput('styleGtMd', val);
  };

  @Input('style.lg')
  set styleLg(val: NgStyleType) {
    this._base.cacheInput('styleLg', val);
  };

  @Input('style.gt-lg')
  set styleGtLg(val: NgStyleType) {
    this._base.cacheInput('styleGtLg', val);
  };

  @Input('style.xl')
  set styleXl(val: NgStyleType) {
    this._base.cacheInput('styleXl', val);
  };

  private _base: BaseFxDirectiveAdapter;

  constructor(private monitor: MediaMonitor,
    private _bpRegistry: BreakPointRegistry,
    _differs: KeyValueDiffers, _ngEl: ElementRef, _renderer: Renderer) {

    super(_differs, _ngEl, _renderer);

    this._base = new BaseFxDirectiveAdapter(monitor, _ngEl, _renderer);
  }

  /**
   * For @Input changes on the current mq activation property, see onMediaQueryChanges()
   */
  ngOnChanges(changes: SimpleChanges) {
    const changed = this._bpRegistry.items.some(it => `style${it.suffix}` in changes);
    if (changed || this._base.mqActivation) {
      this._updateStyle();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._base.listenForMediaQueryChanges('style', '', (changes: MediaChange) => {
      this._updateStyle(changes.value);
    });
    this._updateStyle();
  }

  ngOnDestroy() {
    this._base.ngOnDestroy();
  }

  private _updateStyle(value?: NgStyleType) {
    let style = value || this._base.queryInput("style") || '';
    if (this._base.mqActivation) {
      style = this._base.mqActivation.activatedInput;
    }

    this.ngStyle = style;
  }
}

/**
 * Adapted BaseFxDirective abtract class version so it can be used via composition.
 *
 * @see BaseFxDirective
 */
import { MediaQuerySubscriber } from '../../media-query/media-change';

export class BaseFxDirectiveAdapter extends BaseFxDirective {

  /**
   *  Save the property value.
   */
  cacheInput(key?: string, source?: any) {
    this._inputMap[key] = source;
  }

  /**
   * @see BaseFxDirective._listenForMediaQueryChanges
   */
  listenForMediaQueryChanges(key: string,
    defaultValue: any,
    onMediaQueryChange: MediaQuerySubscriber): ResponsiveActivation {
    return this._listenForMediaQueryChanges(key, defaultValue, onMediaQueryChange);
  }

  /**
   * @see BaseFxDirective._queryInput
   */
  queryInput(key) {
    return this._queryInput(key);
  }

  /**
   * @see BaseFxDirective._mqActivation
   */
  get mqActivation(): ResponsiveActivation {
    return this._mqActivation;
  }
}
