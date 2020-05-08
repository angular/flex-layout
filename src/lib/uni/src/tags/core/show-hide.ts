/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {coerceBooleanProperty} from '@angular/cdk/coercion';

import {Tag, ValuePriority} from '../tag';
import {NO_VALUE} from '../../constants';


const HIDE_STYLES = new Map().set('display', {value: 'none', priority: 100});
const EMPTY_MAP = new Map();

export class Hide extends Tag {
  readonly tag = 'hide';
  readonly deps = ['self.show'];

  build(input: string, show: string): Map<string, ValuePriority> {
    return coerceBooleanProperty(input) && show === NO_VALUE ? HIDE_STYLES : EMPTY_MAP;
  }
}

export class Show extends Tag {
  readonly tag = 'show';

  build(): Map<string, ValuePriority> {
    return EMPTY_MAP;
  }
}
