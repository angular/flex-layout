import { BREAKPOINTS } from './break-points-token';
import { DEFAULT_BREAKPOINTS } from './data/break-points';
import { ORIENTATION_BREAKPOINTS } from './data/orientation-break-points';
import { extendObject } from '../../utils/object-extend';
import { mergeByAlias, validateSuffixes } from '../../utils/breakpoint-tools';
/**
 * Add new custom items to the default list or override existing default with custom overrides
 */
export function buildMergedBreakPoints(_custom, options) {
    options = extendObject({}, {
        defaults: true,
        orientation: false // exclude pre-configured, internal orientations breakpoints
    }, options || {});
    return function () {
        // Order so the defaults are loaded last; so ObservableMedia will report these last!
        var defaults = options.orientations ? ORIENTATION_BREAKPOINTS.concat(DEFAULT_BREAKPOINTS) :
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
export var DEFAULT_BREAKPOINTS_PROVIDER = {
    provide: BREAKPOINTS,
    useFactory: DEFAULT_BREAKPOINTS_PROVIDER_FACTORY
};
/**
 * Use with FlexLayoutModule.CUSTOM_BREAKPOINTS_PROVIDER_FACTORY!
 */
export function CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(_custom, options) {
    return {
        provide: BREAKPOINTS,
        useFactory: buildMergedBreakPoints(_custom, options)
    };
}
//# sourceMappingURL=break-points-provider.js.map