var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer, Self, Optional } from '@angular/core';
import { extendObject } from '../../utils/object-extend';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { LayoutDirective, LAYOUT_VALUES } from './layout';
/**
 * 'layout-wrap' flexbox styling directive
 * Defines wrapping of child elements in layout container
 * Optional values: reverse, wrap-reverse, none, nowrap, wrap (default)]
 * @see https://css-tricks.com/almanac/properties/f/flex-wrap/
 */
export var LayoutWrapDirective = (function (_super) {
    __extends(LayoutWrapDirective, _super);
    function LayoutWrapDirective(monitor, elRef, renderer, container) {
        _super.call(this, monitor, elRef, renderer);
        this._layout = 'row'; // default flex-direction
        if (container) {
            this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
        }
    }
    Object.defineProperty(LayoutWrapDirective.prototype, "wrap", {
        set: function (val) { this._cacheInput("wrap", val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapXs", {
        set: function (val) { this._cacheInput('wrapXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapGtXs", {
        set: function (val) { this._cacheInput('wrapGtXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapSm", {
        set: function (val) { this._cacheInput('wrapSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapGtSm", {
        set: function (val) { this._cacheInput('wrapGtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapMd", {
        set: function (val) { this._cacheInput('wrapMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapGtMd", {
        set: function (val) { this._cacheInput('wrapGtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapLg", {
        set: function (val) { this._cacheInput('wrapLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapGtLg", {
        set: function (val) { this._cacheInput('wrapGtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapXl", {
        set: function (val) { this._cacheInput('wrapXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    LayoutWrapDirective.prototype.ngOnChanges = function (changes) {
        if (changes['wrap'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    LayoutWrapDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('wrap', 'wrap', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     */
    LayoutWrapDirective.prototype._onLayoutChange = function (direction) {
        var _this = this;
        this._layout = (direction || '').toLowerCase().replace('-reverse', '');
        if (!LAYOUT_VALUES.find(function (x) { return x === _this._layout; })) {
            this._layout = 'row';
        }
        this._updateWithValue();
    };
    LayoutWrapDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("wrap") || 'wrap';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        value = this._validateValue(value);
        this._applyStyleToElement(this._buildCSS(value));
    };
    /**
     * Build the CSS that should be assigned to the element instance
     */
    LayoutWrapDirective.prototype._buildCSS = function (value) {
        return extendObject({ 'flex-wrap': value }, {
            'display': 'flex',
            'flex-direction': this._layout || 'row'
        });
    };
    /**
     * Convert layout-wrap="<value>" to expected flex-wrap style
     */
    LayoutWrapDirective.prototype._validateValue = function (value) {
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
    };
    LayoutWrapDirective.decorators = [
        { type: Directive, args: [{ selector: "\n  [fxLayoutWrap],\n  [fxLayoutWrap.xs],\n  [fxLayoutWrap.gt-xs],\n  [fxLayoutWrap.sm],\n  [fxLayoutWrap.gt-sm],\n  [fxLayoutWrap.md],\n  [fxLayoutWrap.gt-md],\n  [fxLayoutWrap.lg],\n  [fxLayoutWrap.gt-lg],\n  [fxLayoutWrap.xl]\n" },] },
    ];
    /** @nocollapse */
    LayoutWrapDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: ElementRef, },
        { type: Renderer, },
        { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
    ]; };
    LayoutWrapDirective.propDecorators = {
        'wrap': [{ type: Input, args: ['fxLayoutWrap',] },],
        'wrapXs': [{ type: Input, args: ['fxLayoutWrap.xs',] },],
        'wrapGtXs': [{ type: Input, args: ['fxLayoutWrap.gt-xs',] },],
        'wrapSm': [{ type: Input, args: ['fxLayoutWrap.sm',] },],
        'wrapGtSm': [{ type: Input, args: ['fxLayoutWrap.gt-sm',] },],
        'wrapMd': [{ type: Input, args: ['fxLayoutWrap.md',] },],
        'wrapGtMd': [{ type: Input, args: ['fxLayoutWrap.gt-md',] },],
        'wrapLg': [{ type: Input, args: ['fxLayoutWrap.lg',] },],
        'wrapGtLg': [{ type: Input, args: ['fxLayoutWrap.gt-lg',] },],
        'wrapXl': [{ type: Input, args: ['fxLayoutWrap.xl',] },],
    };
    return LayoutWrapDirective;
}(BaseFxDirective));
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/flexbox/api/layout-wrap.js.map