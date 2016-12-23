(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/add/operator/map'), require('rxjs/add/operator/filter'), require('@angular/core'), require('rxjs/BehaviorSubject')) :
    typeof define === 'function' && define.amd ? define(['exports', 'rxjs/add/operator/map', 'rxjs/add/operator/filter', '@angular/core', 'rxjs/BehaviorSubject'], factory) :
    (factory((global.ng = global.ng || {}, global.ng.flexLayout = global.ng.flexLayout || {}),global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.ng.core,global.Rx));
}(this, (function (exports,rxjs_add_operator_map,rxjs_add_operator_filter,_angular_core,rxjs_BehaviorSubject) { 'use strict';

/** @internal Applies CSS prefixes to appropriate style keys.*/
function applyCssPrefixes(target) {
    for (var key in target) {
        var value = target[key];
        switch (key) {
            case 'display':
                target['display'] = value;
                // also need 'display : -webkit-box' and 'display : -ms-flexbox;'
                break;
            case 'flex':
                target['-ms-flex'] = value;
                target['-webkit-box-flex'] = value.split(" ")[0];
                break;
            case 'flex-direction':
                value = value || "row";
                target['flex-direction'] = value;
                target['-ms-flex-direction'] = value;
                target['-webkit-box-orient'] = toBoxOrient(value);
                target['-webkit-box-direction'] = toBoxDirection(value);
                break;
            case 'flex-wrap':
                target['-ms-flex-wrap'] = value;
                break;
            case 'order':
                if (isNaN(value)) {
                    value = "0";
                }
                target['order'] = value;
                target['-ms-flex-order'] = value;
                target['-webkit-box-ordinal-group'] = toBoxOrdinal(value);
                break;
            case 'justify-content':
                target['-ms-flex-pack'] = toBoxValue(value);
                target['-webkit-box-pack'] = toBoxValue(value);
                break;
            case 'align-items':
                target['-ms-flex-align'] = toBoxValue(value);
                target['-webkit-box-align'] = toBoxValue(value);
                break;
            case 'align-self':
                target['-ms-flex-item-align'] = toBoxValue(value);
                break;
            case 'align-content':
                target['-ms-align-content'] = toAlignContentValue(value);
                target['-ms-flex-line-pack'] = toAlignContentValue(value);
                break;
        }
    }
    return target;
}
function toAlignContentValue(value) {
    switch (value) {
        case "space-between": return "justify";
        case "space-around": return "distribute";
        default:
            return toBoxValue(value);
    }
}
/** @internal Convert flex values flex-start, flex-end to start, end. */
function toBoxValue(value) {
    if (value === void 0) { value = ""; }
    return (value == 'flex-start') ? 'start' : ((value == 'flex-end') ? 'end' : value);
}
/** @internal Convert flex Direction to Box orientation */
function toBoxOrient(flexDirection) {
    if (flexDirection === void 0) { flexDirection = 'row'; }
    return flexDirection.indexOf('column') === -1 ? 'horizontal' : 'vertical';
}
/** @internal Convert flex Direction to Box direction type */
function toBoxDirection(flexDirection) {
    if (flexDirection === void 0) { flexDirection = 'row'; }
    return flexDirection.indexOf('reverse') !== -1 ? 'reverse' : 'normal';
}
/** @internal Convert flex order to Box ordinal group */
function toBoxOrdinal(order) {
    if (order === void 0) { order = '0'; }
    var value = order ? parseInt(order) + 1 : 1;
    return isNaN(value) ? "0" : value.toString();
}

/**
 * @internal
 *
 * Extends an object with the *enumerable* and *own* properties of one or more source objects,
 * similar to Object.assign.
 *
 * @param dest The object which will have properties copied to it.
 * @param sources The source objects from which properties will be copied.
 */
function extendObject(dest) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (dest == null) {
        throw TypeError('Cannot convert undefined or null to object');
    }
    for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
        var source = sources_1[_a];
        if (source != null) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            }
        }
    }
    return dest;
}

/** @internal  */
var KeyOptions = (function () {
    function KeyOptions(baseKey, defaultValue, inputKeys) {
        this.baseKey = baseKey;
        this.defaultValue = defaultValue;
        this.inputKeys = inputKeys;
    }
    return KeyOptions;
}());
/**
 * @internal
 *
 * ResponsiveActivation acts as a proxy between the MonitorMedia service (which emits mediaQuery changes)
 * and the fx API directives. The MQA proxies mediaQuery change events and notifies the directive
 * via the specified callback.
 *
 * - The MQA also determines which directive property should be used to determine the
 *   current change 'value'... BEFORE the original `onMediaQueryChanges()` method is called.
 * - The `ngOnDestroy()` method is also head-hooked to enable auto-unsubscribe from the MediaQueryServices.
 *
 * NOTE: these interceptions enables the logic in the fx API directives to remain terse and clean.
 */
var ResponsiveActivation = (function () {
    /**
     * Constructor
     */
    function ResponsiveActivation(_options, _mediaMonitor, _onMediaChanges) {
        this._options = _options;
        this._mediaMonitor = _mediaMonitor;
        this._onMediaChanges = _onMediaChanges;
        this._subscribers = [];
        this._subscribers = this._configureChangeObservers();
    }
    Object.defineProperty(ResponsiveActivation.prototype, "mediaMonitor", {
        /**
         * Accessor to the DI'ed directive property
         * Each directive instance has a reference to the MediaMonitor which is
         * used HERE to subscribe to mediaQuery change notifications.
         */
        get: function () {
            return this._mediaMonitor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponsiveActivation.prototype, "activatedInputKey", {
        /**
         * Determine which directive @Input() property is currently active (for the viewport size):
         * The key must be defined (in use) or fallback to the 'closest' overlapping property key
         * that is defined; otherwise the default property key will be used.
         * e.g.
         *      if `<div fxHide fxHide.gt-sm="false">` is used but the current activated mediaQuery alias
         *      key is `.md` then `.gt-sm` should be used instead
         */
        get: function () {
            return this._activatedInputKey || this._options.baseKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponsiveActivation.prototype, "activatedInput", {
        /**
         * Get the currently activated @Input value or the fallback default @Input value
         */
        get: function () {
            var key = this.activatedInputKey;
            return this._hasKeyValue(key) ? this._lookupKeyValue(key) : this._options.defaultValue;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Remove interceptors, restore original functions, and forward the onDestroy() call
     */
    ResponsiveActivation.prototype.destroy = function () {
        this._subscribers.forEach(function (link) {
            link.unsubscribe();
        });
        this._subscribers = [];
    };
    /**
     * For each *defined* API property, register a callback to `_onMonitorEvents( )`
     * Cache 1..n subscriptions for internal auto-unsubscribes when the the directive destructs
     */
    ResponsiveActivation.prototype._configureChangeObservers = function () {
        var _this = this;
        var subscriptions = [];
        this._buildRegistryMap().forEach(function (bp) {
            if (_this._keyInUse(bp.key)) {
                // Inject directive default property key name: to let onMediaChange() calls
                // know which property is being triggered...
                var buildChanges = function (change) {
                    change.property = _this._options.baseKey;
                    return change;
                };
                subscriptions.push(_this.mediaMonitor.observe(bp.alias)
                    .map(buildChanges)
                    .subscribe(function (change) {
                    _this._onMonitorEvents(change);
                }));
            }
        });
        return subscriptions;
    };
    /**
     * Build mediaQuery key-hashmap; only for the directive properties that are actually defined/used
     * in the HTML markup
     */
    ResponsiveActivation.prototype._buildRegistryMap = function () {
        var _this = this;
        return this.mediaMonitor.breakpoints
            .map(function (bp) {
            return extendObject({}, bp, {
                baseKey: _this._options.baseKey,
                key: _this._options.baseKey + bp.suffix // e.g.  layoutGtSm, layoutMd, layoutGtLg
            });
        })
            .filter(function (bp) { return _this._keyInUse(bp.key); });
    };
    /**
     * Synchronizes change notifications with the current mq-activated @Input and calculates the
     * mq-activated input value or the default value
     */
    ResponsiveActivation.prototype._onMonitorEvents = function (change) {
        if (change.property == this._options.baseKey) {
            change.value = this._calculateActivatedValue(change);
            this._onMediaChanges(change);
        }
    };
    /**
     * Has the key been specified in the HTML markup and thus is intended
     * to participate in activation processes.
     */
    ResponsiveActivation.prototype._keyInUse = function (key) {
        return this._lookupKeyValue(key) !== undefined;
    };
    /**
     *  Map input key associated with mediaQuery activation to closest defined input key
     *  then return the values associated with the targeted input property
     *
     *  !! change events may arrive out-of-order (activate before deactivate)
     *     so make sure the deactivate is used ONLY when the keys match
     *     (since a different activate may be in use)
     */
    ResponsiveActivation.prototype._calculateActivatedValue = function (current) {
        var currentKey = this._options.baseKey + current.suffix; // e.g. suffix == 'GtSm', _baseKey == 'hide'
        var newKey = this._activatedInputKey; // e.g. newKey == hideGtSm
        newKey = current.matches ? currentKey : ((newKey == currentKey) ? null : newKey);
        this._activatedInputKey = this._validateInputKey(newKey);
        return this.activatedInput;
    };
    /**
     * For the specified input property key, validate it is defined (used in the markup)
     * If not see if a overlapping mediaQuery-related input key fallback has been defined
     *
     * NOTE: scans in the order defined by activeOverLaps (largest viewport ranges -> smallest ranges)
     */
    ResponsiveActivation.prototype._validateInputKey = function (inputKey) {
        var _this = this;
        var items = this.mediaMonitor.activeOverlaps;
        var isMissingKey = function (key) { return !_this._keyInUse(key); };
        if (isMissingKey(inputKey)) {
            items.some(function (bp) {
                var key = _this._options.baseKey + bp.suffix;
                if (!isMissingKey(key)) {
                    inputKey = key;
                    return true; // exit .some()
                }
                return false;
            });
        }
        return inputKey;
    };
    /**
     * Get the value (if any) for the directive instances @Input property (aka key)
     */
    ResponsiveActivation.prototype._lookupKeyValue = function (key) {
        return this._options.inputKeys[key];
    };
    ResponsiveActivation.prototype._hasKeyValue = function (key) {
        var value = this._options.inputKeys[key];
        return typeof value !== 'undefined';
    };
    return ResponsiveActivation;
}());

/** Abstract base class for the Layout API styling directives. */
var BaseFxDirective = (function () {
    /**
     *
     */
    function BaseFxDirective(_mediaMonitor, _elementRef, _renderer) {
        this._mediaMonitor = _mediaMonitor;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        /**
         *  Dictionary of input keys with associated values
         */
        this._inputMap = {};
    }
    // *********************************************
    // Accessor Methods
    // *********************************************
    /**
     * Access the current value (if any) of the @Input property.
     */
    BaseFxDirective.prototype._queryInput = function (key) {
        return this._inputMap[key];
    };
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    BaseFxDirective.prototype.ngOnDestroy = function () {
        if (this._mqActivation) {
            this._mqActivation.destroy();
        }
        this._mediaMonitor = null;
    };
    // *********************************************
    // Protected Methods
    // *********************************************
    /**
     * Applies styles given via string pair or object map to the directive element.
     */
    BaseFxDirective.prototype._applyStyleToElement = function (style, value, nativeElement) {
        var styles = {};
        var element = nativeElement || this._elementRef.nativeElement;
        if (typeof style === 'string') {
            styles[style] = value;
            style = styles;
        }
        styles = applyCssPrefixes(style);
        // Iterate all properties in hashMap and set styles
        for (var key in styles) {
            this._renderer.setElementStyle(element, key, styles[key]);
        }
    };
    /**
     * Applies styles given via string pair or object map to the directive element.
     */
    BaseFxDirective.prototype._applyStyleToElements = function (style, elements) {
        var _this = this;
        var styles = applyCssPrefixes(style);
        elements.forEach(function (el) {
            // Iterate all properties in hashMap and set styles
            for (var key in styles) {
                _this._renderer.setElementStyle(el, key, styles[key]);
            }
        });
    };
    /**
     *  Save the property value; which may be a complex object.
     *  Complex objects support property chains
     */
    BaseFxDirective.prototype._cacheInput = function (key, source) {
        if (typeof source === 'object') {
            for (var prop in source) {
                this._inputMap[prop] = source[prop];
            }
        }
        else {
            this._inputMap[key] = source;
        }
    };
    /**
     *  Build a ResponsiveActivation object used to manage subscriptions to mediaChange notifications
     *  and intelligent lookup of the directive's property value that corresponds to that mediaQuery
     *  (or closest match).
     */
    BaseFxDirective.prototype._listenForMediaQueryChanges = function (key, defaultValue, onMediaQueryChange) {
        var _this = this;
        var keyOptions = new KeyOptions(key, defaultValue, this._inputMap);
        return this._mqActivation = new ResponsiveActivation(keyOptions, this._mediaMonitor, function (change) { return onMediaQueryChange.call(_this, change); });
    };
    Object.defineProperty(BaseFxDirective.prototype, "childrenNodes", {
        /**
         * Special accessor to query for all child 'element' nodes regardless of type, class, etc.
         */
        get: function () {
            var obj = this._elementRef.nativeElement.childNodes;
            var array = [];
            // iterate backwards ensuring that length is an UInt32
            for (var i = obj.length; i--;) {
                array[i] = obj[i];
            }
            return array;
        },
        enumerable: true,
        configurable: true
    });
    return BaseFxDirective;
}());

var RESPONSIVE_ALIASES = ['xs', 'gt-xs', 'sm', 'gt-sm', 'md', 'gt-md', 'lg', 'gt-lg', 'xl'];
var RAW_DEFAULTS = [
    {
        alias: 'xs',
        suffix: 'Xs',
        overlapping: false,
        mediaQuery: 'screen and (max-width: 599px)'
    },
    {
        alias: 'gt-xs',
        suffix: 'GtXs',
        overlapping: true,
        mediaQuery: 'screen and (min-width: 600px)'
    },
    {
        alias: 'sm',
        suffix: 'Sm',
        overlapping: false,
        mediaQuery: 'screen and (min-width: 600px) and (max-width: 959px)'
    },
    {
        alias: 'gt-sm',
        suffix: 'GtSm',
        overlapping: true,
        mediaQuery: 'screen and (min-width: 960px)'
    },
    {
        alias: 'md',
        suffix: 'Md',
        overlapping: false,
        mediaQuery: 'screen and (min-width: 960px) and (max-width: 1279px)'
    },
    {
        alias: 'gt-md',
        suffix: 'GtMd',
        overlapping: true,
        mediaQuery: 'screen and (min-width: 1280px)'
    },
    {
        alias: 'lg',
        suffix: 'Lg',
        overlapping: false,
        mediaQuery: 'screen and (min-width: 1280px) and (max-width: 1919px)'
    },
    {
        alias: 'gt-lg',
        suffix: 'GtLg',
        overlapping: true,
        mediaQuery: 'screen and (min-width: 1920px)'
    },
    {
        alias: 'xl',
        suffix: 'Xl',
        overlapping: false,
        mediaQuery: 'screen and (min-width: 1921px)' // should be distinct from 'gt-lg' range
    }
];
/**
 *  Opaque Token unique to the flex-layout library.
 *  Use this token when build a custom provider (see below).
 */
var BREAKPOINTS = new _angular_core.OpaqueToken('fxRawBreakpoints');
/**
 *  Provider to return observable to ALL known BreakPoint(s)
 *  Developers should build custom providers to override this default BreakPointRegistry dataset provider
 *  NOTE: !! custom breakpoints lists MUST contain the following aliases & suffixes:
 *        [xs, gt-xs, sm, gt-sm, md, gt-md, lg, gt-lg, xl]
 */
var BreakPointsProvider = {
    provide: BREAKPOINTS,
    useValue: RAW_DEFAULTS
};

var __decorate$2 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$2 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * @internal
 *
 * Registry of 1..n MediaQuery breakpoint ranges
 * This is published as a provider and may be overriden from custom, application-specific ranges
 *
 */
var BreakPointRegistry = (function () {
    function BreakPointRegistry(_registry) {
        this._registry = _registry;
    }
    Object.defineProperty(BreakPointRegistry.prototype, "items", {
        /**
         * Accessor to raw list
         */
        get: function () {
            return this._registry.slice();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Search breakpoints by alias (e.g. gt-xs)
     */
    BreakPointRegistry.prototype.findByAlias = function (alias) {
        return this._registry.find(function (bp) { return bp.alias == alias; });
    };
    BreakPointRegistry.prototype.findByQuery = function (query) {
        return this._registry.find(function (bp) { return bp.mediaQuery == query; });
    };
    Object.defineProperty(BreakPointRegistry.prototype, "overlappings", {
        /**
         * Get all the breakpoints whose ranges could overlapping `normal` ranges;
         * e.g. gt-sm overlaps md, lg, and xl
         */
        get: function () {
            return this._registry.filter(function (it) { return it.overlapping == true; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BreakPointRegistry.prototype, "aliases", {
        /**
         * Get list of all registered (non-empty) breakpoint aliases
         */
        get: function () {
            return this._registry.map(function (it) { return it.alias; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BreakPointRegistry.prototype, "suffixes", {
        /**
         * Aliases are mapped to properties using suffixes
         * e.g.  'gt-sm' for property 'layout'  uses suffix 'GtSm'
         * for property layoutGtSM.
         */
        get: function () {
            return this._registry.map(function (it) { return it.suffix; });
        },
        enumerable: true,
        configurable: true
    });
    BreakPointRegistry = __decorate$2([
        _angular_core.Injectable(),
        __param(0, _angular_core.Inject(BREAKPOINTS)), 
        __metadata$2('design:paramtypes', [Array])
    ], BreakPointRegistry);
    return BreakPointRegistry;
}());

/**
 * Class instances emitted [to observers] for each mql notification
 */
var MediaChange = (function () {
    function MediaChange(matches, // Is the mq currently activated
        mediaQuery, // e.g.   screen and (min-width: 600px) and (max-width: 959px)
        mqAlias, // e.g.   gt-sm, md, gt-lg
        suffix // e.g.   GtSM, Md, GtLg
        ) {
        if (matches === void 0) { matches = false; }
        if (mediaQuery === void 0) { mediaQuery = 'all'; }
        if (mqAlias === void 0) { mqAlias = ''; }
        if (suffix === void 0) { suffix = ''; }
        this.matches = matches;
        this.mediaQuery = mediaQuery;
        this.mqAlias = mqAlias;
        this.suffix = suffix;
    }
    return MediaChange;
}());

var __decorate$3 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$3 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 *  Opaque Token unique to the flex-layout library.
 *  Note: Developers must use this token when building their own custom `MatchMediaObservableProvider`
 *  provider.
 *
 *  @see ./providers/match-media-observable-provider.ts
 */
var MatchMediaObservable = new _angular_core.OpaqueToken('fxObservableMatchMedia');
/**
 * MediaMonitor configures listeners to mediaQuery changes and publishes an Observable facade to convert
 * mediaQuery change callbacks to subscriber notifications. These notifications will be performed within the
 * ng Zone to trigger change detections and component updates.
 *
 * NOTE: both mediaQuery activations and de-activations are announced in notifications
 */
var MatchMedia = (function () {
    function MatchMedia(_zone) {
        this._zone = _zone;
        this._registry = new Map();
        this._source = new rxjs_BehaviorSubject.BehaviorSubject(new MediaChange(true));
        this._observable$ = this._source.asObservable();
    }
    /**
     * For the specified mediaQuery?
     */
    MatchMedia.prototype.isActive = function (mediaQuery) {
        if (this._registry.has(mediaQuery)) {
            var mql = this._registry.get(mediaQuery);
            return mql.matches;
        }
        return false;
    };
    /**
     * External observers can watch for all (or a specific) mql changes.
     * Typically used by the MediaQueryAdaptor; optionally available to components
     * who wish to use the MediaMonitor as mediaMonitor$ observable service.
     *
     * NOTE: if a mediaQuery is not specified, then ALL mediaQuery activations will
     *       be announced.
     */
    MatchMedia.prototype.observe = function (mediaQuery) {
        this.registerQuery(mediaQuery);
        return this._observable$.filter(function (change) {
            return mediaQuery ? (change.mediaQuery === mediaQuery) : true;
        });
    };
    /**
     * Based on the BreakPointRegistry provider, register internal listeners for each unique mediaQuery
     * Each listener emits specific MediaChange data to observers
     */
    MatchMedia.prototype.registerQuery = function (mediaQuery) {
        var _this = this;
        if (mediaQuery) {
            var mql = this._registry.get(mediaQuery);
            var onMQLEvent = function (mql) {
                _this._zone.run(function () {
                    var change = new MediaChange(mql.matches, mediaQuery);
                    _this._source.next(change);
                });
            };
            if (!mql) {
                mql = this._buildMQL(mediaQuery);
                mql.addListener(onMQLEvent);
                this._registry.set(mediaQuery, mql);
            }
            if (mql.matches) {
                onMQLEvent(mql); // Announce activate range for initial subscribers
            }
        }
    };
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    MatchMedia.prototype._buildMQL = function (query) {
        prepareQueryCSS(query);
        var canListen = !!window.matchMedia('all').addListener;
        return canListen ? window.matchMedia(query) : {
            matches: query === 'all' || query === '',
            media: query,
            addListener: function () { },
            removeListener: function () { }
        };
    };
    MatchMedia = __decorate$3([
        _angular_core.Injectable(), 
        __metadata$3('design:paramtypes', [_angular_core.NgZone])
    ], MatchMedia);
    return MatchMedia;
}());
/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
var ALL_STYLES = {};
/**
 * For Webkit engines that only trigger the MediaQueryListListener
 * when there is at least one CSS selector for the respective media query.
 *
 * @param query string The mediaQuery used to create a faux CSS selector
 *
 */
function prepareQueryCSS(query) {
    if (!ALL_STYLES[query]) {
        try {
            var style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            if (!style['styleSheet']) {
                var cssText = "@media " + query + " {.fx-query-test{ }}";
                style.appendChild(document.createTextNode(cssText));
            }
            document.getElementsByTagName('head')[0].appendChild(style);
            // Store in private global registry
            ALL_STYLES[query] = style;
        }
        catch (e) {
            console.error(e);
        }
    }
}

/**
 * @internal
 *
 * For the specified MediaChange, make sure it contains the breakpoint alias
 * and suffix (if available).
 */
function mergeAlias(dest, source) {
    return extendObject(dest, source ? {
        mqAlias: source.alias,
        suffix: source.suffix
    } : {});
}

var __decorate$1 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$1 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * MediaMonitor uses the MatchMedia service to observe mediaQuery changes (both activations and
 * deactivations). These changes are are published as MediaChange notifications.
 *
 * Note: all notifications will be performed within the
 * ng Zone to trigger change detections and component updates.
 *
 * It is the MediaMonitor that:
 *  - auto registers all known breakpoints
 *  - injects alias information into each raw MediaChange event
 *  - provides accessor to the currently active BreakPoint
 *  - publish list of overlapping BreakPoint(s); used by ResponsiveActivation
 */
var MediaMonitor = (function () {
    function MediaMonitor(_breakpoints, _matchMedia) {
        this._breakpoints = _breakpoints;
        this._matchMedia = _matchMedia;
        this._registerBreakpoints();
    }
    Object.defineProperty(MediaMonitor.prototype, "breakpoints", {
        /**
         * Read-only accessor to the list of breakpoints configured in the BreakPointRegistry provider
         */
        get: function () {
            return this._breakpoints.items.slice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaMonitor.prototype, "activeOverlaps", {
        get: function () {
            var _this = this;
            var items = this._breakpoints.overlappings.reverse();
            return items.filter(function (bp) {
                return _this._matchMedia.isActive(bp.mediaQuery);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaMonitor.prototype, "active", {
        get: function () {
            var _this = this;
            var found = null, items = this.breakpoints.reverse();
            items.forEach(function (bp) {
                if (bp.alias !== '') {
                    if (!found && _this._matchMedia.isActive(bp.mediaQuery)) {
                        found = bp;
                    }
                }
            });
            var first = this.breakpoints[0];
            return found || (this._matchMedia.isActive(first.mediaQuery) ? first : null);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * For the specified mediaQuery alias, is the mediaQuery range active?
     */
    MediaMonitor.prototype.isActive = function (alias) {
        var bp = this._breakpoints.findByAlias(alias) || this._breakpoints.findByQuery(alias);
        return this._matchMedia.isActive(bp ? bp.mediaQuery : alias);
    };
    /**
     * External observers can watch for all (or a specific) mql changes.
     * If specific breakpoint is observed, only return *activated* events
     * otherwise return all events for BOTH activated + deactivated changes.
     */
    MediaMonitor.prototype.observe = function (alias) {
        var bp = this._breakpoints.findByAlias(alias) || this._breakpoints.findByQuery(alias);
        var hasAlias = function (change) { return (bp ? change.mqAlias !== "" : true); };
        // Note: the raw MediaChange events [from MatchMedia] do not contain important alias information
        return this._matchMedia
            .observe(bp ? bp.mediaQuery : alias)
            .map(function (change) { return mergeAlias(change, bp); })
            .filter(hasAlias);
    };
    /**
     * Immediate calls to matchMedia() to establish listeners
     * and prepare for immediate subscription notifications
     */
    MediaMonitor.prototype._registerBreakpoints = function () {
        var _this = this;
        this._breakpoints.items.forEach(function (bp) {
            _this._matchMedia.registerQuery(bp.mediaQuery);
        });
    };
    MediaMonitor = __decorate$1([
        _angular_core.Injectable(), 
        __metadata$1('design:paramtypes', [BreakPointRegistry, MatchMedia])
    ], MediaMonitor);
    return MediaMonitor;
}());

/**
 * This factory uses the BreakPoint Registry only to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and those
 * fields will be ''.
 *
 * !! Only activation mediaChange notifications are publised by the MatchMediaObservable
 */
function instanceOfMatchMediaObservable(mediaWatcher, breakpoints) {
    var onlyActivations = function (change) { return change.matches === true; };
    var findBreakpoint = function (mediaQuery) { return breakpoints.findByQuery(mediaQuery); };
    var injectAlias = function (change) { return mergeAlias(change, findBreakpoint(change.mediaQuery)); };
    // Note: the raw MediaChange events [from MatchMedia] do not contain important alias information
    //       these must be injected into the MediaChange
    return mediaWatcher.observe().filter(onlyActivations).map(injectAlias);
}

/**
 *  Provider to return observable to ALL MediaQuery events
 *  Developers should build custom providers to override this default MediaQuery Observable
 */
var MatchMediaObservableProvider = {
    provide: MatchMediaObservable,
    deps: [MatchMedia, BreakPointRegistry],
    useFactory: instanceOfMatchMediaObservable
};

var __decorate$4 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$4 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */
var MediaQueriesModule = (function () {
    function MediaQueriesModule() {
    }
    MediaQueriesModule.forRoot = function () {
        return {
            ngModule: MediaQueriesModule
        };
    };
    MediaQueriesModule = __decorate$4([
        _angular_core.NgModule({
            providers: [
                MatchMedia,
                MediaMonitor,
                BreakPointRegistry,
                BreakPointsProvider,
                MatchMediaObservableProvider // Allows easy subscription to the injectable `media$` matchMedia observable
            ]
        }), 
        __metadata$4('design:paramtypes', [])
    ], MediaQueriesModule);
    return MediaQueriesModule;
}());

var __extends$1 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$6 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$6 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];
/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
var LayoutDirective = (function (_super) {
    __extends$1(LayoutDirective, _super);
    /**
     *
     */
    function LayoutDirective(monitor, elRef, renderer) {
        _super.call(this, monitor, elRef, renderer);
        this._announcer = new rxjs_BehaviorSubject.BehaviorSubject("row");
        this.layout$ = this._announcer.asObservable();
    }
    Object.defineProperty(LayoutDirective.prototype, "layout", {
        set: function (val) { this._cacheInput("layout", val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutDirective.prototype, "layoutXs", {
        set: function (val) { this._cacheInput('layoutXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutDirective.prototype, "layoutGtXs", {
        set: function (val) { this._cacheInput('layoutGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutSm", {
        set: function (val) { this._cacheInput('layoutSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutGtSm", {
        set: function (val) { this._cacheInput('layoutGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutMd", {
        set: function (val) { this._cacheInput('layoutMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutGtMd", {
        set: function (val) { this._cacheInput('layoutGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutLg", {
        set: function (val) { this._cacheInput('layoutLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutGtLg", {
        set: function (val) { this._cacheInput('layoutGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutXl", {
        set: function (val) { this._cacheInput('layoutXl', val); },
        enumerable: true,
        configurable: true
    });
    
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxLayout')
     * Then conditionally override with the mq-activated Input's current value
     */
    LayoutDirective.prototype.ngOnChanges = function (changes) {
        if (changes['layout'] != null || this._mqActivation) {
            this._updateWithDirection();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    LayoutDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('layout', 'row', function (changes) {
            _this._updateWithDirection(changes.value);
        });
        this._updateWithDirection();
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Validate the direction value and then update the host's inline flexbox styles
     */
    LayoutDirective.prototype._updateWithDirection = function (direction) {
        direction = direction || this._queryInput("layout") || 'row';
        if (this._mqActivation) {
            direction = this._mqActivation.activatedInput;
        }
        direction = this._validateValue(direction);
        // Update styles and announce to subscribers the *new* direction
        this._applyStyleToElement(this._buildCSS(direction));
        this._announcer.next(direction);
    };
    /**
     * Build the CSS that should be assigned to the element instance
     * BUG:
     *
     *   1) min-height on a column flex container won’t apply to its flex item children in IE 10-11.
     *      Use height instead if possible; height : <xxx>vh;
     *
     * @todo - update all child containers to have "box-sizing: border-box"
     *         This way any padding or border specified on the child elements are
     *         laid out and drawn inside that element's specified width and height.
     *
     */
    LayoutDirective.prototype._buildCSS = function (value) {
        return { 'display': 'flex', 'box-sizing': 'border-box', 'flex-direction': value };
    };
    /**
     * Validate the value to be one of the acceptable value options
     * Use default fallback of "row"
     */
    LayoutDirective.prototype._validateValue = function (value) {
        value = value ? value.toLowerCase() : '';
        return LAYOUT_VALUES.find(function (x) { return x === value; }) ? value : LAYOUT_VALUES[0]; // "row"
    };
    __decorate$6([
        _angular_core.Input('fxLayout'), 
        __metadata$6('design:type', Object), 
        __metadata$6('design:paramtypes', [Object])
    ], LayoutDirective.prototype, "layout", null);
    __decorate$6([
        _angular_core.Input('fxLayout.xs'), 
        __metadata$6('design:type', Object), 
        __metadata$6('design:paramtypes', [Object])
    ], LayoutDirective.prototype, "layoutXs", null);
    __decorate$6([
        _angular_core.Input('fxLayout.gt-xs'), 
        __metadata$6('design:type', Object), 
        __metadata$6('design:paramtypes', [Object])
    ], LayoutDirective.prototype, "layoutGtXs", null);
    __decorate$6([
        _angular_core.Input('fxLayout.sm'), 
        __metadata$6('design:type', Object), 
        __metadata$6('design:paramtypes', [Object])
    ], LayoutDirective.prototype, "layoutSm", null);
    __decorate$6([
        _angular_core.Input('fxLayout.gt-sm'), 
        __metadata$6('design:type', Object), 
        __metadata$6('design:paramtypes', [Object])
    ], LayoutDirective.prototype, "layoutGtSm", null);
    __decorate$6([
        _angular_core.Input('fxLayout.md'), 
        __metadata$6('design:type', Object), 
        __metadata$6('design:paramtypes', [Object])
    ], LayoutDirective.prototype, "layoutMd", null);
    __decorate$6([
        _angular_core.Input('fxLayout.gt-md'), 
        __metadata$6('design:type', Object), 
        __metadata$6('design:paramtypes', [Object])
    ], LayoutDirective.prototype, "layoutGtMd", null);
    __decorate$6([
        _angular_core.Input('fxLayout.lg'), 
        __metadata$6('design:type', Object), 
        __metadata$6('design:paramtypes', [Object])
    ], LayoutDirective.prototype, "layoutLg", null);
    __decorate$6([
        _angular_core.Input('fxLayout.gt-lg'), 
        __metadata$6('design:type', Object), 
        __metadata$6('design:paramtypes', [Object])
    ], LayoutDirective.prototype, "layoutGtLg", null);
    __decorate$6([
        _angular_core.Input('fxLayout.xl'), 
        __metadata$6('design:type', Object), 
        __metadata$6('design:paramtypes', [Object])
    ], LayoutDirective.prototype, "layoutXl", null);
    LayoutDirective = __decorate$6([
        _angular_core.Directive({ selector: "\n  [fxLayout],\n  [fxLayout.xs]\n  [fxLayout.gt-xs],\n  [fxLayout.sm],\n  [fxLayout.gt-sm]\n  [fxLayout.md],\n  [fxLayout.gt-md]\n  [fxLayout.lg],\n  [fxLayout.gt-lg],\n  [fxLayout.xl]\n" }), 
        __metadata$6('design:paramtypes', [MediaMonitor, _angular_core.ElementRef, _angular_core.Renderer])
    ], LayoutDirective);
    return LayoutDirective;
}(BaseFxDirective));

var __extends$2 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$7 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$7 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$2 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * 'layout-wrap' flexbox styling directive
 * Defines wrapping of child elements in layout container
 * Optional values: reverse, wrap-reverse, none, nowrap, wrap (default)]
 * @see https://css-tricks.com/almanac/properties/f/flex-wrap/
 */
var LayoutWrapDirective = (function (_super) {
    __extends$2(LayoutWrapDirective, _super);
    function LayoutWrapDirective(monitor, elRef, renderer, container) {
        _super.call(this, monitor, elRef, renderer);
        this._layout = 'row'; // default flex-direction
        if (container) {
            this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
        }
    }
    Object.defineProperty(LayoutWrapDirective.prototype, "wrap", {
        set: function (val) { this._cacheInput("wrap", val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapXs", {
        set: function (val) { this._cacheInput('wrapXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapGtXs", {
        set: function (val) { this._cacheInput('wrapGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapSm", {
        set: function (val) { this._cacheInput('wrapSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapGtSm", {
        set: function (val) { this._cacheInput('wrapGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapMd", {
        set: function (val) { this._cacheInput('wrapMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapGtMd", {
        set: function (val) { this._cacheInput('wrapGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapLg", {
        set: function (val) { this._cacheInput('wrapLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapGtLg", {
        set: function (val) { this._cacheInput('wrapGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapXl", {
        set: function (val) { this._cacheInput('wrapXl', val); },
        enumerable: true,
        configurable: true
    });
    
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    LayoutWrapDirective.prototype.ngOnChanges = function (changes) {
        if (changes['wrap'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    LayoutWrapDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('wrap', 'wrap', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     */
    LayoutWrapDirective.prototype._onLayoutChange = function (direction) {
        var _this = this;
        this._layout = (direction || '').toLowerCase().replace('-reverse', '');
        if (!LAYOUT_VALUES.find(function (x) { return x === _this._layout; })) {
            this._layout = 'row';
        }
        this._updateWithValue();
    };
    LayoutWrapDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("wrap") || 'wrap';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        value = this._validateValue(value);
        this._applyStyleToElement(this._buildCSS(value));
    };
    /**
     * Build the CSS that should be assigned to the element instance
     */
    LayoutWrapDirective.prototype._buildCSS = function (value) {
        return extendObject({ 'flex-wrap': value }, {
            'display': 'flex',
            'flex-direction': this._layout || 'row'
        });
    };
    /**
     * Convert layout-wrap="<value>" to expected flex-wrap style
     */
    LayoutWrapDirective.prototype._validateValue = function (value) {
        switch (value.toLowerCase()) {
            case 'reverse':
            case 'wrap-reverse':
                value = 'wrap-reverse';
                break;
            case 'no':
            case 'none':
            case 'nowrap':
                value = 'nowrap';
                break;
            // All other values fallback to "wrap"
            default:
                value = 'wrap';
                break;
        }
        return value;
    };
    __decorate$7([
        _angular_core.Input('fxLayoutWrap'), 
        __metadata$7('design:type', Object), 
        __metadata$7('design:paramtypes', [Object])
    ], LayoutWrapDirective.prototype, "wrap", null);
    __decorate$7([
        _angular_core.Input('fxLayoutWrap.xs'), 
        __metadata$7('design:type', Object), 
        __metadata$7('design:paramtypes', [Object])
    ], LayoutWrapDirective.prototype, "wrapXs", null);
    __decorate$7([
        _angular_core.Input('fxLayoutWrap.gt-xs'), 
        __metadata$7('design:type', Object), 
        __metadata$7('design:paramtypes', [Object])
    ], LayoutWrapDirective.prototype, "wrapGtXs", null);
    __decorate$7([
        _angular_core.Input('fxLayoutWrap.sm'), 
        __metadata$7('design:type', Object), 
        __metadata$7('design:paramtypes', [Object])
    ], LayoutWrapDirective.prototype, "wrapSm", null);
    __decorate$7([
        _angular_core.Input('fxLayoutWrap.gt-sm'), 
        __metadata$7('design:type', Object), 
        __metadata$7('design:paramtypes', [Object])
    ], LayoutWrapDirective.prototype, "wrapGtSm", null);
    __decorate$7([
        _angular_core.Input('fxLayoutWrap.md'), 
        __metadata$7('design:type', Object), 
        __metadata$7('design:paramtypes', [Object])
    ], LayoutWrapDirective.prototype, "wrapMd", null);
    __decorate$7([
        _angular_core.Input('fxLayoutWrap.gt-md'), 
        __metadata$7('design:type', Object), 
        __metadata$7('design:paramtypes', [Object])
    ], LayoutWrapDirective.prototype, "wrapGtMd", null);
    __decorate$7([
        _angular_core.Input('fxLayoutWrap.lg'), 
        __metadata$7('design:type', Object), 
        __metadata$7('design:paramtypes', [Object])
    ], LayoutWrapDirective.prototype, "wrapLg", null);
    __decorate$7([
        _angular_core.Input('fxLayoutWrap.gt-lg'), 
        __metadata$7('design:type', Object), 
        __metadata$7('design:paramtypes', [Object])
    ], LayoutWrapDirective.prototype, "wrapGtLg", null);
    __decorate$7([
        _angular_core.Input('fxLayoutWrap.xl'), 
        __metadata$7('design:type', Object), 
        __metadata$7('design:paramtypes', [Object])
    ], LayoutWrapDirective.prototype, "wrapXl", null);
    LayoutWrapDirective = __decorate$7([
        _angular_core.Directive({ selector: "\n  [fxLayoutWrap],\n  [fxLayoutWrap.xs]\n  [fxLayoutWrap.gt-xs],\n  [fxLayoutWrap.sm],\n  [fxLayoutWrap.gt-sm]\n  [fxLayoutWrap.md],\n  [fxLayoutWrap.gt-md]\n  [fxLayoutWrap.lg],\n  [fxLayoutWrap.gt-lg],\n  [fxLayoutWrap.xl]\n" }),
        __param$2(3, _angular_core.Optional()),
        __param$2(3, _angular_core.Self()), 
        __metadata$7('design:paramtypes', [MediaMonitor, _angular_core.ElementRef, _angular_core.Renderer, LayoutDirective])
    ], LayoutWrapDirective);
    return LayoutWrapDirective;
}(BaseFxDirective));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$5 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$5 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$1 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * Directive to control the size of a flex item using flex-basis, flex-grow, and flex-shrink.
 * Corresponds to the css `flex` shorthand property.
 *
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
var FlexDirective = (function (_super) {
    __extends(FlexDirective, _super);
    // Explicitly @SkipSelf on LayoutDirective and LayoutWrapDirective because we want the
    // parent flex container for this flex item.
    function FlexDirective(monitor, elRef, renderer, _container, _wrap) {
        var _this = this;
        _super.call(this, monitor, elRef, renderer);
        this._container = _container;
        this._wrap = _wrap;
        /** The flex-direction of this element's flex container. Defaults to 'row'. */
        this._layout = 'row';
        this._cacheInput("flex", "");
        this._cacheInput("shrink", 1);
        this._cacheInput("grow", 1);
        if (_container) {
            // If this flex item is inside of a flex container marked with
            // Subscribe to layout immediate parent direction changes
            this._layoutWatcher = _container.layout$.subscribe(function (direction) {
                // `direction` === null if parent container does not have a `fxLayout`
                _this._onLayoutChange(direction);
            });
        }
    }
    Object.defineProperty(FlexDirective.prototype, "flex", {
        set: function (val) { this._cacheInput("flex", val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexDirective.prototype, "shrink", {
        set: function (val) { this._cacheInput("shrink", val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexDirective.prototype, "grow", {
        set: function (val) { this._cacheInput("grow", val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexDirective.prototype, "flexXs", {
        set: function (val) { this._cacheInput('flexXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexDirective.prototype, "flexGtXs", {
        set: function (val) { this._cacheInput('flexGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexSm", {
        set: function (val) { this._cacheInput('flexSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexGtSm", {
        set: function (val) { this._cacheInput('flexGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexMd", {
        set: function (val) { this._cacheInput('flexMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexGtMd", {
        set: function (val) { this._cacheInput('flexGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexLg", {
        set: function (val) { this._cacheInput('flexLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexGtLg", {
        set: function (val) { this._cacheInput('flexGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexXl", {
        set: function (val) { this._cacheInput('flexXl', val); },
        enumerable: true,
        configurable: true
    });
    
    /**
     * For @Input changes on the current mq activation property, see onMediaQueryChanges()
     */
    FlexDirective.prototype.ngOnChanges = function (changes) {
        if (changes['flex'] != null || this._mqActivation) {
            this._onLayoutChange();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    FlexDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('flex', '', function (changes) {
            _this._updateStyle(changes.value);
        });
        this._onLayoutChange();
    };
    FlexDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    };
    /**
     * Caches the parent container's 'flex-direction' and updates the element's style.
     * Used as a handler for layout change events from the parent flex container.
     */
    FlexDirective.prototype._onLayoutChange = function (direction) {
        this._layout = direction || this._layout || "row";
        this._updateStyle();
    };
    FlexDirective.prototype._updateStyle = function (value) {
        var flexBasis = value || this._queryInput("flex") || '';
        if (this._mqActivation) {
            flexBasis = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._validateValue.apply(this, this._parseFlexParts(String(flexBasis))));
    };
    /**
     * If the used the short-form `fxFlex="1 0 37%"`, then parse the parts
     */
    FlexDirective.prototype._parseFlexParts = function (basis) {
        basis = basis.replace(";", "");
        var hasCalc = basis && basis.indexOf("calc") > -1;
        var matches = !hasCalc ? basis.split(" ") : this._getPartsWithCalc(basis.trim());
        return (matches.length === 3) ? matches : [this._queryInput("grow"), this._queryInput("shrink"), basis];
    };
    /**
     * Extract more complicated short-hand versions.
     * e.g.
     * fxFlex="3 3 calc(15em + 20px)"
     */
    FlexDirective.prototype._getPartsWithCalc = function (value) {
        debugger;
        var parts = [this._queryInput("grow"), this._queryInput("shrink"), value];
        var j = value.indexOf('calc');
        if (j > 0) {
            parts[2] = value.substring(j);
            var matches = value.substr(0, j).trim().split(" ");
            if (matches.length == 2) {
                parts[0] = matches[0];
                parts[1] = matches[1];
            }
        }
        return parts;
    };
    /**
     * Validate the value to be one of the acceptable value options
     * Use default fallback of "row"
     */
    FlexDirective.prototype._validateValue = function (grow, shrink, basis) {
        var css;
        var direction = (this._layout === 'column') || (this._layout == 'column-reverse') ?
            'column' :
            'row';
        // flex-basis allows you to specify the initial/starting main-axis size of the element,
        // before anything else is computed. It can either be a percentage or an absolute value.
        // It is, however, not the breaking point for flex-grow/shrink properties
        //
        // flex-grow can be seen as this:
        //   0: Do not stretch. Either size to element's content width, or obey 'flex-basis'.
        //   1: (Default value). Stretch; will be the same size to all other flex items on
        //       the same row since they have a default value of 1.
        //   ≥2 (integer n): Stretch. Will be n times the size of other elements
        //      with 'flex-grow: 1' on the same row.
        // Use `null` to clear existing styles.
        var clearStyles = {
            'max-width': null,
            'max-height': null,
            'min-width': null,
            'min-height': null
        };
        switch (basis || '') {
            case '':
                css = extendObject(clearStyles, { 'flex': '1 1 0.000000001px' });
                break;
            case 'grow':
                css = extendObject(clearStyles, { 'flex': '1 1 100%' });
                break;
            case 'initial':
                css = extendObject(clearStyles, { 'flex': '0 1 auto' });
                break; // default
            case 'auto':
                css = extendObject(clearStyles, { 'flex': '1 1 auto' });
                break;
            case 'none':
                css = extendObject(clearStyles, { 'flex': '0 0 auto' });
                break;
            case 'nogrow':
                css = extendObject(clearStyles, { 'flex': '0 1 auto' });
                break;
            case 'none':
                css = extendObject(clearStyles, { 'flex': 'none' });
                break;
            case 'noshrink':
                css = extendObject(clearStyles, { 'flex': '1 0 auto' });
                break;
            default:
                var isPercent = String(basis).indexOf('%') > -1;
                var isValue = String(basis).indexOf('px') > -1 ||
                    String(basis).indexOf('calc') > -1 ||
                    String(basis).indexOf('em') > -1 ||
                    String(basis).indexOf('vw') > -1 ||
                    String(basis).indexOf('vh') > -1;
                // Defaults to percentage sizing unless `px` is explicitly set
                if (!isValue && !isPercent && !isNaN(basis))
                    basis = basis + '%';
                if (basis === '0px')
                    basis = '0%';
                // Set max-width = basis if using layout-wrap
                // @see https://github.com/philipwalton/flexbugs#11-min-and-max-size-declarations-are-ignored-when-wrappifl-flex-items
                css = extendObject(clearStyles, {
                    'flex': grow + " " + shrink + " " + ((isValue || this._wrap) ? basis : '100%'),
                });
                break;
        }
        var max = (direction === 'row') ? 'max-width' : 'max-height';
        var min = (direction === 'row') ? 'min-width' : 'min-height';
        var usingCalc = String(basis).indexOf('calc') > -1;
        css[min] = (basis == '0%') ? 0 : null;
        css[max] = (basis == '0%') ? 0 : usingCalc ? null : basis;
        return extendObject(css, { 'box-sizing': 'border-box' });
    };
    __decorate$5([
        _angular_core.Input('fxFlex'), 
        __metadata$5('design:type', Object), 
        __metadata$5('design:paramtypes', [Object])
    ], FlexDirective.prototype, "flex", null);
    __decorate$5([
        _angular_core.Input('fxShrink'), 
        __metadata$5('design:type', Object), 
        __metadata$5('design:paramtypes', [Object])
    ], FlexDirective.prototype, "shrink", null);
    __decorate$5([
        _angular_core.Input('fxGrow'), 
        __metadata$5('design:type', Object), 
        __metadata$5('design:paramtypes', [Object])
    ], FlexDirective.prototype, "grow", null);
    __decorate$5([
        _angular_core.Input('fxFlex.xs'), 
        __metadata$5('design:type', Object), 
        __metadata$5('design:paramtypes', [Object])
    ], FlexDirective.prototype, "flexXs", null);
    __decorate$5([
        _angular_core.Input('fxFlex.gt-xs'), 
        __metadata$5('design:type', Object), 
        __metadata$5('design:paramtypes', [Object])
    ], FlexDirective.prototype, "flexGtXs", null);
    __decorate$5([
        _angular_core.Input('fxFlex.sm'), 
        __metadata$5('design:type', Object), 
        __metadata$5('design:paramtypes', [Object])
    ], FlexDirective.prototype, "flexSm", null);
    __decorate$5([
        _angular_core.Input('fxFlex.gt-sm'), 
        __metadata$5('design:type', Object), 
        __metadata$5('design:paramtypes', [Object])
    ], FlexDirective.prototype, "flexGtSm", null);
    __decorate$5([
        _angular_core.Input('fxFlex.md'), 
        __metadata$5('design:type', Object), 
        __metadata$5('design:paramtypes', [Object])
    ], FlexDirective.prototype, "flexMd", null);
    __decorate$5([
        _angular_core.Input('fxFlex.gt-md'), 
        __metadata$5('design:type', Object), 
        __metadata$5('design:paramtypes', [Object])
    ], FlexDirective.prototype, "flexGtMd", null);
    __decorate$5([
        _angular_core.Input('fxFlex.lg'), 
        __metadata$5('design:type', Object), 
        __metadata$5('design:paramtypes', [Object])
    ], FlexDirective.prototype, "flexLg", null);
    __decorate$5([
        _angular_core.Input('fxFlex.gt-lg'), 
        __metadata$5('design:type', Object), 
        __metadata$5('design:paramtypes', [Object])
    ], FlexDirective.prototype, "flexGtLg", null);
    __decorate$5([
        _angular_core.Input('fxFlex.xl'), 
        __metadata$5('design:type', Object), 
        __metadata$5('design:paramtypes', [Object])
    ], FlexDirective.prototype, "flexXl", null);
    FlexDirective = __decorate$5([
        _angular_core.Directive({ selector: "\n  [fxFlex],\n  [fxFlex.xs]\n  [fxFlex.gt-xs],\n  [fxFlex.sm],\n  [fxFlex.gt-sm]\n  [fxFlex.md],\n  [fxFlex.gt-md]\n  [fxFlex.lg],\n  [fxFlex.gt-lg],\n  [fxFlex.xl]\n"
        }),
        __param$1(3, _angular_core.Optional()),
        __param$1(3, _angular_core.SkipSelf()),
        __param$1(4, _angular_core.Optional()),
        __param$1(4, _angular_core.SkipSelf()), 
        __metadata$5('design:paramtypes', [MediaMonitor, _angular_core.ElementRef, _angular_core.Renderer, LayoutDirective, LayoutWrapDirective])
    ], FlexDirective);
    return FlexDirective;
}(BaseFxDirective));

var __extends$4 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$9 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$9 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$4 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FALSY$1 = ['false', false, 0];
/**
 * 'show' Layout API directive
 *
 */
var ShowDirective = (function (_super) {
    __extends$4(ShowDirective, _super);
    /**
     *
     */
    function ShowDirective(monitor, _layout, _hideDirective, elRef, renderer) {
        var _this = this;
        _super.call(this, monitor, elRef, renderer);
        this._layout = _layout;
        this._hideDirective = _hideDirective;
        this.elRef = elRef;
        this.renderer = renderer;
        /**
         * Original dom Elements CSS display style
         */
        this._display = 'flex';
        if (_layout) {
            /**
             * The Layout can set the display:flex (and incorrectly affect the Hide/Show directives.
             * Whenever Layout [on the same element] resets its CSS, then update the Hide/Show CSS
             */
            this._layoutWatcher = _layout.layout$.subscribe(function () { return _this._updateWithValue(); });
        }
    }
    Object.defineProperty(ShowDirective.prototype, "show", {
        set: function (val) { this._cacheInput("show", val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowDirective.prototype, "showXs", {
        set: function (val) { this._cacheInput('showXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowDirective.prototype, "showGtXs", {
        set: function (val) { this._cacheInput('showGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowDirective.prototype, "showSm", {
        set: function (val) { this._cacheInput('showSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowDirective.prototype, "showGtSm", {
        set: function (val) { this._cacheInput('showGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowDirective.prototype, "showMd", {
        set: function (val) { this._cacheInput('showMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowDirective.prototype, "showGtMd", {
        set: function (val) { this._cacheInput('showGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowDirective.prototype, "showLg", {
        set: function (val) { this._cacheInput('showLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowDirective.prototype, "showGtLg", {
        set: function (val) { this._cacheInput('showGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowDirective.prototype, "showXl", {
        set: function (val) { this._cacheInput('showXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowDirective.prototype, "usesHideAPI", {
        /**
          * Does the current element also use the fxShow API ?
          */
        get: function () {
            return !!this._hideDirective;
        },
        enumerable: true,
        configurable: true
    });
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxShow')
     * Then conditionally override with the mq-activated Input's current value
     */
    ShowDirective.prototype.ngOnChanges = function (changes) {
        if (changes['show'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ShowDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('show', true, function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    ShowDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /** Validate the visibility value and then update the host's inline display style */
    ShowDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("show") || true;
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        var shouldShow = this._validateTruthy(value);
        if (shouldShow || !this.usesHideAPI) {
            this._applyStyleToElement(this._buildCSS(shouldShow));
        }
    };
    /** Build the CSS that should be assigned to the element instance */
    ShowDirective.prototype._buildCSS = function (show) {
        return { 'display': show ? this._display : 'none' };
    };
    /**  Validate the to be not FALSY */
    ShowDirective.prototype._validateTruthy = function (show) {
        return (FALSY$1.indexOf(show) == -1);
    };
    __decorate$9([
        _angular_core.Input('fxShow'), 
        __metadata$9('design:type', Object), 
        __metadata$9('design:paramtypes', [Object])
    ], ShowDirective.prototype, "show", null);
    __decorate$9([
        _angular_core.Input('fxShow.xs'), 
        __metadata$9('design:type', Object), 
        __metadata$9('design:paramtypes', [Object])
    ], ShowDirective.prototype, "showXs", null);
    __decorate$9([
        _angular_core.Input('fxShow.gt-xs'), 
        __metadata$9('design:type', Object), 
        __metadata$9('design:paramtypes', [Object])
    ], ShowDirective.prototype, "showGtXs", null);
    __decorate$9([
        _angular_core.Input('fxShow.sm'), 
        __metadata$9('design:type', Object), 
        __metadata$9('design:paramtypes', [Object])
    ], ShowDirective.prototype, "showSm", null);
    __decorate$9([
        _angular_core.Input('fxShow.gt-sm'), 
        __metadata$9('design:type', Object), 
        __metadata$9('design:paramtypes', [Object])
    ], ShowDirective.prototype, "showGtSm", null);
    __decorate$9([
        _angular_core.Input('fxShow.md'), 
        __metadata$9('design:type', Object), 
        __metadata$9('design:paramtypes', [Object])
    ], ShowDirective.prototype, "showMd", null);
    __decorate$9([
        _angular_core.Input('fxShow.gt-md'), 
        __metadata$9('design:type', Object), 
        __metadata$9('design:paramtypes', [Object])
    ], ShowDirective.prototype, "showGtMd", null);
    __decorate$9([
        _angular_core.Input('fxShow.lg'), 
        __metadata$9('design:type', Object), 
        __metadata$9('design:paramtypes', [Object])
    ], ShowDirective.prototype, "showLg", null);
    __decorate$9([
        _angular_core.Input('fxShow.gt-lg'), 
        __metadata$9('design:type', Object), 
        __metadata$9('design:paramtypes', [Object])
    ], ShowDirective.prototype, "showGtLg", null);
    __decorate$9([
        _angular_core.Input('fxShow.xl'), 
        __metadata$9('design:type', Object), 
        __metadata$9('design:paramtypes', [Object])
    ], ShowDirective.prototype, "showXl", null);
    ShowDirective = __decorate$9([
        _angular_core.Directive({ selector: "\n  [fxShow],\n  [fxShow.xs]\n  [fxShow.gt-xs],\n  [fxShow.sm],\n  [fxShow.gt-sm]\n  [fxShow.md],\n  [fxShow.gt-md]\n  [fxShow.lg],\n  [fxShow.gt-lg],\n  [fxShow.xl]\n" }),
        __param$4(1, _angular_core.Optional()),
        __param$4(1, _angular_core.Self()),
        __param$4(2, _angular_core.Inject(_angular_core.forwardRef(function () { return HideDirective; }))),
        __param$4(2, _angular_core.Optional()),
        __param$4(2, _angular_core.Self()), 
        __metadata$9('design:paramtypes', [MediaMonitor, LayoutDirective, Object, _angular_core.ElementRef, _angular_core.Renderer])
    ], ShowDirective);
    return ShowDirective;
}(BaseFxDirective));

var __extends$3 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$8 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$8 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$3 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * 'show' Layout API directive
 *
 */
var HideDirective = (function (_super) {
    __extends$3(HideDirective, _super);
    /**
     *
     */
    function HideDirective(monitor, _layout, _showDirective, elRef, renderer) {
        var _this = this;
        _super.call(this, monitor, elRef, renderer);
        this._layout = _layout;
        this._showDirective = _showDirective;
        this.elRef = elRef;
        this.renderer = renderer;
        /**
         * Original dom Elements CSS display style
         */
        this._display = 'flex';
        if (_layout) {
            /**
             * The Layout can set the display:flex (and incorrectly affect the Hide/Show directives.
             * Whenever Layout [on the same element] resets its CSS, then update the Hide/Show CSS
             */
            this._layoutWatcher = _layout.layout$.subscribe(function () { return _this._updateWithValue(); });
        }
    }
    Object.defineProperty(HideDirective.prototype, "hide", {
        set: function (val) { this._cacheInput("hide", val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HideDirective.prototype, "hideXs", {
        set: function (val) { this._cacheInput('hideXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HideDirective.prototype, "hideGtXs", {
        set: function (val) { this._cacheInput('hideGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(HideDirective.prototype, "hideSm", {
        set: function (val) { this._cacheInput('hideSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(HideDirective.prototype, "hideGtSm", {
        set: function (val) { this._cacheInput('hideGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(HideDirective.prototype, "hideMd", {
        set: function (val) { this._cacheInput('hideMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(HideDirective.prototype, "hideGtMd", {
        set: function (val) { this._cacheInput('hideGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(HideDirective.prototype, "hideLg", {
        set: function (val) { this._cacheInput('hideLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(HideDirective.prototype, "hideGtLg", {
        set: function (val) { this._cacheInput('hideGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(HideDirective.prototype, "hideXl", {
        set: function (val) { this._cacheInput('hideXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(HideDirective.prototype, "usesShowAPI", {
        /**
         * Does the current element also use the fxShow API ?
         */
        get: function () {
            return !!this._showDirective;
        },
        enumerable: true,
        configurable: true
    });
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxHide')
     * Then conditionally override with the mq-activated Input's current value
     */
    HideDirective.prototype.ngOnChanges = function (changes) {
        if (changes['hide'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    HideDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('hide', true, function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    HideDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Validate the visibility value and then update the host's inline display style
     */
    HideDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("hide") || true;
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        var shouldHide = this._validateTruthy(value);
        if (shouldHide || !this.usesShowAPI) {
            this._applyStyleToElement(this._buildCSS(shouldHide));
        }
    };
    /**
     * Build the CSS that should be assigned to the element instance
     */
    HideDirective.prototype._buildCSS = function (value) {
        return { 'display': value ? 'none' : this._display };
    };
    /**
     * Validate the value to NOT be FALSY
     */
    HideDirective.prototype._validateTruthy = function (value) {
        return FALSY.indexOf(value) === -1;
    };
    __decorate$8([
        _angular_core.Input('fxHide'), 
        __metadata$8('design:type', Object), 
        __metadata$8('design:paramtypes', [Object])
    ], HideDirective.prototype, "hide", null);
    __decorate$8([
        _angular_core.Input('fxHide.xs'), 
        __metadata$8('design:type', Object), 
        __metadata$8('design:paramtypes', [Object])
    ], HideDirective.prototype, "hideXs", null);
    __decorate$8([
        _angular_core.Input('fxHide.gt-xs'), 
        __metadata$8('design:type', Object), 
        __metadata$8('design:paramtypes', [Object])
    ], HideDirective.prototype, "hideGtXs", null);
    __decorate$8([
        _angular_core.Input('fxHide.sm'), 
        __metadata$8('design:type', Object), 
        __metadata$8('design:paramtypes', [Object])
    ], HideDirective.prototype, "hideSm", null);
    __decorate$8([
        _angular_core.Input('fxHide.gt-sm'), 
        __metadata$8('design:type', Object), 
        __metadata$8('design:paramtypes', [Object])
    ], HideDirective.prototype, "hideGtSm", null);
    __decorate$8([
        _angular_core.Input('fxHide.md'), 
        __metadata$8('design:type', Object), 
        __metadata$8('design:paramtypes', [Object])
    ], HideDirective.prototype, "hideMd", null);
    __decorate$8([
        _angular_core.Input('fxHide.gt-md'), 
        __metadata$8('design:type', Object), 
        __metadata$8('design:paramtypes', [Object])
    ], HideDirective.prototype, "hideGtMd", null);
    __decorate$8([
        _angular_core.Input('fxHide.lg'), 
        __metadata$8('design:type', Object), 
        __metadata$8('design:paramtypes', [Object])
    ], HideDirective.prototype, "hideLg", null);
    __decorate$8([
        _angular_core.Input('fxHide.gt-lg'), 
        __metadata$8('design:type', Object), 
        __metadata$8('design:paramtypes', [Object])
    ], HideDirective.prototype, "hideGtLg", null);
    __decorate$8([
        _angular_core.Input('fxHide.xl'), 
        __metadata$8('design:type', Object), 
        __metadata$8('design:paramtypes', [Object])
    ], HideDirective.prototype, "hideXl", null);
    HideDirective = __decorate$8([
        _angular_core.Directive({ selector: "\n  [fxHide],\n  [fxHide.xs]\n  [fxHide.gt-xs],\n  [fxHide.sm],\n  [fxHide.gt-sm]\n  [fxHide.md],\n  [fxHide.gt-md]\n  [fxHide.lg],\n  [fxHide.gt-lg],\n  [fxHide.xl]\n" }),
        __param$3(1, _angular_core.Optional()),
        __param$3(1, _angular_core.Self()),
        __param$3(2, _angular_core.Optional()),
        __param$3(2, _angular_core.Self()), 
        __metadata$8('design:paramtypes', [MediaMonitor, LayoutDirective, ShowDirective, _angular_core.ElementRef, _angular_core.Renderer])
    ], HideDirective);
    return HideDirective;
}(BaseFxDirective));
var FALSY = ['false', false, 0];

var __extends$5 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$10 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$10 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
var FlexAlignDirective = (function (_super) {
    __extends$5(FlexAlignDirective, _super);
    function FlexAlignDirective(monitor, elRef, renderer) {
        _super.call(this, monitor, elRef, renderer);
    }
    Object.defineProperty(FlexAlignDirective.prototype, "align", {
        set: function (val) {
            this._cacheInput('align', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexAlignDirective.prototype, "alignXs", {
        set: function (val) {
            this._cacheInput('alignXs', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtXs", {
        set: function (val) {
            this._cacheInput('alignGtXs', val);
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignSm", {
        set: function (val) {
            this._cacheInput('alignSm', val);
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtSm", {
        set: function (val) {
            this._cacheInput('alignGtSm', val);
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignMd", {
        set: function (val) {
            this._cacheInput('alignMd', val);
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtMd", {
        set: function (val) {
            this._cacheInput('alignGtMd', val);
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignLg", {
        set: function (val) {
            this._cacheInput('alignLg', val);
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtLg", {
        set: function (val) {
            this._cacheInput('alignGtLg', val);
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignXl", {
        set: function (val) {
            this._cacheInput('alignXl', val);
        },
        enumerable: true,
        configurable: true
    });
    
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * For @Input changes on the current mq activation property, see onMediaQueryChanges()
     */
    FlexAlignDirective.prototype.ngOnChanges = function (changes) {
        if (changes['align'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    FlexAlignDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('align', 'stretch', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    // *********************************************
    // Protected methods
    // *********************************************
    FlexAlignDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("align") || 'stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    };
    FlexAlignDirective.prototype._buildCSS = function (align) {
        var css = {};
        // Cross-axis
        switch (align) {
            case 'start':
                css['align-self'] = 'flex-start';
                break;
            case 'end':
                css['align-self'] = 'flex-end';
                break;
            default:
                css['align-self'] = align;
                break;
        }
        return css;
    };
    __decorate$10([
        _angular_core.Input('fxFlexAlign'), 
        __metadata$10('design:type', Object), 
        __metadata$10('design:paramtypes', [Object])
    ], FlexAlignDirective.prototype, "align", null);
    __decorate$10([
        _angular_core.Input('fxFlexAlign.xs'), 
        __metadata$10('design:type', Object), 
        __metadata$10('design:paramtypes', [Object])
    ], FlexAlignDirective.prototype, "alignXs", null);
    __decorate$10([
        _angular_core.Input('fxFlexAlign.gt-xs'), 
        __metadata$10('design:type', Object), 
        __metadata$10('design:paramtypes', [Object])
    ], FlexAlignDirective.prototype, "alignGtXs", null);
    __decorate$10([
        _angular_core.Input('fxFlexAlign.sm'), 
        __metadata$10('design:type', Object), 
        __metadata$10('design:paramtypes', [Object])
    ], FlexAlignDirective.prototype, "alignSm", null);
    __decorate$10([
        _angular_core.Input('fxFlexAlign.gt-sm'), 
        __metadata$10('design:type', Object), 
        __metadata$10('design:paramtypes', [Object])
    ], FlexAlignDirective.prototype, "alignGtSm", null);
    __decorate$10([
        _angular_core.Input('fxFlexAlign.md'), 
        __metadata$10('design:type', Object), 
        __metadata$10('design:paramtypes', [Object])
    ], FlexAlignDirective.prototype, "alignMd", null);
    __decorate$10([
        _angular_core.Input('fxFlexAlign.gt-md'), 
        __metadata$10('design:type', Object), 
        __metadata$10('design:paramtypes', [Object])
    ], FlexAlignDirective.prototype, "alignGtMd", null);
    __decorate$10([
        _angular_core.Input('fxFlexAlign.lg'), 
        __metadata$10('design:type', Object), 
        __metadata$10('design:paramtypes', [Object])
    ], FlexAlignDirective.prototype, "alignLg", null);
    __decorate$10([
        _angular_core.Input('fxFlexAlign.gt-lg'), 
        __metadata$10('design:type', Object), 
        __metadata$10('design:paramtypes', [Object])
    ], FlexAlignDirective.prototype, "alignGtLg", null);
    __decorate$10([
        _angular_core.Input('fxFlexAlign.xl'), 
        __metadata$10('design:type', Object), 
        __metadata$10('design:paramtypes', [Object])
    ], FlexAlignDirective.prototype, "alignXl", null);
    FlexAlignDirective = __decorate$10([
        _angular_core.Directive({
            selector: "\n  [fxFlexAlign],\n  [fxFlexAlign.xs]\n  [fxFlexAlign.gt-xs],\n  [fxFlexAlign.sm],\n  [fxFlexAlign.gt-sm]\n  [fxFlexAlign.md],\n  [fxFlexAlign.gt-md]\n  [fxFlexAlign.lg],\n  [fxFlexAlign.gt-lg],\n  [fxFlexAlign.xl]\n"
        }), 
        __metadata$10('design:paramtypes', [MediaMonitor, _angular_core.ElementRef, _angular_core.Renderer])
    ], FlexAlignDirective);
    return FlexAlignDirective;
}(BaseFxDirective));

var __extends$6 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$11 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$11 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FLEX_FILL_CSS = {
    'margin': 0,
    'width': '100%',
    'height': '100%',
    'min-width': '100%',
    'min-height': '100%'
};
/**
 * 'fxFill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: fxFill is NOT responsive API!!
 */
var FlexFillDirective = (function (_super) {
    __extends$6(FlexFillDirective, _super);
    function FlexFillDirective(monitor, elRef, renderer) {
        _super.call(this, monitor, elRef, renderer);
        this.elRef = elRef;
        this.renderer = renderer;
        this._applyStyleToElement(FLEX_FILL_CSS);
    }
    FlexFillDirective = __decorate$11([
        _angular_core.Directive({ selector: "\n  [fxFill],\n  [fxFill.xs]\n  [fxFill.gt-xs],\n  [fxFill.sm],\n  [fxFill.gt-sm]\n  [fxFill.md],\n  [fxFill.gt-md]\n  [fxFill.lg],\n  [fxFill.gt-lg],\n  [fxFill.xl]\n" }), 
        __metadata$11('design:paramtypes', [MediaMonitor, _angular_core.ElementRef, _angular_core.Renderer])
    ], FlexFillDirective);
    return FlexFillDirective;
}(BaseFxDirective));

var __extends$7 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$12 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$12 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
var FlexOffsetDirective = (function (_super) {
    __extends$7(FlexOffsetDirective, _super);
    function FlexOffsetDirective(monitor, elRef, renderer) {
        _super.call(this, monitor, elRef, renderer);
    }
    Object.defineProperty(FlexOffsetDirective.prototype, "offset", {
        set: function (val) { this._cacheInput('offset', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetXs", {
        set: function (val) { this._cacheInput('offsetXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtXs", {
        set: function (val) { this._cacheInput('offsetGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetSm", {
        set: function (val) { this._cacheInput('offsetSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtSm", {
        set: function (val) { this._cacheInput('offsetGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetMd", {
        set: function (val) { this._cacheInput('offsetMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtMd", {
        set: function (val) { this._cacheInput('offsetGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetLg", {
        set: function (val) { this._cacheInput('offsetLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtLg", {
        set: function (val) { this._cacheInput('offsetGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetXl", {
        set: function (val) { this._cacheInput('offsetXl', val); },
        enumerable: true,
        configurable: true
    });
    
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * For @Input changes on the current mq activation property, see onMediaQueryChanges()
     */
    FlexOffsetDirective.prototype.ngOnChanges = function (changes) {
        if (changes['offset'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    FlexOffsetDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('offset', 0, function (changes) {
            _this._updateWithValue(changes.value);
        });
    };
    // *********************************************
    // Protected methods
    // *********************************************
    FlexOffsetDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("offset") || 0;
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    };
    FlexOffsetDirective.prototype._buildCSS = function (offset) {
        var isPercent = String(offset).indexOf('%') > -1;
        var isPx = String(offset).indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(offset))
            offset = offset + '%';
        return { 'margin-left': "" + offset };
    };
    __decorate$12([
        _angular_core.Input('fxFlexOffset'), 
        __metadata$12('design:type', Object), 
        __metadata$12('design:paramtypes', [Object])
    ], FlexOffsetDirective.prototype, "offset", null);
    __decorate$12([
        _angular_core.Input('fxFlexOffset.xs'), 
        __metadata$12('design:type', Object), 
        __metadata$12('design:paramtypes', [Object])
    ], FlexOffsetDirective.prototype, "offsetXs", null);
    __decorate$12([
        _angular_core.Input('fxFlexOffset.gt-xs'), 
        __metadata$12('design:type', Object), 
        __metadata$12('design:paramtypes', [Object])
    ], FlexOffsetDirective.prototype, "offsetGtXs", null);
    __decorate$12([
        _angular_core.Input('fxFlexOffset.sm'), 
        __metadata$12('design:type', Object), 
        __metadata$12('design:paramtypes', [Object])
    ], FlexOffsetDirective.prototype, "offsetSm", null);
    __decorate$12([
        _angular_core.Input('fxFlexOffset.gt-sm'), 
        __metadata$12('design:type', Object), 
        __metadata$12('design:paramtypes', [Object])
    ], FlexOffsetDirective.prototype, "offsetGtSm", null);
    __decorate$12([
        _angular_core.Input('fxFlexOffset.md'), 
        __metadata$12('design:type', Object), 
        __metadata$12('design:paramtypes', [Object])
    ], FlexOffsetDirective.prototype, "offsetMd", null);
    __decorate$12([
        _angular_core.Input('fxFlexOffset.gt-md'), 
        __metadata$12('design:type', Object), 
        __metadata$12('design:paramtypes', [Object])
    ], FlexOffsetDirective.prototype, "offsetGtMd", null);
    __decorate$12([
        _angular_core.Input('fxFlexOffset.lg'), 
        __metadata$12('design:type', Object), 
        __metadata$12('design:paramtypes', [Object])
    ], FlexOffsetDirective.prototype, "offsetLg", null);
    __decorate$12([
        _angular_core.Input('fxFlexOffset.gt-lg'), 
        __metadata$12('design:type', Object), 
        __metadata$12('design:paramtypes', [Object])
    ], FlexOffsetDirective.prototype, "offsetGtLg", null);
    __decorate$12([
        _angular_core.Input('fxFlexOffset.xl'), 
        __metadata$12('design:type', Object), 
        __metadata$12('design:paramtypes', [Object])
    ], FlexOffsetDirective.prototype, "offsetXl", null);
    FlexOffsetDirective = __decorate$12([
        _angular_core.Directive({ selector: "\n  [fxFlexOffset],\n  [fxFlexOffset.xs]\n  [fxFlexOffset.gt-xs],\n  [fxFlexOffset.sm],\n  [fxFlexOffset.gt-sm]\n  [fxFlexOffset.md],\n  [fxFlexOffset.gt-md]\n  [fxFlexOffset.lg],\n  [fxFlexOffset.gt-lg],\n  [fxFlexOffset.xl]\n" }), 
        __metadata$12('design:paramtypes', [MediaMonitor, _angular_core.ElementRef, _angular_core.Renderer])
    ], FlexOffsetDirective);
    return FlexOffsetDirective;
}(BaseFxDirective));

var __extends$8 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$13 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$13 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
var FlexOrderDirective = (function (_super) {
    __extends$8(FlexOrderDirective, _super);
    function FlexOrderDirective(monitor, elRef, renderer) {
        _super.call(this, monitor, elRef, renderer);
    }
    Object.defineProperty(FlexOrderDirective.prototype, "order", {
        set: function (val) { this._cacheInput('order', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexOrderDirective.prototype, "orderXs", {
        set: function (val) { this._cacheInput('orderXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtXs", {
        set: function (val) { this._cacheInput('orderGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderSm", {
        set: function (val) { this._cacheInput('orderSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtSm", {
        set: function (val) { this._cacheInput('orderGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderMd", {
        set: function (val) { this._cacheInput('orderMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtMd", {
        set: function (val) { this._cacheInput('orderGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderLg", {
        set: function (val) { this._cacheInput('orderLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtLg", {
        set: function (val) { this._cacheInput('orderGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderXl", {
        set: function (val) { this._cacheInput('orderXl', val); },
        enumerable: true,
        configurable: true
    });
    
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * For @Input changes on the current mq activation property, see onMediaQueryChanges()
     */
    FlexOrderDirective.prototype.ngOnChanges = function (changes) {
        if (changes['order'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    FlexOrderDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('order', '0', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    // *********************************************
    // Protected methods
    // *********************************************
    FlexOrderDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("order") || '0';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    };
    FlexOrderDirective.prototype._buildCSS = function (value) {
        value = parseInt(value, 10);
        return { order: isNaN(value) ? 0 : value };
    };
    __decorate$13([
        _angular_core.Input('fxFlexOrder'), 
        __metadata$13('design:type', Object), 
        __metadata$13('design:paramtypes', [Object])
    ], FlexOrderDirective.prototype, "order", null);
    __decorate$13([
        _angular_core.Input('fxFlexOrder.xs'), 
        __metadata$13('design:type', Object), 
        __metadata$13('design:paramtypes', [Object])
    ], FlexOrderDirective.prototype, "orderXs", null);
    __decorate$13([
        _angular_core.Input('fxFlexOrder.gt-xs'), 
        __metadata$13('design:type', Object), 
        __metadata$13('design:paramtypes', [Object])
    ], FlexOrderDirective.prototype, "orderGtXs", null);
    __decorate$13([
        _angular_core.Input('fxFlexOrder.sm'), 
        __metadata$13('design:type', Object), 
        __metadata$13('design:paramtypes', [Object])
    ], FlexOrderDirective.prototype, "orderSm", null);
    __decorate$13([
        _angular_core.Input('fxFlexOrder.gt-sm'), 
        __metadata$13('design:type', Object), 
        __metadata$13('design:paramtypes', [Object])
    ], FlexOrderDirective.prototype, "orderGtSm", null);
    __decorate$13([
        _angular_core.Input('fxFlexOrder.md'), 
        __metadata$13('design:type', Object), 
        __metadata$13('design:paramtypes', [Object])
    ], FlexOrderDirective.prototype, "orderMd", null);
    __decorate$13([
        _angular_core.Input('fxFlexOrder.gt-md'), 
        __metadata$13('design:type', Object), 
        __metadata$13('design:paramtypes', [Object])
    ], FlexOrderDirective.prototype, "orderGtMd", null);
    __decorate$13([
        _angular_core.Input('fxFlexOrder.lg'), 
        __metadata$13('design:type', Object), 
        __metadata$13('design:paramtypes', [Object])
    ], FlexOrderDirective.prototype, "orderLg", null);
    __decorate$13([
        _angular_core.Input('fxFlexOrder.gt-lg'), 
        __metadata$13('design:type', Object), 
        __metadata$13('design:paramtypes', [Object])
    ], FlexOrderDirective.prototype, "orderGtLg", null);
    __decorate$13([
        _angular_core.Input('fxFlexOrder.xl'), 
        __metadata$13('design:type', Object), 
        __metadata$13('design:paramtypes', [Object])
    ], FlexOrderDirective.prototype, "orderXl", null);
    FlexOrderDirective = __decorate$13([
        _angular_core.Directive({ selector: "\n  [fxFlexOrder],\n  [fxFlexOrder.xs]\n  [fxFlexOrder.gt-xs],\n  [fxFlexOrder.sm],\n  [fxFlexOrder.gt-sm]\n  [fxFlexOrder.md],\n  [fxFlexOrder.gt-md]\n  [fxFlexOrder.lg],\n  [fxFlexOrder.gt-lg],\n  [fxFlexOrder.xl]\n" }), 
        __metadata$13('design:paramtypes', [MediaMonitor, _angular_core.ElementRef, _angular_core.Renderer])
    ], FlexOrderDirective);
    return FlexOrderDirective;
}(BaseFxDirective));

var __extends$9 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$14 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$14 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$5 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * 'layout-align' flexbox styling directive
 *  Defines positioning of child elements along main and cross axis in a layout container
 *  Optional values: {main-axis} values or {main-axis cross-axis} value pairs
 *
 *  @see https://css-tricks.com/almanac/properties/j/justify-content/
 *  @see https://css-tricks.com/almanac/properties/a/align-items/
 *  @see https://css-tricks.com/almanac/properties/a/align-content/
 */
var LayoutAlignDirective = (function (_super) {
    __extends$9(LayoutAlignDirective, _super);
    function LayoutAlignDirective(monitor, elRef, renderer, container) {
        _super.call(this, monitor, elRef, renderer);
        this._layout = 'row'; // default flex-direction
        if (container) {
            this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
        }
    }
    Object.defineProperty(LayoutAlignDirective.prototype, "align", {
        set: function (val) { this._cacheInput('align', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutAlignDirective.prototype, "alignXs", {
        set: function (val) { this._cacheInput('alignXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutAlignDirective.prototype, "alignGtXs", {
        set: function (val) { this._cacheInput('alignGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignSm", {
        set: function (val) { this._cacheInput('alignSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignGtSm", {
        set: function (val) { this._cacheInput('alignGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignMd", {
        set: function (val) { this._cacheInput('alignMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignGtMd", {
        set: function (val) { this._cacheInput('alignGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignLg", {
        set: function (val) { this._cacheInput('alignLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignGtLg", {
        set: function (val) { this._cacheInput('alignGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignXl", {
        set: function (val) { this._cacheInput('alignXl', val); },
        enumerable: true,
        configurable: true
    });
    
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    LayoutAlignDirective.prototype.ngOnChanges = function (changes) {
        if (changes['align'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    LayoutAlignDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('align', 'start stretch', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    LayoutAlignDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     *
     */
    LayoutAlignDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("align") || 'start stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
        this._allowStretching(value, !this._layout ? "row" : this._layout);
    };
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     */
    LayoutAlignDirective.prototype._onLayoutChange = function (direction) {
        var _this = this;
        this._layout = (direction || '').toLowerCase().replace('-reverse', '');
        if (!LAYOUT_VALUES.find(function (x) { return x === _this._layout; }))
            this._layout = 'row';
        var value = this._queryInput("align") || 'start stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._allowStretching(value, this._layout || "row");
    };
    LayoutAlignDirective.prototype._buildCSS = function (align) {
        var css = {}, _a = align.split(' '), main_axis = _a[0], cross_axis = _a[1];
        css['justify-content'] = 'flex-start'; // default main axis
        css['align-items'] = 'stretch'; // default cross axis
        css['align-content'] = 'stretch'; // default cross axis
        // Main axis
        switch (main_axis) {
            case 'center':
                css['justify-content'] = 'center';
                break;
            case 'space-around':
                css['justify-content'] = 'space-around';
                break;
            case 'space-between':
                css['justify-content'] = 'space-between';
                break;
            case 'end':
                css['justify-content'] = 'flex-end';
                break;
        }
        // Cross-axis
        switch (cross_axis) {
            case 'start':
                css['align-items'] = css['align-content'] = 'flex-start';
                break;
            case 'baseline':
                css['align-items'] = 'baseline';
                break;
            case 'center':
                css['align-items'] = css['align-content'] = 'center';
                break;
            case 'end':
                css['align-items'] = css['align-content'] = 'flex-end';
                break;
            default:
                break;
        }
        return extendObject(css, {
            'display': 'flex',
            'flex-direction': this._layout || "row",
            'box-sizing': 'border-box'
        });
    };
    /**
     * Update container element to 'stretch' as needed...
     * NOTE: this is only done if the crossAxis is explicitly set to 'stretch'
     */
    LayoutAlignDirective.prototype._allowStretching = function (align, layout) {
        var _a = align.split(' '), cross_axis = _a[1];
        if (cross_axis == 'stretch') {
            // Use `null` values to remove style
            this._applyStyleToElement({
                'box-sizing': 'border-box',
                'max-width': (layout === 'column') ? '100%' : null,
                'max-height': (layout === 'row') ? '100%' : null
            });
        }
    };
    __decorate$14([
        _angular_core.Input('fxLayoutAlign'), 
        __metadata$14('design:type', Object), 
        __metadata$14('design:paramtypes', [Object])
    ], LayoutAlignDirective.prototype, "align", null);
    __decorate$14([
        _angular_core.Input('fxLayoutAlign.xs'), 
        __metadata$14('design:type', Object), 
        __metadata$14('design:paramtypes', [Object])
    ], LayoutAlignDirective.prototype, "alignXs", null);
    __decorate$14([
        _angular_core.Input('fxLayoutAlign.gt-xs'), 
        __metadata$14('design:type', Object), 
        __metadata$14('design:paramtypes', [Object])
    ], LayoutAlignDirective.prototype, "alignGtXs", null);
    __decorate$14([
        _angular_core.Input('fxLayoutAlign.sm'), 
        __metadata$14('design:type', Object), 
        __metadata$14('design:paramtypes', [Object])
    ], LayoutAlignDirective.prototype, "alignSm", null);
    __decorate$14([
        _angular_core.Input('fxLayoutAlign.gt-sm'), 
        __metadata$14('design:type', Object), 
        __metadata$14('design:paramtypes', [Object])
    ], LayoutAlignDirective.prototype, "alignGtSm", null);
    __decorate$14([
        _angular_core.Input('fxLayoutAlign.md'), 
        __metadata$14('design:type', Object), 
        __metadata$14('design:paramtypes', [Object])
    ], LayoutAlignDirective.prototype, "alignMd", null);
    __decorate$14([
        _angular_core.Input('fxLayoutAlign.gt-md'), 
        __metadata$14('design:type', Object), 
        __metadata$14('design:paramtypes', [Object])
    ], LayoutAlignDirective.prototype, "alignGtMd", null);
    __decorate$14([
        _angular_core.Input('fxLayoutAlign.lg'), 
        __metadata$14('design:type', Object), 
        __metadata$14('design:paramtypes', [Object])
    ], LayoutAlignDirective.prototype, "alignLg", null);
    __decorate$14([
        _angular_core.Input('fxLayoutAlign.gt-lg'), 
        __metadata$14('design:type', Object), 
        __metadata$14('design:paramtypes', [Object])
    ], LayoutAlignDirective.prototype, "alignGtLg", null);
    __decorate$14([
        _angular_core.Input('fxLayoutAlign.xl'), 
        __metadata$14('design:type', Object), 
        __metadata$14('design:paramtypes', [Object])
    ], LayoutAlignDirective.prototype, "alignXl", null);
    LayoutAlignDirective = __decorate$14([
        _angular_core.Directive({ selector: "\n  [fxLayoutAlign],\n  [fxLayoutAlign.xs]\n  [fxLayoutAlign.gt-xs],\n  [fxLayoutAlign.sm],\n  [fxLayoutAlign.gt-sm]\n  [fxLayoutAlign.md],\n  [fxLayoutAlign.gt-md]\n  [fxLayoutAlign.lg],\n  [fxLayoutAlign.gt-lg],\n  [fxLayoutAlign.xl]\n" }),
        __param$5(3, _angular_core.Optional()),
        __param$5(3, _angular_core.Self()), 
        __metadata$14('design:paramtypes', [MediaMonitor, _angular_core.ElementRef, _angular_core.Renderer, LayoutDirective])
    ], LayoutAlignDirective);
    return LayoutAlignDirective;
}(BaseFxDirective));

var __extends$10 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$15 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$15 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
var LayoutGapDirective = (function (_super) {
    __extends$10(LayoutGapDirective, _super);
    function LayoutGapDirective(monitor, elRef, renderer) {
        _super.call(this, monitor, elRef, renderer);
    }
    Object.defineProperty(LayoutGapDirective.prototype, "gap", {
        set: function (val) { this._cacheInput('gap', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutGapDirective.prototype, "gapXs", {
        set: function (val) { this._cacheInput('gapXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutGapDirective.prototype, "gapGtXs", {
        set: function (val) { this._cacheInput('gapGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapSm", {
        set: function (val) { this._cacheInput('gapSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapGtSm", {
        set: function (val) { this._cacheInput('gapGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapMd", {
        set: function (val) { this._cacheInput('gapMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapGtMd", {
        set: function (val) { this._cacheInput('gapGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapLg", {
        set: function (val) { this._cacheInput('gapLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapGtLg", {
        set: function (val) { this._cacheInput('gapGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapXl", {
        set: function (val) { this._cacheInput('gapXl', val); },
        enumerable: true,
        configurable: true
    });
    
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    LayoutGapDirective.prototype.ngOnChanges = function (changes) {
        if (changes['gap'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    LayoutGapDirective.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._listenForMediaQueryChanges('gap', '0', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     *
     */
    LayoutGapDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput("padding") || '0';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        // For each `element` child, set the padding styles...
        var items = this.childrenNodes
            .filter(function (el) { return (el.nodeType === 1); }) // only Element types
            .filter(function (el, j) { return j > 0; }); // skip first element since gaps are needed
        this._applyStyleToElements(this._buildCSS(value), items);
    };
    LayoutGapDirective.prototype._buildCSS = function (value) {
        return { 'margin-left': value };
    };
    __decorate$15([
        _angular_core.Input('fxLayoutGap'), 
        __metadata$15('design:type', Object), 
        __metadata$15('design:paramtypes', [Object])
    ], LayoutGapDirective.prototype, "gap", null);
    __decorate$15([
        _angular_core.Input('fxLayoutGap.xs'), 
        __metadata$15('design:type', Object), 
        __metadata$15('design:paramtypes', [Object])
    ], LayoutGapDirective.prototype, "gapXs", null);
    __decorate$15([
        _angular_core.Input('fxLayoutGap.gt-xs'), 
        __metadata$15('design:type', Object), 
        __metadata$15('design:paramtypes', [Object])
    ], LayoutGapDirective.prototype, "gapGtXs", null);
    __decorate$15([
        _angular_core.Input('fxLayoutGap.sm'), 
        __metadata$15('design:type', Object), 
        __metadata$15('design:paramtypes', [Object])
    ], LayoutGapDirective.prototype, "gapSm", null);
    __decorate$15([
        _angular_core.Input('fxLayoutGap.gt-sm'), 
        __metadata$15('design:type', Object), 
        __metadata$15('design:paramtypes', [Object])
    ], LayoutGapDirective.prototype, "gapGtSm", null);
    __decorate$15([
        _angular_core.Input('fxLayoutGap.md'), 
        __metadata$15('design:type', Object), 
        __metadata$15('design:paramtypes', [Object])
    ], LayoutGapDirective.prototype, "gapMd", null);
    __decorate$15([
        _angular_core.Input('fxLayoutGap.gt-md'), 
        __metadata$15('design:type', Object), 
        __metadata$15('design:paramtypes', [Object])
    ], LayoutGapDirective.prototype, "gapGtMd", null);
    __decorate$15([
        _angular_core.Input('fxLayoutGap.lg'), 
        __metadata$15('design:type', Object), 
        __metadata$15('design:paramtypes', [Object])
    ], LayoutGapDirective.prototype, "gapLg", null);
    __decorate$15([
        _angular_core.Input('fxLayoutGap.gt-lg'), 
        __metadata$15('design:type', Object), 
        __metadata$15('design:paramtypes', [Object])
    ], LayoutGapDirective.prototype, "gapGtLg", null);
    __decorate$15([
        _angular_core.Input('fxLayoutGap.xl'), 
        __metadata$15('design:type', Object), 
        __metadata$15('design:paramtypes', [Object])
    ], LayoutGapDirective.prototype, "gapXl", null);
    LayoutGapDirective = __decorate$15([
        _angular_core.Directive({ selector: "\n  [fxLayoutGap],\n  [fxLayoutGap.xs]\n  [fxLayoutGap.gt-xs],\n  [fxLayoutGap.sm],\n  [fxLayoutGap.gt-sm]\n  [fxLayoutGap.md],\n  [fxLayoutGap.gt-md]\n  [fxLayoutGap.lg],\n  [fxLayoutGap.gt-lg],\n  [fxLayoutGap.xl]\n" }), 
        __metadata$15('design:paramtypes', [MediaMonitor, _angular_core.ElementRef, _angular_core.Renderer])
    ], LayoutGapDirective);
    return LayoutGapDirective;
}(BaseFxDirective));

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Since the equivalent results are easily achieved with a css class attached to each
 * layout child, these have been deprecated and removed from the API.
 *
 *  import {LayoutPaddingDirective} from './api/layout-padding';
 *  import {LayoutMarginDirective} from './api/layout-margin';
 */
var ALL_DIRECTIVES = [
    LayoutDirective,
    LayoutWrapDirective,
    LayoutGapDirective,
    LayoutAlignDirective,
    FlexDirective,
    FlexOrderDirective,
    FlexOffsetDirective,
    FlexFillDirective,
    FlexAlignDirective,
    ShowDirective,
    HideDirective,
];
/**
 *
 */
var FlexLayoutModule = (function () {
    function FlexLayoutModule() {
    }
    FlexLayoutModule.forRoot = function () {
        return { ngModule: FlexLayoutModule, providers: [MediaMonitor] };
    };
    FlexLayoutModule = __decorate([
        _angular_core.NgModule({
            declarations: ALL_DIRECTIVES,
            imports: [MediaQueriesModule],
            exports: [MediaQueriesModule].concat(ALL_DIRECTIVES),
            providers: []
        }), 
        __metadata('design:paramtypes', [])
    ], FlexLayoutModule);
    return FlexLayoutModule;
}());

exports.BaseFxDirective = BaseFxDirective;
exports.KeyOptions = KeyOptions;
exports.ResponsiveActivation = ResponsiveActivation;
exports.FlexLayoutModule = FlexLayoutModule;
exports.BreakPointRegistry = BreakPointRegistry;
exports.RESPONSIVE_ALIASES = RESPONSIVE_ALIASES;
exports.RAW_DEFAULTS = RAW_DEFAULTS;
exports.BREAKPOINTS = BREAKPOINTS;
exports.BreakPointsProvider = BreakPointsProvider;
exports.MatchMediaObservable = MatchMediaObservable;
exports.MatchMedia = MatchMedia;
exports.MediaChange = MediaChange;
exports.MediaMonitor = MediaMonitor;
exports.MediaQueriesModule = MediaQueriesModule;
exports.applyCssPrefixes = applyCssPrefixes;
exports.toAlignContentValue = toAlignContentValue;
exports.toBoxValue = toBoxValue;
exports.toBoxOrient = toBoxOrient;
exports.toBoxDirection = toBoxDirection;
exports.toBoxOrdinal = toBoxOrdinal;
exports.extendObject = extendObject;
exports.mergeAlias = mergeAlias;

Object.defineProperty(exports, '__esModule', { value: true });

})));
