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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { buildLayoutCSS } from '../../utils/layout-validator';
/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
var LayoutDirective = (function (_super) {
    __extends(LayoutDirective, _super);
    /* tslint:enable */
    /**
     *
     */
    function LayoutDirective(monitor, elRef, renderer) {
        var _this = _super.call(this, monitor, elRef, renderer) || this;
        _this._announcer = new BehaviorSubject("row");
        _this.layout$ = _this._announcer.asObservable();
        return _this;
    }
    Object.defineProperty(LayoutDirective.prototype, "layout", {
        /* tslint:disable */
        set: function (val) { this._cacheInput("layout", val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutXs", {
        set: function (val) { this._cacheInput('layoutXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutSm", {
        set: function (val) { this._cacheInput('layoutSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutMd", {
        set: function (val) { this._cacheInput('layoutMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutLg", {
        set: function (val) { this._cacheInput('layoutLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutXl", {
        set: function (val) { this._cacheInput('layoutXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutGtXs", {
        set: function (val) { this._cacheInput('layoutGtXs', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutGtSm", {
        set: function (val) { this._cacheInput('layoutGtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutGtMd", {
        set: function (val) { this._cacheInput('layoutGtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutGtLg", {
        set: function (val) { this._cacheInput('layoutGtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutLtSm", {
        set: function (val) { this._cacheInput('layoutLtSm', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutLtMd", {
        set: function (val) { this._cacheInput('layoutLtMd', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutLtLg", {
        set: function (val) { this._cacheInput('layoutLtLg', val); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayoutDirective.prototype, "layoutLtXl", {
        set: function (val) { this._cacheInput('layoutLtXl', val); },
        enumerable: true,
        configurable: true
    });
    ;
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxLayout')
     * Then conditionally override with the mq-activated Input's current value
     */
    LayoutDirective.prototype.ngOnChanges = function (changes) {
        if (changes['layout'] != null || this._mqActivation) {
            this._updateWithDirection();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    LayoutDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('layout', 'row', function (changes) {
            _this._updateWithDirection(changes.value);
        });
        this._updateWithDirection();
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Validate the direction value and then update the host's inline flexbox styles
     */
    LayoutDirective.prototype._updateWithDirection = function (value) {
        value = value || this._queryInput("layout") || 'row';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        // Update styles and announce to subscribers the *new* direction
        var css = buildLayoutCSS(value);
        this._applyStyleToElement(css);
        this._announcer.next(css['flex-direction']);
    };
    return LayoutDirective;
}(BaseFxDirective));
__decorate([
    Input('fxLayout'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layout", null);
__decorate([
    Input('fxLayout.xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutXs", null);
__decorate([
    Input('fxLayout.sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutSm", null);
__decorate([
    Input('fxLayout.md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutMd", null);
__decorate([
    Input('fxLayout.lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutLg", null);
__decorate([
    Input('fxLayout.xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutXl", null);
__decorate([
    Input('fxLayout.gt-xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutGtXs", null);
__decorate([
    Input('fxLayout.gt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutGtSm", null);
__decorate([
    Input('fxLayout.gt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutGtMd", null);
__decorate([
    Input('fxLayout.gt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutGtLg", null);
__decorate([
    Input('fxLayout.lt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutLtSm", null);
__decorate([
    Input('fxLayout.lt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutLtMd", null);
__decorate([
    Input('fxLayout.lt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutLtLg", null);
__decorate([
    Input('fxLayout.lt-xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], LayoutDirective.prototype, "layoutLtXl", null);
LayoutDirective = __decorate([
    Directive({ selector: "\n  [fxLayout], \n  [fxLayout.xs], [fxLayout.sm], [fxLayout.md], [fxLayout.lg], [fxLayout.xl],\n  [fxLayout.lt-sm], [fxLayout.lt-md], [fxLayout.lt-lg], [fxLayout.lt-xl],\n  [fxLayout.gt-xs], [fxLayout.gt-sm], [fxLayout.gt-md], [fxLayout.gt-lg]\n" }),
    __metadata("design:paramtypes", [MediaMonitor, ElementRef, Renderer])
], LayoutDirective);
export { LayoutDirective };
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/api/layout.js.map