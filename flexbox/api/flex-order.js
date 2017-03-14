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
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
var FlexOrderDirective = (function (_super) {
    __extends(FlexOrderDirective, _super);
    /* tslint:enable */
    function FlexOrderDirective(monitor, elRef, renderer) {
        return _super.call(this, monitor, elRef, renderer) || this;
    }
    Object.defineProperty(FlexOrderDirective.prototype, "order", {
        /* tslint:disable */
        set: function (val) { this._cacheInput('order', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexOrderDirective.prototype, "orderXs", {
        set: function (val) { this._cacheInput('orderXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexOrderDirective.prototype, "orderSm", {
        set: function (val) { this._cacheInput('orderSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderMd", {
        set: function (val) { this._cacheInput('orderMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderLg", {
        set: function (val) { this._cacheInput('orderLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderXl", {
        set: function (val) { this._cacheInput('orderXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtXs", {
        set: function (val) { this._cacheInput('orderGtXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtSm", {
        set: function (val) { this._cacheInput('orderGtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtMd", {
        set: function (val) { this._cacheInput('orderGtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtLg", {
        set: function (val) { this._cacheInput('orderGtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderLtSm", {
        set: function (val) { this._cacheInput('orderLtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderLtMd", {
        set: function (val) { this._cacheInput('orderLtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderLtLg", {
        set: function (val) { this._cacheInput('orderLtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(FlexOrderDirective.prototype, "orderLtXl", {
        set: function (val) { this._cacheInput('orderLtXl', val); },
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
    FlexOrderDirective.prototype.ngOnChanges = function (changes) {
        if (changes['order'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    FlexOrderDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('order', '0', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    // *********************************************
    // Protected methods
    // *********************************************
    FlexOrderDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("order") || '0';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    };
    FlexOrderDirective.prototype._buildCSS = function (value) {
        value = parseInt(value, 10);
        return { order: isNaN(value) ? 0 : value };
    };
    return FlexOrderDirective;
}(BaseFxDirective));
__decorate([
    Input('fxFlexOrder'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "order", null);
__decorate([
    Input('fxFlexOrder.xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderXs", null);
__decorate([
    Input('fxFlexOrder.sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderSm", null);
__decorate([
    Input('fxFlexOrder.md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderMd", null);
__decorate([
    Input('fxFlexOrder.lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderLg", null);
__decorate([
    Input('fxFlexOrder.xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderXl", null);
__decorate([
    Input('fxFlexOrder.gt-xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderGtXs", null);
__decorate([
    Input('fxFlexOrder.gt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderGtSm", null);
__decorate([
    Input('fxFlexOrder.gt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderGtMd", null);
__decorate([
    Input('fxFlexOrder.gt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderGtLg", null);
__decorate([
    Input('fxFlexOrder.lt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderLtSm", null);
__decorate([
    Input('fxFlexOrder.lt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderLtMd", null);
__decorate([
    Input('fxFlexOrder.lt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderLtLg", null);
__decorate([
    Input('fxFlexOrder.lt-xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FlexOrderDirective.prototype, "orderLtXl", null);
FlexOrderDirective = __decorate([
    Directive({ selector: "\n  [fxFlexOrder],\n  [fxFlexOrder.xs], [fxFlexOrder.sm], [fxFlexOrder.md], [fxFlexOrder.lg], [fxFlexOrder.xl],\n  [fxFlexOrder.lt-sm], [fxFlexOrder.lt-md], [fxFlexOrder.lt-lg], [fxFlexOrder.lt-xl],\n  [fxFlexOrder.gt-xs], [fxFlexOrder.gt-sm], [fxFlexOrder.gt-md], [fxFlexOrder.gt-lg]\n" }),
    __metadata("design:paramtypes", [MediaMonitor, ElementRef, Renderer])
], FlexOrderDirective);
export { FlexOrderDirective };
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/api/flex-order.js.map