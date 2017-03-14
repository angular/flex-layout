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
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Input, Renderer, } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
var FlexAlignDirective = (function (_super) {
    __extends(FlexAlignDirective, _super);
    /* tslint:enable */
    function FlexAlignDirective(monitor, elRef, renderer) {
        return _super.call(this, monitor, elRef, renderer) || this;
    }
    Object.defineProperty(FlexAlignDirective.prototype, "align", {
        /* tslint:disable */
        set: function (val) { this._cacheInput('align', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignXs", {
        set: function (val) { this._cacheInput('alignXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignSm", {
        set: function (val) { this._cacheInput('alignSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignMd", {
        set: function (val) { this._cacheInput('alignMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignLg", {
        set: function (val) { this._cacheInput('alignLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignXl", {
        set: function (val) { this._cacheInput('alignXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignLtSm", {
        set: function (val) { this._cacheInput('alignLtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignLtMd", {
        set: function (val) { this._cacheInput('alignLtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignLtLg", {
        set: function (val) { this._cacheInput('alignLtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignLtXl", {
        set: function (val) { this._cacheInput('alignLtXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtXs", {
        set: function (val) { this._cacheInput('alignGtXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtSm", {
        set: function (val) { this._cacheInput('alignGtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtMd", {
        set: function (val) { this._cacheInput('alignGtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtLg", {
        set: function (val) { this._cacheInput('alignGtLg', val); },
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
    return FlexAlignDirective;
}(BaseFxDirective));
__decorate([
    Input('fxFlexAlign'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "align", null);
__decorate([
    Input('fxFlexAlign.xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignXs", null);
__decorate([
    Input('fxFlexAlign.sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignSm", null);
__decorate([
    Input('fxFlexAlign.md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignMd", null);
__decorate([
    Input('fxFlexAlign.lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignLg", null);
__decorate([
    Input('fxFlexAlign.xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignXl", null);
__decorate([
    Input('fxFlexAlign.lt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignLtSm", null);
__decorate([
    Input('fxFlexAlign.lt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignLtMd", null);
__decorate([
    Input('fxFlexAlign.lt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignLtLg", null);
__decorate([
    Input('fxFlexAlign.lt-xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignLtXl", null);
__decorate([
    Input('fxFlexAlign.gt-xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignGtXs", null);
__decorate([
    Input('fxFlexAlign.gt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignGtSm", null);
__decorate([
    Input('fxFlexAlign.gt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignGtMd", null);
__decorate([
    Input('fxFlexAlign.gt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexAlignDirective.prototype, "alignGtLg", null);
FlexAlignDirective = __decorate([
    Directive({
        selector: "\n  [fxFlexAlign],\n  [fxFlexAlign.xs], [fxFlexAlign.sm], [fxFlexAlign.md], [fxFlexAlign.lg], [fxFlexAlign.xl],\n  [fxFlexAlign.lt-sm], [fxFlexAlign.lt-md], [fxFlexAlign.lt-lg], [fxFlexAlign.lt-xl],\n  [fxFlexAlign.gt-xs], [fxFlexAlign.gt-sm], [fxFlexAlign.gt-md], [fxFlexAlign.gt-lg]\n"
    }),
    __metadata("design:paramtypes", [MediaMonitor, ElementRef, Renderer])
], FlexAlignDirective);
export { FlexAlignDirective };
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/api/flex-align.js.map