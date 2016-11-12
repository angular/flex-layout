import {Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Optional, Renderer, SimpleChanges,} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {isDefined} from '../../utils/global';
import {MediaQueryActivation} from '../media-query/media-query-activation';
import {MediaQueryAdapter} from '../media-query/media-query-adapter';
import {MediaQueryChanges, OnMediaQueryChanges} from '../media-query/media-query-changes';

import {BaseStyleDirective} from './abstract';

/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
@Directive({selector: '[fx-layout], [fx-layout.md]'})
export class LayoutDirective extends BaseStyleDirective implements OnInit, OnChanges,
                                                                   OnMediaQueryChanges {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: MediaQueryActivation;

  /**
   * Create Observable for nested/child 'flex' directives. This allows
   * child flex directives to subscribe/listen for flexbox direction changes.
   */
  private _layout: BehaviorSubject<string> = new BehaviorSubject<string>(this.layout);

  /**
   * Publish observer to enabled nested, dependent directives to listen
   * to parent "layout" direction changes
   */
  public onLayoutChange: Observable<string> = this._layout.asObservable();

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
  constructor(private _mqa: MediaQueryAdapter, elRef: ElementRef, renderer: Renderer) {
    super(elRef, renderer);
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
    let activated = this._mqActivation;
    let activationChange = activated && isDefined(changes[activated.activatedInputKey]);

    if (isDefined(changes['layout']) || activationChange) {
      this._updateWithDirection();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = this._mqa.attach(this, 'layout', 'row');
    this._updateWithDirection();
  }

  /**
   *  Special mql callback used by MediaQueryActivation when a mql event occurs
   */
  onMediaQueryChanges(changes: MediaQueryChanges) {
    this._updateWithDirection(changes.current.value);
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
    if (isDefined(this._mqActivation)) {
      direction = this._mqActivation.activatedInput;
    }
    direction = this._validateValue(direction);

    // Update styles and announce to subscribers the *new* direction
    this._updateStyle(this._buildCSS(direction));
    this._layout.next(direction);
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


/**
 * 'layout-wrap' flexbox styling directive
 * Defines wrapping of child elements in layout container
 * Optional values: reverse, wrap-reverse, none, nowrap, wrap (default)]
 * @see https://css-tricks.com/almanac/properties/f/flex-wrap/
 */
@Directive({selector: '[fx-layout-wrap]'})
export class LayoutWrapDirective extends BaseStyleDirective implements OnInit, OnChanges,
                                                                       OnMediaQueryChanges,
                                                                       OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: MediaQueryActivation;

  @Input('fx-layout-wrap') wrap: string = 'wrap';

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fx-layout-wrap.xs') wrapXs;
  @Input('fx-layout-wrap.gt-xs') wrapGtXs;
  @Input('fx-layout-wrap.sm') wrapSm;
  @Input('fx-layout-wrap.gt-sm') wrapGtSm;
  @Input('fx-layout-wrap.md') wrapMd;
  @Input('fx-layout-wrap.gt-md') wrapGtMd;
  @Input('fx-layout-wrap.lg') wrapLg;
  @Input('fx-layout-wrap.gt-lg') wrapGtLg;
  @Input('fx-layout-wrap.xl') wrapXl;

  constructor(private _mqa: MediaQueryAdapter, elRef: ElementRef, renderer: Renderer) {
    super(elRef, renderer)
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges(changes: SimpleChanges) {
    let activated = this._mqActivation;
    let activationChange = activated && isDefined(changes[activated.activatedInputKey]);

    if (isDefined(changes['wrap']) || activationChange) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = this._mqa.attach(this, 'wrap', 'wrap');
    this._updateWithValue();
  }

  /**
   *  Special mql callback used by MediaQueryActivation when a mql event occurs
   */
  onMediaQueryChanges(changes: MediaQueryChanges) {
    this._updateWithValue(changes.current.value);
  }

  ngOnDestroy() {}

  // *********************************************
  // Protected methods
  // *********************************************

  _updateWithValue(value?: string) {
    value = value || this.wrap || 'wrap';
    if (isDefined(this._mqActivation)) {
      value = this._mqActivation.activatedInput;
    }
    value = this._validateValue(value);

    this._updateStyle(this._buildCSS(value));
  }


  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    return { 'flex-wrap': value };
  }

  /**
   * Convert layout-wrap="<value>" to expected flex-wrap style
   */
  _validateValue(value) {
    switch (value.toLowerCase()) {
      case 'reverse':
      case 'wrap-reverse':
        value = 'wrap-reverse';
        break;

      case 'no':
      case 'none':
      case 'nowrap':
        value = 'nowrap';
        break;

      // All other values fallback to "wrap"
      default:
        value = 'wrap';
        break;
    }
    return value;
  }
}


/**
 * 'layout-align' flexbox styling directive
 *  Defines positioning of child elements along main and cross axis in a layout container
 *  Optional values: {main-axis} values or {main-axis cross-axis} value pairs
 *
 *  @see https://css-tricks.com/almanac/properties/j/justify-content/
 *  @see https://css-tricks.com/almanac/properties/a/align-items/
 *  @see https://css-tricks.com/almanac/properties/a/align-content/
 */
@Directive({selector: '[fx-layout-align]'})
export class LayoutAlignDirective extends BaseStyleDirective implements OnInit, OnChanges,
                                                                        OnMediaQueryChanges,
                                                                        OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: MediaQueryActivation;

  private _layout = 'row';  // default flex-direction
  private _layoutWatcher: Subscription;

  @Input('fx-layout-align') align: string = 'start stretch';

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fx-layout-align.xs') alignXs;
  @Input('fx-layout-align.gt-xs') alignGtXs;
  @Input('fx-layout-align.sm') alignSm;
  @Input('fx-layout-align.gt-sm') alignGtSm;
  @Input('fx-layout-align.md') alignMd;
  @Input('fx-layout-align.gt-md') alignGtMd;
  @Input('fx-layout-align.lg') alignLg;
  @Input('fx-layout-align.gt-lg') alignGtLg;
  @Input('fx-layout-align.xl') alignXl;

  constructor(
      @Optional() public container: LayoutDirective, private _mqa: MediaQueryAdapter,
      elRef: ElementRef, renderer: Renderer) {
    super(elRef, renderer);

    if (container) {  // Subscribe to layout direction changes
      this._layoutWatcher = container.onLayoutChange.subscribe(this._onLayoutChange.bind(this));
    }
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges(changes?: SimpleChanges) {
    let activated = this._mqActivation;
    let activationChange = activated && isDefined(changes[activated.activatedInputKey]);

    if (isDefined(changes['align']) || activationChange) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = this._mqa.attach(this, 'align', 'start stretch');
    this._updateWithValue();
  }

  /**
   *  Special mql callback used by MediaQueryActivation when a mql event occurs
   */
  onMediaQueryChanges(changes: MediaQueryChanges) {
    this._updateWithValue(changes.current.value);
  }


  ngOnDestroy() {
    this._layoutWatcher.unsubscribe();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   *
   */
  _updateWithValue(value?: string) {
    value = value || this.align || 'start stretch';
    if (isDefined(this._mqActivation)) {
      value = this._mqActivation.activatedInput;
    }

    this._updateStyle(this._buildCSS(value));
  }

  /**
   * Cache the parent container 'flex-direction' and update the 'flex' styles
   */
  _onLayoutChange(direction) {
    this._layout = (direction || '').toLowerCase().replace('-reverse', '');
    if (!LAYOUT_VALUES.find(x => x === this._layout))
      this._layout = 'row';

    let value = this.align || 'start stretch';
    if (isDefined(this._mqActivation)) {
      value = this._mqActivation.activatedInput;
    }
    this._allowStretching(value, this._layout);
  }

  _buildCSS(align) {
    let css = {}, [main_axis, cross_axis] = align.split(' ');

    css['justify-content'] = 'flex-start';  // default
    css['align-items'] = 'stretch';         // default
    css['align-content'] = 'stretch';       // default

    // Main axis
    switch (main_axis) {
      case 'center':
        css['justify-content'] = 'center';
        break;
      case 'space-around':
        css['justify-content'] = 'space-around';
        break;
      case 'space-between':
        css['justify-content'] = 'space-between';
        break;
      case 'end':
        css['justify-content'] = 'flex-end';
        break;
    }
    // Cross-axis
    switch (cross_axis) {
      case 'start':
        css['align-items'] = css['align-content'] = 'flex-start';
        break;
      case 'baseline':
        css['align-items'] = 'baseline';
        break;
      case 'center':
        css['align-items'] = css['align-content'] = 'center';
        break;
      case 'end':
        css['align-items'] = css['align-content'] = 'flex-end';
        break;
    }

    return css;
  }

  /**
   * Update container element to 'stretch' as needed...
   */
  _allowStretching(align, layout) {
    let [, cross_axis] = align.split(' ');

    if (cross_axis == 'stretch') {
      // Use `null` values to remove style
      this._updateStyle({
        'box-sizing': 'border-box',
        'max-width': (layout === 'column') ? '100%' : null,
        'max-height': (layout === 'row') ? '100%' : null
      });
    }
  }
}


// ************************************************************
// Private static variables
// ************************************************************

const LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];
const [ROW, COLUMN, ROW_REVERSE, COLUMN_REVERSE] = LAYOUT_VALUES;
