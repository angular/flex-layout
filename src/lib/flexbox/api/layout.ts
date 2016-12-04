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
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';
import {ResponsiveActivation, KeyOptions} from '../responsive/responsive-activation';


export const LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];


/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
@Directive({selector: '[fx-layout]'})
export class LayoutDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: ResponsiveActivation;

  /**
   * Create Observable for nested/child 'flex' directives. This allows
   * child flex directives to subscribe/listen for flexbox direction changes.
   */
  private _announcer: BehaviorSubject<string> = new BehaviorSubject<string>(this.layout);

  /**
   * Publish observer to enabled nested, dependent directives to listen
   * to parent "layout" direction changes
   */
  public layout$: Observable<string> = this._announcer.asObservable();

  /**
   * Default layout property with default direction value
   */
  @Input('fx-layout') layout = 'row';

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fx-layout.xs') layoutXs;
  @Input('fx-layout.gt-xs') layoutGtXs;
  @Input('fx-layout.sm') layoutSm;
  @Input('fx-layout.gt-sm') layoutGtSm;
  @Input('fx-layout.md') layoutMd;
  @Input('fx-layout.gt-md') layoutGtMd;
  @Input('fx-layout.lg') layoutLg;
  @Input('fx-layout.gt-lg') layoutGtLg;
  @Input('fx-layout.xl') layoutXl;

  /**
   *
   */
  constructor(monitor : MediaMonitor, elRef: ElementRef, renderer: Renderer) {
    super(monitor, elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fx-layout')
   * Then conditionally override with the mq-activated Input's current value
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['layout'] != null || this._mqActivation) {
      this._updateWithDirection();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    let keyOptions = new KeyOptions('layout', 'row');
    this._mqActivation = new ResponsiveActivation(this, keyOptions, (changes: MediaChange) =>{
      this._updateWithDirection(changes.value);
    });
    this._updateWithDirection();
  }

  ngOnDestroy() {
    this._mqActivation.destroy();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Validate the direction value and then update the host's inline flexbox styles
   *
   * @todo - update all child containers to have "box-sizing: border-box"
   *         This way any padding or border specified on the child elements are
   *         laid out and drawn inside that element's specified width and height.
   *
   */
  _updateWithDirection(direction?: string) {
    direction = direction || this.layout || 'row';
    if (this._mqActivation) {
      direction = this._mqActivation.activatedInput;
    }
    direction = this._validateValue(direction);

    // Update styles and announce to subscribers the *new* direction
    this._applyStyleToElement(this._buildCSS(direction));
    this._announcer.next(direction);
  }


  /**
   * Build the CSS that should be assigned to the element instance
   * BUG:
   *
   *   1) min-height on a column flex container won’t apply to its flex item children in IE 10-11.
   *      Use height instead if possible; height : <xxx>vh;
   */
  _buildCSS(value) {
    return {'display': 'flex', 'box-sizing': 'border-box', 'flex-direction': value};
  }

  /**
   * Validate the value to be one of the acceptable value options
   * Use default fallback of "row"
   */
  _validateValue(value) {
    value = value ? value.toLowerCase() : '';
    return LAYOUT_VALUES.find(x => x === value) ? value : LAYOUT_VALUES[0];  // "row"
  }
}






// ************************************************************
// Private static variables
// ************************************************************

const [ROW, COLUMN, ROW_REVERSE, COLUMN_REVERSE] = LAYOUT_VALUES;
