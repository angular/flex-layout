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
  IterableDiffers,
  KeyValueDiffers
} from '@angular/core';
import {NgClass} from '@angular/common';

import {BreakPointRegistry} from './../../media-query/breakpoints/break-point-registry';
import {ResponsiveActivation} from './../responsive/responsive-activation';
import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';

/** NgClass allowed inputs **/
export type NgClassType = string|string[]|Set<string>|{[klass: string]: any};

/**
 * Directive to add responsive support for ngClass.
 */
@Directive({
  selector: `
    [class.xs],
    [class.gt-xs],
    [class.sm],
    [class.gt-sm],
    [class.md],
    [class.gt-md],
    [class.lg],
    [class.gt-lg],
    [class.xl]
  `
})
export class ClassDirective extends NgClass implements OnInit, OnChanges, OnDestroy {

  @Input('class.xs')
  set classXs(val: NgClassType) {
    this._base.cacheInput('classXs', val);
  }

  @Input('class.gt-xs')
  set classGtXs(val: NgClassType) {
    this._base.cacheInput('classGtXs', val);
  };

  @Input('class.sm')
  set classSm(val: NgClassType) {
    this._base.cacheInput('classSm', val);
  };

  @Input('class.gt-sm')
  set classGtSm(val: NgClassType) {
    this._base.cacheInput('classGtSm', val);
  };

  @Input('class.md')
  set classMd(val: NgClassType) {
    this._base.cacheInput('classMd', val);
  };

  @Input('class.gt-md')
  set classGtMd(val: NgClassType) {
    this._base.cacheInput('classGtMd', val);
  };

  @Input('class.lg')
  set classLg(val: NgClassType) {
    this._base.cacheInput('classLg', val);
  };

  @Input('class.gt-lg')
  set classGtLg(val: NgClassType) {
    this._base.cacheInput('classGtLg', val);
  };

  @Input('class.xl')
  set classXl(val: NgClassType) {
    this._base.cacheInput('classXl', val);
  };

  private _base: BaseFxDirectiveAdapter;

  constructor(private monitor: MediaMonitor,
              private _bpRegistry: BreakPointRegistry,
              _iterableDiffers: IterableDiffers, _keyValueDiffers: KeyValueDiffers,
              _ngEl: ElementRef, _renderer: Renderer) {

    super(_iterableDiffers, _keyValueDiffers, _ngEl, _renderer);

    this._base = new BaseFxDirectiveAdapter(monitor, _ngEl, _renderer);
  }

  /**
   * For @Input changes on the current mq activation property, see onMediaQueryChanges()
   */
  ngOnChanges(changes: SimpleChanges) {
    const changed = this._bpRegistry.items.some(it => `class${it.suffix}` in changes);
    if (changed || this._base.mqActivation) {
      this._updateStyle();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._base.listenForMediaQueryChanges('class', '', (changes: MediaChange) => {
      this._updateStyle(changes.value);
    });
    this._updateStyle();
  }

  ngOnDestroy() {
    this._base.ngOnDestroy();
  }

  private _updateStyle(value?: NgClassType) {
    let clazz = value || this._base.queryInput("class") || '';
    if (this._base.mqActivation) {
      clazz = this._base.mqActivation.activatedInput;
    }

    this.ngClass = clazz;
  }
}

/**
 * Adapted BaseFxDirective abtract class version so it can be used via composition.
 *
 * @see BaseFxDirective
 */
import {MediaQuerySubscriber} from '../../media-query/media-change';

export class BaseFxDirectiveAdapter extends BaseFxDirective {
  get inputMap() {
    return this._inputMap;
  }

  /**
   *  Save the property value.
   */
  cacheInput(key?: string, source?: any) {
    if (Array.isArray(source)) {
      this._cacheInputArray(key, source);
    } else if (typeof source === 'object') {
      this._cacheInputObject(key, source);
    } else if (typeof source === 'string') {
      this._cacheInputString(key, source);
    } else {
      throw new Error('Invalid class value provided');
    }
  }

  /**
   *  Save the property value for Array values.
   */
  _cacheInputArray(key?: string, source?: boolean[]) {
    this._inputMap[key] = source.join(' ');
  }

  /**
   *  Save the property value for key/value pair values.
   */
  _cacheInputObject(key?: string, source?: {[key: string]: boolean}) {
    let classes = [];
    for (let prop in source) {
      if (!!source[prop]) {
        classes.push(prop);
      }
    }
    this._inputMap[key] = classes.join(' ');
  }

  /**
   *  Save the property value for string values.
   */
  _cacheInputString(key?: string, source?: string) {
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
