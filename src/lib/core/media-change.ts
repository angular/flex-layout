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
  property: string;
  value: any;

  constructor(public matches = false,       // Is the mq currently activated
              public mediaQuery = 'all',    // e.g.   (min-width: 600px) and (max-width: 959px)
              public mqAlias = '',          // e.g.   gt-sm, md, gt-lg
              public suffix = ''            // e.g.   GtSM, Md, GtLg
  ) { }

  clone() {
    return new MediaChange(this.matches, this.mediaQuery, this.mqAlias, this.suffix);
  }
}


