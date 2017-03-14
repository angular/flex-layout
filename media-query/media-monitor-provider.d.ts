/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Optional } from '@angular/core';
import { MediaMonitor } from './media-monitor';
import { MatchMedia } from './match-media';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
/**
 * Ensure a single global service provider
 */
export declare function MEDIA_MONITOR_PROVIDER_FACTORY(parentMonitor: MediaMonitor, breakpoints: BreakPointRegistry, matchMedia: MatchMedia): MediaMonitor;
/**
 * Export provider that uses a global service factory (above)
 */
export declare const MEDIA_MONITOR_PROVIDER: {
    provide: typeof MediaMonitor;
    deps: (typeof BreakPointRegistry | typeof MatchMedia | Optional[])[];
    useFactory: (parentMonitor: MediaMonitor, breakpoints: BreakPointRegistry, matchMedia: MatchMedia) => MediaMonitor;
};
