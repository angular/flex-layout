/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { NgModule } from '@angular/core';
import { MediaQueriesModule } from '../media-query/_module';
import { DEFAULT_BREAKPOINTS_PROVIDER, CUSTOM_BREAKPOINTS_PROVIDER_FACTORY } from '../media-query/breakpoints/break-points-provider';
import { MEDIA_MONITOR_PROVIDER } from '../media-query/media-monitor-provider';
import { OBSERVABLE_MEDIA_PROVIDER } from '../media-query/observable-media-provider';
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
var FlexLayoutModule = (function () {
    function FlexLayoutModule() {
    }
    /**
     * External uses can easily add custom breakpoints AND include internal orientations
     * breakpoints; which are not available by default.
     *
     * !! Selector aliases are not auto-configured. Developers must subclass
     * the API directives to support extra selectors for the orientations breakpoints !!
     */
    FlexLayoutModule.provideBreakPoints = function (breakpoints, options) {
        return {
            ngModule: FlexLayoutModule,
            providers: [
                CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(breakpoints, options || { orientations: false })
            ]
        };
    };
    return FlexLayoutModule;
}());
export { FlexLayoutModule };
FlexLayoutModule.decorators = [
    { type: NgModule, args: [{
                declarations: ALL_DIRECTIVES,
                imports: [MediaQueriesModule],
                exports: [MediaQueriesModule].concat(ALL_DIRECTIVES),
                providers: [
                    MEDIA_MONITOR_PROVIDER,
                    DEFAULT_BREAKPOINTS_PROVIDER,
                    OBSERVABLE_MEDIA_PROVIDER
                ]
            },] },
];
/** @nocollapse */
FlexLayoutModule.ctorParameters = function () { return []; };
//# sourceMappingURL=_module.js.map