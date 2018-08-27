/**
 * GridLayout -- a Custom Element representation of a CSS Grid container
 * Options: areas, rows, columns, auto, gap, alignColumns, alignRows
 */
import {getProps} from './util.js';
import {BaseLayout} from './base.js';
import {Property} from './config.js';

const DELIMETER = '|';
const AUTO_SPECIFIER = '!';
const DEFAULT_MAIN = 'start';
const DEFAULT_CROSS = 'stretch';
const ROW_DEFAULT = 'stretch';
const COL_DEFAULT = 'stretch';

export class GridLayout extends BaseLayout {

  static get observedAttributes() {
    return getProps(properties.filter(d => !d.child));
  }

  constructor() {
    super('grid', properties);
  }
}

// TODO(CaerusKaru): when we switch to TypeScript, we can probably make this work...
// export function withGridLayout(Base = {}) {
//   'use strict';
//   return class extends Base {
//   };
// }

export function defineGrid() {
  customElements.whenDefined('layout-config').then(() => {
    customElements.define('grid-layout', GridLayout);
  });
}


// Type: Property
// {name: string, updateFn: (value: string) => string}
const properties: Property[] = [
  {
    name: 'areas',
    updateFn: _buildAreas,
    child: false,
    values: new Map(),
  },
  {
    name: 'rows',
    updateFn: _buildRows,
    child: false,
    values: new Map(),
  },
  {
    name: 'columns',
    updateFn: _buildColumns,
    child: false,
    values: new Map(),
  },
  {
    name: 'gap',
    updateFn: _buildGap,
    child: false,
    values: new Map(),
  },
  {
    name: 'auto',
    updateFn: _buildAuto,
    child: false,
    values: new Map(),
  },
  {
    name: 'alignColumns',
    updateFn: _buildAlignColumns,
    child: false,
    values: new Map(),
  },
  {
    name: 'alignRows',
    updateFn: _buildAlignRows,
    child: false,
    values: new Map(), // map: <value, numInstances>
  },
  {
    name: 'gdRow',
    updateFn: _buildRow,
    child: true,
    values: new Map(),
  },
  {
    name: 'gdArea',
    updateFn: _buildArea,
    child: true,
    values: new Map(),
  },
  {
    name: 'gdColumn',
    updateFn: _buildColumn,
    child: true,
    values: new Map(),
  },
  {
    name: 'gdAlign',
    updateFn: _buildAlign,
    child: true,
    values: new Map(),
  },
];


/******* TOP-LEVEL PROPERTY FUNCTIONS ********/

/**
 * The return type for these functions is [host styles, child styles]
 */

function _buildAreas(value) {
  const areas = value.split(DELIMETER).map(v => `"${v.trim()}"`);

  return [{'grid-template-areas': areas.join(' ')}, {}];
}

function _buildRows(value) {
  let auto = false;
  if (value.endsWith(AUTO_SPECIFIER)) {
    value = value.substring(0, value.indexOf(AUTO_SPECIFIER));
    auto = true;
  }

  let css = {
    'grid-auto-rows': '',
    'grid-template-rows': '',
  };
  const key = (auto ? 'grid-auto-rows' : 'grid-template-rows');
  css[key] = value;

  return [css, {}];
}

function _buildColumns(value) {
  let auto = false;
  if (value.endsWith(AUTO_SPECIFIER)) {
    value = value.substring(0, value.indexOf(AUTO_SPECIFIER));
    auto = true;
  }

  let css = {
    'grid-auto-columns': '',
    'grid-template-columns': '',
  };
  const key = (auto ? 'grid-auto-columns' : 'grid-template-columns');
  css[key] = value;

  return [css, {}];
}

function _buildGap(value) {
  return [{'grid-gap': value}, {}];
}

function _buildAuto(value) {
  let [direction, dense] = value.split(' ');
  if (direction !== 'column' && direction !== 'row' && direction !== 'dense') {
    direction = 'row';
  }

  dense = (dense === 'dense' && direction !== 'dense') ? ' dense' : '';

  return [{'grid-auto-flow': direction + dense}, {}];
}

function _buildAlignColumns(align) {
  let css = {}, [mainAxis, crossAxis] = align.split(' ');

  // Main axis
  switch (mainAxis) {
    case 'center':
      css['align-content'] = 'center';
      break;
    case 'space-around':
      css['align-content'] = 'space-around';
      break;
    case 'space-between':
      css['align-content'] = 'space-between';
      break;
    case 'space-evenly':
      css['align-content'] = 'space-evenly';
      break;
    case 'end':
      css['align-content'] = 'end';
      break;
    case 'start':
      css['align-content'] = 'start';
      break;
    case 'stretch':
      css['align-content'] = 'stretch';
      break;
    default:
      css['align-content'] = DEFAULT_MAIN;  // default main axis
      break;
  }

  // Cross-axis
  switch (crossAxis) {
    case 'start':
      css['align-items'] = 'start';
      break;
    case 'center':
      css['align-items'] = 'center';
      break;
    case 'end':
      css['align-items'] = 'end';
      break;
    case 'stretch':
      css['align-items'] = 'stretch';
      break;
    default : // 'stretch'
      css['align-items'] = DEFAULT_CROSS;   // default cross axis
      break;
  }

  return [css, {}];
}

function _buildAlignRows(align) {
  let css = {}, [mainAxis, crossAxis] = align.split(' ');

  // Main axis
  switch (mainAxis) {
    case 'center':
    case 'space-around':
    case 'space-between':
    case 'space-evenly':
    case 'end':
    case 'start':
    case 'stretch':
      css['justify-content'] = mainAxis;
      break;
    default:
      css['justify-content'] = DEFAULT_MAIN;  // default main axis
      break;
  }

  // Cross-axis
  switch (crossAxis) {
    case 'start':
    case 'center':
    case 'end':
    case 'stretch':
      css['justify-items'] = crossAxis;
      break;
    default : // 'stretch'
      css['justify-items'] = DEFAULT_CROSS;   // default cross axis
      break;
  }

  return [css, {}];
}

/******* CHILD-LEVEL PROPERTY FUNCTIONS ********/

function _buildArea(value) {
  return [{'grid-area': value}];
}

function _buildRow(value) {
  return [{'grid-row': value}];
}

function _buildColumn(value) {
  return [{'grid-column': value}];
}

function _buildAlign(align) {
  let css = {}, [rowAxis, columnAxis] = align.split(' ');

  // Row axis
  switch (rowAxis) {
    case 'end':
      css['justify-self'] = 'end';
      break;
    case 'center':
      css['justify-self'] = 'center';
      break;
    case 'stretch':
      css['justify-self'] = 'stretch';
      break;
    case 'start':
      css['justify-self'] = 'start';
      break;
    default:
      css['justify-self'] = ROW_DEFAULT;  // default row axis
      break;
  }

  // Column axis
  switch (columnAxis) {
    case 'end':
      css['align-self'] = 'end';
      break;
    case 'center':
      css['align-self'] = 'center';
      break;
    case 'stretch':
      css['align-self'] = 'stretch';
      break;
    case 'start':
      css['align-self'] = 'start';
      break;
    default:
      css['align-self'] = COL_DEFAULT;  // default column axis
      break;
  }

  return [css];
}
