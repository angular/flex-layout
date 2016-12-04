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
import {ResponsiveActivation, KeyOptions} from '../responsive/responsive-activation';

/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
@Directive({selector: '[fx-flex-align]'})
export class FlexAlignDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: ResponsiveActivation;

  @Input('fx-flex-align') align: string = 'stretch';  // default

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fx-flex-align.xs') alignXs;
  @Input('fx-flex-align.gt-xs') alignGtXs;
  @Input('fx-flex-align.sm') alignSm;
  @Input('fx-flex-align.gt-sm') alignGtSm;
  @Input('fx-flex-align.md') alignMd;
  @Input('fx-flex-align.gt-md') alignGtMd;
  @Input('fx-flex-align.lg') alignLg;
  @Input('fx-flex-align.gt-lg') alignGtLg;
  @Input('fx-flex-align.xl') alignXl;


  constructor(monitor : MediaMonitor, elRef: ElementRef, renderer: Renderer) {
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
    let keyOptions = new KeyOptions('align', 'stretch');
    this._mqActivation = new ResponsiveActivation(this, keyOptions, (changes: MediaChange) =>{
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  ngOnDestroy() {
    this._mqActivation.destroy();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  _updateWithValue(value?: string|number) {
    value = value || this.align || 'stretch';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }

  _buildCSS(align) {
    let css = {};

    // Cross-axis
    switch (align) {
      case 'start':
        css['align-self'] = 'flex-start';
        break;
      case 'baseline':
        css['align-self'] = 'baseline';
        break;
      case 'center':
        css['align-self'] = 'center';
        break;
      case 'end':
        css['align-self'] = 'flex-end';
        break;
      default:
        css['align-self'] = 'stretch';
        break;  // default
    }

    return css;
  }
}
