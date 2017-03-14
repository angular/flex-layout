/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Optional } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
import { MatchMedia } from './match-media';
import { ObservableMedia } from './observable-media';
/**
 * Ensure a single global ObservableMedia service provider
 */
export declare function OBSERVABLE_MEDIA_PROVIDER_FACTORY(parentService: ObservableMedia, matchMedia: MatchMedia, breakpoints: BreakPointRegistry): ObservableMedia;
/**
 *  Provider to return global service for observable service for all MediaQuery activations
 */
export declare const OBSERVABLE_MEDIA_PROVIDER: {
    provide: typeof ObservableMedia;
    deps: (typeof BreakPointRegistry | typeof MatchMedia | Optional[])[];
    useFactory: (parentService: ObservableMedia, matchMedia: MatchMedia, breakpoints: BreakPointRegistry) => ObservableMedia;
};
