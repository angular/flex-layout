/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { ModuleWithProviders } from '@angular/core';
import { BreakPoint } from '../media-query/breakpoints/break-point';
import { BreakPointProviderOptions } from '../media-query/breakpoints/break-points-provider';
/**
 *
 */
export declare class FlexLayoutModule {
    /**
     * External uses can easily add custom breakpoints AND include internal orientations
     * breakpoints; which are not available by default.
     *
     * !! Selector aliases are not auto-configured. Developers must subclass
     * the API directives to support extra selectors for the orientations breakpoints !!
     */
    static provideBreakPoints(breakpoints: BreakPoint[], options?: BreakPointProviderOptions): ModuleWithProviders;
}
