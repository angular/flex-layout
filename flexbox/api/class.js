var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Input, Renderer, IterableDiffers, KeyValueDiffers } from '@angular/core';
import { NgClass } from '@angular/common';
import { BaseFxDirectiveAdapter } from './base-adapter';
import { BreakPointRegistry } from './../../media-query/breakpoints/break-point-registry';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * Directive to add responsive support for ngClass.
 */
export var ClassDirective = (function (_super) {
    __extends(ClassDirective, _super);
    function ClassDirective(monitor, _bpRegistry, _iterableDiffers, _keyValueDiffers, _ngEl, _renderer) {
        _super.call(this, _iterableDiffers, _keyValueDiffers, _ngEl, _renderer);
        this.monitor = monitor;
        this._bpRegistry = _bpRegistry;
        this._base = new BaseFxDirectiveAdapter(monitor, _ngEl, _renderer);
    }
    Object.defineProperty(ClassDirective.prototype, "classXs", {
        set: function (val) {
            this._base.cacheInput('classXs', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classGtXs", {
        set: function (val) {
            this._base.cacheInput('classGtXs', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classSm", {
        set: function (val) {
            this._base.cacheInput('classSm', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classGtSm", {
        set: function (val) {
            this._base.cacheInput('classGtSm', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classMd", {
        set: function (val) {
            this._base.cacheInput('classMd', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classGtMd", {
        set: function (val) {
            this._base.cacheInput('classGtMd', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classLg", {
        set: function (val) {
            this._base.cacheInput('classLg', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classGtLg", {
        set: function (val) {
            this._base.cacheInput('classGtLg', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ClassDirective.prototype, "classXl", {
        set: function (val) {
            this._base.cacheInput('classXl', val);
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * For @Input changes on the current mq activation property, see onMediaQueryChanges()
     */
    ClassDirective.prototype.ngOnChanges = function (changes) {
        var changed = this._bpRegistry.items.some(function (it) { return "class" + it.suffix in changes; });
        if (changed || this._base.mqActivation) {
            this._updateStyle();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ClassDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._base.listenForMediaQueryChanges('class', '', function (changes) {
            _this._updateStyle(changes.value);
        });
        this._updateStyle();
    };
    ClassDirective.prototype.ngOnDestroy = function () {
        this._base.ngOnDestroy();
    };
    ClassDirective.prototype._updateStyle = function (value) {
        var clazz = value || this._base.queryInput("class") || '';
        if (this._base.mqActivation) {
            clazz = this._base.mqActivation.activatedInput;
        }
        // Delegate subsequent activity to the NgClass logic
        this.ngClass = clazz;
    };
    ClassDirective.decorators = [
        { type: Directive, args: [{
                    selector: "\n    [class.xs],\n    [class.gt-xs],\n    [class.sm],\n    [class.gt-sm],\n    [class.md],\n    [class.gt-md],\n    [class.lg],\n    [class.gt-lg],\n    [class.xl]\n  "
                },] },
    ];
    /** @nocollapse */
    ClassDirective.ctorParameters = function () { return [
        { type: MediaMonitor, },
        { type: BreakPointRegistry, },
        { type: IterableDiffers, },
        { type: KeyValueDiffers, },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    ClassDirective.propDecorators = {
        'classXs': [{ type: Input, args: ['class.xs',] },],
        'classGtXs': [{ type: Input, args: ['class.gt-xs',] },],
        'classSm': [{ type: Input, args: ['class.sm',] },],
        'classGtSm': [{ type: Input, args: ['class.gt-sm',] },],
        'classMd': [{ type: Input, args: ['class.md',] },],
        'classGtMd': [{ type: Input, args: ['class.gt-md',] },],
        'classLg': [{ type: Input, args: ['class.lg',] },],
        'classGtLg': [{ type: Input, args: ['class.gt-lg',] },],
        'classXl': [{ type: Input, args: ['class.xl',] },],
    };
    return ClassDirective;
}(NgClass));
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/flexbox/api/class.js.map