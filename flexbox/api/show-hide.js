var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var ShowHideDirective = (function (_super) {
    __extends(ShowHideDirective, _super);
    /* tslint:enable */
    /**
     *
     */
    function ShowHideDirective(monitor, _layout, elRef, renderer) {
        var _this = _super.call(this, monitor, elRef, renderer) || this;
        _this._layout = _layout;
        _this.elRef = elRef;
        _this.renderer = renderer;
        _this._display = _this._getDisplayStyle(); // re-invoke override to use `this._layout`
        if (_layout) {
            /**
             * The Layout can set the display:flex (and incorrectly affect the Hide/Show directives.
             * Whenever Layout [on the same element] resets its CSS, then update the Hide/Show CSS
             */
            _this._layoutWatcher = _layout.layout$.subscribe(function () { return _this._updateWithValue(); });
        }
        return _this;
    }
    Object.defineProperty(ShowHideDirective.prototype, "show", {
        /* tslint:disable */
        set: function (val) { this._cacheInput("show", val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowHideDirective.prototype, "showXs", {
        set: function (val) { this._cacheInput('showXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowHideDirective.prototype, "showSm", {
        set: function (val) { this._cacheInput('showSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showMd", {
        set: function (val) { this._cacheInput('showMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showLg", {
        set: function (val) { this._cacheInput('showLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showXl", {
        set: function (val) { this._cacheInput('showXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showLtSm", {
        set: function (val) { this._cacheInput('showLtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showLtMd", {
        set: function (val) { this._cacheInput('showLtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showLtLg", {
        set: function (val) { this._cacheInput('showLtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showLtXl", {
        set: function (val) { this._cacheInput('showLtXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showGtXs", {
        set: function (val) { this._cacheInput('showGtXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showGtSm", {
        set: function (val) { this._cacheInput('showGtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showGtMd", {
        set: function (val) { this._cacheInput('showGtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "showGtLg", {
        set: function (val) { this._cacheInput('showGtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hide", {
        set: function (val) { this._cacheInput("show", negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowHideDirective.prototype, "hideXs", {
        set: function (val) { this._cacheInput("showXs", negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowHideDirective.prototype, "hideSm", {
        set: function (val) { this._cacheInput('showSm', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideMd", {
        set: function (val) { this._cacheInput('showMd', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideLg", {
        set: function (val) { this._cacheInput('showLg', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideXl", {
        set: function (val) { this._cacheInput('showXl', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideLtSm", {
        set: function (val) { this._cacheInput('showLtSm', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideLtMd", {
        set: function (val) { this._cacheInput('showLtMd', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideLtLg", {
        set: function (val) { this._cacheInput('showLtLg', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideLtXl", {
        set: function (val) { this._cacheInput('showLtXl', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideGtXs", {
        set: function (val) { this._cacheInput('showGtXs', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideGtSm", {
        set: function (val) { this._cacheInput('showGtSm', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideGtMd", {
        set: function (val) { this._cacheInput('showGtMd', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ShowHideDirective.prototype, "hideGtLg", {
        set: function (val) { this._cacheInput('showGtLg', negativeOf(val)); },
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
    return ShowHideDirective;
}(BaseFxDirective));
__decorate([
    Input('fxShow'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "show", null);
__decorate([
    Input('fxShow.xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showXs", null);
__decorate([
    Input('fxShow.sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showSm", null);
__decorate([
    Input('fxShow.md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showMd", null);
__decorate([
    Input('fxShow.lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showLg", null);
__decorate([
    Input('fxShow.xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showXl", null);
__decorate([
    Input('fxShow.lt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showLtSm", null);
__decorate([
    Input('fxShow.lt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showLtMd", null);
__decorate([
    Input('fxShow.lt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showLtLg", null);
__decorate([
    Input('fxShow.lt-xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showLtXl", null);
__decorate([
    Input('fxShow.gt-xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showGtXs", null);
__decorate([
    Input('fxShow.gt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showGtSm", null);
__decorate([
    Input('fxShow.gt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showGtMd", null);
__decorate([
    Input('fxShow.gt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "showGtLg", null);
__decorate([
    Input('fxHide'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hide", null);
__decorate([
    Input('fxHide.xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideXs", null);
__decorate([
    Input('fxHide.sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideSm", null);
__decorate([
    Input('fxHide.md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideMd", null);
__decorate([
    Input('fxHide.lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideLg", null);
__decorate([
    Input('fxHide.xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideXl", null);
__decorate([
    Input('fxHide.lt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideLtSm", null);
__decorate([
    Input('fxHide.lt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideLtMd", null);
__decorate([
    Input('fxHide.lt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideLtLg", null);
__decorate([
    Input('fxHide.lt-xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideLtXl", null);
__decorate([
    Input('fxHide.gt-xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideGtXs", null);
__decorate([
    Input('fxHide.gt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideGtSm", null);
__decorate([
    Input('fxHide.gt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideGtMd", null);
__decorate([
    Input('fxHide.gt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShowHideDirective.prototype, "hideGtLg", null);
ShowHideDirective = __decorate([
    Directive({
        selector: "\n  [fxShow], \n  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],\n  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl], \n  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],\n  [fxHide], \n  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],  \n  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],\n  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]\n"
    }),
    __param(1, Optional()), __param(1, Self()),
    __metadata("design:paramtypes", [MediaMonitor,
        LayoutDirective,
        ElementRef,
        Renderer])
], ShowHideDirective);
export { ShowHideDirective };
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/api/show-hide.js.map