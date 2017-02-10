var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer, Self, Optional } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { LayoutDirective } from './layout';
import { HideDirective } from './hide';
var FALSY = ['false', false, 0];
/**
 * 'show' Layout API directive
 *
 */
export var ShowDirective = (function (_super) {
    __extends(ShowDirective, _super);
    /**
     *
     */
    function ShowDirective(monitor, _layout, _hide, elRef, renderer) {
        var _this = this;
        _super.call(this, monitor, elRef, renderer);
        this._layout = _layout;
        this._hide = _hide;
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
    Object.defineProperty(ShowDirective.prototype, "show", {
        set: function (val) {
            this._cacheInput("show", val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowDirective.prototype, "showXs", {
        set: function (val) {
            this._cacheInput('showXs', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowDirective.prototype, "showGtXs", {
        set: function (val) {
            this._cacheInput('showGtXs', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showSm", {
        set: function (val) {
            this._cacheInput('showSm', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showGtSm", {
        set: function (val) {
            this._cacheInput('showGtSm', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showMd", {
        set: function (val) {
            this._cacheInput('showMd', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showGtMd", {
        set: function (val) {
            this._cacheInput('showGtMd', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showLg", {
        set: function (val) {
            this._cacheInput('showLg', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showGtLg", {
        set: function (val) {
            this._cacheInput('showGtLg', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showXl", {
        set: function (val) {
            this._cacheInput('showXl', val);
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
    ShowDirective.prototype._getDisplayStyle = function () {
        var element = this._elementRef.nativeElement;
        return element.style['display'] || (this._layout ? "flex" : "block");
    };
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxShow')
     * Then conditionally override with the mq-activated Input's current value
     */
    ShowDirective.prototype.ngOnChanges = function (changes) {
        if (changes['show'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ShowDirective.prototype.ngOnInit = function () {
        var _this = this;
        var value = this._getDefaultVal("show", true);
        // Build _mqActivation controller
        this._listenForMediaQueryChanges('show', value, function (changes) {
            if (!_this._delegateToHide(changes)) {
                _this._updateWithValue(changes.value);
            }
        });
        if (!this._delegateToHide()) {
            this._updateWithValue();
        }
    };
    ShowDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * If deactiving Show, then delegate action to the Hide directive if it is
     * specified on same element.
     */
    ShowDirective.prototype._delegateToHide = function (changes) {
        if (this._hide) {
            var delegate = (changes && !changes.matches) || (!changes && !this.hasKeyValue('show'));
            if (delegate) {
                this._hide.ngOnChanges({});
                return true;
            }
        }
        return false;
    };
    /** Validate the visibility value and then update the host's inline display style */
    ShowDirective.prototype._updateWithValue = function (value) {
        value = value || this._getDefaultVal("show", true);
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        var shouldShow = this._validateTruthy(value);
        this._applyStyleToElement(this._buildCSS(shouldShow));
    };
    /** Build the CSS that should be assigned to the element instance */
    ShowDirective.prototype._buildCSS = function (show) {
        return { 'display': show ? this._display : 'none' };
    };
    /**  Validate the to be not FALSY */
    ShowDirective.prototype._validateTruthy = function (show) {
        return (FALSY.indexOf(show) == -1);
    };
    ShowDirective.decorators = [
        { type: Directive, args: [{
                    selector: "\n  [fxShow],\n  [fxShow.xs],\n  [fxShow.gt-xs],\n  [fxShow.sm],\n  [fxShow.gt-sm],\n  [fxShow.md],\n  [fxShow.gt-md],\n  [fxShow.lg],\n  [fxShow.gt-lg],\n  [fxShow.xl]\n"
                },] },
    ];
    /** @nocollapse */
    ShowDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
        { type: HideDirective, decorators: [{ type: Optional }, { type: Self },] },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    ShowDirective.propDecorators = {
        'show': [{ type: Input, args: ['fxShow',] },],
        'showXs': [{ type: Input, args: ['fxShow.xs',] },],
        'showGtXs': [{ type: Input, args: ['fxShow.gt-xs',] },],
        'showSm': [{ type: Input, args: ['fxShow.sm',] },],
        'showGtSm': [{ type: Input, args: ['fxShow.gt-sm',] },],
        'showMd': [{ type: Input, args: ['fxShow.md',] },],
        'showGtMd': [{ type: Input, args: ['fxShow.gt-md',] },],
        'showLg': [{ type: Input, args: ['fxShow.lg',] },],
        'showGtLg': [{ type: Input, args: ['fxShow.gt-lg',] },],
        'showXl': [{ type: Input, args: ['fxShow.xl',] },],
    };
    return ShowDirective;
}(BaseFxDirective));
//# sourceMappingURL=/usr/local/google/home/tinagao/WebstormProjects/caretaker/flex-layout/src/lib/flexbox/api/show.js.map