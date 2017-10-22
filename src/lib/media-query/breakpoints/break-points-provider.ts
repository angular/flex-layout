/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  InjectionToken,    // tslint:disable-line:no-unused-variable
} from '@angular/core';

import {BreakPoint} from './break-point';
import {BREAKPOINTS} from './break-points-token';
import {DEFAULT_BREAKPOINTS} from './data/break-points';
import {ORIENTATION_BREAKPOINTS} from './data/orientation-break-points';

import {extendObject} from '../../utils/object-extend';
import {mergeByAlias, validateSuffixes} from '../../utils/breakpoint-tools';


/**
 * Options to identify which breakpoint types to include as part of
 * a BreakPoint provider
 */
export interface BreakPointProviderOptions {
  /**
   * include pre-configured, internal default breakpoints.
   * @default 'true'
   */
  defaults ?: boolean;
  /**
   * include pre-configured, internal orientations breakpoints.
   * @default 'false'
   */
  orientations ?: boolean;
}

/**
 * Add new custom items to the default list or override existing default with custom overrides
 */
export function buildMergedBreakPoints(_custom?: BreakPoint[],
                                       options?: BreakPointProviderOptions) {
  options = extendObject({ }, {
        defaults: true,       // exclude pre-configured, internal default breakpoints
        orientation: false      // exclude pre-configured, internal orientations breakpoints
  }, options || { });

  return () => {
    // Order so the defaults are loaded last; so ObservableMedia will report these last!
    let defaults = options.orientations ? ORIENTATION_BREAKPOINTS.concat(DEFAULT_BREAKPOINTS) :
        DEFAULT_BREAKPOINTS;

    return options.defaults ? mergeByAlias(defaults, _custom || []) : mergeByAlias(_custom);
  };
}

/**
 *  Ensure that only a single global BreakPoint list is instantiated...
 */
export function DEFAULT_BREAKPOINTS_PROVIDER_FACTORY() {
  return validateSuffixes(DEFAULT_BREAKPOINTS);
}
/**
 * Default Provider that does not support external customization nor provide
 * the extra extended breakpoints:   "handset", "tablet", and "web"
 *
 *  NOTE: !! breakpoints are considered to have unique 'alias' properties,
 *        custom breakpoints matching existing breakpoints will override the properties
 *        of the existing (and not be added as an extra breakpoint entry).
 *        [xs, gt-xs, sm, gt-sm, md, gt-md, lg, gt-lg, xl]
 */
export const DEFAULT_BREAKPOINTS_PROVIDER = { // tslint:disable-line:variable-name
  provide: BREAKPOINTS,
  useFactory: DEFAULT_BREAKPOINTS_PROVIDER_FACTORY
};
/**
 * Use with FlexLayoutModule.CUSTOM_BREAKPOINTS_PROVIDER_FACTORY!
 */
export function CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(_custom?: BreakPoint[],
                                                    options?: BreakPointProviderOptions) {
  return {
    provide: BREAKPOINTS,
    useFactory: buildMergedBreakPoints(_custom, options)
  };
}
