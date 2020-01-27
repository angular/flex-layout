/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {inject, InjectionToken} from '@angular/core';

import {Tag} from './tag';
import {Fill} from './core/fill';
import {Gap} from './core/gap';
import {Offset} from './core/offset';
import {Order} from './core/order';
import {Hide, Show} from './core/show-hide';
import {Flex} from './flex/flex';
import {FlexAlign} from './flex/flex-align';
import {LayoutAlign} from './flex/layout-align';
import {Layout} from './flex/layout';
import {GridGap} from './grid/gap';
import {Inline} from './grid/inline';
import {AlignColumns} from './grid/align-columns';
import {AlignRows} from './grid/align-rows';
import {Area} from './grid/area';
import {Areas} from './grid/areas';
import {Auto} from './grid/auto';
import {Align} from './grid/align';
import {Column} from './grid/column';
import {Columns} from './grid/columns';
import {Row} from './grid/row';
import {Rows} from './grid/rows';


/** All of the extended features that are not CSS standard */
export const CORE_TAGS: Tag[] = [
  new Fill(),
  new Gap(),
  new Hide(),
  new Offset(),
  new Order(),
  new Show()
];

/** All of the standard CSS flexbox-related tags */
export const FLEX_TAGS: Tag[] = [
  new Flex(),
  new FlexAlign(),
  new LayoutAlign(),
  new Layout(),
];

/** All of the standard CSS grid-related tags */
export const GRID_TAGS: Tag[] = [
  new Inline(),
  new GridGap(),
  new AlignColumns(),
  new AlignRows(),
  new Area(),
  new Areas(),
  new Auto(),
  new Align(),
  new Column(),
  new Columns(),
  new Row(),
  new Rows(),
];

/**
 * The default tags as provided by Angular Layout. These include both
 * flex and grid type tags.
*/
export const DEFAULT_TAGS: Tag[] = [...CORE_TAGS, ...FLEX_TAGS, ...GRID_TAGS];

/**
 * The user-facing injection token for providing tags,
 * this is meant to be provided as a multi-provider, and
 * consolidated later.
 */
export const LAYOUT_TAGS = new InjectionToken<Array<Array<Tag>>>('Angular Layout Tags');

/** An internal-facing provider for the default flex tags */
export const FLEX_PROVIDER = {
  provide: LAYOUT_TAGS,
  useValue: FLEX_TAGS,
  multi: true,
};

/** An internal-facing provider for the default grid tags */
export const GRID_PROVIDER = {
  provide: LAYOUT_TAGS,
  useValue: GRID_TAGS,
  multi: true,
};

/** An internal-facing provider for the default tags */
export const TAGS_PROVIDER = {
  provide: LAYOUT_TAGS,
  useValue: DEFAULT_TAGS,
  multi: true,
};

/**
 * An internal-facing injection token to consolidate all registered
 * tags for use in the application.
 */
export const TAGS = new InjectionToken<Map<string, Tag>>('Angular Layout Condensed Tags', {
  providedIn: 'root',
  factory: () => {
    const providedTags = inject(LAYOUT_TAGS);
    const tagsMap: Map<string, Tag> = new Map();
    providedTags.forEach(tags => {
      tags.forEach(tag => {
        tagsMap.set(tag.tag, tag);
      });
    });
    return tagsMap;
  }
});
