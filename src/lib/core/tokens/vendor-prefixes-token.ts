/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {InjectionToken} from '@angular/core';

export const DISABLE_VENDOR_PREFIXES = new InjectionToken<boolean>(
  'Flex Layout token, whether to add vendor prefix styles inline for elements');
