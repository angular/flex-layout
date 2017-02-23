var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer, KeyValueDiffers } from '@angular/core';
import { NgStyle } from '@angular/common';
import { BaseFxDirectiveAdapter } from './base-adapter';
import { BreakPointRegistry } from './../../media-query/breakpoints/break-point-registry';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * Directive to add responsive support for ngStyle.
 *
 */
export var StyleDirective = (function (_super) {
    __extends(StyleDirective, _super);
    /**
     *
     */
    function StyleDirective(monitor, _bpRegistry, _differs, _ngEl, _renderer) {
        _super.call(this, _differs, _ngEl, _renderer);
        this.monitor = monitor;
        this._bpRegistry = _bpRegistry;
        this._base = new BaseFxDirectiveAdapter(monitor, _ngEl, _renderer);
    }
    Object.defineProperty(StyleDirective.prototype, "styleXs", {
        set: function (val) {
            this._base.cacheInput('styleXs', val, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StyleDirective.prototype, "styleGtXs", {
        set: function (val) {
            this._base.cacheInput('styleGtXs', val, true);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(StyleDirective.prototype, "styleSm", {
        set: function (val) {
            this._base.cacheInput('styleSm', val, true);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(StyleDirective.prototype, "styleGtSm", {
        set: function (val) {
            this._base.cacheInput('styleGtSm', val, true);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(StyleDirective.prototype, "styleMd", {
        set: function (val) {
            this._base.cacheInput('styleMd', val, true);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(StyleDirective.prototype, "styleGtMd", {
        set: function (val) {
            this._base.cacheInput('styleGtMd', val, true);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(StyleDirective.prototype, "styleLg", {
        set: function (val) {
            this._base.cacheInput('styleLg', val, true);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(StyleDirective.prototype, "styleGtLg", {
        set: function (val) {
            this._base.cacheInput('styleGtLg', val, true);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(StyleDirective.prototype, "styleXl", {
        set: function (val) {
            this._base.cacheInput('styleXl', val, true);
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * For @Input changes on the current mq activation property, see onMediaQueryChanges()
     */
    StyleDirective.prototype.ngOnChanges = function (changes) {
        var changed = this._bpRegistry.items.some(function (it) { return "style" + it.suffix in changes; });
        if (changed || this._base.mqActivation) {
            this._updateStyle();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    StyleDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._base.listenForMediaQueryChanges('style', '', function (changes) {
            _this._updateStyle(changes.value);
        });
        this._updateStyle();
    };
    StyleDirective.prototype.ngOnDestroy = function () {
        this._base.ngOnDestroy();
    };
    StyleDirective.prototype._updateStyle = function (value) {
        var style = value || this._base.queryInput("style") || '';
        if (this._base.mqActivation) {
            style = this._base.mqActivation.activatedInput;
        }
        // Delegate subsequent activity to the NgStyle logic
        this.ngStyle = style;
    };
    StyleDirective.decorators = [
        { type: Directive, args: [{
                    selector: "\n    [style.xs],\n    [style.gt-xs],\n    [style.sm],\n    [style.gt-sm],\n    [style.md],\n    [style.gt-md],\n    [style.lg],\n    [style.gt-lg],\n    [style.xl]\n  "
                },] },
    ];
    /** @nocollapse */
    StyleDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: BreakPointRegistry, },
        { type: KeyValueDiffers, },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    StyleDirective.propDecorators = {
        'styleXs': [{ type: Input, args: ['style.xs',] },],
        'styleGtXs': [{ type: Input, args: ['style.gt-xs',] },],
        'styleSm': [{ type: Input, args: ['style.sm',] },],
        'styleGtSm': [{ type: Input, args: ['style.gt-sm',] },],
        'styleMd': [{ type: Input, args: ['style.md',] },],
        'styleGtMd': [{ type: Input, args: ['style.gt-md',] },],
        'styleLg': [{ type: Input, args: ['style.lg',] },],
        'styleGtLg': [{ type: Input, args: ['style.gt-lg',] },],
        'styleXl': [{ type: Input, args: ['style.xl',] },],
    };
    return StyleDirective;
}(NgStyle));
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/flexbox/api/style.js.map