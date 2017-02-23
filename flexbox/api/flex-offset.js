var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
export var FlexOffsetDirective = (function (_super) {
    __extends(FlexOffsetDirective, _super);
    function FlexOffsetDirective(monitor, elRef, renderer) {
        _super.call(this, monitor, elRef, renderer);
    }
    Object.defineProperty(FlexOffsetDirective.prototype, "offset", {
        set: function (val) { this._cacheInput('offset', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetXs", {
        set: function (val) { this._cacheInput('offsetXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtXs", {
        set: function (val) { this._cacheInput('offsetGtXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetSm", {
        set: function (val) { this._cacheInput('offsetSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtSm", {
        set: function (val) { this._cacheInput('offsetGtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetMd", {
        set: function (val) { this._cacheInput('offsetMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtMd", {
        set: function (val) { this._cacheInput('offsetGtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetLg", {
        set: function (val) { this._cacheInput('offsetLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtLg", {
        set: function (val) { this._cacheInput('offsetGtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetXl", {
        set: function (val) { this._cacheInput('offsetXl', val); },
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
    FlexOffsetDirective.prototype.ngOnChanges = function (changes) {
        if (changes['offset'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    FlexOffsetDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('offset', 0, function (changes) {
            _this._updateWithValue(changes.value);
        });
    };
    // *********************************************
    // Protected methods
    // *********************************************
    FlexOffsetDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("offset") || 0;
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    };
    FlexOffsetDirective.prototype._buildCSS = function (offset) {
        var isPercent = String(offset).indexOf('%') > -1;
        var isPx = String(offset).indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(offset)) {
            offset = offset + '%';
        }
        return { 'margin-left': "" + offset };
    };
    FlexOffsetDirective.decorators = [
        { type: Directive, args: [{ selector: "\n  [fxFlexOffset],\n  [fxFlexOffset.xs],\n  [fxFlexOffset.gt-xs],\n  [fxFlexOffset.sm],\n  [fxFlexOffset.gt-sm],\n  [fxFlexOffset.md],\n  [fxFlexOffset.gt-md],\n  [fxFlexOffset.lg],\n  [fxFlexOffset.gt-lg],\n  [fxFlexOffset.xl]\n" },] },
    ];
    /** @nocollapse */
    FlexOffsetDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    FlexOffsetDirective.propDecorators = {
        'offset': [{ type: Input, args: ['fxFlexOffset',] },],
        'offsetXs': [{ type: Input, args: ['fxFlexOffset.xs',] },],
        'offsetGtXs': [{ type: Input, args: ['fxFlexOffset.gt-xs',] },],
        'offsetSm': [{ type: Input, args: ['fxFlexOffset.sm',] },],
        'offsetGtSm': [{ type: Input, args: ['fxFlexOffset.gt-sm',] },],
        'offsetMd': [{ type: Input, args: ['fxFlexOffset.md',] },],
        'offsetGtMd': [{ type: Input, args: ['fxFlexOffset.gt-md',] },],
        'offsetLg': [{ type: Input, args: ['fxFlexOffset.lg',] },],
        'offsetGtLg': [{ type: Input, args: ['fxFlexOffset.gt-lg',] },],
        'offsetXl': [{ type: Input, args: ['fxFlexOffset.xl',] },],
    };
    return FlexOffsetDirective;
}(BaseFxDirective));
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/flexbox/api/flex-offset.js.map