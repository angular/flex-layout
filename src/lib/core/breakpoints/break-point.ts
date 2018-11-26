/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export interface BreakPoint {
  mediaQuery: string;
  alias: string;
  suffix?: string;
  overlapping?: boolean;
  // The priority of the individual breakpoint when overlapping another breakpoint
  priority?: number;
}
