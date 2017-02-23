var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
export var LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];
/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
export var LayoutDirective = (function (_super) {
    __extends(LayoutDirective, _super);
    /**
     *
     */
    function LayoutDirective(monitor, elRef, renderer) {
        _super.call(this, monitor, elRef, renderer);
        this._announcer = new BehaviorSubject("row");
        this.layout$ = this._announcer.asObservable();
    }
    Object.defineProperty(LayoutDirective.prototype, "layout", {
        set: function (val) { this._cacheInput("layout", val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutXs", {
        set: function (val) { this._cacheInput('layoutXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutGtXs", {
        set: function (val) { this._cacheInput('layoutGtXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutSm", {
        set: function (val) { this._cacheInput('layoutSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutGtSm", {
        set: function (val) { this._cacheInput('layoutGtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutMd", {
        set: function (val) { this._cacheInput('layoutMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutGtMd", {
        set: function (val) { this._cacheInput('layoutGtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutLg", {
        set: function (val) { this._cacheInput('layoutLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutGtLg", {
        set: function (val) { this._cacheInput('layoutGtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutXl", {
        set: function (val) { this._cacheInput('layoutXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxLayout')
     * Then conditionally override with the mq-activated Input's current value
     */
    LayoutDirective.prototype.ngOnChanges = function (changes) {
        if (changes['layout'] != null || this._mqActivation) {
            this._updateWithDirection();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    LayoutDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('layout', 'row', function (changes) {
            _this._updateWithDirection(changes.value);
        });
        this._updateWithDirection();
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Validate the direction value and then update the host's inline flexbox styles
     */
    LayoutDirective.prototype._updateWithDirection = function (direction) {
        direction = direction || this._queryInput("layout") || 'row';
        if (this._mqActivation) {
            direction = this._mqActivation.activatedInput;
        }
        direction = this._validateValue(direction);
        // Update styles and announce to subscribers the *new* direction
        this._applyStyleToElement(this._buildCSS(direction));
        this._announcer.next(direction);
    };
    /**
     * Build the CSS that should be assigned to the element instance
     * BUG:
     *
     *   1) min-height on a column flex container won’t apply to its flex item children in IE 10-11.
     *      Use height instead if possible; height : <xxx>vh;
     *
     * @todo - update all child containers to have "box-sizing: border-box"
     *         This way any padding or border specified on the child elements are
     *         laid out and drawn inside that element's specified width and height.
     *
     */
    LayoutDirective.prototype._buildCSS = function (value) {
        return { 'display': 'flex', 'box-sizing': 'border-box', 'flex-direction': value };
    };
    /**
     * Validate the value to be one of the acceptable value options
     * Use default fallback of "row"
     */
    LayoutDirective.prototype._validateValue = function (value) {
        value = value ? value.toLowerCase() : '';
        return LAYOUT_VALUES.find(function (x) { return x === value; }) ? value : LAYOUT_VALUES[0]; // "row"
    };
    LayoutDirective.decorators = [
        { type: Directive, args: [{ selector: "\n  [fxLayout],\n  [fxLayout.xs],\n  [fxLayout.gt-xs],\n  [fxLayout.sm],\n  [fxLayout.gt-sm],\n  [fxLayout.md],\n  [fxLayout.gt-md],\n  [fxLayout.lg],\n  [fxLayout.gt-lg],\n  [fxLayout.xl]\n" },] },
    ];
    /** @nocollapse */
    LayoutDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    LayoutDirective.propDecorators = {
        'layout': [{ type: Input, args: ['fxLayout',] },],
        'layoutXs': [{ type: Input, args: ['fxLayout.xs',] },],
        'layoutGtXs': [{ type: Input, args: ['fxLayout.gt-xs',] },],
        'layoutSm': [{ type: Input, args: ['fxLayout.sm',] },],
        'layoutGtSm': [{ type: Input, args: ['fxLayout.gt-sm',] },],
        'layoutMd': [{ type: Input, args: ['fxLayout.md',] },],
        'layoutGtMd': [{ type: Input, args: ['fxLayout.gt-md',] },],
        'layoutLg': [{ type: Input, args: ['fxLayout.lg',] },],
        'layoutGtLg': [{ type: Input, args: ['fxLayout.gt-lg',] },],
        'layoutXl': [{ type: Input, args: ['fxLayout.xl',] },],
    };
    return LayoutDirective;
}(BaseFxDirective));
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/flexbox/api/layout.js.map