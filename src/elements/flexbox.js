/**
 * FlexLayout -- a Custom Element representation of a flexbox container
 * Options: align, direction, gap
 */
import {getProps} from './util';
import {BaseLayout} from './base';

class FlexLayout extends BaseLayout {

  static get observedAttributes() {
    return getProps(properties);
  }

  constructor() {
    super('flex', properties, childrenProperties);
  }
}

// TODO(CaerusKaru): when we switch to TypeScript, we can probably make this work...
// export function withFlexLayout() {
//   'use strict';
//   return FlexLayout;
// }


customElements.whenDefined('layout-config').then(() => {
  'use strict';
  customElements.define('flex-layout', FlexLayout);
});

const properties = [
  {
    name: 'gap',
    updateFn: _buildGapCSS
  },
  {
    name: 'direction',
    updateFn: _buildDirCSS
  },
  {
    name: 'align',
    updateFn: _buildAlignCSS
  }
];


const childrenProperties = [
  {
    name: 'fxFlex',
    updateFn: _buildFlex
  },
  {
    name: 'fxAlign',
    updateFn: _buildFlexAlign
  },
  {
    name: 'fxOrder',
    updateFn: _buildOrderCss
  },
  {
    name: 'fxOffset',
    updateFn: _buildOffsetCss
  },
];

/******* TOP-LEVEL PROPERTY FUNCTIONS ********/

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

/******* CHILD-LEVEL PROPERTY FUNCTIONS ********/

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
  const configs = document.getElementsByTagName('layout-config');
  const config = configs.length > 0 ? config[0] : null;
  const useColumnBasisZero = config ? config.useColumnBasisZero : false;
  const disableVendorPrefixes = config ? config.disableVendorPrefixes : false;
}
