import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { NgModule } from '@angular/core';
import { MediaMonitor } from '../media-query/media-monitor';
import { MediaQueriesModule } from '../media-query/_module';
import { FlexDirective } from './api/flex';
import { LayoutDirective } from './api/layout';
import { ShowHideDirective } from './api/show-hide';
import { FlexAlignDirective } from './api/flex-align';
import { FlexFillDirective } from './api/flex-fill';
import { FlexOffsetDirective } from './api/flex-offset';
import { FlexOrderDirective } from './api/flex-order';
import { LayoutAlignDirective } from './api/layout-align';
import { LayoutWrapDirective } from './api/layout-wrap';
import { LayoutGapDirective } from './api/layout-gap';
import { ClassDirective } from './api/class';
import { StyleDirective } from './api/style';
/**
 * Since the equivalent results are easily achieved with a css class attached to each
 * layout child, these have been deprecated and removed from the API.
 *
 *  import {LayoutPaddingDirective} from './api/layout-padding';
 *  import {LayoutMarginDirective} from './api/layout-margin';
 */
var ALL_DIRECTIVES = [
    LayoutDirective,
    LayoutWrapDirective,
    LayoutGapDirective,
    LayoutAlignDirective,
    FlexDirective,
    FlexOrderDirective,
    FlexOffsetDirective,
    FlexFillDirective,
    FlexAlignDirective,
    ShowHideDirective,
    ClassDirective,
    StyleDirective,
];
/**
 *
 */
export var FlexLayoutModule = (function () {
    function FlexLayoutModule() {
    }
    /** @deprecated */
    FlexLayoutModule.forRoot = function () {
        return {
            ngModule: FlexLayoutModule
        };
    };
    FlexLayoutModule.decorators = [
        { type: NgModule, args: [{
                    declarations: ALL_DIRECTIVES,
                    imports: [MediaQueriesModule],
                    exports: [MediaQueriesModule].concat(ALL_DIRECTIVES),
                    providers: [MediaMonitor]
                },] },
    ];
    /** @nocollapse */
    FlexLayoutModule.ctorParameters = function () { return []; };
    return FlexLayoutModule;
}());
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/flexbox/_module.js.map