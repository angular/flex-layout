/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Optional, SkipSelf } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
import { MatchMedia } from './match-media';
import { ObservableMedia, MediaService } from './observable-media';
/**
 * Ensure a single global ObservableMedia service provider
 */
export function OBSERVABLE_MEDIA_PROVIDER_FACTORY(parentService, matchMedia, breakpoints) {
    return parentService || new MediaService(matchMedia, breakpoints);
}
/**
 *  Provider to return global service for observable service for all MediaQuery activations
 */
export var OBSERVABLE_MEDIA_PROVIDER = {
    provide: ObservableMedia,
    deps: [
        [new Optional(), new SkipSelf(), ObservableMedia],
        MatchMedia,
        BreakPointRegistry
    ],
    useFactory: OBSERVABLE_MEDIA_PROVIDER_FACTORY
};
//# sourceMappingURL=observable-media-provider.js.map