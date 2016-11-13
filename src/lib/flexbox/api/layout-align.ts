import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Renderer,
  SimpleChanges,
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {MediaQueryActivation} from '../media-query/media-query-activation';
import {MediaQueryAdapter} from '../media-query/media-query-adapter';
import {MediaQueryChanges, OnMediaQueryChanges} from '../media-query/media-query-changes';
import {BaseFlexLayoutDirective} from './abstract';
import {LAYOUT_VALUES, LayoutDirective} from './layout';


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
export class LayoutAlignDirective extends BaseFlexLayoutDirective implements OnInit, OnChanges,
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
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }

  /**
   * Cache the parent container 'flex-direction' and update the 'flex' styles
   */
  _onLayoutChange(direction) {
    this._layout = (direction || '').toLowerCase().replace('-reverse', '');
    if (!LAYOUT_VALUES.find(x => x === this._layout))
      this._layout = 'row';

    let value = this.align || 'start stretch';
    if (this._mqActivation) {
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
      this._applyStyleToElement({
        'box-sizing': 'border-box',
        'max-width': (layout === 'column') ? '100%' : null,
        'max-height': (layout === 'row') ? '100%' : null
      });
    }
  }
}
