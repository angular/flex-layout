
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
 *        initialize(mq) => { $log.debug(`init : ${mq}`); },
 *        enter     (mq) => { $log.debug(`enter: ${mq}`); },
 *        leave     (mq) => { $log.debug(`leave: ${mq}`); }
 *      };
 *
 *  this._subscribers = [
 *    $mediaWatcher.attach(layout_sm    ,callbacks),
 *    $mediaWatcher.attach(layout_gt_sm ,callbacks)
 *  ];
 *
 *  this._ignoreGtSm = () => $mediaWatcher.detach(this._subscribers[1]);
 *  this._watchGtSm  = () => $mediaWatcher.attach(this._subscribers[1]);
 *
 */
class MediaQueryWatcher {

    /**
   * Constructor
   */
  constructor() {
    this._subscriptions = new SubscriberGroups();
    this._watchers      = new QueryWatchers(this._subscriptions);
  }

  // ************************************************
  // Private Methods
  // ************************************************

   /**
    * Prepare a shared watcher (if needed) for the
    * subscriber, then add the subscriber to the
    * known subscriptions registry...
    */
   _connect(subscriber){
     let watchers = this._watchers;
     let query    = subscriber.query;
     let onChange = (watcher) => {
           let isEntering = watcher.matches;
           this._notifySubscribers(query, isEntering);

           if ( !isEntering ) {
            // If we are 'leaving'... simulate enter
            // for the next active/overlapped breakpoint

            this._simulateEnter(query);
           }
         };
  
     this._subscriptions.add(subscriber);
     if ( !watchers.has(query) ) {
       watchers.add(query, onChange);
     }
   }

  /**
   * For overlapping breakpoints, a leave will be generated but NOT an enter (since it is still active)
   * So we simulate an 'enter' notification to allow the injectors to fire properly.
   * Consider:
   *
   *   <div flex flex-gt-sm="xx" flex-gt-lg="xx" />
   *
   * When we 'leave' flex-gt-lg, then the flex-gt-sm should fire.
   */
  _simulateEnter(query) {
     let group = this._subscriptions.findGroupToReactivate(query);

     angular.forEach(group || [ ],(subscriber) => {
       if ( subscriber.active ) {
         // Simulate 'fresh' enter
         subscriber.enter();
       }
     });
   }
  
   /**
    * Remove subscriber from the subscriptions registry
    * and clear the shared mediaQuery change listener (if appropriate)
    */
   _disconnect(subscriber){
     let query = subscriber.query;
     this._subscriptions.remove(subscriber);
     this._watchers.remove(query);
   }
  
   /**
    * Only if the current mediaQuery is active,
    * then process all known subscribers
    */
   _announce(query) {
     if ( this._watchers.isActive(query) ) {
       this._notifySubscribers(query, true);
     }
   }
  
   /**
    *  Notify all subscribers in the mediaQuery group
    *  to either activate or deactivate.
    *
    *  NOTE: This is called from the mediaQuery change listener!
    */
   _notifySubscribers(query, isActive) {
     let group = this._subscriptions.findGroup(query);
  
     angular.forEach(group,(subscriber) => {
       subscriber.activate(isActive);
     });
   }


  // ************************************************
  // Public Methods
  // ************************************************

  /**
     * For the specified mediaQuery, attach a set of
     * callbacks (initialize, enter, leave).
     *
     * @param mediaQuery string
     * @param callbacks object { initialize:fn(), enter:fn(), leave:fn() }
     *
     * @return Subcriber instance
     */
    attach(breakpoint, callbacks) {
      if ( !breakpoint ) return;
      let subscriber = new Subscriber(breakpoint, callbacks );

      this._connect(subscriber);
      this._announce(breakpoint.mediaQuery);

      return subscriber;
    }

    /**
     * Deactivate the subscriber (and notify subscribers) that the
     * mediaQuery value has changed; so `leave` notifications should be issued
     *
     */
    detach(subscriber) {
      if ( !subscriber        ) return;
      if ( !subscriber.active ) return;

      this._disconnect(subscriber);
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
    /**
     * Internal registry of all subscribers (grouped by query)
     */
    this._subscriptions = subscriptions;
  }

  // ************************************************
  // Private Methods
  // ************************************************

  /**
   * Use `window.matchMedia(<query>)` to attach listeners
   * to mediaQuery notifications.
   *
   * @Todo - use polyfill to avoid a `mockMedia`
   */
  _build(query) {
    if ( window.matchMedia ) {
      // For modern webkits:
      let canListen = angular.isDefined(window.matchMedia('all').addListener);
      let hasQuery = canListen && angular.isDefined(ALL_WATCHERS[query]);

      if (!hasQuery) {
        // Returns a new MediaQueryList object representing the
        // parsed results of the specified media query string.

        ALL_WATCHERS[query] = window.matchMedia(query);
        hasQuery = true;
      }

      // Return cached or mocked listener...
      if ( hasQuery ) return ALL_WATCHERS[query];
    }

    return ALL_WATCHERS[query] = this._buildMQLMock();
  }


  /**
    * Factory to build faux mediaQuery watcher with its
    * requisite properties
    */
   _buildMQLMock() {
     return {
       matches        : false,
       sharedListener : void 0,
       addListener    : angular.noop,
       removeListener : angular.noop
     };
   }

  // ************************************************
  // Public Methods
  // ************************************************

  /**
   * Does the specified mediaQuery already have a registered
   * watcher ?
   */
  has(query) {
    return angular.isDefined(ALL_WATCHERS[query]);
  }

  /**
   * Lookup the registered watcher for the specified query
   */
  find(query) {
    return ALL_WATCHERS[query];
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
      let watcher = this._build(query);

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

  // ************************************************
  // Public Accessors
  // ************************************************

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
    return this._subscriptions;
  }

}

/**
 * SubscriberGroups manages 1..n Subscribers
 * Subscribers are external observers requesting notifications of
 * mediaQuery changes; and are grouped by their associated mediaQueries.
 */
class SubscriberGroups {

  constructor() {
    this._groups = { };
  }

  // ************************************************
  // Private Methods
  // ************************************************

  _findQuery(source) {
    return  angular.isString(source) ? source : (source ? source.query : null);
  }

  _scanBy(query){
    if ( !query ) return [ ];

    this._groups[query] = this._groups[query] || [ ];
    return this._groups[query];
  }

  _updateGroup(query, group){
    this._groups[query] = group || [ ];
  }

  /**
   * For Webkit engines that only trigger the MediaQueryListListener
   * when there is at least one CSS selector for the respective media query.
   *
   * @param query string The mediaQuery used to create a faux CSS selector
   *
   */
  _prepare(query){

    if ( !ALL_STYLES[query] ) {
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
      ALL_STYLES[query] = style;
    }
  }

  // ************************************************
  // Public Methods
  // ************************************************

  add(subscriber) {
    if ( subscriber ) {
      let query = this._findQuery(subscriber);
      let group = this._scanBy(query);

      this._prepare(query);
      group.push(subscriber);
    }

    return this;
  }

  remove(subscriber) {
    let query = this._findQuery(subscriber);
    let group = this._scanBy(query);

    // Update the query group
    this._updateGroup(query, group.filter(it => {
      return (it !== subscriber);
    }));

    return this;
  }

  hasGroup(subscriber) {
    let query = this._findQuery(subscriber);
    let group = this._scanBy(query);

    return (group.length > 0);
  }

  findGroup(query) {
    return this._scanBy(query);
  }

  /**
   * MediaQuery listeners are NOT triggered with 'enter' events if breakpoints
   * overlap.
   *
   * Nodes with multiple `-gt-<xxxx>` breakpoints, may not work as expected.
   * Leave events will fire but 'enter' events will not fire for overlapped.
   * Consider:
   *
   *    <div flex-gt-sm="50" flex-gt-md="25" />
   *
   * When the viewport shrinks and flex-gt-md injector 'leaves', then
   * the flex-gt-sm injector should also activate/enter.
   *
   * For overlapping breakpoints, multiple groups may be
   * active. When leaving a mediaQuery, find (if any)
   * other active groups (except the default/global).
   *
   */
  findGroupToReactivate(leaveQuery) {
    let allGroups = this.groupsByPrecedence(this._groups);
    let groupToActivate = [ ];

    // Note: each group has 1..n subscriber instances.

    angular.forEach(allGroups, function(subscribers){
      let mq = subscribers[0].query;
      let isActive = subscribers[0].active;
      let isGlobal = (mq == "screen");

      if ( isActive && !isGlobal && (mq != leaveQuery) ) {
        groupToActivate = subscribers;
      }
    });

    return groupToActivate;
  }

  /**
   * Sort groups from lowest precedence to highest;
   * where HIGHER precedence == small viewPort size
   */
  groupsByPrecedence(groups) {
    let sorted = {}, keys = [ ];

    angular.forEach(groups, function(group){
      sorted[group[0].queryOrder] = group;
      keys.push(group[0].queryOrder);
    });

    return keys
      .sort((a,b)=> a-b)    // numeric, ascending sort
      .map(function(key){
        return sorted[key];
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
  constructor(breakpoint, callbacks){
      this._isActive    = false;
      this._initialized = false;
      this._announce    = this._validate(callbacks);
      this._breakpoint  = breakpoint;
  }


  // ************************************************
  // Private Methods
  // ************************************************


  /**
    * Safeguard callbacks with fallback noop; for all future method calls
    */
   _validate(callbacks) {
     return angular.extend({},{
       initialize: angular.noop,
       enter     : angular.noop,
       leave     : angular.noop
     }, callbacks || { });
   }

  // ************************************************
  // Public Methods
  // ************************************************

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
    return () => {
      this._isActive = true;

      if ( !this._initialized ) {
        this._initialized = true;
        this._announce.initialize(this.query);
      }

      this._announce.enter(this.query);
    };
  }

  /**
   * Notify listeners that we are leaving the current
   * mediaQuery state... and then deactivate.
   */
  get leave() {
    return () => {
      this._isActive = false;
      this._announce.leave(this.query);
    };
  }

  /**
   * Read-only accessor to the associated mediaQuery
   * for this subscriber
   */
  get query() {
    return this._breakpoint.mediaQuery;
  }

  /**
   * Read-only accessor to the associated mediaQuery
   * priority
   */
  get queryOrder() {
    return this._breakpoint.order;
  }
  
  /**
   * Read-only accessor to current activation state
   */
  get active() {
    return this._isActive;
  }

}

// ************************************************************
// Private static variables
// ************************************************************

/**
 * Private cache of all registered, `window.matchMedia(query)` listeners
 */
const ALL_WATCHERS = { };

/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
const ALL_STYLES = { };


// ************************************************************
// Export Module
// ************************************************************


export default MediaQueryWatcher;
