/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export type MediaQuerySubscriber = (changes: MediaChange) => void;

/**
 * Class instances emitted [to observers] for each mql notification
 */
export class MediaChange {
  property: string = '';
  value: any;

  /**
   * @param matches whether the mediaQuery is currently activated
   * @param mediaQuery e.g. (min-width: 600px) and (max-width: 959px)
   * @param mqAlias e.g. gt-sm, md, gt-lg
   * @param suffix e.g. GtSM, Md, GtLg
   * @param priority the priority of activation for the given breakpoint
   */
  constructor(public matches = false,
              public mediaQuery = 'all',
              public mqAlias = '',
              public suffix = '',
              public priority = 0) {
  }

  /** Create an exact copy of the MediaChange */
  clone(): MediaChange {
    return new MediaChange(this.matches, this.mediaQuery, this.mqAlias, this.suffix);
  }
}


