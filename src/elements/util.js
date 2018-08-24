/* the default breakpoints for all Layout Custom Elements */

/* findByBySuffix - find the full breakpoint object from a list based on its suffix */
function findBpBySuffix(bps, suffix) {
  'use strict';

  for (let i = 0; i < bps.length; i++) {
    let bp = bps[i];
    if (bp.alias === suffix) {
      return bp;
    }
  }

  return null;
}

/* propToBps - map the given breakpoints to a given property to get the full selector */
function propToBps(prop, bps) {
  'use strict';
  return bps.map(bp => `${prop}.${bp.alias}`);
}

/* getBps - return the full list of breakpoints as provided by the user in the DOM */
function getBps() {
  'use strict';
  const configs = document.getElementsByTagName('layout-config');
  return configs.length > 0 ? configs.getBreakpoints() : [];
}

/* getProps - get the full list of selectors to monitor, including the breakpoint-less defaults */
function getProps(properties) {
  'use strict';
  const propNames = properties.map(p => p.name);
  return propNames.map(p => propToBps(p, getBps())).reduce((acc, p) => acc.concat(p), []).concat(propNames);
}

export {findBpBySuffix, getBps, propToBps, getProps};
