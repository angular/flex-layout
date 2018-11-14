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
  SimpleChanges,
  Injectable,
} from '@angular/core';
import {
  BaseDirective,
  MediaChange,
  MediaMonitor,
  StyleBuilder,
  StyleBuilderOutput,
  StyleUtils,
} from '@angular/flex-layout/core';

@Injectable({providedIn: 'root'})
export class FlexAlignStyleBuilder extends StyleBuilder {
  constructor() {
    super();
  }
  buildStyles(input: string): StyleBuilderOutput {
    const styles: {[key: string]: string | number} = {};

    // Cross-axis
    switch (input) {
      case 'start':
        styles['align-self'] = 'flex-start';
        break;
      case 'end':
        styles['align-self'] = 'flex-end';
        break;
      default:
        styles['align-self'] = input;
        break;
    }

    return {styles, shouldCache: true};
  }
}

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
export class FlexAlignDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('fxFlexAlign')       set align(val: string)  { this._cacheInput('align', val);  };
  @Input('fxFlexAlign.xs')    set alignXs(val: string)  { this._cacheInput('alignXs', val);  };
  @Input('fxFlexAlign.sm')    set alignSm(val: string)  { this._cacheInput('alignSm', val); };
  @Input('fxFlexAlign.md')    set alignMd(val: string)  { this._cacheInput('alignMd', val); };
  @Input('fxFlexAlign.lg')    set alignLg(val: string)  { this._cacheInput('alignLg', val); };
  @Input('fxFlexAlign.xl')    set alignXl(val: string)  { this._cacheInput('alignXl', val); };

  @Input('fxFlexAlign.lt-sm') set alignLtSm(val: string) { this._cacheInput('alignLtSm', val); };
  @Input('fxFlexAlign.lt-md') set alignLtMd(val: string) { this._cacheInput('alignLtMd', val); };
  @Input('fxFlexAlign.lt-lg') set alignLtLg(val: string) { this._cacheInput('alignLtLg', val); };
  @Input('fxFlexAlign.lt-xl') set alignLtXl(val: string) { this._cacheInput('alignLtXl', val); };

  @Input('fxFlexAlign.gt-xs') set alignGtXs(val: string)  { this._cacheInput('alignGtXs', val); };
  @Input('fxFlexAlign.gt-sm') set alignGtSm(val: string)  { this._cacheInput('alignGtSm', val); };
  @Input('fxFlexAlign.gt-md') set alignGtMd(val: string)  { this._cacheInput('alignGtMd', val); };
  @Input('fxFlexAlign.gt-lg') set alignGtLg(val: string)  { this._cacheInput('alignGtLg', val); };

  /* tslint:enable */
  constructor(monitor: MediaMonitor,
              elRef: ElementRef,
              styleUtils: StyleUtils,
              styleBuilder: FlexAlignStyleBuilder) {
    super(monitor, elRef, styleUtils, styleBuilder);
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
  }

  // *********************************************
  // Protected methods
  // *********************************************

  protected _updateWithValue(value?: string|number) {
    value = value || this._queryInput('align') || 'stretch';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this.addStyles(value && (value + '') || '');
  }
}
