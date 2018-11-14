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
  Inject,
  Injectable,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';
import {
  BaseDirective,
  LayoutConfigOptions,
  LAYOUT_CONFIG,
  MediaChange,
  MediaMonitor,
  StyleUtils,
  validateBasis,
  StyleBuilder,
  StyleDefinition,
} from '@angular/flex-layout/core';
import {Subscription} from 'rxjs';

import {extendObject} from '../../utils/object-extend';
import {Layout, LayoutDirective} from '../layout/layout';
import {isFlowHorizontal} from '../../utils/layout-validator';

/** Built-in aliases for different flex-basis values. */
export type FlexBasisAlias = 'grow' | 'initial' | 'auto' | 'none' | 'nogrow' | 'noshrink';

interface FlexBuilderParent {
  direction: string;
  hasWrap: boolean;
}

@Injectable({providedIn: 'root'})
export class FlexStyleBuilder extends StyleBuilder {
  constructor(@Inject(LAYOUT_CONFIG) protected layoutConfig: LayoutConfigOptions) {
    super();
  }
  buildStyles(input: string, parent: FlexBuilderParent) {
    let [grow, shrink, ...basisParts]: (string|number)[] = input.split(' ');
    let basis = basisParts.join(' ');

    // The flex-direction of this element's flex container. Defaults to 'row'.
    const direction = (parent.direction.indexOf('column') > -1) ? 'column' : 'row';

    const max = isFlowHorizontal(direction) ? 'max-width' : 'max-height';
    const min = isFlowHorizontal(direction) ? 'min-width' : 'min-height';

    const hasCalc = String(basis).indexOf('calc') > -1;
    const usingCalc = hasCalc || (basis === 'auto');
    const isPercent = String(basis).indexOf('%') > -1 && !hasCalc;
    const hasUnits = String(basis).indexOf('px') > -1 || String(basis).indexOf('em') > -1 ||
      String(basis).indexOf('vw') > -1 || String(basis).indexOf('vh') > -1;
    const isPx = String(basis).indexOf('px') > -1 || usingCalc;

    let isValue = (hasCalc || hasUnits);

    grow = (grow == '0') ? 0 : grow;
    shrink = (shrink == '0') ? 0 : shrink;

    // make box inflexible when shrink and grow are both zero
    // should not set a min when the grow is zero
    // should not set a max when the shrink is zero
    const isFixed = !grow && !shrink;

    let css: {[key: string]: string | number | null} = {};

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
    const clearStyles = {
      'max-width': null,
      'max-height': null,
      'min-width': null,
      'min-height': null
    };
    switch (basis || '') {
      case '':
        const useColumnBasisZero = this.layoutConfig.useColumnBasisZero !== false;
        basis = direction === 'row' ? '0%' : (useColumnBasisZero ? '0.000000001px' : 'auto');
        break;
      case 'initial':   // default
      case 'nogrow':
        grow = 0;
        basis = 'auto';
        break;
      case 'grow':
        basis = '100%';
        break;
      case 'noshrink':
        shrink = 0;
        basis = 'auto';
        break;
      case 'auto':
        break;
      case 'none':
        grow = 0;
        shrink = 0;
        basis = 'auto';
        break;
      default:
        // Defaults to percentage sizing unless `px` is explicitly set
        if (!isValue && !isPercent && !isNaN(basis as any)) {
          basis = basis + '%';
        }

        // Fix for issue 280
        if (basis === '0%') {
          isValue = true;
        }

        if (basis === '0px') {
          basis = '0%';
        }

        // fix issue #5345
        if (hasCalc) {
          css = extendObject(clearStyles, {
            'flex-grow': grow,
            'flex-shrink': shrink,
            'flex-basis': isValue ? basis : '100%'
          });
        } else {
          css = extendObject(clearStyles, {
            'flex': `${grow} ${shrink} ${isValue ? basis : '100%'}`
          });
        }

        break;
    }

    if (!(css['flex'] || css['flex-grow'])) {
      if (hasCalc) {
        css = extendObject(clearStyles, {
          'flex-grow': grow,
          'flex-shrink': shrink,
          'flex-basis': basis
        });
      } else {
        css = extendObject(clearStyles, {
          'flex': `${grow} ${shrink} ${basis}`
        });
      }
    }

    // Fix for issues 277, 534, and 728
    if (basis !== '0%' && basis !== '0px' && basis !== '0.000000001px' && basis !== 'auto') {
      css[min] = isFixed || (isPx && grow) ? basis : null;
      css[max] = isFixed || (!usingCalc && shrink) ? basis : null;
    }

    // Fix for issue 528
    if (!css[min] && !css[max]) {
      if (hasCalc) {
        css = extendObject(clearStyles, {
          'flex-grow': grow,
          'flex-shrink': shrink,
          'flex-basis': basis
        });
      } else {
        css = extendObject(clearStyles, {
          'flex': `${grow} ${shrink} ${basis}`
        });
      }
    } else {
      // Fix for issue 660
      if (parent.hasWrap) {
        css[hasCalc ? 'flex-basis' : 'flex'] = css[max] ?
          (hasCalc ? css[max] : `${grow} ${shrink} ${css[max]}`) :
          (hasCalc ? css[min] : `${grow} ${shrink} ${css[min]}`);
      }
    }

    return extendObject(css, {'box-sizing': 'border-box'}) as StyleDefinition;
  }
}

/**
 * Directive to control the size of a flex item using flex-basis, flex-grow, and flex-shrink.
 * Corresponds to the css `flex` shorthand property.
 *
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
@Directive({
  selector: `
    [fxFlex],
    [fxFlex.xs], [fxFlex.sm], [fxFlex.md], [fxFlex.lg], [fxFlex.xl],
    [fxFlex.lt-sm], [fxFlex.lt-md], [fxFlex.lt-lg], [fxFlex.lt-xl],
    [fxFlex.gt-xs], [fxFlex.gt-sm], [fxFlex.gt-md], [fxFlex.gt-lg],
  `,
})
export class FlexDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

  /** The flex-direction of this element's flex container. Defaults to 'row'. */
  protected _layout?: Layout;

  /**
   * Subscription to the parent flex container's layout changes.
   * Stored so we can unsubscribe when this directive is destroyed.
   */
  protected _layoutWatcher?: Subscription;

  /* tslint:disable */
  @Input('fxShrink')     set shrink(val: string)    { this._cacheInput('shrink', val); };
  @Input('fxGrow')       set grow(val: string)      { this._cacheInput('grow', val); };

  @Input('fxFlex')       set flex(val: string)      { this._cacheInput('flex', val); };
  @Input('fxFlex.xs')    set flexXs(val: string)    { this._cacheInput('flexXs', val); };
  @Input('fxFlex.sm')    set flexSm(val: string)    { this._cacheInput('flexSm', val); };
  @Input('fxFlex.md')    set flexMd(val: string)    { this._cacheInput('flexMd', val); };
  @Input('fxFlex.lg')    set flexLg(val: string)    { this._cacheInput('flexLg', val); };
  @Input('fxFlex.xl')    set flexXl(val: string)    { this._cacheInput('flexXl', val); };

  @Input('fxFlex.gt-xs') set flexGtXs(val: string)  { this._cacheInput('flexGtXs', val); };
  @Input('fxFlex.gt-sm') set flexGtSm(val: string)  { this._cacheInput('flexGtSm', val); };
  @Input('fxFlex.gt-md') set flexGtMd(val: string)  { this._cacheInput('flexGtMd', val); };
  @Input('fxFlex.gt-lg') set flexGtLg(val: string)  { this._cacheInput('flexGtLg', val); };

  @Input('fxFlex.lt-sm') set flexLtSm(val: string) { this._cacheInput('flexLtSm', val); };
  @Input('fxFlex.lt-md') set flexLtMd(val: string) { this._cacheInput('flexLtMd', val); };
  @Input('fxFlex.lt-lg') set flexLtLg(val: string) { this._cacheInput('flexLtLg', val); };
  @Input('fxFlex.lt-xl') set flexLtXl(val: string) { this._cacheInput('flexLtXl', val); };
  /* tslint:enable */

  // Note: Explicitly @SkipSelf on LayoutDirective because we are looking
  //       for the parent flex container for this flex item.
  constructor(monitor: MediaMonitor,
              elRef: ElementRef,
              @Optional() @SkipSelf() protected _container: LayoutDirective,
              protected styleUtils: StyleUtils,
              @Inject(LAYOUT_CONFIG) protected layoutConfig: LayoutConfigOptions,
              protected styleBuilder: FlexStyleBuilder) {
    super(monitor, elRef, styleUtils, styleBuilder);

    this._cacheInput('flex', '');
    this._cacheInput('shrink', 1);
    this._cacheInput('grow', 1);
  }

  /**
   * For @Input changes on the current mq activation property, see onMediaQueryChanges()
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['flex'] != null || this._mqActivation) {
      this._updateStyle();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    super.ngOnInit();

    this._listenForMediaQueryChanges('flex', '', (changes: MediaChange) => {
      this._updateStyle(changes.value);
    });

    if (this._container) {
      // If this flex item is inside of a flex container marked with
      // Subscribe to layout immediate parent direction changes
      this._layoutWatcher = this._container.layout$.subscribe((layout) => {
        // `direction` === null if parent container does not have a `fxLayout`
        this._onLayoutChange(layout);
      });
    }
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
  protected _onLayoutChange(layout?: Layout) {
    this._layout = layout || this._layout || {direction: 'row', wrap: false};
    this._updateStyle();
  }

  protected _updateStyle(value?: string|number) {
    let flexBasis = value || this._queryInput('flex') || '';
    if (this._mqActivation) {
      flexBasis = this._mqActivation.activatedInput;
    }

    const basis = String(flexBasis).replace(';', '');
    const parts = validateBasis(basis, this._queryInput('grow'), this._queryInput('shrink'));
    const addFlexToParent = this.layoutConfig.addFlexToParent !== false;
    const direction = this._getFlexFlowDirection(this.parentElement, addFlexToParent);
    const hasWrap = this._layout && this._layout.wrap;
    if (direction === 'row' && hasWrap) {
      this._styleCache = flexRowWrapCache;
    } else if (direction === 'row' && !hasWrap) {
      this._styleCache = flexRowCache;
    } else if (direction === 'column' && hasWrap) {
      this._styleCache = flexColumnWrapCache;
    } else if (direction === 'column' && !hasWrap) {
      this._styleCache = flexColumnCache;
    }
    this.addStyles(parts.join(' '), {direction, hasWrap});
  }
}

const flexRowCache: Map<string, StyleDefinition> = new Map();
const flexColumnCache: Map<string, StyleDefinition> = new Map();
const flexRowWrapCache: Map<string, StyleDefinition> = new Map();
const flexColumnWrapCache: Map<string, StyleDefinition> = new Map();
