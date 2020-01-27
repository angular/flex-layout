/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Tag, ValuePriority} from '../tag';


export class Rows extends Tag {
  readonly tag = 'rows';

  build(input: string): Map<string, ValuePriority> {
    input = input || 'none';
    let auto = false;
    if (input.endsWith(AUTO_SPECIFIER)) {
      input = input.substring(0, input.indexOf(AUTO_SPECIFIER));
      auto = true;
    }

    const key = auto ? 'grid-auto-rows' : 'grid-template-rows';
    return new Map()
      .set('display', {value: 'grid', priority: 0})
      .set(key, {value: input, priority: 0});
  }
}

const AUTO_SPECIFIER = '!';
