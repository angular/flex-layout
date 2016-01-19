/// <reference path="../../../typings/browser.d.ts" />
var MediaQueryWatcherService = (function () {
    function MediaQueryWatcherService() {
        this._subscriptions = new SubscriberGroups(new BrowserMediaQueryRegistrar());
        this._watchers = new QueryWatchers(this._subscriptions);
    }
    /**
     * For the specified mediaQuery, attach a set of
     * callbacks (initialize, enter, leave).
     *
     * @param mediaQuery string
     * @param callbacks object { initialize:fn(), enter:fn(), leave:fn() }
     *
     * @return Subcriber instance
     */
    MediaQueryWatcherService.prototype.attach = function (breakpoint, hooks) {
        var subscriber = new Subscriber(breakpoint, hooks);
        this._connect(subscriber);
        this._announce(breakpoint.mediaQuery);
        return subscriber;
    };
    MediaQueryWatcherService.prototype.detach = function (subscriber) {
        if (subscriber.active)
            return;
        this._disconnect(subscriber);
    };
    /**
     * Prepare a shared watcher (if needed) for the
     * subscriber, then add the subscriber to the
     * known subscriptions registry...
     */
    MediaQueryWatcherService.prototype._connect = function (subscriber) {
        var _this = this;
        var watchers = this._watchers;
        var query = subscriber.query;
        var onChange = function (watcher) {
            var isEntering = watcher.matches;
            _this._notifySubscribers(query, isEntering);
            if (!isEntering) {
                // If we are 'leaving'... simulate enter
                // for the next active/overlapped breakpoint
                _this._simulateEnter(query);
            }
        };
        this._subscriptions.add(subscriber);
        if (!watchers.has(query)) {
            watchers.add(query, onChange);
        }
    };
    /**
     * Remove subscriber from the subscriptions registry
     * and clear the shared mediaQuery change listener (if appropriate)
     */
    MediaQueryWatcherService.prototype._disconnect = function (subscriber) {
        var query = subscriber.query;
        this._subscriptions.remove(subscriber);
        this._watchers.remove(query);
    };
    /**
     * Only if the current mediaQuery is active,
     * then process all known subscribers
     */
    MediaQueryWatcherService.prototype._announce = function (query) {
        if (this._watchers.isActive(query)) {
            this._notifySubscribers(query, true);
        }
    };
    /**
     * For overlapping breakpoints, a leave will be generated but NOT an enter (since it is still active)
     * So we simulate an 'enter' notification to allow the injectors to fire properly.
     * Consider:
     *
     *   <div flex flex-gt-sm="xx" flex-gt-lg="xx" />
     *
     * When we 'leave' flex-gt-lg, then the flex-gt-sm should fire.
     */
    MediaQueryWatcherService.prototype._simulateEnter = function (query) {
        var group = this._subscriptions.subscribersToActivate(query);
        for (var _i = 0; _i < group.length; _i++) {
            var subscriber = group[_i];
            if (subscriber.active) {
                // Simulate 'fresh' enter
                subscriber.enter();
            }
        }
    };
    /**
     *  Notify all subscribers in the mediaQuery group
     *  to either activate or deactivate.
     *
     *  NOTE: This is called from the mediaQuery change listener!
     */
    MediaQueryWatcherService.prototype._notifySubscribers = function (query, isActive) {
        var group = this._subscriptions.findGroup(query);
        for (var _i = 0; _i < group.length; _i++) {
            var subscriber = group[_i];
            subscriber.activate(isActive);
        }
    };
    return MediaQueryWatcherService;
})();
exports.MediaQueryWatcherService = MediaQueryWatcherService;
// **************************
// Helper Classes
// **************************
/**
 * QueryWatchers manages 1..n mediaQuery listeners.
 * A mediaQuery listener is shared for all subscribers of a query.
 * Each query has its own shared listener...
 */
var ALL_WATCHERS = {};
var QueryWatchers = (function () {
    function QueryWatchers(_subscriptions) {
        this._subscriptions = _subscriptions;
    }
    /**
     * Does the specified mediaQuery already have a registered
     * watcher ?
     */
    QueryWatchers.prototype.has = function (query) {
        return angular.isDefined(ALL_WATCHERS[query]);
    };
    /**
     * Lookup the registered watcher for the specified query
     */
    QueryWatchers.prototype.find = function (query) {
        return ALL_WATCHERS[query];
    };
    /**
     * Cache the shared listener; since each query has a
     * listener for 1...n subscribers.
     *
     * NOTE: Remove the shared listener when the
     * all subscribers (for the query) are detached..
     *
     */
    QueryWatchers.prototype.add = function (query, onMediaChange) {
        if (!this.has(query)) {
            var watcher = this._build(query);
            watcher.addListener(onMediaChange);
            watcher.sharedListener = onMediaChange;
        }
    };
    /**
     * Is the specified mediaQuery currently active?
     */
    QueryWatchers.prototype.isActive = function (query) {
        return this.find(query).matches;
    };
    /**
     * If all subscribers [for the associated mediaQuery] are detached,
     * then clear the shared listener.
     */
    QueryWatchers.prototype.remove = function (query) {
        if (this.has(query)) {
            var watcher = this.find(query);
            var group = this._subscriptions.findGroup(query);
            if (!group.length) {
                watcher.removeListener(watcher.sharedListener);
            }
        }
    };
    QueryWatchers.prototype._build = function (query) {
        if (window.matchMedia) {
            var canListen = angular.isDefined(window.matchMedia('all').addListener);
            var hasQuery = canListen && angular.isDefined(ALL_WATCHERS[query]);
            if (!hasQuery) {
                ALL_WATCHERS[query] = window.matchMedia(query);
                hasQuery = true;
            }
            return ALL_WATCHERS[query];
        }
        else {
            return this._mockMQL();
        }
    };
    QueryWatchers.prototype._mockMQL = function () {
        return {
            matches: false,
            addListener: angular.noop,
            removeListener: angular.noop,
            sharedListener: null
        };
    };
    return QueryWatchers;
})();
exports.QueryWatchers = QueryWatchers;
/**
 * SubscriberGroups manages 1..n Subscribers
 * Subscribers are external observers requesting notifications of
 * mediaQuery changes; and are grouped by their associated mediaQueries.
 */
var SubscriberGroups = (function () {
    function SubscriberGroups(_browserRegistrar) {
        this._browserRegistrar = _browserRegistrar;
        this._groups = {};
    }
    SubscriberGroups.prototype.add = function (subscriber) {
        this._browserRegistrar.registerMediaQuery(subscriber.query);
        var group = this.findGroup(subscriber.query);
        group.push(subscriber);
        return this;
    };
    SubscriberGroups.prototype.remove = function (subscriber) {
        var group = this.findGroup(subscriber.query);
        var index = group.indexOf(subscriber);
        if (index != -1) {
            group.splice(index, 1);
        }
        return this;
    };
    SubscriberGroups.prototype.findGroup = function (query) {
        this._groups[query] = this._groups[query] || [];
        return this._groups[query];
    };
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
    SubscriberGroups.prototype.subscribersToActivate = function (leaveQuery) {
        var allGroups = this._groupsByPrecedence();
        for (var _i = 0; _i < allGroups.length; _i++) {
            var group = allGroups[_i];
            var isGlobal = group[0].query == 'screen';
            var isActive = group[0].isActive;
            if (isActive && !isGlobal && group[0].query != leaveQuery) {
                return group;
            }
        }
    };
    SubscriberGroups.prototype._groupsByPrecedence = function () {
        var _this = this;
        return Object.keys(this._groups)
            .map(function (groupName) { return _this._groups[groupName]; })
            .sort(function (a, b) { return a[0].queryOrder - b[0].queryOrder; }); // numeric, ascending sort
    };
    return SubscriberGroups;
})();
exports.SubscriberGroups = SubscriberGroups;
/**
 * Subscriber is a delegate class used to forward notifications
 * of mediaQuery changes to external observers. Observers register
 * a subscription for a query with MediaQueryWatcher::attach()
 */
var Subscriber = (function () {
    function Subscriber(_breakpoint, _hooks) {
        this._breakpoint = _breakpoint;
        this._hooks = _hooks;
        this.isActive = false;
        this._initialized = false;
    }
    Object.defineProperty(Subscriber.prototype, "active", {
        get: function () {
            return this.isActive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscriber.prototype, "query", {
        get: function () {
            return this._breakpoint.mediaQuery;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subscriber.prototype, "queryOrder", {
        get: function () {
            return this._breakpoint.order;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Issue the enter or leave announcements for the current
     * subscriber
     */
    Subscriber.prototype.activate = function (newActive) {
        if (newActive != this.isActive) {
            if (newActive)
                this.enter();
            else
                this.leave();
        }
    };
    /**
     * Notify listeners to initialize (1st time only)
     * then announce that we are 'entering' a mediaQuery state
     * and activate.
     */
    Subscriber.prototype.enter = function () {
        this.isActive = true;
        if (!this._initialized) {
            this._initialized = true;
            if (this._hooks.initialize) {
                this._hooks.initialize(this._breakpoint.mediaQuery);
            }
        }
    };
    /**
     * Notify listeners that we are leaving the current
     * mediaQuery state... and then deactivate.
     */
    Subscriber.prototype.leave = function () {
        this.isActive = false;
        if (this._hooks.leave) {
            this._hooks.leave(this._breakpoint.mediaQuery);
        }
    };
    return Subscriber;
})();
exports.Subscriber = Subscriber;
/**
 * BrowserMediaQueryRegistrar inserts CSS selectors into the DOM
 * For Webkit engines that only trigger the MediaQueryListListener
 * when there is at least one CSS selector for the respective media query.
 */
var BrowserMediaQueryRegistrar = (function () {
    function BrowserMediaQueryRegistrar() {
    }
    BrowserMediaQueryRegistrar.prototype.registerMediaQuery = function (query) {
        if (this._registeredStyles[query])
            return;
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        document.querySelector('head').appendChild(style);
        var textNode = document.createTextNode("@media " + query + " {.md-query-test{}}");
        style.appendChild(textNode);
        this._registeredStyles[query] = style;
    };
    return BrowserMediaQueryRegistrar;
})();
exports.BrowserMediaQueryRegistrar = BrowserMediaQueryRegistrar;
