/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {MediaService, ObservableMediaService} from '../observable-media-service';
import {BreakPointRegistry} from '../breakpoints/break-point-registry';
import {MatchMedia} from '../match-media';

import {OpaqueToken} from '@angular/core'; // tslint:disable-line:no-unused-variable

/**
 *  Provider to return observable to ALL MediaQuery events
 *  Developers should build custom providers to override this default MediaQuery Observable
 */
export const ObservableMediaServiceProvider = { // tslint:disable-line:variable-name
  provide: ObservableMediaService,
  useClass: MediaService,
  deps: [MatchMedia, BreakPointRegistry]
};
