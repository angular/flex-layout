var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer, Self, Optional } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { ShowDirective } from "./show";
import { LayoutDirective } from './layout';
/**
 * 'show' Layout API directive
 *
 */
export var HideDirective = (function (_super) {
    __extends(HideDirective, _super);
    /**
     *
     */
    function HideDirective(monitor, _layout, _showDirective, elRef, renderer) {
        var _this = this;
        _super.call(this, monitor, elRef, renderer);
        this._layout = _layout;
        this._showDirective = _showDirective;
        this.elRef = elRef;
        this.renderer = renderer;
        /**
         * Original dom Elements CSS display style
         */
        this._display = 'flex';
        if (_layout) {
            /**
             * The Layout can set the display:flex (and incorrectly affect the Hide/Show directives.
             * Whenever Layout [on the same element] resets its CSS, then update the Hide/Show CSS
             */
            this._layoutWatcher = _layout.layout$.subscribe(function () { return _this._updateWithValue(); });
        }
    }
    Object.defineProperty(HideDirective.prototype, "hide", {
        set: function (val) { this._cacheInput("hide", val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HideDirective.prototype, "hideXs", {
        set: function (val) { this._cacheInput('hideXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HideDirective.prototype, "hideGtXs", {
        set: function (val) { this._cacheInput('hideGtXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideSm", {
        set: function (val) { this._cacheInput('hideSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideGtSm", {
        set: function (val) { this._cacheInput('hideGtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideMd", {
        set: function (val) { this._cacheInput('hideMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideGtMd", {
        set: function (val) { this._cacheInput('hideGtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideLg", {
        set: function (val) { this._cacheInput('hideLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideGtLg", {
        set: function (val) { this._cacheInput('hideGtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideXl", {
        set: function (val) { this._cacheInput('hideXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "usesShowAPI", {
        /**
         * Does the current element also use the fx-show API ?
         */
        get: function () {
            return !!this._showDirective;
        },
        enumerable: true,
        configurable: true
    });
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fx-hide')
     * Then conditionally override with the mq-activated Input's current value
     */
    HideDirective.prototype.ngOnChanges = function (changes) {
        if (changes['hide'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    HideDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('hide', true, function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    HideDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Validate the visibility value and then update the host's inline display style
     */
    HideDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("hide") || true;
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        var shouldHide = this._validateTruthy(value);
        if (shouldHide || !this.usesShowAPI) {
            this._applyStyleToElement(this._buildCSS(shouldHide));
        }
    };
    /**
     * Build the CSS that should be assigned to the element instance
     */
    HideDirective.prototype._buildCSS = function (value) {
        return { 'display': value ? 'none' : this._display };
    };
    /**
     * Validate the value to NOT be FALSY
     */
    HideDirective.prototype._validateTruthy = function (value) {
        return FALSY.indexOf(value) === -1;
    };
    HideDirective.decorators = [
        { type: Directive, args: [{ selector: "\n  [fx-hide],\n  [fx-hide.xs]\n  [fx-hide.gt-xs],\n  [fx-hide.sm],\n  [fx-hide.gt-sm]\n  [fx-hide.md],\n  [fx-hide.gt-md]\n  [fx-hide.lg],\n  [fx-hide.gt-lg],\n  [fx-hide.xl]\n" },] },
    ];
    /** @nocollapse */
    HideDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
        { type: ShowDirective, decorators: [{ type: Optional }, { type: Self },] },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    HideDirective.propDecorators = {
        'hide': [{ type: Input, args: ['fx-hide',] },],
        'hideXs': [{ type: Input, args: ['fx-hide.xs',] },],
        'hideGtXs': [{ type: Input, args: ['fx-hide.gt-xs',] },],
        'hideSm': [{ type: Input, args: ['fx-hide.sm',] },],
        'hideGtSm': [{ type: Input, args: ['fx-hide.gt-sm',] },],
        'hideMd': [{ type: Input, args: ['fx-hide.md',] },],
        'hideGtMd': [{ type: Input, args: ['fx-hide.gt-md',] },],
        'hideLg': [{ type: Input, args: ['fx-hide.lg',] },],
        'hideGtLg': [{ type: Input, args: ['fx-hide.gt-lg',] },],
        'hideXl': [{ type: Input, args: ['fx-hide.xl',] },],
    };
    return HideDirective;
}(BaseFxDirective));
var FALSY = ['false', false, 0];
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/api/hide.js.map