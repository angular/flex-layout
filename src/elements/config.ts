import {BreakPoint, BREAKPOINTS, ORIENTATION_BREAKPOINTS} from './data.js';
import {Breakpoint} from './breakpoint.js';

export interface Property {
  name: string;
  updateFn: (value: string, alias?: string) => {}[];
  child: boolean;
  values: Map<string, number>;
}

export interface BreakPointProperty extends BreakPoint {
  properties: Property[];
}

/**
 * LayoutConfig -- a Custom Element representation of the configuration options
 *                 for the layout library. Also accumulates all breakpoints for
 *                 later consumption
 * Options: disableDefaultBps, addOrientationBps, disableVendorPrefixes
 */
export class LayoutConfig extends HTMLElement {

  /** disableDefaultBps -- whether or not to use the default breakpoints */
  get disableDefaultBps() {
    return this.hasAttribute('disableDefaultBps');
  }
  set disableDefaultBps(val) {
    if (val) {
      this.setAttribute('disableDefaultBps', '');
    } else {
      this.removeAttribute('disableDefaultBps');
    }
  }

  /** addOrientationBps -- whether or not to use the default breakpoints */
  get addOrientationBps() {
    return this.hasAttribute('addOrientationBps');
  }
  set addOrientationBps(val) {
    if (val) {
      this.setAttribute('addOrientationBps', '');
    } else {
      this.removeAttribute('addOrientationBps');
    }
  }

  /** disableVendorPrefixes -- whether or not to use vendor prefixes on added styles */
  get disableVendorPrefixes() {
    return this.hasAttribute('disableVendorPrefixes');
  }
  set disableVendorPrefixes(val) {
    if (val) {
      this.setAttribute('disableVendorPrefixes', '');
    } else {
      this.removeAttribute('disableVendorPrefixes');
    }
  }

  /** useColumnBasisZero -- whether or not to use zero as the default flex value in column mode */
  get useColumnBasisZero() {
    return this.hasAttribute('useColumnBasisZero');
  }
  set useColumnBasisZero(val) {
    if (val) {
      this.setAttribute('useColumnBasisZero', '');
    } else {
      this.removeAttribute('useColumnBasisZero');
    }
  }

  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `<style>:host {display: contents;}</style>`;
  }

  getBreakpoints(): BreakPointProperty[] {
    const bps: BreakPoint[] = [];
    const bpElements = this.getElementsByTagName('break-point');
    const numEls = bpElements.length;
    for (let i = 0; i < numEls; i++) {
      const element = bpElements[i];
      const alias = element.getAttribute('alias')!;
      const overlapping = element.hasAttribute('overlapping');
      const mediaQuery = element.getAttribute('mediaquery')!;
      bps.push({
        alias,
        overlapping,
        mediaQuery,
      });
    }

    if (!this.disableDefaultBps) {
      bps.push(...BREAKPOINTS);
    }

    if (this.addOrientationBps) {
      bps.push(...ORIENTATION_BREAKPOINTS);
    }

    return bps.map(bp => {
      return {
        ...bp,
        properties: [],
      };
    });
  }
}

customElements.define('break-point', Breakpoint);
customElements.define('layout-config', LayoutConfig);
