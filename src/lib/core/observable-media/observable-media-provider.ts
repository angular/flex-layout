/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Optional, SkipSelf} from '@angular/core';

import {BreakPointRegistry} from '../breakpoints/break-point-registry';
import {MatchMedia} from '../match-media/match-media';
import {ObservableMedia, MediaService} from './observable-media';

/**
 * Ensure a single global ObservableMedia service provider
 * @deprecated
 * @deletion-target v6.0.0-beta.16
 */
export function OBSERVABLE_MEDIA_PROVIDER_FACTORY(parentService: ObservableMedia,
                                                  matchMedia: MatchMedia,
                                                  breakpoints: BreakPointRegistry) {
  return parentService || new MediaService(breakpoints, matchMedia);
}
/**
 *  Provider to return global service for observable service for all MediaQuery activations
 *  @deprecated
 *  @deletion-target v6.0.0-beta.16
 */
export const OBSERVABLE_MEDIA_PROVIDER = { // tslint:disable-line:variable-name
  provide: ObservableMedia,
  deps: [
    [ new Optional(), new SkipSelf(), ObservableMedia ],
    MatchMedia,
    BreakPointRegistry
  ],
  useFactory: OBSERVABLE_MEDIA_PROVIDER_FACTORY
};
