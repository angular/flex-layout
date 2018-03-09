/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ObservableMedia, MediaService} from './observable-media';

/**
 *  Provider to return global service for observable service for all MediaQuery activations
 */
export const OBSERVABLE_MEDIA_PROVIDER = {
  provide: ObservableMedia,
  useClass: MediaService
};
