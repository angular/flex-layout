/**
 * GridLayout -- a Custom Element representation of a CSS Grid container
 * Options: areas, rows, columns, auto, gap, alignColumns, alignRows
 */
import {findBpBySuffix, getBps, getProps} from './util';

class GridLayout extends HTMLElement {

  static get observedAttributes() {
    return getProps(properties);
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this._breakpoints = getBps();
    this._observer = null;
    this._childrenObserver = null;
    this._initialized = false;
    properties.forEach(p => p.updateFn.bind(this));
    childrenProperties.forEach(p => p.updateFn.bind(this));
  }

  connectedCallback() {
    this._buildStyle();
    this._observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Detect insertion of new nodes
        mutation.addedNodes.forEach(node => this.shadowRoot.appendChild(node.cloneNode(true)));
      });
    });

    const childrenPropsBps = getProps(childrenProperties);
    // TODO(CaerusKaru): finalize the mutation
    const childObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {

      });
    });
    for (let i = 0; i < this.children.length; i++) {
      // init the properties
      const child = this.children[i];
      for (let j = 0; j < childrenPropsBps.length; j++) {

      }
      // then watch them
      childObserver.observe(child, { attributes: true, attributeFilter: childrenPropsBps });
    }

    this._observer.observe(this, { childList: true });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const [prop, suffix] = name.split('.');
    const bp = findBpBySuffix(this._breakpoints, suffix);
    if (bp) {
      let suffixCss = '';
      for (let prop of properties) {
        const attribute = this.getAttribute(`${prop.name}.${bp.alias}`);
        suffixCss += attribute ? prop.updateFn(attribute) : '';
      }
      if (suffixCss) {
        suffixCss += ':host{display:grid;}';
        const styleEl = this.shadowRoot.querySelector(`#grid-${bp.alias}`);

        if (styleEl) {
          styleEl.textContent = `@media ${bp.mediaQuery}{${suffixCss}}`;
        } else if (!styleEl && this._initialized) {
          const newEl = document.createElement('style');
          newEl.textContent = `@media ${bp.mediaQuery}{${suffixCss}}`;
          newEl.id = `grid-${bp.alias}`;

          if (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.insertAdjacentElement('afterend', newEl);
          } else {
            this.shadowRoot.appendChild(newEl);
          }
        }
      }
    } else {
      if (properties.some(p => p.name === prop)) {
        let suffixCss = '';
        for (let prop of properties) {
          const attribute = this.getAttribute(prop.name);
          suffixCss += attribute ? prop.updateFn(attribute) : '';
          if (suffixCss) {
            suffixCss += ':host{display:grid;}';
          }
        }

        if (suffixCss) {
          const styleEl = this.shadowRoot.querySelector('#grid-all');
          if (styleEl) {
            styleEl.textContent = `@media all{${suffixCss}}`;
          } else if (!styleEl && this._initialized) {
            const newEl = document.createElement('style');
            newEl.textContent = `@media all{${suffixCss}}`;
            newEl.id = 'grid-all';

            if (this.shadowRoot.firstChild) {
              this.shadowRoot.firstChild.insertAdjacentElement('afterend', newEl);
            } else {
              this.shadowRoot.appendChild(newEl);
            }
          }
        }
      }
    }
  }

  disconnectedCallback() {
    this._observer.disconnect();
    this._childrenObserver.disconnect();
  }

  _buildStyle() {
    // First add the catch-all
    let suffixCss = '';
    for (let prop of properties) {
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
      for (let prop of properties) {
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

    this._initialized = true;
  }
}


Promise.all([
  customElements.whenDefined('layout-config'),
  customElements.whenDefined('break-point'),
  customElements.whenDefined('default-breakpoints')
]).then(() => {
  'use strict';
  customElements.define('grid-layout', GridLayout);
});

function _buildGapCSS(gap) {
  'use strict';

  if (!gap) {
    gap = '0';
  }

  let paddingTop = '0', paddingRight = '0', paddingBottom = gap, paddingLeft = '0';
  let marginTop = '0', marginRight = '0', marginBottom = `-${gap}`, marginLeft = '0';

  let paddingNormal = `padding:${paddingTop} ${gap} ${paddingBottom} ${paddingLeft}`;
  let paddingRtl = `padding:${paddingTop} ${paddingRight} ${paddingBottom} ${gap}`;
  let marginNormal = `margin:${marginTop} -${gap} ${marginBottom} ${marginLeft}`;
  let marginRtl = `margin:${marginTop} ${marginRight} ${marginBottom} -${gap}`;

  const gapNormalCss = `:host{${marginNormal}}:host>*{${paddingNormal}}`;
  const gapRtlCss = `[dir="rtl"]:host{${marginRtl}}[dir="rtl"]:host>*{${paddingRtl}}`;
  return gapNormalCss + gapRtlCss;
}

function _buildDirCSS(dir) {
  'use strict';
  let css = ':host{flex-flow:';

  const [direction, wrap] = dir.split(' ');
  switch (direction) {
    case 'row':
      css += 'row';
      break;
    case 'column':
      css += 'column';
      break;
    case 'row-reverse':
      css += 'row-reverse';
      break;
    case 'column-reverse':
      css += 'column-reverse';
      break;
    default:
      css += 'row';
      break;
  }

  if (wrap === 'wrap') {
    css += ' wrap';
  }

  return css + ';}';
}

function _buildAlignCSS(align) {
  'use strict';
  let css = ':host{', [mainAxis, crossAxis] = align.split(' ');

  // Main axis
  switch (mainAxis) {
    case 'center':
      css += 'justify-content:center;';
      break;
    case 'space-around':
      css += 'justify-content:space-around;';
      break;
    case 'space-between':
      css += 'justify-content:space-between;';
      break;
    case 'space-evenly':
      css += 'justify-content:space-evenly;';
      break;
    case 'end':
    case 'flex-end':
      css += 'justify-content:flex-end;';
      break;
    case 'start':
    case 'flex-start':
    default:
      css += 'justify-content:flex-start;';  // default main axis
      break;
  }

  // Cross-axis
  switch (crossAxis) {
    case 'start':
    case 'flex-start':
      css += 'align-items:flex-start;';
      css += 'align-content:flex-start;';
      break;
    case 'baseline':
      css += 'align-items:baseline;';
      css += 'align-content:baseline;';
      break;
    case 'center':
      css += 'align-items:center;';
      css += 'align-content:center;';
      break;
    case 'end':
    case 'flex-end':
      css += 'align-items:flex-end;';
      css += 'align-content:flex-end;';
      break;
    case 'stretch':
    default: // 'stretch'
      css += 'align-items:stretch;';
      css += 'align-content:stretch;'; // default cross axis
      break;
  }

  return css + '}';
}

function _buildOrderCss(order = 0) {
  'use strict';
  let value = Number(order);
  value = isNaN(value) ? 0 : value;
  return `order:${value};`;
}

function _buildOffsetCss(offset, direction) {
  'use strict';
  if (!offset) {
    offset = 0;
  }
  const isPercent = String(offset).indexOf('%') > -1;
  const isPx = String(offset).indexOf('px') > -1;
  if (!isPx && !isPercent && !isNaN(offset)) {
    offset = offset + '%';
  }

  // TODO(CaerusKaru): design for directionality
  // map for breakpoint and direction
  // for children, send direction as well
  // how to handle RTL?

  let key = '';
  switch (direction) {
    case 'row':
      // TODO(CaerusKaru): add RTL
      key = 'margin-right';
      break;
    case 'column':
      key = 'margin-bottom';
      break;
    case 'row-reverse':
      // TODO(CaerusKaru): add RTL
      key = 'margin-left';
      break;
    case 'column-reverse':
      key = 'margin-top';
      break;
    default:
      // TODO(CaerusKaru): add RTL
      key = 'margin-right';
      break;
  }

  return `${key}:${offset};`;
}

function _buildFlexAlign(align) {
  'use strict';
  let css = '';
  switch (align) {
    case 'start':
      css = `align-self:flex-start;`;
      break;
    case 'end':
      css = `align-self:flex-end;`;
      break;
    default:
      css = `align-self:${align};`;
      break;
  }

  return css;
}

function _buildFlex(flex) {
  'use strict';
}

const properties = [
  {
    name: 'areas',
    updateFn: _buildGapCSS
  },
  {
    name: 'rows',
    updateFn: _buildDirCSS
  },
  {
    name: 'columns',
    updateFn: _buildAlignCSS
  },
  {
    name: 'gap',
    updateFn: _buildAlignCSS
  },
  {
    name: 'auto',
    updateFn: _buildAlignCSS
  },
  {
    name: 'alignColumns',
    updateFn: _buildAlignCSS
  },
  {
    name: 'alignRows',
    updateFn: _buildAlignCSS
  }
];


const childrenProperties = [
  {
    name: 'gdRow',
    updateFn: _buildFlex
  },
  {
    name: 'gdArea',
    updateFn: _buildFlexAlign
  },
  {
    name: 'gdColumn',
    updateFn: _buildOrderCss
  },
  {
    name: 'gdAlign',
    updateFn: _buildOffsetCss
  },
];
