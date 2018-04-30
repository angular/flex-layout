/* the default breakpoints for all Layout Custom Elements */
const BREAKPOINTS = [
  {
    alias: 'xs',
    mediaQuery: '(min-width: 0px) and (max-width: 599px)'
  },
  {
    alias: 'gt-xs',
    overlapping: true,
    mediaQuery: '(min-width: 600px)'
  },
  {
    alias: 'lt-sm',
    overlapping: true,
    mediaQuery: '(max-width: 599px)'
  },
  {
    alias: 'sm',
    mediaQuery: '(min-width: 600px) and (max-width: 959px)'
  },
  {
    alias: 'gt-sm',
    overlapping: true,
    mediaQuery: '(min-width: 960px)'
  },
  {
    alias: 'lt-md',
    overlapping: true,
    mediaQuery: '(max-width: 959px)'
  },
  {
    alias: 'md',
    mediaQuery: '(min-width: 960px) and (max-width: 1279px)'
  },
  {
    alias: 'gt-md',
    overlapping: true,
    mediaQuery: '(min-width: 1280px)'
  },
  {
    alias: 'lt-lg',
    overlapping: true,
    mediaQuery: '(max-width: 1279px)'
  },
  {
    alias: 'lg',
    mediaQuery: '(min-width: 1280px) and (max-width: 1919px)'
  },
  {
    alias: 'gt-lg',
    overlapping: true,
    mediaQuery: '(min-width: 1920px)'
  },
  {
    alias: 'lt-xl',
    overlapping: true,
    mediaQuery: '(max-width: 1920px)'
  },
  {
    alias: 'xl',
    mediaQuery: '(min-width: 1920px) and (max-width: 5000px)'
  }
];

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
  const useDefaults = document.getElementsByTagName('default-breakpoints').length > 0;
  const domBps = Array.from(document.getElementsByTagName('break-point'), (bpEl) => {
    return {
      alias: bpEl.alias,
      mediaQuery: bpEl.mediaquery,
      overlapping: bpEl.overlapping
    };
  });
  return useDefaults ? [...domBps, ...BREAKPOINTS] : domBps;
}

/* getProps - get the full list of selectors to monitor, including the breakpoint-less defaults */
function getProps(properties) {
  'use strict';
  const propNames = properties.map(p => p.name);
  return propNames.map(p => propToBps(p, getBps())).reduce((acc, p) => acc.concat(p), []).concat(propNames);
}

export {BREAKPOINTS, findBpBySuffix, getBps, propToBps, getProps};
