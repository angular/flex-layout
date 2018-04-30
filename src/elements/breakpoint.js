/**
 * Breakpoint -- a Custom Element representation a CSS Media Query
 * Options: alias, overlapping, mediaQuery
 */
class Breakpoint extends HTMLElement {

  static get observedAttributes() {
    return ['alias', 'mediaquery'];
  }

  /** overlapping -- whether or not the breakpoint overlaps with others */
  get overlapping() {
    return this.hasAttribute('overlapping');
  }
  set overlapping(val) {
    if (val) {
      this.setAttribute('overlapping', '');
    } else {
      this.removeAttribute('overlapping');
    }
  }

  /** alias -- the suffix to be used for the breakpoint */
  get alias() {
    return this._alias;
  }
  set alias(val) {
    this.setAttribute('alias', val);
  }

  /** mediaQuery -- the media query CSS to use for the breakpoint */
  get mediaquery() {
    return this._mediaquery;
  }
  set mediaquery(val) {
    this.setAttribute('mediaquery', val);
  }

  constructor() {
    super();
    this._alias = null;
    this._mediaquery = null;
    const shadow = this.attachShadow({mode: 'open'});
    const styleEl = document.createElement('style');
    styleEl.innerHTML = ':host{display:contents;}';
    shadow.appendChild(styleEl);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'alias') {
      this._alias = newValue;
    } else if (name === 'mediaquery') {
      this._mediaquery = newValue;
    }
  }
}

customElements.define('break-point', Breakpoint);

class DefaultBreakpoints extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    const styleEl = document.createElement('style');
    styleEl.innerHTML = ':host{display:contents;}';
    shadow.appendChild(styleEl);
  }
}

customElements.define('default-breakpoints', DefaultBreakpoints);
