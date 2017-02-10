var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer, Self, Optional } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
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
    function HideDirective(monitor, _layout, elRef, renderer) {
        var _this = this;
        _super.call(this, monitor, elRef, renderer);
        this._layout = _layout;
        this.elRef = elRef;
        this.renderer = renderer;
        /**
         * The Layout can set the display:flex (and incorrectly affect the Hide/Show directives.
         * Whenever Layout [on the same element] resets its CSS, then update the Hide/Show CSS
         */
        if (_layout) {
            this._layoutWatcher = _layout.layout$.subscribe(function () { return _this._updateWithValue(); });
        }
        this._display = this._getDisplayStyle(); // re-invoke override to use `this._layout`
    }
    Object.defineProperty(HideDirective.prototype, "hide", {
        set: function (val) {
            this._cacheInput("hide", val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HideDirective.prototype, "hideXs", {
        set: function (val) {
            this._cacheInput('hideXs', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HideDirective.prototype, "hideGtXs", {
        set: function (val) {
            this._cacheInput('hideGtXs', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideSm", {
        set: function (val) {
            this._cacheInput('hideSm', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideGtSm", {
        set: function (val) {
            this._cacheInput('hideGtSm', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideMd", {
        set: function (val) {
            this._cacheInput('hideMd', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideGtMd", {
        set: function (val) {
            this._cacheInput('hideGtMd', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideLg", {
        set: function (val) {
            this._cacheInput('hideLg', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideGtLg", {
        set: function (val) {
            this._cacheInput('hideGtLg', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(HideDirective.prototype, "hideXl", {
        set: function (val) {
            this._cacheInput('hideXl', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * Override accessor to the current HTMLElement's `display` style
     * Note: Show/Hide will not change the display to 'flex' but will set it to 'block'
     * unless it was already explicitly defined.
     */
    HideDirective.prototype._getDisplayStyle = function () {
        return this._layout ? "flex" : _super.prototype._getDisplayStyle.call(this);
    };
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxHide')
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
     * NOTE: fxHide has special fallback defaults.
     *       - If the non-responsive fxHide="" is specified we default to hide==true
     *       - If the non-responsive fxHide is NOT specified, use default hide == false
     *       This logic supports mixed usages with fxShow; e.g. `<div fxHide fxShow.gt-sm>`
     */
    HideDirective.prototype.ngOnInit = function () {
        var _this = this;
        // If the attribute 'fxHide' is specified we default to hide==true, otherwise do nothing..
        var value = (this._queryInput('hide') == "") ? true : this._getDefaultVal("hide", false);
        this._listenForMediaQueryChanges('hide', value, function (changes) {
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
        value = value || this._getDefaultVal("hide", false);
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        var shouldHide = this._validateTruthy(value);
        this._applyStyleToElement(this._buildCSS(shouldHide));
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
        { type: Directive, args: [{
                    selector: "\n  [fxHide],\n  [fxHide.xs],\n  [fxHide.gt-xs],\n  [fxHide.sm],\n  [fxHide.gt-sm],\n  [fxHide.md],\n  [fxHide.gt-md],\n  [fxHide.lg],\n  [fxHide.gt-lg],\n  [fxHide.xl]\n"
                },] },
    ];
    /** @nocollapse */
    HideDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    HideDirective.propDecorators = {
        'hide': [{ type: Input, args: ['fxHide',] },],
        'hideXs': [{ type: Input, args: ['fxHide.xs',] },],
        'hideGtXs': [{ type: Input, args: ['fxHide.gt-xs',] },],
        'hideSm': [{ type: Input, args: ['fxHide.sm',] },],
        'hideGtSm': [{ type: Input, args: ['fxHide.gt-sm',] },],
        'hideMd': [{ type: Input, args: ['fxHide.md',] },],
        'hideGtMd': [{ type: Input, args: ['fxHide.gt-md',] },],
        'hideLg': [{ type: Input, args: ['fxHide.lg',] },],
        'hideGtLg': [{ type: Input, args: ['fxHide.gt-lg',] },],
        'hideXl': [{ type: Input, args: ['fxHide.xl',] },],
    };
    return HideDirective;
}(BaseFxDirective));
var FALSY = ['false', false, 0];
//# sourceMappingURL=/usr/local/google/home/tinagao/WebstormProjects/caretaker/flex-layout/src/lib/flexbox/api/hide.js.map