/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {InjectionToken, Optional, SkipSelf} from '@angular/core';

import {BreakPoint} from './break-point';
import {BREAKPOINTS} from './break-points-token';
import {DEFAULT_BREAKPOINTS} from './data/break-points';
import {ORIENTATION_BREAKPOINTS} from './data/orientation-break-points';
import {extendObject} from '../../utils/object-extend';
import {mergeByAlias, validateSuffixes} from './breakpoint-tools';
import {
  ADD_ORIENTATION_BREAKPOINTS,
  BREAKPOINT,
  DISABLE_DEFAULT_BREAKPOINTS,
} from '../tokens/breakpoint-token';


/**
 * Options to identify which breakpoint types to include as part of
 * a BreakPoint provider
 * @deprecated
 * @deletion-target v6.0.0-beta.15
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
 * @deprecated
 * @deletion-target v6.0.0-beta.15
 */
export function buildMergedBreakPoints(_custom?: BreakPoint[],
                                       options?: BreakPointProviderOptions) {
  options = extendObject({}, {
        defaults: true,         // exclude pre-configured, internal default breakpoints
        orientation: false      // exclude pre-configured, internal orientations breakpoints
  }, options || {});

  return () => {
    // Order so the defaults are loaded last; so ObservableMedia will report these last!
    let defaults = (options && options.orientations) ?
      ORIENTATION_BREAKPOINTS.concat(DEFAULT_BREAKPOINTS) : DEFAULT_BREAKPOINTS;

    return (options && options.defaults) ?
      mergeByAlias(defaults, _custom || []) : mergeByAlias(_custom || []);
  };
}

/**
 *  Ensure that only a single global BreakPoint list is instantiated...
 *  @deprecated
 *  @deletion-target v6.0.0-beta.15
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
 * @deprecated
 * @deletion-target v6.0.0-beta.15
 */
export const DEFAULT_BREAKPOINTS_PROVIDER = {
  provide: BREAKPOINTS,
  useFactory: DEFAULT_BREAKPOINTS_PROVIDER_FACTORY
};

/**
 * Factory that combines the configured breakpoints into one array and then merges
 * them using a utility function
 */
export function BREAKPOINTS_PROVIDER_FACTORY(parentBreakpoints: BreakPoint[],
                                             breakpoints: (BreakPoint|BreakPoint[])[],
                                             disableDefaults: boolean,
                                             addOrientation: boolean) {
  const bpFlattenArray = [].concat.apply([], (breakpoints || [])
    .map(v => Array.isArray(v) ? v : [v]));
  const builtIns = DEFAULT_BREAKPOINTS.concat(addOrientation ? ORIENTATION_BREAKPOINTS : []);
  return parentBreakpoints || disableDefaults ?
     mergeByAlias(bpFlattenArray) : mergeByAlias(builtIns, bpFlattenArray);
}

/**
 * Provider that combines the provided extra breakpoints with the default and
 * orientation breakpoints based on configuration
 */
export const BREAKPOINTS_PROVIDER = {
  provide: BREAKPOINTS,
  useFactory: BREAKPOINTS_PROVIDER_FACTORY,
  deps: [
    [new Optional(), new SkipSelf(), BREAKPOINTS],
    [new Optional(), BREAKPOINT],
    [new Optional(), DISABLE_DEFAULT_BREAKPOINTS],
    [new Optional(), ADD_ORIENTATION_BREAKPOINTS],
  ]
};

/**
 * Use with FlexLayoutModule.CUSTOM_BREAKPOINTS_PROVIDER_FACTORY!
 * @deprecated
 * @deletion-target v6.0.0-beta.15
 */
export function CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(custom?: BreakPoint[],
                                                    options?: BreakPointProviderOptions) {
  return {
    provide: <InjectionToken<BreakPoint[]>>BREAKPOINTS,
    useFactory: buildMergedBreakPoints(custom, options)
  };
}
