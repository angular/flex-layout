var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
export var FlexOrderDirective = (function (_super) {
    __extends(FlexOrderDirective, _super);
    function FlexOrderDirective(monitor, elRef, renderer) {
        _super.call(this, monitor, elRef, renderer);
    }
    Object.defineProperty(FlexOrderDirective.prototype, "order", {
        set: function (val) { this._cacheInput('order', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexOrderDirective.prototype, "orderXs", {
        set: function (val) { this._cacheInput('orderXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtXs", {
        set: function (val) { this._cacheInput('orderGtXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderSm", {
        set: function (val) { this._cacheInput('orderSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtSm", {
        set: function (val) { this._cacheInput('orderGtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderMd", {
        set: function (val) { this._cacheInput('orderMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtMd", {
        set: function (val) { this._cacheInput('orderGtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderLg", {
        set: function (val) { this._cacheInput('orderLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtLg", {
        set: function (val) { this._cacheInput('orderGtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderXl", {
        set: function (val) { this._cacheInput('orderXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * For @Input changes on the current mq activation property, see onMediaQueryChanges()
     */
    FlexOrderDirective.prototype.ngOnChanges = function (changes) {
        if (changes['order'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    FlexOrderDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('order', '0', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    // *********************************************
    // Protected methods
    // *********************************************
    FlexOrderDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("order") || '0';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    };
    FlexOrderDirective.prototype._buildCSS = function (value) {
        value = parseInt(value, 10);
        return { order: isNaN(value) ? 0 : value };
    };
    FlexOrderDirective.decorators = [
        { type: Directive, args: [{ selector: "\n  [fxFlexOrder],\n  [fxFlexOrder.xs],\n  [fxFlexOrder.gt-xs],\n  [fxFlexOrder.sm],\n  [fxFlexOrder.gt-sm],\n  [fxFlexOrder.md],\n  [fxFlexOrder.gt-md],\n  [fxFlexOrder.lg],\n  [fxFlexOrder.gt-lg],\n  [fxFlexOrder.xl]\n" },] },
    ];
    /** @nocollapse */
    FlexOrderDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    FlexOrderDirective.propDecorators = {
        'order': [{ type: Input, args: ['fxFlexOrder',] },],
        'orderXs': [{ type: Input, args: ['fxFlexOrder.xs',] },],
        'orderGtXs': [{ type: Input, args: ['fxFlexOrder.gt-xs',] },],
        'orderSm': [{ type: Input, args: ['fxFlexOrder.sm',] },],
        'orderGtSm': [{ type: Input, args: ['fxFlexOrder.gt-sm',] },],
        'orderMd': [{ type: Input, args: ['fxFlexOrder.md',] },],
        'orderGtMd': [{ type: Input, args: ['fxFlexOrder.gt-md',] },],
        'orderLg': [{ type: Input, args: ['fxFlexOrder.lg',] },],
        'orderGtLg': [{ type: Input, args: ['fxFlexOrder.gt-lg',] },],
        'orderXl': [{ type: Input, args: ['fxFlexOrder.xl',] },],
    };
    return FlexOrderDirective;
}(BaseFxDirective));
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/flexbox/api/flex-order.js.map