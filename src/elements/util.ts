import {BreakPointProperty, LayoutConfig} from './config.js';
/* the default breakpoints for all Layout Custom Elements */

/* propToBps - map the given breakpoints to a given property to get the full selector */
export function propToBps(prop, bps) {
  return bps.map(bp => `${prop}.${bp.alias}`);
}

/* getBps - return the full list of breakpoints as provided by the user in the DOM */
export function getBps(): BreakPointProperty[] {
  const configs = document.getElementsByTagName('layout-config') as NodeListOf<LayoutConfig>;
  return configs.length > 0 ? configs[0].getBreakpoints() : [];
}

/* getProps - get the full list of selectors to monitor, including the breakpoint-less defaults */
export function getProps(properties) {
  const propNames = properties.map(p => p.name);
  return propNames.map(p => propToBps(p, getBps()))
    .reduce((acc, p) => acc.concat(p), []).concat(propNames);
}
