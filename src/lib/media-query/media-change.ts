export type MediaQuerySubscriber = (changes: MediaChange) => void;

/**
 * Class instances emitted [to observers] for each mql notification
 */
export class MediaChange {
  property : string;
  value    : any;

  constructor(public matches = false,       // Is the mq currently activated
              public mediaQuery = 'all',    // e.g.   screen and (min-width: 600px) and (max-width: 959px)
              public mqAlias = '',          // e.g.   gt-sm, md, gt-lg
              public suffix = ''            // e.g.   GtSM, Md, GtLg
  ) { }
}


