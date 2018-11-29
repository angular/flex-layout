/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {StyleDefinition} from '../style-utils/style-utils';

/** A class that encapsulates CSS style generation for common directives */
export abstract class StyleBuilder {

  /** Whether to cache the generated output styles */
  shouldCache = true;

  /** Build the styles given an input string and configuration object from a host */
  abstract buildStyles(input: string, parent?: Object): StyleDefinition;

  /**
   * Run a side effect computation given the input string and the computed styles
   * from the build task and the host configuration object
   * NOTE: This should be a no-op unless an algorithm is provided in a subclass
   */
  sideEffect(_input: string, _styles: StyleDefinition, _parent?: Object) {
  }
}
