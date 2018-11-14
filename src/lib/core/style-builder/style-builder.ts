/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Injectable} from '@angular/core';
import {StyleDefinition} from '../style-utils/style-utils';

@Injectable()
export abstract class StyleBuilder {
  abstract buildStyles(input: string, parent?: Object): StyleBuilderOutput;

  sideEffect(_input: string, _styles: StyleDefinition, _parent?: Object) {
    // This should be a no-op unless an algorithm is provided in a subclass
  }
}

export interface StyleBuilderOutput {
  styles: StyleDefinition;
  shouldCache: boolean;
}
