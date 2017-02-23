var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer, Self, Optional } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { LayoutDirective } from './layout';
var FALSY = ['false', false, 0];
/**
 * For fxHide selectors, we invert the 'value'
 * and assign to the equivalent fxShow selector cache
 *  - When 'hide' === '' === true, do NOT show the element
 *  - When 'hide' === false or 0... we WILL show the element
 */
export function negativeOf(hide) {
    return (hide === "") ? false :
        ((hide === "false") || (hide === 0)) ? true : !hide;
}
/**
 * 'show' Layout API directive
 *
 */
export var ShowHideDirective = (function (_super) {
    __extends(ShowHideDirective, _super);
    /**
     *
     */
    function ShowHideDirective(monitor, _layout, elRef, renderer) {
        var _this = this;
        _super.call(this, monitor, elRef, renderer);
        this._layout = _layout;
        this.elRef = elRef;
        this.renderer = renderer;
        this._display = this._getDisplayStyle(); // re-invoke override to use `this._layout`
        if (_layout) {
            /**
             * The Layout can set the display:flex (and incorrectly affect the Hide/Show directives.
             * Whenever Layout [on the same element] resets its CSS, then update the Hide/Show CSS
             */
            this._layoutWatcher = _layout.layout$.subscribe(function () { return _this._updateWithValue(); });
        }
    }
    Object.defineProperty(ShowHideDirective.prototype, "show", {
        set: function (val) {
            this._cacheInput("show", val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowHideDirective.prototype, "hide", {
        set: function (val) {
            this._cacheInput("show", negativeOf(val));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowHideDirective.prototype, "showXs", {
        set: function (val) {
            this._cacheInput('showXs', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowHideDirective.prototype, "hideXs", {
        set: function (val) {
            this._cacheInput("showXs", negativeOf(val));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowHideDirective.prototype, "showGtXs", {
        set: function (val) {
            this._cacheInput('showGtXs', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideGtXs", {
        set: function (val) {
            this._cacheInput('showGtXs', negativeOf(val));
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showSm", {
        set: function (val) {
            this._cacheInput('showSm', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideSm", {
        set: function (val) {
            this._cacheInput('showSm', negativeOf(val));
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showGtSm", {
        set: function (val) {
            this._cacheInput('showGtSm', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideGtSm", {
        set: function (val) {
            this._cacheInput('showGtSm', negativeOf(val));
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showMd", {
        set: function (val) {
            this._cacheInput('showMd', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideMd", {
        set: function (val) {
            this._cacheInput('showMd', negativeOf(val));
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showGtMd", {
        set: function (val) {
            this._cacheInput('showGtMd', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideGtMd", {
        set: function (val) {
            this._cacheInput('showGtMd', negativeOf(val));
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showLg", {
        set: function (val) {
            this._cacheInput('showLg', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideLg", {
        set: function (val) {
            this._cacheInput('showLg', negativeOf(val));
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showGtLg", {
        set: function (val) {
            this._cacheInput('showGtLg', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideGtLg", {
        set: function (val) {
            this._cacheInput('showGtLg', negativeOf(val));
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showXl", {
        set: function (val) {
            this._cacheInput('showXl', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideXl", {
        set: function (val) {
            this._cacheInput('showXl', negativeOf(val));
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
    ShowHideDirective.prototype._getDisplayStyle = function () {
        return this._layout ? "flex" : _super.prototype._getDisplayStyle.call(this);
    };
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxShow')
     * Then conditionally override with the mq-activated Input's current value
     */
    ShowHideDirective.prototype.ngOnChanges = function (changes) {
        if (changes['show'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ShowHideDirective.prototype.ngOnInit = function () {
        var _this = this;
        var value = this._getDefaultVal("show", true);
        // Build _mqActivation controller
        this._listenForMediaQueryChanges('show', value, function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    ShowHideDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /** Validate the visibility value and then update the host's inline display style */
    ShowHideDirective.prototype._updateWithValue = function (value) {
        value = value || this._getDefaultVal("show", true);
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        var shouldShow = this._validateTruthy(value);
        this._applyStyleToElement(this._buildCSS(shouldShow));
    };
    /** Build the CSS that should be assigned to the element instance */
    ShowHideDirective.prototype._buildCSS = function (show) {
        return { 'display': show ? this._display : 'none' };
    };
    /**  Validate the to be not FALSY */
    ShowHideDirective.prototype._validateTruthy = function (show) {
        return (FALSY.indexOf(show) == -1);
    };
    ShowHideDirective.decorators = [
        { type: Directive, args: [{
                    selector: "\n  [fxShow],\n  [fxShow.xs],[fxShow.gt-xs],[fxShow.sm],[fxShow.gt-sm],\n  [fxShow.md],[fxShow.gt-md],[fxShow.lg],[fxShow.gt-lg],[fxShow.xl],  \n  [fxHide],\n  [fxHide.xs],[fxHide.gt-xs],[fxHide.sm],[fxHide.gt-sm],\n  [fxHide.md],[fxHide.gt-md],[fxHide.lg],[fxHide.gt-lg],[fxHide.xl]  \n"
                },] },
    ];
    /** @nocollapse */
    ShowHideDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    ShowHideDirective.propDecorators = {
        'show': [{ type: Input, args: ['fxShow',] },],
        'hide': [{ type: Input, args: ['fxHide',] },],
        'showXs': [{ type: Input, args: ['fxShow.xs',] },],
        'hideXs': [{ type: Input, args: ['fxHide.xs',] },],
        'showGtXs': [{ type: Input, args: ['fxShow.gt-xs',] },],
        'hideGtXs': [{ type: Input, args: ['fxHide.gt-xs',] },],
        'showSm': [{ type: Input, args: ['fxShow.sm',] },],
        'hideSm': [{ type: Input, args: ['fxHide.sm',] },],
        'showGtSm': [{ type: Input, args: ['fxShow.gt-sm',] },],
        'hideGtSm': [{ type: Input, args: ['fxHide.gt-sm',] },],
        'showMd': [{ type: Input, args: ['fxShow.md',] },],
        'hideMd': [{ type: Input, args: ['fxHide.md',] },],
        'showGtMd': [{ type: Input, args: ['fxShow.gt-md',] },],
        'hideGtMd': [{ type: Input, args: ['fxHide.gt-md',] },],
        'showLg': [{ type: Input, args: ['fxShow.lg',] },],
        'hideLg': [{ type: Input, args: ['fxHide.lg',] },],
        'showGtLg': [{ type: Input, args: ['fxShow.gt-lg',] },],
        'hideGtLg': [{ type: Input, args: ['fxHide.gt-lg',] },],
        'showXl': [{ type: Input, args: ['fxShow.xl',] },],
        'hideXl': [{ type: Input, args: ['fxHide.xl',] },],
    };
    return ShowHideDirective;
}(BaseFxDirective));
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/flexbox/api/show-hide.js.map