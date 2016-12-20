var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer, Self, Optional, Inject, forwardRef } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { HideDirective } from "./hide";
import { LayoutDirective } from './layout';
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
    function ShowDirective(monitor, _layout, _hideDirective, elRef, renderer) {
        var _this = this;
        _super.call(this, monitor, elRef, renderer);
        this._layout = _layout;
        this._hideDirective = _hideDirective;
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
    Object.defineProperty(ShowDirective.prototype, "show", {
        set: function (val) { this._cacheInput("show", val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowDirective.prototype, "showXs", {
        set: function (val) { this._cacheInput('showXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowDirective.prototype, "showGtXs", {
        set: function (val) { this._cacheInput('showGtXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showSm", {
        set: function (val) { this._cacheInput('showSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showGtSm", {
        set: function (val) { this._cacheInput('showGtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showMd", {
        set: function (val) { this._cacheInput('showMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showGtMd", {
        set: function (val) { this._cacheInput('showGtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showLg", {
        set: function (val) { this._cacheInput('showLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showGtLg", {
        set: function (val) { this._cacheInput('showGtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "showXl", {
        set: function (val) { this._cacheInput('showXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowDirective.prototype, "usesHideAPI", {
        /**
          * Does the current element also use the fx-show API ?
          */
        get: function () {
            return !!this._hideDirective;
        },
        enumerable: true,
        configurable: true
    });
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fx-show')
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
        this._listenForMediaQueryChanges('show', true, function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
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
    /** Validate the visibility value and then update the host's inline display style */
    ShowDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("show") || true;
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        var shouldShow = this._validateTruthy(value);
        if (shouldShow || !this.usesHideAPI) {
            this._applyStyleToElement(this._buildCSS(shouldShow));
        }
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
        { type: Directive, args: [{ selector: "\n  [fx-show],\n  [fx-show.xs]\n  [fx-show.gt-xs],\n  [fx-show.sm],\n  [fx-show.gt-sm]\n  [fx-show.md],\n  [fx-show.gt-md]\n  [fx-show.lg],\n  [fx-show.gt-lg],\n  [fx-show.xl]\n" },] },
    ];
    /** @nocollapse */
    ShowDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
        { type: undefined, decorators: [{ type: Inject, args: [forwardRef(function () { return HideDirective; }),] }, { type: Optional }, { type: Self },] },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    ShowDirective.propDecorators = {
        'show': [{ type: Input, args: ['fx-show',] },],
        'showXs': [{ type: Input, args: ['fx-show.xs',] },],
        'showGtXs': [{ type: Input, args: ['fx-show.gt-xs',] },],
        'showSm': [{ type: Input, args: ['fx-show.sm',] },],
        'showGtSm': [{ type: Input, args: ['fx-show.gt-sm',] },],
        'showMd': [{ type: Input, args: ['fx-show.md',] },],
        'showGtMd': [{ type: Input, args: ['fx-show.gt-md',] },],
        'showLg': [{ type: Input, args: ['fx-show.lg',] },],
        'showGtLg': [{ type: Input, args: ['fx-show.gt-lg',] },],
        'showXl': [{ type: Input, args: ['fx-show.xl',] },],
    };
    return ShowDirective;
}(BaseFxDirective));
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/api/show.js.map