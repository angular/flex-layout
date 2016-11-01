import { isDefined } from '../utils/global';

// ****************************************************************
// Exported Types and Interfaces
// ****************************************************************

/**
 * EventHandler callback with the mediaQuery [range] activates or deactivates
 */
export interface MediaQueryListListener {
    // Function with Window's MediaQueryList argument
    (mql: MediaQueryList): void;
}

/**
 * EventDispatcher for a specific mediaQuery [range]
 */
export interface MediaQueryList {
    readonly matches: boolean;
    readonly media: string;
    addListener(listener: MediaQueryListListener): void;
    removeListener(listener: MediaQueryListListener): void;
}

// ****************************************************************
// ****************************************************************

/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
const ALL_STYLES = { };

/**
 * Factory class used to quickly create a mq listener for a specified mediaQuery range
 * No need to implement polyfill
 */
export class MediaQueryListFactory {

  /**
   * Return a MediaQueryList for the specified media query
   * Publish a mockMQL if needed
   */
  static instanceOf(query:string) : MediaQueryList {
    let canListen = isDefined(window.matchMedia('all').addListener);

    prepare(query);

    return canListen ? window.matchMedia(query) : <MediaQueryList> {
      matches       : query === 'all' || query === '',
      media         : query,
      addListener   : () => { },
      removeListener: () => { }
    };
  }
}


/**
 * For Webkit engines that only trigger the MediaQueryListListener
 * when there is at least one CSS selector for the respective media query.
 *
 * @param query string The mediaQuery used to create a faux CSS selector
 *
 */
function prepare(query){
  if ( !ALL_STYLES[query] ) {
    try {
      let style = document.createElement('style');

          style.setAttribute('type', 'text/css');
          if ( !style["styleSheet"] ) {
            let cssText = `@media ${query} {.ngl-query-test{ }}`;
            style.appendChild(document.createTextNode( cssText ));
          }

      document.getElementsByTagName('head')[0].appendChild(style);

      // Store in private global registry
      ALL_STYLES[query] = style;

    } catch ( e ) {
      console.error( e );
    }
  }
}
