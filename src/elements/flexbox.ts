/**
 * FlexLayout -- a Custom Element representation of a flexbox container
 * Options: align, direction, gap
 */
import {getProps} from './util.js';
import {BaseLayout} from './base.js';
import {Property} from './config.js';

export class FlexLayout extends BaseLayout {

  static get observedAttributes() {
    return getProps(properties.filter(d => !d.child));
  }

  constructor() {
    super('flex', properties);
  }
}

// TODO(CaerusKaru): when we switch to TypeScript, we can probably make this work...
// export function withFlexLayout() {
//   'use strict';
//   return FlexLayout;
// }

export function defineFlex() {
  customElements.whenDefined('layout-config').then(() => {
    customElements.define('flex-layout', FlexLayout);
  });
}


const properties: Property[] = [
  {
    name: 'gap',
    updateFn: _buildGapCSS,
    child: false,
  },
  {
    name: 'direction',
    updateFn: _buildDirCSS,
    child: false,
  },
  {
    name: 'align',
    updateFn: _buildAlignCSS,
    child: false,
  },
  {
    name: 'flex',
    updateFn: _buildFlex,
    child: true,
  },
  {
    name: 'fx-align',
    updateFn: _buildFlexAlign,
    child: true,
  },
  {
    name: 'order',
    updateFn: _buildOrderCss,
    child: true,
  },
  {
    name: 'offset',
    updateFn: _buildOffsetCss,
    child: true,
  },
];

/******* TOP-LEVEL PROPERTY FUNCTIONS ********/

/**
 * The return type for these functions is [host styles, child styles]
 */

function _buildGapCSS(gap) {
  const hostCss = {}, childCss = {};
  const ltrKey = '[dir="rtl"]';
  childCss[ltrKey] = {};
  hostCss[ltrKey] = {};
  if (!gap) {
    gap = '0';
  }

  let paddingTop = '0', paddingRight = '0', paddingBottom = gap, paddingLeft = '0';
  let marginTop = '0', marginRight = '0', marginBottom = `-${gap}`, marginLeft = '0';

  childCss['padding'] = `${paddingTop} ${gap} ${paddingBottom} ${paddingLeft}`;
  hostCss['margin'] = `${marginTop} -${gap} ${marginBottom} ${marginLeft}`;
  childCss[ltrKey]['padding'] = `${paddingTop} ${paddingRight} ${paddingBottom} ${gap}`;
  hostCss[ltrKey]['margin'] = `${marginTop} ${marginRight} ${marginBottom} -${gap}`;

  return [hostCss, childCss];
}

function _buildDirCSS(dir) {
  let css = '';

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

  return [{'flex-flow': css}, {}];
}

function _buildAlignCSS(align) {
  const css = {}, [mainAxis, crossAxis] = align.split(' ');

  // Main axis
  switch (mainAxis) {
    case 'center':
      css['justify-content'] = 'center';
      break;
    case 'space-around':
      css['justify-content'] = 'space-around';
      break;
    case 'space-between':
      css['justify-content'] = 'space-between';
      break;
    case 'space-evenly':
      css['justify-content'] = 'space-evenly';
      break;
    case 'end':
    case 'flex-end':
      css['justify-content'] = 'flex-end';
      break;
    case 'start':
    case 'flex-start':
    default:
      css['justify-content'] = 'flex-start';  // default main axis
      break;
  }

  // Cross-axis
  switch (crossAxis) {
    case 'start':
    case 'flex-start':
      css['align-items'] = 'flex-start';
      css['align-content'] = 'flex-start';
      break;
    case 'baseline':
      css['align-items'] = 'baseline';
      css['align-content'] = 'baseline';
      break;
    case 'center':
      css['align-items'] = 'center';
      css['align-content'] = 'center';
      break;
    case 'end':
    case 'flex-end':
      css['align-items'] = 'flex-end';
      css['align-content'] = 'flex-end';
      break;
    case 'stretch':
    default: // 'stretch'
      css['align-items'] = 'stretch';
      css['align-content'] = 'stretch'; // default cross axis
      break;
  }

  return [css, {}];
}

/******* CHILD-LEVEL PROPERTY FUNCTIONS ********/

function _buildOrderCss(order) {
  let value = Number(order || 0);
  value = isNaN(value) ? 0 : value;
  return [{order: value}];
}

function _buildOffsetCss(offset, alias) {
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

  const direction = getDirection(this, alias);
  const css = {};
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
  css[key] = offset;

  return [css];
}

function _buildFlexAlign(align) {
  const css = {};
  switch (align) {
    case 'start':
      css['align-self'] = 'flex-start';
      break;
    case 'end':
      css['align-self'] = 'flex-end';
      break;
    default:
      css['align-self'] = align;
      break;
  }

  return [css];
}

function _buildFlex(flex, alias) {
  const configs = document.getElementsByTagName('layout-config');
  const config = configs.length > 0 ? configs[0] : null;
  const useColumnBasisZero = config ? config.hasAttribute('useColumnBasisZero') : false;
  const disableVendorPrefixes = config ? config.hasAttribute('disableVendorPrefixes') : false;
  const css = {};
  const [direction, wrap] = (getDirection(this, alias) || 'row').split(' ');
  const isHorizontal = direction.startsWith('row');

  css['flex'] = flex || '1';

  return [css];
}

function getDirection(element, alias): string {
  const attribute = alias ? `direction.${alias}` : 'direction';
  return element.getAttribute(attribute);
}
