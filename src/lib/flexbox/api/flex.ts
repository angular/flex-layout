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
  SkipSelf,
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {extendObject} from '../../utils/object-extend';
import {MediaQueryActivation} from '../media-query/media-query-activation';
import {MediaQueryAdapter} from '../media-query/media-query-adapter';
import {MediaQueryChanges, OnMediaQueryChanges} from '../media-query/media-query-changes';
import {BaseFxDirective} from './base';
import {LayoutDirective} from './layout';
import {LayoutWrapDirective} from './layout-wrap';


/** Built-in aliases for different flex-basis values. */
export type FlexBasisAlias = 'grow' | 'initial' | 'auto' | 'none' | 'nogrow' | 'noshrink';


/**
 * Directive to control the size of a flex item using flex-basis, flex-grow, and flex-shrink.
 * Correspondds to the css `flex` shorthand property.
 *
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
@Directive({
  selector: '[fx-flex]',
})
export class FlexDirective extends BaseFxDirective
    implements OnInit, OnChanges, OnMediaQueryChanges, OnDestroy {

  /** MediaQuery Activation Tracker */
  private _mqActivation: MediaQueryActivation;

  /** The flex-direction of this element's flex container. Defaults to 'row'. */
  private _layout = 'row';

  /**
   * Subscription to the parent flex container's layout changes.
   * Stored so we can unsubscribe when this directive is destroyed.
   */
  private _layoutWatcher: Subscription;

  @Input('fx-flex') flex: string = '';
  @Input('fx-shrink') shrink: number = 1;
  @Input('fx-grow') grow: number = 1;

  // Optional input variations to support mediaQuery triggers
  @Input('fx-flex.xs') flexXs;
  @Input('fx-flex.gt-xs') flexGtXs;
  @Input('fx-flex.sm') flexSm;
  @Input('fx-flex.gt-sm') flexGtSm;
  @Input('fx-flex.md') flexMd;
  @Input('fx-flex.gt-md') flexGtMd;
  @Input('fx-flex.lg') flexLg;
  @Input('fx-flex.gt-lg') flexGtLg;
  @Input('fx-flex.xl') flexXl;


  // Explicitly @SkipSelf on LayoutDirective and LayoutWrapDirective because we want the
  // parent flex container for this flex item.
  constructor(
      elRef: ElementRef,
      renderer: Renderer,
      private _mediaQueryAdapter: MediaQueryAdapter,
      @Optional() @SkipSelf() private _container: LayoutDirective,
      @Optional() @SkipSelf() private _wrap: LayoutWrapDirective) {
    super(elRef, renderer);

    // If this flex item is inside of a flex container marked with
    if (_container) {
      // Subscribe to layout immediate parent direction changes
      this._layoutWatcher = _container.onLayoutChange.subscribe(() => this._onLayoutChange());
    }
  }

  /**
   * For @Input changes on the current mq activation property, delegate to the onLayoutChange()
   */
  ngOnChanges(changes: SimpleChanges) {
    let activated = this._mqActivation;
    let activationChange = activated && changes[activated.activatedInputKey] != null;

    if (changes['flex'] != null || activationChange) {
      this._onLayoutChange(this._layout);
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = this._mediaQueryAdapter.attach(this, 'flex', '');
    this._onLayoutChange();
  }

  /**
   *  Special mql callback used by MediaQueryActivation when a mql event occurs
   */
  onMediaQueryChanges(changes: MediaQueryChanges) {
    this._updateStyle(changes.current.value);
  }

  ngOnDestroy() {
    if (this._layoutWatcher) {
      this._layoutWatcher.unsubscribe();
    }
  }


  /**
   * Caches the parent container's 'flex-direction' and updates the element's style.
   * Used as a handler for layout change events from the parent flex container.
   */
  _onLayoutChange(direction?: string) {
    this._layout = direction || this._layout;
    this._updateStyle();
  }

  _updateStyle(value?: string) {
    let flexBasis = value || this.flex || '';
    if (this._mqActivation) {
      flexBasis = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._validateValue(this.grow, this.shrink, flexBasis));
  }

  /**
   * Validate the value to be one of the acceptable value options
   * Use default fallback of "row"
   */
  _validateValue(grow: number, shrink: number, basis: string|number|FlexBasisAlias) {
    let css;
    let direction = (this._layout === 'column') || (this._layout == 'column-reverse') ?
        'column' :
        'row';

    // flex-basis allows you to specify the initial/starting main-axis size of the element,
    // before anything else is computed. It can either be a percentage or an absolute value.
    // It is, however, not the breaking point for flex-grow/shrink properties
    //
    // flex-grow can be seen as this:
    //   0: Do not stretch. Either size to element's content width, or obey 'flex-basis'.
    //   1: (Default value). Stretch; will be the same size to all other flex items on
    //       the same row since they have a default value of 1.
    //   ≥2 (integer n): Stretch. Will be n times the size of other elements
    //      with 'flex-grow: 1' on the same row.

    // Use `null` to clear existing styles.
    let clearStyles = {
      'max-width': null,
      'max-height': null,
      'min-width': null,
      'min-height': null
    };
    switch (basis || '') {
      case '':
        css = extendObject(clearStyles, {'flex': '1'});
        break;
      case 'grow':
        css = extendObject(clearStyles, {'flex': '1 1 100%'});
        break;
      case 'initial':
        css = extendObject(clearStyles, {'flex': '0 1 auto'});
        break;  // default
      case 'auto':
        css = extendObject(clearStyles, {'flex': '1 1 auto'});
        break;
      case 'none':
        css = extendObject(clearStyles, {'flex': '0 0 auto'});
        break;
      case 'nogrow':
        css = extendObject(clearStyles, {'flex': '0 1 auto'});
        break;
      case 'noshrink':
        css = extendObject(clearStyles, {'flex': '1 0 auto'});
        break;

      default:
        let isPercent = String(basis).indexOf('%') > -1;
        let isPx = String(basis).indexOf('px') > -1;

        // Defaults to percentage sizing unless `px` is explicitly set
        if (!isPx && !isPercent && !isNaN(basis as any))
          basis = basis + '%';
        if (basis === '0px')
          basis = '0%';

        // Set max-width = basis if using layout-wrap
        // @see https://github.com/philipwalton/flexbugs#11-min-and-max-size-declarations-are-ignored-when-wrappifl-flex-items

        css = extendObject(clearStyles, {
          'flex': `${grow} ${shrink} ${(isPx || this._wrap) ? basis : '100%'}`,  // fix issue #5345
        });
        break;
    }

    let max = (direction === 'row') ? 'max-width' : 'max-height';
    let min = (direction === 'row') ? 'min-width' : 'min-height';

    css[min] = (basis == '0%') ? 0 : null;
    css[max] = (basis == '0%') ? 0 : basis;

    return extendObject(css, {'box-sizing': 'border-box'});
  }
}
