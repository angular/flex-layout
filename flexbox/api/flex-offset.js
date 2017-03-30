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
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
var FlexOffsetDirective = (function (_super) {
    __extends(FlexOffsetDirective, _super);
    /* tslint:enable */
    function FlexOffsetDirective(monitor, elRef, renderer) {
        return _super.call(this, monitor, elRef, renderer) || this;
    }
    Object.defineProperty(FlexOffsetDirective.prototype, "offset", {
        /* tslint:disable */
        set: function (val) { this._cacheInput('offset', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetXs", {
        set: function (val) { this._cacheInput('offsetXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetSm", {
        set: function (val) { this._cacheInput('offsetSm', val); },
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
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetLg", {
        set: function (val) { this._cacheInput('offsetLg', val); },
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
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetLtSm", {
        set: function (val) { this._cacheInput('offsetLtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetLtMd", {
        set: function (val) { this._cacheInput('offsetLtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetLtLg", {
        set: function (val) { this._cacheInput('offsetLtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetLtXl", {
        set: function (val) { this._cacheInput('offsetLtXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtXs", {
        set: function (val) { this._cacheInput('offsetGtXs', val); },
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
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtMd", {
        set: function (val) { this._cacheInput('offsetGtMd', val); },
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
    return FlexOffsetDirective;
}(BaseFxDirective));
__decorate([
    Input('fxFlexOffset'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offset", null);
__decorate([
    Input('fxFlexOffset.xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetXs", null);
__decorate([
    Input('fxFlexOffset.sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetSm", null);
__decorate([
    Input('fxFlexOffset.md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetMd", null);
__decorate([
    Input('fxFlexOffset.lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetLg", null);
__decorate([
    Input('fxFlexOffset.xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetXl", null);
__decorate([
    Input('fxFlexOffset.lt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetLtSm", null);
__decorate([
    Input('fxFlexOffset.lt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetLtMd", null);
__decorate([
    Input('fxFlexOffset.lt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetLtLg", null);
__decorate([
    Input('fxFlexOffset.lt-xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetLtXl", null);
__decorate([
    Input('fxFlexOffset.gt-xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetGtXs", null);
__decorate([
    Input('fxFlexOffset.gt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetGtSm", null);
__decorate([
    Input('fxFlexOffset.gt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetGtMd", null);
__decorate([
    Input('fxFlexOffset.gt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOffsetDirective.prototype, "offsetGtLg", null);
FlexOffsetDirective = __decorate([
    Directive({ selector: "\n  [fxFlexOffset],\n  [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md], [fxFlexOffset.lg], [fxFlexOffset.xl],\n  [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md], [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl],\n  [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm], [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]\n" }),
    __metadata("design:paramtypes", [MediaMonitor, ElementRef, Renderer])
], FlexOffsetDirective);
export { FlexOffsetDirective };
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/api/flex-offset.js.map