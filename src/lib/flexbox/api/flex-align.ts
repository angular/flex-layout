import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer,
  SimpleChanges,
} from '@angular/core';
import {MediaQueryActivation} from '../media-query/media-query-activation';
import {MediaQueryAdapter} from '../media-query/media-query-adapter';
import {MediaQueryChanges, OnMediaQueryChanges} from '../media-query/media-query-changes';
import {BaseFlexLayoutDirective} from './abstract';


/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
@Directive({selector: '[fx-flex-align]'})
export class FlexAlignDirective extends BaseFlexLayoutDirective implements OnInit, OnChanges,
                                                                      OnMediaQueryChanges {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: MediaQueryActivation;

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


  constructor(private _mqa: MediaQueryAdapter, elRef: ElementRef, renderer: Renderer) {
    super(elRef, renderer);
  }


  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * For @Input changes on the current mq activation property, delegate to the onLayoutChange()
   */
  ngOnChanges(changes: SimpleChanges) {
    let activated = this._mqActivation;
    let activationChange = activated && changes[activated.activatedInputKey] != null;
    if (changes['align'] != null || activationChange) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = this._mqa.attach(this, 'align', 'stretch');
    this._updateWithValue();
  }

  /**
   *  Special mql callback used by MediaQueryActivation when a mql event occurs
   */
  onMediaQueryChanges(changes: MediaQueryChanges) {
    this._updateWithValue(changes.current.value);
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
