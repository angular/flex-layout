/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {InjectionToken} from '@angular/core';

export const ADD_FLEX_STYLES = new InjectionToken<boolean>(
  'Flex Layout token, should flex stylings be applied to parents automatically', {
    providedIn: 'root',
    factory: () => false
  });
