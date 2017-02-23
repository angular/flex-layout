var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
export var FlexAlignDirective = (function (_super) {
    __extends(FlexAlignDirective, _super);
    function FlexAlignDirective(monitor, elRef, renderer) {
        _super.call(this, monitor, elRef, renderer);
    }
    Object.defineProperty(FlexAlignDirective.prototype, "align", {
        set: function (val) {
            this._cacheInput('align', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexAlignDirective.prototype, "alignXs", {
        set: function (val) {
            this._cacheInput('alignXs', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtXs", {
        set: function (val) {
            this._cacheInput('alignGtXs', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignSm", {
        set: function (val) {
            this._cacheInput('alignSm', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtSm", {
        set: function (val) {
            this._cacheInput('alignGtSm', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignMd", {
        set: function (val) {
            this._cacheInput('alignMd', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtMd", {
        set: function (val) {
            this._cacheInput('alignGtMd', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignLg", {
        set: function (val) {
            this._cacheInput('alignLg', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtLg", {
        set: function (val) {
            this._cacheInput('alignGtLg', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignXl", {
        set: function (val) {
            this._cacheInput('alignXl', val);
        },
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
    FlexAlignDirective.prototype.ngOnChanges = function (changes) {
        if (changes['align'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    FlexAlignDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('align', 'stretch', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    // *********************************************
    // Protected methods
    // *********************************************
    FlexAlignDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("align") || 'stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    };
    FlexAlignDirective.prototype._buildCSS = function (align) {
        var css = {};
        // Cross-axis
        switch (align) {
            case 'start':
                css['align-self'] = 'flex-start';
                break;
            case 'end':
                css['align-self'] = 'flex-end';
                break;
            default:
                css['align-self'] = align;
                break;
        }
        return css;
    };
    FlexAlignDirective.decorators = [
        { type: Directive, args: [{
                    selector: "\n  [fxFlexAlign],\n  [fxFlexAlign.xs],\n  [fxFlexAlign.gt-xs],\n  [fxFlexAlign.sm],\n  [fxFlexAlign.gt-sm],\n  [fxFlexAlign.md],\n  [fxFlexAlign.gt-md],\n  [fxFlexAlign.lg],\n  [fxFlexAlign.gt-lg],\n  [fxFlexAlign.xl]\n"
                },] },
    ];
    /** @nocollapse */
    FlexAlignDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    FlexAlignDirective.propDecorators = {
        'align': [{ type: Input, args: ['fxFlexAlign',] },],
        'alignXs': [{ type: Input, args: ['fxFlexAlign.xs',] },],
        'alignGtXs': [{ type: Input, args: ['fxFlexAlign.gt-xs',] },],
        'alignSm': [{ type: Input, args: ['fxFlexAlign.sm',] },],
        'alignGtSm': [{ type: Input, args: ['fxFlexAlign.gt-sm',] },],
        'alignMd': [{ type: Input, args: ['fxFlexAlign.md',] },],
        'alignGtMd': [{ type: Input, args: ['fxFlexAlign.gt-md',] },],
        'alignLg': [{ type: Input, args: ['fxFlexAlign.lg',] },],
        'alignGtLg': [{ type: Input, args: ['fxFlexAlign.gt-lg',] },],
        'alignXl': [{ type: Input, args: ['fxFlexAlign.xl',] },],
    };
    return FlexAlignDirective;
}(BaseFxDirective));
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/flexbox/api/flex-align.js.map