import {getBps, getProps} from './util.js';
import {BreakPointProperty, Property} from './config.js';

export class BaseLayout extends HTMLElement {

  readonly _breakpoints: BreakPointProperty[];
  readonly _layoutType: string;
  readonly _allBreakpoint: BreakPointProperty;
  private _childObserver: MutationObserver;
  private _properties: Property[];

  constructor(layoutType: string, properties: Property[]) {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `<style>:host {contain: content;}</style>
<style id="${layoutType}-all">@media all {:host {display: ${layoutType};}}</style><slot></slot>`;

    this._breakpoints = getBps();
    // Bind the instance of the HTMLElement to each function so that
    // each has access to parent properties
    this._properties = properties.map(p => {
      p.updateFn = p.updateFn.bind(this);
      return p;
    });
    this._layoutType = layoutType;
    this._allBreakpoint = {
      alias: '',
      mediaQuery: 'all',
      overlapping: false,
      properties: [],
    };
  }

  /**
   * attributeChangedCallback -- fired when an attribute from observedAttributes or a child
   *                             changes, at which point we should find the breakpoint for
   *                             that attribute and recompute the style block
   */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log('START', {name, oldValue, newValue});
    const [prop, alias] = name.split('.');

    const bp = this._getBreakpointByAlias(alias);
    const [property, newProp] = this._getPropertyByName(bp, prop);
    if (newProp) {
      property.values = new Map();
      bp.properties.push(property);
    }

    console.log('before', JSON.stringify(bp));
    console.log({newProp, prop: JSON.stringify(property),
      vals: JSON.stringify([...property.values])});

    if (property.values.has(oldValue)) {
      console.log(`has old value: ${oldValue}, ${property.values.get(oldValue)}`);
      property.values.set(oldValue, property.values.get(oldValue)! - 1);
    }

    if (newValue !== null) {
      console.log(`setting new value: ${newValue}, ${(property.values.get(newValue) || 0) + 1}`);
      property.values.set(newValue, (property.values.get(newValue) || 0) + 1);
    }

    console.log(`new old value: ${property.values.get(oldValue)}`);
    if (property.values.get(oldValue) === 0) {
      console.log('removing old value');
      property.values.delete(oldValue);
    }

    const inlineAttr = bp.alias ? `inline.${bp.alias}` : 'inline';
    const css = buildCss(bp.alias, bp.properties, this.hasAttribute(inlineAttr), this._layoutType,
      !!alias);
    this._attachCss(css, bp.mediaQuery, bp.alias);

    console.log('DONE', JSON.stringify(bp));
  }

  /**
   * connectedCallback -- when the CustomElement gets wired up, do two things:
   *                      * build the initial style block
   *                      * wire up the MutationObservers to watch the children;
   *                        the parents are watched by the static observedAttributes
   */
  connectedCallback() {
    this._childObserver = new MutationObserver((mutations) =>
      mutations.forEach((mutation) =>
        this.attributeChangedCallback(mutation.attributeName, mutation.oldValue,
          (mutation.target as HTMLElement).getAttribute(mutation.attributeName!)))
    );
    const children = this.shadowRoot!.host.children;
    const numChildren = children.length;
    const childrenPropsBps = getProps(this._properties.filter(d => d.child));
    const numChildrenPropBps = childrenPropsBps.length;
    for (let i = 0; i < numChildren; i++) {
      const child = children[i];
      for (let j = 0; j < numChildrenPropBps; j++) {
        const propBp = childrenPropsBps[j];
        if (child.hasAttribute(propBp)) {
          this.attributeChangedCallback(propBp, null, child.getAttribute(propBp));
        }
      }
      this._childObserver.observe(child, {
        attributes: true,
        attributeFilter: childrenPropsBps,
        attributeOldValue: true
      });
    }
  }

  disconnectedCallback() {
    this._childObserver.disconnect();
  }

  _attachCss(css: {}, mediaQuery: string, alias: string) {
    const id = `${this._layoutType}-${alias || 'all'}`;
    const styleElement = this.shadowRoot!.getElementById(id);

    const unwrapCss = (wrapCss) => {
      if (!wrapCss || wrapCss && wrapCss.length) {
        return wrapCss;
      }

      const keys = Object.keys(wrapCss);
      const numKeys = keys.length;
      let formattedCss = '';
      for (let i = 0; i < numKeys; i++) {
        const key = keys[i];
        const addCss = unwrapCss(wrapCss[key]);
        if (addCss) {
          formattedCss += !wrapCss[key].length ? `${key} {${addCss}}` : `${key}: ${addCss};`;
        }
      }

      return formattedCss;
    };

    const cssStyles = unwrapCss(css);

    if (!styleElement) {
      const newStyleElement = document.createElement('style');
      const slotElement = alias ?
        this.shadowRoot!.querySelector('slot') : this.shadowRoot!.children[1];
      newStyleElement.innerHTML = `@media ${mediaQuery} {${cssStyles}}`;
      newStyleElement.id = id;
      this.shadowRoot!.insertBefore(newStyleElement, slotElement);
    } else {
      styleElement.innerHTML = `@media ${mediaQuery} {${cssStyles}}`;
    }
  }

  _getBreakpointByAlias(alias: string): BreakPointProperty {
    const bpIndex = this._breakpoints.findIndex(b => b.alias === alias);
    const bpFound = bpIndex !== -1;
    return bpFound ? this._breakpoints[bpIndex] : this._allBreakpoint;
  }

  _getPropertyByName(bp: BreakPointProperty, prop: string): [Property, boolean] {
    const bpPropIndex = bp.properties.findIndex(p => p.name === prop);
    const bpPropFound = bpPropIndex !== -1;
    return bpPropFound ?
      [bp.properties[bpPropIndex], false] : [this._properties.find(p => p.name === prop)!, true];
  }
}

/**
 * buildCss -- construct the CSS object with necessary wrappings,
 *             e.g. all host properties must be wrapped with :host
 *             and all child attributes need to be wrapped with ::slotted
 */
function buildCss(alias: string,
                  properties: Property[],
                  inline: boolean,
                  layoutType: string,
                  applyDefaults: boolean) {
  const parentProps = properties.filter(p => !p.child);
  const childProps = properties.filter(p => p.child);
  const numParentProps = parentProps.length;
  const numChildProps = childProps.length;
  const parentKey = ':host';
  const allChildKey = `${parentKey}>*`;
  const wrapChildKey = (childKey) => `::slotted(${childKey})`;
  const css = {};
  css[parentKey] = {};
  css[allChildKey] = {};

  for (let i = 0; i < numParentProps; i++) {
    const parentProp = parentProps[i];
    if (parentProp.values.size === 0) {
      continue;
    }

    const [[value]] = Array.from(parentProp.values);
    const [hostCss, childCss] = parentProp.updateFn(value, alias);
    for (let key of Object.keys(hostCss)) {
      css[parentKey][key] = hostCss[key];
    }
    for (let key of Object.keys(childCss)) {
      css[allChildKey][key] = childCss[key];
    }
  }

  for (let i = 0; i < numChildProps; i++) {
    const childProp = childProps[i];
    for (let key of childProp.values.keys()) {
      const childPropName = alias ? `${childProp.name}.${alias}` : `${childProp.name}`;
      const childKey = wrapChildKey(`[${childPropName}="${key}"]`);
      const [childCss] = childProp.updateFn(key, alias);
      css[childKey] = childCss;
    }
  }

  const parentSize = Object.keys(css[parentKey]).length;
  if (parentSize !== 0 || applyDefaults) {
    css[parentKey]['display'] = inline ? `inline-${layoutType}` : layoutType;
  }

  return css;
}
