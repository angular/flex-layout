var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
export var LayoutGapDirective = (function (_super) {
    __extends(LayoutGapDirective, _super);
    function LayoutGapDirective(monitor, elRef, renderer) {
        _super.call(this, monitor, elRef, renderer);
    }
    Object.defineProperty(LayoutGapDirective.prototype, "gap", {
        set: function (val) { this._cacheInput('gap', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutGapDirective.prototype, "gapXs", {
        set: function (val) { this._cacheInput('gapXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutGapDirective.prototype, "gapGtXs", {
        set: function (val) { this._cacheInput('gapGtXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutGapDirective.prototype, "gapSm", {
        set: function (val) { this._cacheInput('gapSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutGapDirective.prototype, "gapGtSm", {
        set: function (val) { this._cacheInput('gapGtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutGapDirective.prototype, "gapMd", {
        set: function (val) { this._cacheInput('gapMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutGapDirective.prototype, "gapGtMd", {
        set: function (val) { this._cacheInput('gapGtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutGapDirective.prototype, "gapLg", {
        set: function (val) { this._cacheInput('gapLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutGapDirective.prototype, "gapGtLg", {
        set: function (val) { this._cacheInput('gapGtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutGapDirective.prototype, "gapXl", {
        set: function (val) { this._cacheInput('gapXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    LayoutGapDirective.prototype.ngOnChanges = function (changes) {
        if (changes['gap'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    LayoutGapDirective.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('gap', '0', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     *
     */
    LayoutGapDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("padding") || '0';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        // For each `element` child, set the padding styles...
        var items = this.childrenNodes
            .filter(function (el) { return (el.nodeType === 1); }) // only Element types
            .filter(function (el, j) { return j > 0; }); // skip first element since gaps are needed
        this._applyStyleToElements(this._buildCSS(value), items);
    };
    LayoutGapDirective.prototype._buildCSS = function (value) {
        return { 'margin-left': value };
    };
    LayoutGapDirective.decorators = [
        { type: Directive, args: [{ selector: "\n  [fx-layout-gap],\n  [fx-layout-gap.xs]\n  [fx-layout-gap.gt-xs],\n  [fx-layout-gap.sm],\n  [fx-layout-gap.gt-sm]\n  [fx-layout-gap.md],\n  [fx-layout-gap.gt-md]\n  [fx-layout-gap.lg],\n  [fx-layout-gap.gt-lg],\n  [fx-layout-gap.xl]\n" },] },
    ];
    /** @nocollapse */
    LayoutGapDirective.ctorParameters = [
        { type: MediaMonitor, },
        { type: ElementRef, },
        { type: Renderer, },
    ];
    LayoutGapDirective.propDecorators = {
        'gap': [{ type: Input, args: ['fx-layout-gap',] },],
        'gapXs': [{ type: Input, args: ['fx-layout-gap.xs',] },],
        'gapGtXs': [{ type: Input, args: ['fx-layout-gap.gt-xs',] },],
        'gapSm': [{ type: Input, args: ['fx-layout-gap.sm',] },],
        'gapGtSm': [{ type: Input, args: ['fx-layout-gap.gt-sm',] },],
        'gapMd': [{ type: Input, args: ['fx-layout-gap.md',] },],
        'gapGtMd': [{ type: Input, args: ['fx-layout-gap.gt-md',] },],
        'gapLg': [{ type: Input, args: ['fx-layout-gap.lg',] },],
        'gapGtLg': [{ type: Input, args: ['fx-layout-gap.gt-lg',] },],
        'gapXl': [{ type: Input, args: ['fx-layout-gap.xl',] },],
    };
    return LayoutGapDirective;
}(BaseFxDirective));
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/api/layout-gap.js.map