/**
 * Breakpoint -- a Custom Element representation a CSS Media Query
 * Options: alias, overlapping, mediaQuery
 */
export class Breakpoint extends HTMLElement {

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
    return this.getAttribute('alias');
  }
  set alias(val) {
    this.setAttribute('alias', val);
  }

  /** mediaQuery -- the media query CSS to use for the breakpoint */
  get mediaquery() {
    return this.getAttribute('mediaquery');
  }
  set mediaquery(val) {
    this.setAttribute('mediaquery', val);
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
}
