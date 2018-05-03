/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {InjectionToken} from '@angular/core';

export const ADD_FLEX_STYLES = new InjectionToken<boolean>(
  'Flex Layout token, should flex stylings be applied to parents automatically');

/**
 * @deprecated
 * @deletion-target v6.0.0-beta.15
 */
export const FLEX_STYLES_PROVIDER = {
  provide: ADD_FLEX_STYLES,
  useValue: true
};
