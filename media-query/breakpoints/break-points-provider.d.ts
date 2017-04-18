/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
import { BreakPoint } from './break-point';
/**
 * Options to identify which breakpoint types to include as part of
 * a BreakPoint provider
 */
export interface BreakPointProviderOptions {
    /**
     * include pre-configured, internal default breakpoints.
     * @default 'true'
     */
    defaults?: boolean;
    /**
     * include pre-configured, internal orientations breakpoints.
     * @default 'false'
     */
    orientations?: boolean;
}
/**
 * Add new custom items to the default list or override existing default with custom overrides
 */
export declare function buildMergedBreakPoints(_custom?: BreakPoint[], options?: BreakPointProviderOptions): () => BreakPoint[];
/**
 *  Ensure that only a single global BreakPoint list is instantiated...
 */
export declare function DEFAULT_BREAKPOINTS_PROVIDER_FACTORY(): BreakPoint[];
/**
 * Default Provider that does not support external customization nor provide
 * the extra extended breakpoints:   "handset", "tablet", and "web"
 *
 *  NOTE: !! breakpoints are considered to have unique 'alias' properties,
 *        custom breakpoints matching existing breakpoints will override the properties
 *        of the existing (and not be added as an extra breakpoint entry).
 *        [xs, gt-xs, sm, gt-sm, md, gt-md, lg, gt-lg, xl]
 */
export declare const DEFAULT_BREAKPOINTS_PROVIDER: {
    provide: InjectionToken<BreakPoint[]>;
    useFactory: () => BreakPoint[];
};
/**
 * Use with FlexLayoutModule.CUSTOM_BREAKPOINTS_PROVIDER_FACTORY!
 */
export declare function CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(_custom?: BreakPoint[], options?: BreakPointProviderOptions): {
    provide: InjectionToken<BreakPoint[]>;
    useFactory: () => BreakPoint[];
};
