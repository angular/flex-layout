import {BREAKPOINT, ORIENTATION_BREAKPOINTS} from '@angular/flex-layout';

export const EXTRA_BREAKPOINT = [{
  alias: 'xs.landscape',
  suffix: 'XsLandscape',
  mediaQuery: 'screen and (orientation: landscape) and (max-width: 559px)',
  priority: 1000,
  overlapping: false
}];

export const BREAKPOINT_PROVIDERS = [
  {
    provide: BREAKPOINT,
    useValue: EXTRA_BREAKPOINT,
    multi: true
  },
  {
    provide: BREAKPOINT,
    useValue: ORIENTATION_BREAKPOINTS,
    multi: true
  }
];

export const LAYOUT_CONFIG = {
  useColumnBasisZero: false,
  printWithBreakpoints: ['md', 'lt-lg', 'lt-xl', 'gt-sm', 'gt-xs']
};
