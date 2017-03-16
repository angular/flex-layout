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
import { Directive, ElementRef, Input, Renderer, IterableDiffers, KeyValueDiffers } from '@angular/core';
import { NgClass } from '@angular/common';
import { BaseFxDirectiveAdapter } from './base-adapter';
import { BreakPointRegistry } from './../../media-query/breakpoints/break-point-registry';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * Directive to add responsive support for ngClass.
 */
var ClassDirective = (function (_super) {
    __extends(ClassDirective, _super);
    /* tslint:enable */
    function ClassDirective(monitor, _bpRegistry, _iterableDiffers, _keyValueDiffers, _ngEl, _renderer) {
        var _this = _super.call(this, _iterableDiffers, _keyValueDiffers, _ngEl, _renderer) || this;
        _this.monitor = monitor;
        _this._bpRegistry = _bpRegistry;
        _this._base = new BaseFxDirectiveAdapter(monitor, _ngEl, _renderer);
        return _this;
    }
    Object.defineProperty(ClassDirective.prototype, "ngClassBase", {
        /**
         * Intercept ngClass assignments so we cache the default classes
         * which are merged with activated styles or used as fallbacks.
         */
        set: function (val) {
            this._base.cacheInput('class', val, true);
            this.ngClass = this._base.inputMap['class'];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassXs", {
        /* tslint:disable */
        set: function (val) { this._base.cacheInput('classXs', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassSm", {
        set: function (val) { this._base.cacheInput('classSm', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "ngClassMd", {
        set: function (val) { this._base.cacheInput('classMd', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "ngClassLg", {
        set: function (val) { this._base.cacheInput('classLg', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "ngClassXl", {
        set: function (val) { this._base.cacheInput('classXl', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "ngClassLtXs", {
        set: function (val) { this._base.cacheInput('classLtXs', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "ngClassLtSm", {
        set: function (val) { this._base.cacheInput('classLtSm', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "ngClassLtMd", {
        set: function (val) { this._base.cacheInput('classLtMd', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "ngClassLtLg", {
        set: function (val) { this._base.cacheInput('classLtLg', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "ngClassGtXs", {
        set: function (val) { this._base.cacheInput('classGtXs', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "ngClassGtSm", {
        set: function (val) { this._base.cacheInput('classGtSm', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "ngClassGtMd", {
        set: function (val) { this._base.cacheInput('classGtMd', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "ngClassGtLg", {
        set: function (val) { this._base.cacheInput('classGtLg', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classBase", {
        /** Deprecated selectors */
        set: function (val) { this._base.cacheInput('class', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classXs", {
        set: function (val) { this._base.cacheInput('classXs', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classSm", {
        set: function (val) { this._base.cacheInput('classSm', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classMd", {
        set: function (val) { this._base.cacheInput('classMd', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classLg", {
        set: function (val) { this._base.cacheInput('classLg', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classXl", {
        set: function (val) { this._base.cacheInput('classXl', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classLtXs", {
        set: function (val) { this._base.cacheInput('classLtXs', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classLtSm", {
        set: function (val) { this._base.cacheInput('classLtSm', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classLtMd", {
        set: function (val) { this._base.cacheInput('classLtMd', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classLtLg", {
        set: function (val) { this._base.cacheInput('classLtLg', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classGtXs", {
        set: function (val) { this._base.cacheInput('classGtXs', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classGtSm", {
        set: function (val) { this._base.cacheInput('classGtSm', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classGtMd", {
        set: function (val) { this._base.cacheInput('classGtMd', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classGtLg", {
        set: function (val) { this._base.cacheInput('classGtLg', val, true); },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * For @Input changes on the current mq activation property, see onMediaQueryChanges()
     */
    ClassDirective.prototype.ngOnChanges = function (changes) {
        var changed = this._bpRegistry.items.some(function (it) {
            return ("ngClass" + it.suffix in changes) || ("class" + it.suffix in changes);
        });
        if (changed || this._base.mqActivation) {
            this._updateClass();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ClassDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._base.listenForMediaQueryChanges('class', '', function (changes) {
            _this._updateClass(changes.value);
        });
        this._updateClass();
    };
    ClassDirective.prototype.ngOnDestroy = function () {
        this._base.ngOnDestroy();
    };
    ClassDirective.prototype._updateClass = function (value) {
        var clazz = value || this._base.queryInput("class") || '';
        if (this._base.mqActivation) {
            clazz = this._base.mqActivation.activatedInput;
        }
        // Delegate subsequent activity to the NgClass logic
        this.ngClass = clazz;
    };
    return ClassDirective;
}(NgClass));
__decorate([
    Input('ngClass'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassBase", null);
__decorate([
    Input('ngClass.xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassXs", null);
__decorate([
    Input('ngClass.sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassSm", null);
__decorate([
    Input('ngClass.md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassMd", null);
__decorate([
    Input('ngClass.lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassLg", null);
__decorate([
    Input('ngClass.xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassXl", null);
__decorate([
    Input('ngClass.lt-xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassLtXs", null);
__decorate([
    Input('ngClass.lt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassLtSm", null);
__decorate([
    Input('ngClass.lt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassLtMd", null);
__decorate([
    Input('ngClass.lt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassLtLg", null);
__decorate([
    Input('ngClass.gt-xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassGtXs", null);
__decorate([
    Input('ngClass.gt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassGtSm", null);
__decorate([
    Input('ngClass.gt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassGtMd", null);
__decorate([
    Input('ngClass.gt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "ngClassGtLg", null);
__decorate([
    Input('class'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classBase", null);
__decorate([
    Input('class.xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classXs", null);
__decorate([
    Input('class.sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classSm", null);
__decorate([
    Input('class.md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classMd", null);
__decorate([
    Input('class.lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classLg", null);
__decorate([
    Input('class.xl'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classXl", null);
__decorate([
    Input('class.lt-xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classLtXs", null);
__decorate([
    Input('class.lt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classLtSm", null);
__decorate([
    Input('class.lt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classLtMd", null);
__decorate([
    Input('class.lt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classLtLg", null);
__decorate([
    Input('class.gt-xs'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classGtXs", null);
__decorate([
    Input('class.gt-sm'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classGtSm", null);
__decorate([
    Input('class.gt-md'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classGtMd", null);
__decorate([
    Input('class.gt-lg'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ClassDirective.prototype, "classGtLg", null);
ClassDirective = __decorate([
    Directive({
        selector: "\n    [class],\n    [class.xs], [class.sm], [class.md], [class.lg], [class.xl], \n    [class.lt-sm], [class.lt-md], [class.lt-lg], [class.lt-xl],     \n    [class.gt-xs], [class.gt-sm], [class.gt-md], [class.gt-lg],        \n    [ngClass], \n    [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],\n    [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl], \n    [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]  \n  "
    }),
    __metadata("design:paramtypes", [MediaMonitor,
        BreakPointRegistry,
        IterableDiffers, KeyValueDiffers,
        ElementRef, Renderer])
], ClassDirective);
export { ClassDirective };
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/api/class.js.map