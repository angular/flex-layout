var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Optional, Renderer, SkipSelf } from '@angular/core';
import { extendObject } from '../../utils/object-extend';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { LayoutDirective } from './layout';
import { LayoutWrapDirective } from './layout-wrap';
/**
 * Directive to control the size of a flex item using flex-basis, flex-grow, and flex-shrink.
 * Corresponds to the css `flex` shorthand property.
 *
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
export var FlexDirective = (function (_super) {
    __extends(FlexDirective, _super);
    // Explicitly @SkipSelf on LayoutDirective and LayoutWrapDirective because we want the
    // parent flex container for this flex item.
    function FlexDirective(monitor, elRef, renderer, _container, _wrap) {
        var _this = this;
        _super.call(this, monitor, elRef, renderer);
        this._container = _container;
        this._wrap = _wrap;
        /** The flex-direction of this element's flex container. Defaults to 'row'. */
        this._layout = 'row';
        this._cacheInput("flex", "");
        this._cacheInput("shrink", 1);
        this._cacheInput("grow", 1);
        if (_container) {
            // If this flex item is inside of a flex container marked with
            // Subscribe to layout immediate parent direction changes
            this._layoutWatcher = _container.layout$.subscribe(function (direction) {
                // `direction` === null if parent container does not have a `fxLayout`
                _this._onLayoutChange(direction);
            });
        }
    }
    Object.defineProperty(FlexDirective.prototype, "flex", {
        set: function (val) {
            this._cacheInput("flex", val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexDirective.prototype, "shrink", {
        set: function (val) {
            this._cacheInput("shrink", val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexDirective.prototype, "grow", {
        set: function (val) {
            this._cacheInput("grow", val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexDirective.prototype, "flexXs", {
        set: function (val) {
            this._cacheInput('flexXs', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexDirective.prototype, "flexGtXs", {
        set: function (val) {
            this._cacheInput('flexGtXs', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexDirective.prototype, "flexSm", {
        set: function (val) {
            this._cacheInput('flexSm', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexDirective.prototype, "flexGtSm", {
        set: function (val) {
            this._cacheInput('flexGtSm', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexDirective.prototype, "flexMd", {
        set: function (val) {
            this._cacheInput('flexMd', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexDirective.prototype, "flexGtMd", {
        set: function (val) {
            this._cacheInput('flexGtMd', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexDirective.prototype, "flexLg", {
        set: function (val) {
            this._cacheInput('flexLg', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexDirective.prototype, "flexGtLg", {
        set: function (val) {
            this._cacheInput('flexGtLg', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexDirective.prototype, "flexXl", {
        set: function (val) {
            this._cacheInput('flexXl', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * For @Input changes on the current mq activation property, see onMediaQueryChanges()
     */
    FlexDirective.prototype.ngOnChanges = function (changes) {
        if (changes['flex'] != null || this._mqActivation) {
            this._onLayoutChange();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    FlexDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('flex', '', function (changes) {
            _this._updateStyle(changes.value);
        });
        this._onLayoutChange();
    };
    FlexDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    };
    /**
     * Caches the parent container's 'flex-direction' and updates the element's style.
     * Used as a handler for layout change events from the parent flex container.
     */
    FlexDirective.prototype._onLayoutChange = function (direction) {
        this._layout = direction || this._layout || "row";
        this._updateStyle();
    };
    FlexDirective.prototype._updateStyle = function (value) {
        var flexBasis = value || this._queryInput("flex") || '';
        if (this._mqActivation) {
            flexBasis = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._validateValue.apply(this, this._parseFlexParts(String(flexBasis))));
    };
    /**
     * If the used the short-form `fxFlex="1 0 37%"`, then parse the parts
     */
    FlexDirective.prototype._parseFlexParts = function (basis) {
        basis = basis.replace(";", "");
        var hasCalc = basis && basis.indexOf("calc") > -1;
        var matches = !hasCalc ? basis.split(" ") : this._getPartsWithCalc(basis.trim());
        return (matches.length === 3) ? matches : [this._queryInput("grow"),
            this._queryInput("shrink"), basis];
    };
    /**
     * Extract more complicated short-hand versions.
     * e.g.
     * fxFlex="3 3 calc(15em + 20px)"
     */
    FlexDirective.prototype._getPartsWithCalc = function (value) {
        var parts = [this._queryInput("grow"), this._queryInput("shrink"), value];
        var j = value.indexOf('calc');
        if (j > 0) {
            parts[2] = value.substring(j);
            var matches = value.substr(0, j).trim().split(" ");
            if (matches.length == 2) {
                parts[0] = matches[0];
                parts[1] = matches[1];
            }
        }
        return parts;
    };
    /**
     * Validate the value to be one of the acceptable value options
     * Use default fallback of "row"
     */
    FlexDirective.prototype._validateValue = function (grow, shrink, basis) {
        var css, isValue;
        var direction = (this._layout === 'column') || (this._layout == 'column-reverse') ?
            'column' :
            'row';
        if (grow == "0") {
            grow = 0;
        }
        if (shrink == "0") {
            shrink = 0;
        }
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
        var clearStyles = {
            'max-width': null,
            'max-height': null,
            'min-width': null,
            'min-height': null
        };
        switch (basis || '') {
            case '':
                css = extendObject(clearStyles, { 'flex': '1 1 0.000000001px' });
                break;
            case 'initial': // default
            case 'nogrow':
                grow = 0;
                css = extendObject(clearStyles, { 'flex': '0 1 auto' });
                break;
            case 'grow':
                css = extendObject(clearStyles, { 'flex': '1 1 100%' });
                break;
            case 'noshrink':
                shrink = 0;
                css = extendObject(clearStyles, { 'flex': '1 0 auto' });
                break;
            case 'auto':
                css = extendObject(clearStyles, { 'flex': grow + " " + shrink + " auto" });
                break;
            case 'none':
                grow = 0;
                shrink = 0;
                css = extendObject(clearStyles, { 'flex': '0 0 auto' });
                break;
            default:
                var isPercent = String(basis).indexOf('%') > -1;
                isValue = String(basis).indexOf('px') > -1 ||
                    String(basis).indexOf('calc') > -1 ||
                    String(basis).indexOf('em') > -1 ||
                    String(basis).indexOf('vw') > -1 ||
                    String(basis).indexOf('vh') > -1;
                // Defaults to percentage sizing unless `px` is explicitly set
                if (!isValue && !isPercent && !isNaN(basis)) {
                    basis = basis + '%';
                }
                if (basis === '0px') {
                    basis = '0%';
                }
                // Set max-width = basis if using layout-wrap
                // tslint:disable-next-line:max-line-length
                // @see https://github.com/philipwalton/flexbugs#11-min-and-max-size-declarations-are-ignored-when-wrappifl-flex-items
                css = extendObject(clearStyles, {
                    'flex': grow + " " + shrink + " " + ((isValue || this._wrap) ? basis : '100%'),
                });
                break;
        }
        var max = (direction === 'row') ? 'max-width' : 'max-height';
        var min = (direction === 'row') ? 'min-width' : 'min-height';
        var usingCalc = (String(basis).indexOf('calc') > -1) || (basis == 'auto');
        var isPx = String(basis).indexOf('px') > -1 || usingCalc;
        // make box inflexible when shrink and grow are both zero
        // should not set a min when the grow is zero
        // should not set a max when the shrink is zero
        var isFixed = !grow && !shrink;
        css[min] = (basis == '0%') ? 0 : isFixed || (isPx && grow) ? basis : null;
        css[max] = (basis == '0%') ? 0 : isFixed || (!usingCalc && shrink) ? basis : null;
        return extendObject(css, { 'box-sizing': 'border-box' });
    };
    FlexDirective.decorators = [
        { type: Directive, args: [{ selector: "\n  [fxFlex],\n  [fxFlex.xs],\n  [fxFlex.gt-xs],\n  [fxFlex.sm],\n  [fxFlex.gt-sm],\n  [fxFlex.md],\n  [fxFlex.gt-md],\n  [fxFlex.lg],\n  [fxFlex.gt-lg],\n  [fxFlex.xl]\n"
                },] },
    ];
    /** @nocollapse */
    FlexDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: ElementRef, },
        { type: Renderer, },
        { type: LayoutDirective, decorators: [{ type: Optional }, { type: SkipSelf },] },
        { type: LayoutWrapDirective, decorators: [{ type: Optional }, { type: SkipSelf },] },
    ]; };
    FlexDirective.propDecorators = {
        'flex': [{ type: Input, args: ['fxFlex',] },],
        'shrink': [{ type: Input, args: ['fxShrink',] },],
        'grow': [{ type: Input, args: ['fxGrow',] },],
        'flexXs': [{ type: Input, args: ['fxFlex.xs',] },],
        'flexGtXs': [{ type: Input, args: ['fxFlex.gt-xs',] },],
        'flexSm': [{ type: Input, args: ['fxFlex.sm',] },],
        'flexGtSm': [{ type: Input, args: ['fxFlex.gt-sm',] },],
        'flexMd': [{ type: Input, args: ['fxFlex.md',] },],
        'flexGtMd': [{ type: Input, args: ['fxFlex.gt-md',] },],
        'flexLg': [{ type: Input, args: ['fxFlex.lg',] },],
        'flexGtLg': [{ type: Input, args: ['fxFlex.gt-lg',] },],
        'flexXl': [{ type: Input, args: ['fxFlex.xl',] },],
    };
    return FlexDirective;
}(BaseFxDirective));
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/flexbox/api/flex.js.map