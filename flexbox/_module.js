var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var FlexLayoutModule = FlexLayoutModule_1 = (function () {
    function FlexLayoutModule() {
    }
    /** @deprecated */
    FlexLayoutModule.forRoot = function () {
        return {
            ngModule: FlexLayoutModule_1
        };
    };
    return FlexLayoutModule;
}());
FlexLayoutModule = FlexLayoutModule_1 = __decorate([
    NgModule({
        declarations: ALL_DIRECTIVES,
        imports: [MediaQueriesModule],
        exports: [MediaQueriesModule].concat(ALL_DIRECTIVES),
        providers: [MediaMonitor]
    })
], FlexLayoutModule);
export { FlexLayoutModule };
var FlexLayoutModule_1;
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/_module.js.map