import {Breakpoint} from './breakpoint';
import {BREAKPOINTS, ORIENTATION_BREAKPOINTS} from './data';

/**
 * Breakpoint -- a Custom Element representation a CSS Media Query
 * Options: alias, overlapping, mediaQuery
 */

class LayoutConfig extends HTMLElement {

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
    shadow.innerHTML = `
      <style>
        :host {
          display: contents;
        }
      </style>
    `;
  }

  getBreakpoints() {
    const bps = [];
    const bpElements = this.getElementsByTagName('break-point');
    const numEls = bpElements.length;
    for (let i = 0; i < numEls; i++) {
      const element = bpElements[i];
      bps.push({
        alias: element.alias,
        overlapping: element.overlapping,
        mediaQuery: element.mediaQuery,
      });
    }

    if (!this.disableDefaultBps) {
      bps.concat(BREAKPOINTS);
    }

    if (this.addOrientationBps) {
      bps.concat(ORIENTATION_BREAKPOINTS);
    }

    return bps;
  }
}

customElements.define('break-point', Breakpoint);
customElements.define('layout-config', LayoutConfig);
