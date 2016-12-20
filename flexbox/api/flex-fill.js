var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Directive, ElementRef, Renderer } from '@angular/core';
import { MediaMonitor } from '../../media-query/media-monitor';
import { BaseFxDirective } from './base';
var FLEX_FILL_CSS = {
    'margin': 0,
    'width': '100%',
    'height': '100%',
    'min-width': '100%',
    'min-height': '100%'
};
/**
 * 'fx-fill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: fx-fill is NOT responsive API!!
 */
export var FlexFillDirective = (function (_super) {
    __extends(FlexFillDirective, _super);
    function FlexFillDirective(monitor, elRef, renderer) {
        _super.call(this, monitor, elRef, renderer);
        this.elRef = elRef;
        this.renderer = renderer;
        this._applyStyleToElement(FLEX_FILL_CSS);
    }
    FlexFillDirective.decorators = [
        { type: Directive, args: [{ selector: "\n  [fx-fill],\n  [fx-fill.xs]\n  [fx-fill.gt-xs],\n  [fx-fill.sm],\n  [fx-fill.gt-sm]\n  [fx-fill.md],\n  [fx-fill.gt-md]\n  [fx-fill.lg],\n  [fx-fill.gt-lg],\n  [fx-fill.xl]\n" },] },
    ];
    /** @nocollapse */
    FlexFillDirective.ctorParameters = [
        { type: MediaMonitor, },
        { type: ElementRef, },
        { type: Renderer, },
    ];
    return FlexFillDirective;
}(BaseFxDirective));
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/api/flex-fill.js.map