import {getBps, getProps} from './util';

/**
 * The use case we have to support:
 *
 *  <flex-layout flow="column" flow.xs="row">
 *    <div flex="50%" flex.xs="25px"></div>
 *  </flex-layout>
 *
 * Sample CSS rules:
 *
 * <style id="flex-layout-all">
 *   @media all {
 *   [flex="50%"] {
 *     flex: 1 1 50%;
 *   }
 *   :host {
 *     flex-flow: column;
 *   }
 * }
 *
 *
 * <style id="flex-layout-xs">
 * @media (min-width: 0px) and (max-width: 599px) {
 *   [flex.xs="25px"] {
 *     flex: 1 1 25px;
 *   }
 *   :host {
 *     flex-flow: row;
 *   }
 * }
 * </style>
 *
 *
 * should run generation steps:
 *
 * 1) for each parent property in properties: check if parent has the attribute
 *    * if yes, add to parent list (serialized as :host)
 * 2) for each child property in properties: check if each child has the attribute
 *    * if yes, add to child list (serialized as attribute name)
 *
 * Watch (parent): all parent properties, reserialize entire host string as needed for each breakpoint only
 * Watch (children): all children and children properties, reserialize only individual breakpoint
 *
 */


export class BaseLayout extends HTMLElement {

  constructor(layoutType, properties, childrenProperties) {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
      <style>
      :host {
        contain: content;
      }
      </style>
      <slot></slot>
    `;

    this._breakpoints = getBps();
    this._childrenObserver = null;
    this._properties = properties;
    this._childrenProperties = childrenProperties;
    this._childrenPropsBps = getProps(this._childrenProperties);
    this._prefix = layoutType;

    this._properties.forEach(p => p.updateFn.bind(this));
    this._childrenProperties.forEach(p => p.updateFn.bind(this));
  }

  /**
   * attributeChangedCallback -- fired when a top-level attribute from observedAttributes
   *                             changes, at which point we should find the breakpoint for
   *                             that attribute and recompute the style block
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const [prop, alias] = name.split('.');
    const isParentProp = this._properties.some(p => p === prop);
    const bp = this._breakpoints.find(bp => bp.alias === alias);
    const length = bp.actives.length;
    for (let i = 0; i < length; i++) {
      const active = bp.actives[i];
      if (active) {}
    }


    // TODO: remember to add either display or inline-display to each block
    const css = buildCss(bp.mediaQuery, bp.actives);
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
          mutation.target.getAttribute(mutation.attributeName)))
    );
    const numChildren = this.children.length;
    const numChildrenPropBps = this._childrenPropsBps.length;
    for (let i = 0; i < numChildren; i++) {
      const child = this.children[i];
      for (let j = 0; j < numChildrenPropBps; j++) {
        const propBp = this._childrenPropsBps[i];
        const [prop, bp] = propBp.split('.');
        // TODO: initialize the children in the map to send to build style
        if (child.hasAttribute(propBp)) {

        }
      }
      // then watch them
      this._childObserver.observe(child, {
        attributes: true,
        attributeFilter: this._childrenPropsBps,
        attributeOldValue: true
      });
    }

    // TODO: send the map to build and attach the CSS, and don't forget to send parent props too
    buildCss(map);
  }

  disconnectedCallback() {
    this._childrenObserver.disconnect();
  }

  // TODO: completely refactor below
  _buildStyle() {
    // First add the catch-all
    let suffixCss = '';
    for (let prop of this._properties) {
      const attribute = this.getAttribute(prop.name);
      suffixCss += attribute ? prop.updateFn(attribute) : '';
      if (suffixCss) {
        suffixCss += ':host{display:grid;}';
      }
    }

    if (suffixCss) {
      const styleEl = document.createElement('style');
      styleEl.textContent = `@media all{${suffixCss}}`;
      styleEl.id = 'grid-all';
      this.shadowRoot.appendChild(styleEl);
    }

    // Then add the responsive stuff
    for (let bp of this._breakpoints) {
      suffixCss = '';
      for (let prop of this._properties) {
        const attribute = this.getAttribute(`${prop.name}.${bp.alias}`);
        suffixCss += attribute ? prop.updateFn(attribute) : '';
      }
      if (suffixCss) {
        suffixCss += ':host{display:grid;}';
        const styleEl = document.createElement('style');
        styleEl.textContent = `@media ${bp.mediaQuery}{${suffixCss}}`;
        styleEl.id = `grid-${bp.alias}`;
        this.shadowRoot.appendChild(styleEl);
      }
    }
  }
}
