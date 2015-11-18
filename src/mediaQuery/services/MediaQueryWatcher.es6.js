
/**
 * Service that manages subscriptions to mediaQuery changes.
 * Subscribers will be notified of initialize, enter, and leave changes
 * via ::attach() callback functions.
 *
 * @code:
 *
 *  let self         = $scope,
 *      layout_sm    = "screen and (min-width:0px) and (max-width:599px)",
 *      layout_gt_sm = "screen and (min-width:600px)",
 *      callbacks    = {
 *        initialize : (mq) => { $log.debug(`init : ${mq}`); },
 *        enter      : (mq) => { $log.debug(`enter: ${mq}`); },
 *        leave      : (mq) => { $log.debug(`leave: ${mq}`); }
 *      };
 *
 *  self.subscribers = [
 *    $mediaWatcher.attach(layout_sm    ,callbacks),
 *    $mediaWatcher.attach(layout_gt_sm ,callbacks)
 *  ];
 *
 *  self.ignoreGtSm = () => $mediaWatcher.detach(self.subscribers[1]);
 *  self.watchGtSm  = () => $mediaWatcher.attach(self.subscribers[1]);
 *
 */
class MediaQueryWatcher {

  /**
   * For the specified mediaQuery, attach a set of
   * callbacks (initialize, enter, leave).
   *
   * @param mediaQuery string
   * @param callbacks object { initialize:fn(), enter:fn(), leave:fn() }
   *
   * @return Subcriber instance
   */
  attach(mediaQuery, callbacks) {
    if ( !mediaQuery ) return;

    let self  = privates.get(this);
    let subscriber = new Subscriber(mediaQuery, callbacks );

    self.connect(subscriber);
    self.announce(mediaQuery);

    return subscriber;
  }

  /**
   * Deactivate the subscriber (and notify subscribers) that the
   * mediaQuery value has changed; so `leave` notifications should be issued
   *
   */
  detach(subscriber) {
    let self  = privates.get(this);

    if ( !subscriber        ) return;
    if ( !subscriber.active ) return;

    self.disconnect(subscriber);
  }

  /**
   * Constructor
   */
  constructor() {
    let subscriptions = new SubscriberGroups();

    // !! Configure private methods
    privates.set(this,  {

      subscriptions : subscriptions,
      watchers      : new QueryWatchers(subscriptions),

      /**
       * Prepare a shared watcher (if needed) for the
       * subscriber, then add the subscriber to the
       * known subscriptions registry...
       */
      connect : (subscriber)  => {
        let self     = privates.get(this);
        let watchers = self.watchers;
        let query    = subscriber.query;

        self.subscriptions.add(subscriber);

        if ( !watchers.has(query) ) {
          watchers.add(query, (watcher) => {

            let isActive = watcher.matches;
            self.notifySubscribers(query, isActive);

          });
        }
      },

      /**
       * Remove subscriber from the subscriptions registry
       * and clear the shared mediaQuery change listener (if appropriate)
       */
      disconnect : (subscriber)  => {
        let self  = privates.get(this);
        let query = subscriber.query;

        self.subscriptions.remove(subscriber);
        self.watchers.remove(query);
      },

      /**
       * Only if the current mediaQuery is active,
       * then process all known subscribers
       */
      announce : (query) => {
        let self  = privates.get(this);

        if ( self.watchers.isActive(query) ) {
          self.notifySubscribers(query, true);
        }
      },

      /**
       *  Notify all subscribers in the mediaQuery group
       *  to either activate or deactivate.
       *
       *  NOTE: This is called from the mediaQuery change listener!
       */
      notifySubscribers : (query, isActive) => {
        let self  = privates.get(this);
        let group = self.subscriptions.findGroup(query);

        angular.forEach(group,(subscriber) => {
          subscriber.activate(isActive);
        });
      }

    });
  }


}

// **************************
// Helper Classes
// **************************

/**
 * QueryWatchers manages 1..n mediaQuery listeners.
 * A mediaQuery listener is shared for all subscribers of a query.
 * Each query has its own shared listener...
 */
class QueryWatchers {

  /**
   * Constructor
   */
  constructor(subscriptions) {
    privates.set(this,  {

      /**
       * Internal registry of all subscribers (grouped by query)
       */
      subscriptions : subscriptions,

      /**
       * Use `window.matchMedia(<query>)` to attach listeners
       * to mediaQuery notifications.
       *
       * @Todo - use polyfill to avoid a `mockMedia`
       */
      build : (query) => {
        if ( window.matchMedia ) {
          // For modern webkits:
          let canListen = angular.isDefined(window.matchMedia('all').addListener);
          let hasQuery = canListen && angular.isDefined(allWatchers[query]);

          if (!hasQuery) {
            // Returns a new MediaQueryList object representing the
            // parsed results of the specified media query string.

            allWatchers[query] = window.matchMedia(query);
            hasQuery = true;
          }

          // Return cached or mocked listener...
          if ( hasQuery ) return allWatchers[query];
        }

        return allWatchers[query] = buildMQLMock();
      }

    });
  }

  /**
   * Does the specified mediaQuery already have a registered
   * watcher ?
   */
  has(query) {
    return angular.isDefined(allWatchers[query]);
  }

  /**
   * Lookup the registered watcher for the specified query
   */
  find(query) {
    return allWatchers[query];
  }

  /**
    * Cache the shared listener; since each query has a
    * listener for 1...n subscribers.
    *
    * NOTE: Remove the shared listener when the
    * all subscribers (for the query) are detached..
    *
    */
  add(query, onMediaChange) {
    if ( !this.has(query) ) {
      let self = privates.get(this);
      let watcher = self.build(query);

      watcher.addListener(onMediaChange);
      watcher.sharedListener = onMediaChange;
    }
  }

  /**
   * If all subscribers [for the associated mediaQuery] are detached,
   * then clear the shared listener.
   */
  remove(query) {
    if ( this.has(query) ) {
      let watcher = this.find(query);
      let group = this.subscribers.findGroup(query);

      if ( !group.length ) {
        watcher.removeListener( watcher.sharedListener );
      }
    }
  }

  /**
   * Is the specified mediaQuery currently active?
   */
  isActive(query) {
    return this.find(query).matches;
  }


  /**
   * Read-only accessor
   */
  get subscribers() {
    let self = privates.get(this);
    return self.subscriptions;
  }

}

/**
 * SubscriberGroups manages 1..n Subscribers
 * Subscribers are external observers requesting notifications of
 * mediaQuery changes; and are grouped by their associated mediaQueries.
 */
class SubscriberGroups {

  add(subscriber) {
    let self = privates.get(this);
    
    if ( subscriber ) {
      let query = self.findQuery(subscriber);
      let group = self.scanBy(query);

      self.prepare(query);
      group.push(subscriber);
    }

    return this;
  }

  remove(subscriber) {
    let self = privates.get(this);
    let query = self.findQuery(subscriber);
    let group = self.scanBy(query);

    // Update the query group
    self.updateGroup(query, group.filter(it => {
      return (it !== subscriber);
    }));

    return this;
  }

  hasGroup(subscriber) {
    let self = privates.get(this);
    let query = self.findQuery(subscriber);
    let group = self.scanBy(query);

    return (group.length > 0);
  }

  findGroup(query) {
    let self = privates.get(this);
    return self.scanBy(query);
  }

  /**
   * Constructor
   */
  constructor() {
    privates.set(this,  {

      groups : { },

      findQuery : (source) => {
        return  angular.isString(source) ? source : (source ? source.query : null);
      },

      scanBy : (query)  => {
        if ( !query ) return [ ];

        let self = privates.get(this);
        self.groups[query] = self.groups[query] || [ ];

        return self.groups[query];
      },

      updateGroup : (query, group)  => {
        let self = privates.get(this);
        self.groups[query] = group || [ ];
      },

      /**
       * For Webkit engines that only trigger the MediaQueryListListener
       * when there is at least one CSS selector for the respective media query.
       *
       * @param query string The mediaQuery used to create a faux CSS selector
       *
       */
      prepare : (query)  => {

        if ( !allStyles[query] ) {
          let style = document.createElement('style');

          style.setAttribute('type', 'text/css');
          document.getElementsByTagName('head')[0].appendChild(style);

          if ( !style.styleSheet ) {
            let textNode = document.createTextNode(
              `@media ${query} {.md-query-test{ }}`
            );
            style.appendChild(textNode);
          }

          // Store in private global registry
          allStyles[query] = style;
        }
      }
    });
  }
}

/**
 * Subscriber is a delegate class used to forward notifications
 * of mediaQuery changes to external observers. Observers register
 * a subscription for a query with MediaQueryWatcher::attach()
 */
class Subscriber {

  /**
   * Constructor
   */
  constructor(mediaQuery, callbacks){
    privates.set(this,  {

      isActive    : false,
      initialized : false,
      announce    : validate(callbacks),
      mediaQuery  : mediaQuery

    });
  }

  /**
   * Issue the enter or leave announcements for the current
   * subscriber
   */
  activate(isActive) {
    if (this.active != isActive) {
      if ( isActive ) this.enter();
      else            this.leave();
    }
  }

  /**
   * Notify listeners to initialize (1st time only)
   * then announce that we are 'entering' a mediaQuery state
   * and activate.
   */
  get enter() {
    let self = privates.get(this);
    return () => {
      self.isActive = true;

      if ( !self.initialized ) {
        self.initialized = true;
        self.announce.initialize(this.query);
      }

      self.announce.enter(this.query);
    };
  }

  /**
   * Notify listeners that we are leaving the current
   * mediaQuery state... and then deactivate.
   */
  get leave() {
    let self = privates.get(this);
    return () => {
      self.isActive = false;
      self.announce.leave(this.query);
    };
  }

  /**
   * Read-only accessor to the associated mediaQuery
   * for this subscriber
   */
  get query() {
    let self = privates.get(this);
    return self.mediaQuery;
  }
  
  /**
   * Read-only accessor to current activation state
   */
  get active() {
    let self = privates.get(this);
    return self.isActive;
  }

}

// ************************************************************
// Private static variables
// ************************************************************

/**
 * Private cache for each Class instances' private data and methods.
 */
const privates = new WeakMap();

/**
 * Private cache of all registered, `window.matchMedia(query)` listeners
 */
const allWatchers = { };

/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
const allStyles = { };

// ************************************************************
// Private static utility functions
// ************************************************************

/**
 * Safeguard callbacks with fallback noop; for all future method calls
 */
function validate(callbacks) {
  return angular.extend({},{
    initialize: angular.noop,
    enter     : angular.noop,
    leave     : angular.noop
  }, callbacks || { });
}

/**
 * Factory to build faux mediaQuery watcher with its
 * requisite properties
 */
function buildMQLMock() {
  return {
    matches        : false,
    sharedListener : void 0,
    addListener    : angular.noop,
    removeListener : angular.noop
  };
}

// ************************************************************
// Export only the MediaQueryWatcher
// ************************************************************


export default MediaQueryWatcher;
