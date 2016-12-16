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
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
@Directive({selector: `
  [fx-flex-offset],
  [fx-flex-offset.xs]
  [fx-flex-offset.gt-xs],
  [fx-flex-offset.sm],
  [fx-flex-offset.gt-sm]
  [fx-flex-offset.md],
  [fx-flex-offset.gt-md]
  [fx-flex-offset.lg],
  [fx-flex-offset.gt-lg],
  [fx-flex-offset.xl]
`})
export class FlexOffsetDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  @Input('fx-flex-offset')       set offset(val)     { this._cacheInput('offset', val); }
  @Input('fx-flex-offset.xs')    set offsetXs(val)   { this._cacheInput('offsetXs', val); }
  @Input('fx-flex-offset.gt-xs') set offsetGtXs(val) { this._cacheInput('offsetGtXs', val); };
  @Input('fx-flex-offset.sm')    set offsetSm(val)   { this._cacheInput('offsetSm', val); };
  @Input('fx-flex-offset.gt-sm') set offsetGtSm(val) { this._cacheInput('offsetGtSm', val); };
  @Input('fx-flex-offset.md')    set offsetMd(val)   { this._cacheInput('offsetMd', val); };
  @Input('fx-flex-offset.gt-md') set offsetGtMd(val) { this._cacheInput('offsetGtMd', val); };
  @Input('fx-flex-offset.lg')    set offsetLg(val)   { this._cacheInput('offsetLg', val); };
  @Input('fx-flex-offset.gt-lg') set offsetGtLg(val) { this._cacheInput('offsetGtLg', val); };
  @Input('fx-flex-offset.xl')    set offsetXl(val)   { this._cacheInput('offsetXl', val); };

  constructor(monitor : MediaMonitor,  elRef: ElementRef, renderer: Renderer) {
    super(monitor, elRef, renderer);
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
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._listenForMediaQueryChanges('offset', 0 , (changes: MediaChange) =>{
      this._updateWithValue(changes.value);
    });
  }

  // *********************************************
  // Protected methods
  // *********************************************


  private _updateWithValue(value?: string|number) {
    value = value || this._queryInput("offset") || 0;
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }

  private _buildCSS(offset) {
    let isPercent = String(offset).indexOf('%') > -1;
    let isPx = String(offset).indexOf('px') > -1;
    if (!isPx && !isPercent && !isNaN(offset))
      offset = offset + '%';

    return {'margin-left': `${offset}`};
  }
}
