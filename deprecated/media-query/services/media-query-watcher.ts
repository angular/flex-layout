/// <reference path="../../../typings/browser.d.ts" />

import { BreakPoint } from './break-points';

export type MediaQuery = string;

type MediaQueryChangeHandler = (watcher: MediaQueryListenerAPI) => void;

export class MediaQueryWatcherService {
  private _subscriptions: SubscriberGroups = new SubscriberGroups(new BrowserMediaQueryRegistrar());
  private _watchers: QueryWatchers = new QueryWatchers(this._subscriptions);

  /**
   * For the specified mediaQuery, attach a set of
   * callbacks (initialize, enter, leave).
   *
   * @param mediaQuery string
   * @param callbacks object { initialize:fn(), enter:fn(), leave:fn() }
   *
   * @return Subcriber instance
   */
  attach(breakpoint: BreakPoint, hooks: SubscriberHooks): Subscriber {
    let subscriber = new Subscriber(breakpoint, hooks);

    this._connect(subscriber);
    this._announce(breakpoint.mediaQuery);

    return subscriber;
  }

  detach(subscriber: Subscriber) {
    if (subscriber.active) return;
    this._disconnect(subscriber);
  }

  /**
   * Prepare a shared watcher (if needed) for the
   * subscriber, then add the subscriber to the
   * known subscriptions registry...
   */
  private _connect(subscriber: Subscriber) {
    let watchers = this._watchers;
    let query    = subscriber.query;
    let onChange: MediaQueryChangeHandler = (watcher: MediaQueryListenerAPI) => {
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
   * Remove subscriber from the subscriptions registry
   * and clear the shared mediaQuery change listener (if appropriate)
   */
  private _disconnect(subscriber: Subscriber) {
    let query = subscriber.query;
    this._subscriptions.remove(subscriber);
    this._watchers.remove(query);
  }

  /**
   * Only if the current mediaQuery is active,
   * then process all known subscribers
   */
  private _announce(query: MediaQuery) {
    if ( this._watchers.isActive(query) ) {
      this._notifySubscribers(query, true);
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
  private _simulateEnter(query: MediaQuery) {
    let group = this._subscriptions.subscribersToActivate(query);

    for (let subscriber of group) {
      if ( subscriber.active ) {
        // Simulate 'fresh' enter
        subscriber.enter();
      }
    }
  }

  /**
   *  Notify all subscribers in the mediaQuery group
   *  to either activate or deactivate.
   *
   *  NOTE: This is called from the mediaQuery change listener!
   */
  private _notifySubscribers(query: MediaQuery, isActive: boolean) {
    let group = this._subscriptions.findGroup(query);

    for (let subscriber of group) {
      subscriber.activate(isActive);
    }
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
const ALL_WATCHERS: { [query: string]: MediaQueryListenerAPI } = { };

export class QueryWatchers {
  constructor(private _subscriptions: SubscriberGroups) {
  }

  /**
   * Does the specified mediaQuery already have a registered
   * watcher ?
   */
  has(query: MediaQuery): boolean {
    return angular.isDefined(ALL_WATCHERS[query]);
  }

  /**
   * Lookup the registered watcher for the specified query
   */
  find(query: MediaQuery): MediaQueryListenerAPI {
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
  add(query: MediaQuery, onMediaChange: MediaQueryChangeHandler) {
    if (!this.has(query)) {
      let watcher = this._build(query);
      watcher.addListener(onMediaChange);
      watcher.sharedListener = onMediaChange;
    }
  }

  /**
   * Is the specified mediaQuery currently active?
   */
  isActive(query: MediaQuery): boolean {
    return this.find(query).matches;
  }

  /**
   * If all subscribers [for the associated mediaQuery] are detached,
   * then clear the shared listener.
   */
  remove(query: MediaQuery) {
    if (this.has(query)) {
      let watcher = this.find(query);
      let group = this._subscriptions.findGroup(query);

      if ( !group.length ) {
        watcher.removeListener( watcher.sharedListener );
      }
    }
  }

  private _build(query: MediaQuery): MediaQueryListenerAPI {
    if (window.matchMedia) {
      let canListen = angular.isDefined(window.matchMedia('all').addListener);
      let hasQuery = canListen && angular.isDefined(ALL_WATCHERS[query]);

      if (!hasQuery) {
        ALL_WATCHERS[query] = window.matchMedia(query);
        hasQuery = true;
      }
      return ALL_WATCHERS[query];
    } else {
      return this._mockMQL();
    }
  }

  private _mockMQL(): MediaQueryListenerAPI {
    return {
      matches: false,
      addListener: angular.noop,
      removeListener: angular.noop,
      sharedListener: null
    };
  }
}

interface MediaQueryListenerAPI {
  matches: boolean;
  addListener: Function;
  removeListener: Function;
  sharedListener?: Function;
}


/**
 * SubscriberGroups manages 1..n Subscribers
 * Subscribers are external observers requesting notifications of
 * mediaQuery changes; and are grouped by their associated mediaQueries.
 */
export class SubscriberGroups {
  private _groups: { [query: string]: Subscriber[] } = {};

  constructor(private _browserRegistrar: BrowserMediaQueryRegistrar) {
  }

  add(subscriber: Subscriber): SubscriberGroups {
    this._browserRegistrar.registerMediaQuery(subscriber.query);
    let group = this.findGroup(subscriber.query);
    group.push(subscriber);
    return this;
  }

  remove(subscriber: Subscriber): SubscriberGroups {
    let group = this.findGroup(subscriber.query);

    let index = group.indexOf(subscriber);
    if (index != -1) {
      group.splice(index, 1);
    }

    return this;
  }

  findGroup(query: MediaQuery): Subscriber[] {
    this._groups[query] = this._groups[query] || [];
    return this._groups[query];
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

  subscribersToActivate(leaveQuery: MediaQuery): Subscriber[] {
    let allGroups = this._groupsByPrecedence();

    for (let group of allGroups) {
      let isGlobal = group[0].query == 'screen';
      let isActive = group[0].isActive;

      if ( isActive && !isGlobal && group[0].query != leaveQuery ) {
        return group;
      }
    }
  }

  private _groupsByPrecedence(): Subscriber[][] {
    return Object.keys(this._groups)
      .map(groupName => this._groups[groupName])
      .sort((a, b) => a[0].queryOrder - b[0].queryOrder); // numeric, ascending sort
  }
}

/**
 * Subscriber is a delegate class used to forward notifications
 * of mediaQuery changes to external observers. Observers register
 * a subscription for a query with MediaQueryWatcher::attach()
 */
export class Subscriber {
  public isActive: boolean = false;
  private _initialized: boolean = false;

  constructor(private _breakpoint: BreakPoint, private _hooks: SubscriberHooks) {
  }

  get active(): boolean {
    return this.isActive;
  }

  get query(): MediaQuery {
    return this._breakpoint.mediaQuery;
  }

  get queryOrder(): number {
    return this._breakpoint.order;
  }

  /**
   * Issue the enter or leave announcements for the current
   * subscriber
   */
  activate(newActive: boolean): void {
    if (newActive != this.isActive) {
      if ( newActive ) this.enter();
      else            this.leave();
    }
  }

  /**
   * Notify listeners to initialize (1st time only)
   * then announce that we are 'entering' a mediaQuery state
   * and activate.
   */
  enter(): void {
    this.isActive = true;
    if (!this._initialized) {
      this._initialized = true;
      if (this._hooks.initialize) {
        this._hooks.initialize(this._breakpoint.mediaQuery);
      }
    }
  }

  /**
   * Notify listeners that we are leaving the current
   * mediaQuery state... and then deactivate.
   */
  leave(): void {
    this.isActive = false;
    if (this._hooks.leave) {
      this._hooks.leave(this._breakpoint.mediaQuery);
    }
  }
}

/**
 * Interface representing the required lifecycle events that a subscriber must respond to
 */
export interface SubscriberHooks {
  initialize?: (query: MediaQuery) => void;
  enter?: (query: MediaQuery) => void;
  leave?: (query: MediaQuery) => void;
}

/**
 * BrowserMediaQueryRegistrar inserts CSS selectors into the DOM
 * For Webkit engines that only trigger the MediaQueryListListener
 * when there is at least one CSS selector for the respective media query.
 */
export class BrowserMediaQueryRegistrar {
  private _registeredStyles: { [query: string]: HTMLElement };

  registerMediaQuery(query: MediaQuery) {
    if (this._registeredStyles[query]) return;
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    document.querySelector('head').appendChild(style);

    let textNode = document.createTextNode(
      `@media ${query} {.md-query-test{}}`
    );
    style.appendChild(textNode);

    this._registeredStyles[query] = style;
  }
}
