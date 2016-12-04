export type MediaQuerySubscriber = (changes: MediaChange) => void;

/**
 * Class instances emitted [to observers] for each mql notification
 */
export class MediaChange {
  property : string;
  value    : any;

  constructor(public matches: boolean,              // Is the mq currently activated
              public mediaQuery: string = 'all',    // e.g.   screen and (min-width: 600px) and (max-width: 959px)
              public mqAlias: string = '',          // e.g.   gt-sm, md, gt-lg
              public suffix: string = ''            // e.g.   GtSM, Md, GtLg
  ) { }
}


