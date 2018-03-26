/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {InjectionToken, NgZone, Optional, PLATFORM_ID, SkipSelf} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {MatchMedia} from '../match-media/match-media';

/**
 * Ensure a single global service provider
 * @deprecated
 * @deletion-target v6.0.0-beta.16
 */
export function MATCH_MEDIA_PROVIDER_FACTORY(parentMedia: MatchMedia,
                                             ngZone: NgZone,
                                             platformId: Object,
                                             _document: Document) {
  return parentMedia || new MatchMedia(ngZone, platformId, _document);
}


/**
 * Export provider that uses a global service factory (above)
 * @deprecated
 * @deletion-target v6.0.0-beta.16
 */
export const MATCH_MEDIA_PROVIDER = {
  provide: MatchMedia,
  deps: [
    [new Optional(), new SkipSelf(), MatchMedia],
    NgZone,
    <InjectionToken<Object>>PLATFORM_ID,
    <InjectionToken<Document>>DOCUMENT,
  ],
  useFactory: MATCH_MEDIA_PROVIDER_FACTORY
};
