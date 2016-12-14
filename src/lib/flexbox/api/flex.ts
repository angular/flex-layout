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

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';

import {LayoutDirective} from './layout';
import {LayoutWrapDirective} from './layout-wrap';


/** Built-in aliases for different flex-basis values. */
export type FlexBasisAlias = 'grow' | 'initial' | 'auto' | 'none' | 'nogrow' | 'noshrink';


/**
 * Directive to control the size of a flex item using flex-basis, flex-grow, and flex-shrink.
 * Corresponds to the css `flex` shorthand property.
 *
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
@Directive({ selector: `
  [fx-flex],
  [fx-flex.xs]
  [fx-flex.gt-xs],
  [fx-flex.sm],
  [fx-flex.gt-sm]
  [fx-flex.md],
  [fx-flex.gt-md]
  [fx-flex.lg],
  [fx-flex.gt-lg],
  [fx-flex.xl]
`
 })
export class FlexDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  /** The flex-direction of this element's flex container. Defaults to 'row'. */
  private _layout = 'row';

  /**
   * Subscription to the parent flex container's layout changes.
   * Stored so we can unsubscribe when this directive is destroyed.
   */
  private _layoutWatcher: Subscription;

  @Input('fx-flex')       set flex(val)     { this._cacheInput("flex", val); }
  @Input('fx-shrink')     set shrink(val)   { this._cacheInput("shrink", val); }
  @Input('fx-grow')       set grow(val)     { this._cacheInput("grow", val); }
  
  @Input('fx-flex.xs')    set flexXs(val)   { this._cacheInput('flexXs', val); }
  @Input('fx-flex.gt-xs') set flexGtXs(val) { this._cacheInput('flexGtXs', val); };
  @Input('fx-flex.sm')    set flexSm(val)   { this._cacheInput('flexSm', val); };
  @Input('fx-flex.gt-sm') set flexGtSm(val) { this._cacheInput('flexGtSm', val); };
  @Input('fx-flex.md')    set flexMd(val)   { this._cacheInput('flexMd', val); };
  @Input('fx-flex.gt-md') set flexGtMd(val) { this._cacheInput('flexGtMd', val); };
  @Input('fx-flex.lg')    set flexLg(val)   { this._cacheInput('flexLg', val); };
  @Input('fx-flex.gt-lg') set flexGtLg(val) { this._cacheInput('flexGtLg', val); };
  @Input('fx-flex.xl')    set flexXl(val)   { this._cacheInput('flexXl', val); };


  // Explicitly @SkipSelf on LayoutDirective and LayoutWrapDirective because we want the
  // parent flex container for this flex item.
  constructor(
      monitor : MediaMonitor,
      elRef: ElementRef,
      renderer: Renderer,
      @Optional() @SkipSelf() private _container: LayoutDirective,
      @Optional() @SkipSelf() private _wrap: LayoutWrapDirective) {

    super(monitor, elRef, renderer);
    
    this._cacheInput("flex", "");
    this._cacheInput("shrink", 1);
    this._cacheInput("grow", 1);
    
    if (_container) {
      // If this flex item is inside of a flex container marked with
      // Subscribe to layout immediate parent direction changes
      this._layoutWatcher = _container.layout$.subscribe((direction) => this._onLayoutChange(direction));
    }
  }

  /**
   * For @Input changes on the current mq activation property, see onMediaQueryChanges()
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['flex'] != null || this._mqActivation) {
      this._onLayoutChange(this._layout);
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._listenForMediaQueryChanges('flex', '', (changes: MediaChange) =>{
      this._updateStyle(changes.value);
    });
    this._onLayoutChange();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
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
    let flexBasis = value || this._queryInput("flex") || '';
    if (this._mqActivation) {
      flexBasis = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._validateValue.apply(this, this._parseFlexParts(flexBasis) ));
  }

  /**
   * If the used the short-form `fx-flex="1 0 37%"`, then parse the parts
   */
  _parseFlexParts(basis:string) {
    let matches = basis.split(" ");
    return (matches.length !== 3) ? [ this._queryInput("grow"),  this._queryInput("shrink"), basis ] : matches;
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
        let isValue = String(basis).indexOf('px') > -1 ||
                   String(basis).indexOf('vw') > -1 ||
                   String(basis).indexOf('vh') > -1;

        // Defaults to percentage sizing unless `px` is explicitly set
        if (!isValue && !isPercent && !isNaN(basis as any))
          basis = basis + '%';
        if (basis === '0px')
          basis = '0%';

        // Set max-width = basis if using layout-wrap
        // @see https://github.com/philipwalton/flexbugs#11-min-and-max-size-declarations-are-ignored-when-wrappifl-flex-items

        css = extendObject(clearStyles, {
          'flex': `${grow} ${shrink} ${(isValue || this._wrap) ? basis : '100%'}`,  // fix issue #5345
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
