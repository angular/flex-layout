/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/platform-browser'), require('rxjs/operator/map'), require('rxjs/BehaviorSubject'), require('rxjs/operator/filter'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/platform-browser', 'rxjs/operator/map', 'rxjs/BehaviorSubject', 'rxjs/operator/filter', '@angular/common'], factory) :
	(factory((global.ng = global.ng || {}, global.ng['flex-layout'] = global.ng['flex-layout'] || {}),global.ng.core,global.ng.platformBrowser,global.Rx.Observable.prototype,global.Rx,global.Rx.Observable.prototype,global.ng.common));
}(this, (function (exports,_angular_core,_angular_platformBrowser,rxjs_operator_map,rxjs_BehaviorSubject,rxjs_operator_filter,_angular_common) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var VERSION = new _angular_core.Version('2.0.0-beta.9-8b8b595');
var LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];
function buildLayoutCSS(value) {
    var _a = validateValue(value), direction = _a[0], wrap = _a[1];
    return buildCSS(direction, wrap);
}
function validateValue(value) {
    value = value ? value.toLowerCase() : '';
    var _a = value.split(' '), direction = _a[0], wrap = _a[1];
    if (!LAYOUT_VALUES.find(function (x) { return x === direction; })) {
        direction = LAYOUT_VALUES[0];
    }
    return [direction, validateWrapValue(wrap)];
}
function isFlowHorizontal(value) {
    var _a = validateValue(value), flow = _a[0], _ = _a[1];
    return flow.indexOf('row') > -1;
}
function validateWrapValue(value) {
    if (!!value) {
        switch (value.toLowerCase()) {
            case 'reverse':
            case 'wrap-reverse':
            case 'reverse-wrap':
                value = 'wrap-reverse';
                break;
            case 'no':
            case 'none':
            case 'nowrap':
                value = 'nowrap';
                break;
            default:
                value = 'wrap';
                break;
        }
    }
    return value;
}
function buildCSS(direction, wrap) {
    if (wrap === void 0) { wrap = null; }
    return {
        'display': 'flex',
        'box-sizing': 'border-box',
        'flex-direction': direction,
        'flex-wrap': !!wrap ? wrap : null
    };
}
function applyCssPrefixes(target) {
    for (var key in target) {
        var value = target[key] || '';
        switch (key) {
            case 'display':
                if (value === 'flex') {
                    target['display'] = [
                        '-webkit-flex',
                        'flex'
                    ];
                }
                else if (value === 'inline-flex') {
                    target['display'] = [
                        '-webkit-inline-flex',
                        'inline-flex'
                    ];
                }
                else {
                    target['display'] = value;
                }
                break;
            case 'align-items':
            case 'align-self':
            case 'align-content':
            case 'flex':
            case 'flex-basis':
            case 'flex-flow':
            case 'flex-grow':
            case 'flex-shrink':
            case 'flex-wrap':
            case 'justify-content':
                target['-webkit-' + key] = value;
                break;
            case 'flex-direction':
                value = value || 'row';
                target['-webkit-flex-direction'] = value;
                target['flex-direction'] = value;
                break;
            case 'order':
                target['order'] = target['-webkit-' + key] = isNaN(value) ? '0' : value;
                break;
        }
    }
    return target;
}
function applyStyleToElement(renderer, element, style, value) {
    var styles = {};
    if (typeof style === 'string') {
        styles[style] = value;
        style = styles;
    }
    styles = applyCssPrefixes(style);
    applyMultiValueStyleToElement(styles, element, renderer);
}
function applyStyleToElements(renderer, style, elements) {
    var styles = applyCssPrefixes(style);
    elements.forEach(function (el) {
        applyMultiValueStyleToElement(styles, el, renderer);
    });
}
function applyMultiValueStyleToElement(styles, element, renderer) {
    Object.keys(styles).forEach(function (key) {
        var values = Array.isArray(styles[key]) ? styles[key] : [styles[key]];
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            renderer.setStyle(element, key, value);
        }
    });
}
function lookupInlineStyle(element, styleName) {
    return _angular_platformBrowser.ɵgetDOM().getStyle(element, styleName);
}
function lookupStyle(element, styleName, inlineOnly) {
    if (inlineOnly === void 0) { inlineOnly = false; }
    var value = '';
    if (element) {
        try {
            var immediateValue = value = lookupInlineStyle(element, styleName);
            if (!inlineOnly) {
                value = immediateValue || _angular_platformBrowser.ɵgetDOM().getComputedStyle(element).getPropertyValue(styleName);
            }
        }
        catch (e) {
        }
    }
    return value ? value.trim() : 'block';
}
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
var KeyOptions = (function () {
    function KeyOptions(baseKey, defaultValue, inputKeys) {
        this.baseKey = baseKey;
        this.defaultValue = defaultValue;
        this.inputKeys = inputKeys;
    }
    return KeyOptions;
}());
var ResponsiveActivation = (function () {
    function ResponsiveActivation(_options, _mediaMonitor, _onMediaChanges) {
        this._options = _options;
        this._mediaMonitor = _mediaMonitor;
        this._onMediaChanges = _onMediaChanges;
        this._subscribers = [];
        this._registryMap = this._buildRegistryMap();
        this._subscribers = this._configureChangeObservers();
    }
    Object.defineProperty(ResponsiveActivation.prototype, "registryFromLargest", {
        get: function () {
            return this._registryMap.slice().reverse();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponsiveActivation.prototype, "mediaMonitor", {
        get: function () {
            return this._mediaMonitor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponsiveActivation.prototype, "activatedInputKey", {
        get: function () {
            return this._activatedInputKey || this._options.baseKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponsiveActivation.prototype, "activatedInput", {
        get: function () {
            var key = this.activatedInputKey;
            return this.hasKeyValue(key) ? this._lookupKeyValue(key) : this._options.defaultValue;
        },
        enumerable: true,
        configurable: true
    });
    ResponsiveActivation.prototype.hasKeyValue = function (key) {
        var value = this._options.inputKeys[key];
        return typeof value !== 'undefined';
    };
    ResponsiveActivation.prototype.destroy = function () {
        this._subscribers.forEach(function (link) {
            link.unsubscribe();
        });
        this._subscribers = [];
    };
    ResponsiveActivation.prototype._configureChangeObservers = function () {
        var _this = this;
        var subscriptions = [];
        this._registryMap.forEach(function (bp) {
            if (_this._keyInUse(bp.key)) {
                var buildChanges = function (change) {
                    change = change.clone();
                    change.property = _this._options.baseKey;
                    return change;
                };
                subscriptions.push(rxjs_operator_map.map.call(_this.mediaMonitor.observe(bp.alias), buildChanges)
                    .subscribe(function (change) {
                    _this._onMonitorEvents(change);
                }));
            }
        });
        return subscriptions;
    };
    ResponsiveActivation.prototype._buildRegistryMap = function () {
        var _this = this;
        return this.mediaMonitor.breakpoints
            .map(function (bp) {
            return (extendObject({}, bp, {
                baseKey: _this._options.baseKey,
                key: _this._options.baseKey + bp.suffix
            }));
        })
            .filter(function (bp) { return _this._keyInUse(bp.key); });
    };
    ResponsiveActivation.prototype._onMonitorEvents = function (change) {
        if (change.property == this._options.baseKey) {
            change.value = this._calculateActivatedValue(change);
            this._onMediaChanges(change);
        }
    };
    ResponsiveActivation.prototype._keyInUse = function (key) {
        return this._lookupKeyValue(key) !== undefined;
    };
    ResponsiveActivation.prototype._calculateActivatedValue = function (current) {
        var currentKey = this._options.baseKey + current.suffix;
        var newKey = this._activatedInputKey;
        newKey = current.matches ? currentKey : ((newKey == currentKey) ? null : newKey);
        this._activatedInputKey = this._validateInputKey(newKey);
        return this.activatedInput;
    };
    ResponsiveActivation.prototype._validateInputKey = function (inputKey) {
        var _this = this;
        var items = this.mediaMonitor.activeOverlaps;
        var isMissingKey = function (key) { return !_this._keyInUse(key); };
        if (isMissingKey(inputKey)) {
            items.some(function (bp) {
                var key = _this._options.baseKey + bp.suffix;
                if (!isMissingKey(key)) {
                    inputKey = key;
                    return true;
                }
                return false;
            });
        }
        return inputKey;
    };
    ResponsiveActivation.prototype._lookupKeyValue = function (key) {
        return this._options.inputKeys[key];
    };
    return ResponsiveActivation;
}());
var BaseFxDirective = (function () {
    function BaseFxDirective(_mediaMonitor, _elementRef, _renderer) {
        this._mediaMonitor = _mediaMonitor;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._inputMap = {};
        this._hasInitialized = false;
    }
    Object.defineProperty(BaseFxDirective.prototype, "hasMediaQueryListener", {
        get: function () {
            return !!this._mqActivation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFxDirective.prototype, "activatedValue", {
        get: function () {
            return this._mqActivation ? this._mqActivation.activatedInput : undefined;
        },
        set: function (value) {
            var key = 'baseKey', previousVal;
            if (this._mqActivation) {
                key = this._mqActivation.activatedInputKey;
                previousVal = this._inputMap[key];
                this._inputMap[key] = value;
            }
            var change = new _angular_core.SimpleChange(previousVal, value, false);
            this.ngOnChanges((_a = {}, _a[key] = change, _a));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFxDirective.prototype, "parentElement", {
        get: function () {
            return this._elementRef.nativeElement.parentNode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFxDirective.prototype, "nativeElement", {
        get: function () {
            return this._elementRef.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    BaseFxDirective.prototype._queryInput = function (key) {
        return this._inputMap[key];
    };
    BaseFxDirective.prototype.ngOnInit = function () {
        this._display = this._getDisplayStyle();
        this._hasInitialized = true;
    };
    BaseFxDirective.prototype.ngOnChanges = function (change) {
        throw new Error("BaseFxDirective::ngOnChanges should be overridden in subclass: " + change);
    };
    BaseFxDirective.prototype.ngOnDestroy = function () {
        if (this._mqActivation) {
            this._mqActivation.destroy();
        }
        this._mediaMonitor = null;
    };
    BaseFxDirective.prototype._getDefaultVal = function (key, fallbackVal) {
        var val = this._queryInput(key);
        var hasDefaultVal = (val !== undefined && val !== null);
        return (hasDefaultVal && val !== '') ? val : fallbackVal;
    };
    BaseFxDirective.prototype._getDisplayStyle = function (source) {
        var element = source || this.nativeElement;
        return lookupStyle(element, 'display');
    };
    BaseFxDirective.prototype._getFlowDirection = function (target, addIfMissing) {
        if (addIfMissing === void 0) { addIfMissing = false; }
        var value = 'row';
        if (target) {
            value = lookupStyle(target, 'flex-direction') || 'row';
            var hasInlineValue = lookupInlineStyle(target, 'flex-direction');
            if (!hasInlineValue && addIfMissing) {
                applyStyleToElements(this._renderer, buildLayoutCSS(value), [target]);
            }
        }
        return value.trim();
    };
    BaseFxDirective.prototype._applyStyleToElement = function (style, value, nativeElement) {
        var element = nativeElement || this.nativeElement;
        applyStyleToElement(this._renderer, element, style, value);
    };
    BaseFxDirective.prototype._applyStyleToElements = function (style, elements) {
        applyStyleToElements(this._renderer, style, elements || []);
    };
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
    BaseFxDirective.prototype._listenForMediaQueryChanges = function (key, defaultValue, onMediaQueryChange) {
        if (!this._mqActivation) {
            var keyOptions = new KeyOptions(key, defaultValue, this._inputMap);
            this._mqActivation = new ResponsiveActivation(keyOptions, this._mediaMonitor, function (change) { return onMediaQueryChange(change); });
        }
        return this._mqActivation;
    };
    Object.defineProperty(BaseFxDirective.prototype, "childrenNodes", {
        get: function () {
            var obj = this.nativeElement.children;
            var buffer = [];
            for (var i = obj.length; i--;) {
                buffer[i] = obj[i];
            }
            return buffer;
        },
        enumerable: true,
        configurable: true
    });
    BaseFxDirective.prototype.hasKeyValue = function (key) {
        return this._mqActivation.hasKeyValue(key);
    };
    Object.defineProperty(BaseFxDirective.prototype, "hasInitialized", {
        get: function () {
            return this._hasInitialized;
        },
        enumerable: true,
        configurable: true
    });
    return BaseFxDirective;
}());
var BaseFxDirectiveAdapter = (function (_super) {
    __extends(BaseFxDirectiveAdapter, _super);
    function BaseFxDirectiveAdapter(_baseKey, _mediaMonitor, _elementRef, _renderer) {
        var _this = _super.call(this, _mediaMonitor, _elementRef, _renderer) || this;
        _this._baseKey = _baseKey;
        _this._mediaMonitor = _mediaMonitor;
        _this._elementRef = _elementRef;
        _this._renderer = _renderer;
        return _this;
    }
    Object.defineProperty(BaseFxDirectiveAdapter.prototype, "activeKey", {
        get: function () {
            var mqa = this._mqActivation;
            var key = mqa ? mqa.activatedInputKey : this._baseKey;
            return (key === 'class') ? 'klazz' : key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFxDirectiveAdapter.prototype, "inputMap", {
        get: function () {
            return this._inputMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFxDirectiveAdapter.prototype, "mqActivation", {
        get: function () {
            return this._mqActivation;
        },
        enumerable: true,
        configurable: true
    });
    BaseFxDirectiveAdapter.prototype.queryInput = function (key) {
        return key ? this._queryInput(key) : undefined;
    };
    BaseFxDirectiveAdapter.prototype.cacheInput = function (key, source, cacheRaw) {
        if (cacheRaw === void 0) { cacheRaw = false; }
        if (cacheRaw) {
            this._cacheInputRaw(key, source);
        }
        else if (Array.isArray(source)) {
            this._cacheInputArray(key, source);
        }
        else if (typeof source === 'object') {
            this._cacheInputObject(key, source);
        }
        else if (typeof source === 'string') {
            this._cacheInputString(key, source);
        }
        else {
            throw new Error('Invalid class value provided. Did you want to cache the raw value?');
        }
    };
    BaseFxDirectiveAdapter.prototype.listenForMediaQueryChanges = function (key, defaultValue, onMediaQueryChange) {
        return this._listenForMediaQueryChanges(key, defaultValue, onMediaQueryChange);
    };
    BaseFxDirectiveAdapter.prototype._cacheInputRaw = function (key, source) {
        this._inputMap[key] = source;
    };
    BaseFxDirectiveAdapter.prototype._cacheInputArray = function (key, source) {
        if (key === void 0) { key = ''; }
        this._inputMap[key] = source.join(' ');
    };
    BaseFxDirectiveAdapter.prototype._cacheInputObject = function (key, source) {
        if (key === void 0) { key = ''; }
        var classes = [];
        for (var prop in source) {
            if (!!source[prop]) {
                classes.push(prop);
            }
        }
        this._inputMap[key] = classes.join(' ');
    };
    BaseFxDirectiveAdapter.prototype._cacheInputString = function (key, source) {
        if (key === void 0) { key = ''; }
        this._inputMap[key] = source;
    };
    return BaseFxDirectiveAdapter;
}(BaseFxDirective));
var BREAKPOINTS = new _angular_core.InjectionToken('Token (@angular/flex-layout) Breakpoints');
var BreakPointRegistry = (function () {
    function BreakPointRegistry(_registry) {
        this._registry = _registry;
    }
    Object.defineProperty(BreakPointRegistry.prototype, "items", {
        get: function () {
            return this._registry.slice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BreakPointRegistry.prototype, "sortedItems", {
        get: function () {
            var overlaps = this._registry.filter(function (it) { return it.overlapping === true; });
            var nonOverlaps = this._registry.filter(function (it) { return it.overlapping !== true; });
            return overlaps.concat(nonOverlaps);
        },
        enumerable: true,
        configurable: true
    });
    BreakPointRegistry.prototype.findByAlias = function (alias) {
        return this._registry.find(function (bp) { return bp.alias == alias; });
    };
    BreakPointRegistry.prototype.findByQuery = function (query) {
        return this._registry.find(function (bp) { return bp.mediaQuery == query; });
    };
    Object.defineProperty(BreakPointRegistry.prototype, "overlappings", {
        get: function () {
            return this._registry.filter(function (it) { return it.overlapping == true; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BreakPointRegistry.prototype, "aliases", {
        get: function () {
            return this._registry.map(function (it) { return it.alias; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BreakPointRegistry.prototype, "suffixes", {
        get: function () {
            return this._registry.map(function (it) { return it.suffix; });
        },
        enumerable: true,
        configurable: true
    });
    return BreakPointRegistry;
}());
BreakPointRegistry.decorators = [
    { type: _angular_core.Injectable },
];
BreakPointRegistry.ctorParameters = function () { return [
    { type: Array, decorators: [{ type: _angular_core.Inject, args: [BREAKPOINTS,] },] },
]; };
var MediaChange = (function () {
    function MediaChange(matches, mediaQuery, mqAlias, suffix) {
        if (matches === void 0) { matches = false; }
        if (mediaQuery === void 0) { mediaQuery = 'all'; }
        if (mqAlias === void 0) { mqAlias = ''; }
        if (suffix === void 0) { suffix = ''; }
        this.matches = matches;
        this.mediaQuery = mediaQuery;
        this.mqAlias = mqAlias;
        this.suffix = suffix;
    }
    MediaChange.prototype.clone = function () {
        return new MediaChange(this.matches, this.mediaQuery, this.mqAlias, this.suffix);
    };
    return MediaChange;
}());
var MatchMedia = (function () {
    function MatchMedia(_zone, _document) {
        this._zone = _zone;
        this._document = _document;
        this._registry = new Map();
        this._source = new rxjs_BehaviorSubject.BehaviorSubject(new MediaChange(true));
        this._observable$ = this._source.asObservable();
    }
    MatchMedia.prototype.isActive = function (mediaQuery) {
        if (this._registry.has(mediaQuery)) {
            var mql = this._registry.get(mediaQuery);
            return mql.matches;
        }
        return false;
    };
    MatchMedia.prototype.observe = function (mediaQuery) {
        this.registerQuery(mediaQuery);
        return rxjs_operator_filter.filter.call(this._observable$, function (change) {
            return mediaQuery ? (change.mediaQuery === mediaQuery) : true;
        });
    };
    MatchMedia.prototype.registerQuery = function (mediaQuery) {
        var _this = this;
        var list = normalizeQuery(mediaQuery);
        if (list.length > 0) {
            prepareQueryCSS(list, this._document);
            list.forEach(function (query) {
                var mql = _this._registry.get(query);
                var onMQLEvent = function (e) {
                    _this._zone.run(function () {
                        var change = new MediaChange(e.matches, query);
                        _this._source.next(change);
                    });
                };
                if (!mql) {
                    mql = _this._buildMQL(query);
                    mql.addListener(onMQLEvent);
                    _this._registry.set(query, mql);
                }
                if (mql.matches) {
                    onMQLEvent(mql);
                }
            });
        }
    };
    MatchMedia.prototype._buildMQL = function (query) {
        var canListen = isBrowser() && !!((window)).matchMedia('all').addListener;
        return canListen ? ((window)).matchMedia(query) : ({
            matches: query === 'all' || query === '',
            media: query,
            addListener: function () {
            },
            removeListener: function () {
            }
        });
    };
    return MatchMedia;
}());
MatchMedia.decorators = [
    { type: _angular_core.Injectable },
];
MatchMedia.ctorParameters = function () { return [
    { type: _angular_core.NgZone, },
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_platformBrowser.DOCUMENT,] },] },
]; };
function isBrowser() {
    return _angular_platformBrowser.ɵgetDOM().supportsDOMEvents();
}
var ALL_STYLES = {};
function prepareQueryCSS(mediaQueries, _document) {
    var list = mediaQueries.filter(function (it) { return !ALL_STYLES[it]; });
    if (list.length > 0) {
        var query = list.join(', ');
        try {
            var styleEl_1 = _angular_platformBrowser.ɵgetDOM().createElement('style');
            _angular_platformBrowser.ɵgetDOM().setAttribute(styleEl_1, 'type', 'text/css');
            if (!styleEl_1['styleSheet']) {
                var cssText = "/*\n  @angular/flex-layout - workaround for possible browser quirk with mediaQuery listeners\n  see http://bit.ly/2sd4HMP\n*/\n@media " + query + " {.fx-query-test{ }}";
                _angular_platformBrowser.ɵgetDOM().appendChild(styleEl_1, _angular_platformBrowser.ɵgetDOM().createTextNode(cssText));
            }
            _angular_platformBrowser.ɵgetDOM().appendChild(_document.head, styleEl_1);
            list.forEach(function (mq) { return ALL_STYLES[mq] = styleEl_1; });
        }
        catch (e) {
            console.error(e);
        }
    }
}
function normalizeQuery(mediaQuery) {
    return (typeof mediaQuery === 'undefined') ? [] :
        (typeof mediaQuery === 'string') ? [mediaQuery] : unique((mediaQuery));
}
function unique(list) {
    var seen = {};
    return list.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
function mergeAlias(dest, source) {
    return extendObject(dest, source ? {
        mqAlias: source.alias,
        suffix: source.suffix
    } : {});
}
var MediaMonitor = (function () {
    function MediaMonitor(_breakpoints, _matchMedia) {
        this._breakpoints = _breakpoints;
        this._matchMedia = _matchMedia;
        this._registerBreakpoints();
    }
    Object.defineProperty(MediaMonitor.prototype, "breakpoints", {
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
    MediaMonitor.prototype.isActive = function (alias) {
        var bp = this._breakpoints.findByAlias(alias) || this._breakpoints.findByQuery(alias);
        return this._matchMedia.isActive(bp ? bp.mediaQuery : alias);
    };
    MediaMonitor.prototype.observe = function (alias) {
        var bp = this._breakpoints.findByAlias(alias) || this._breakpoints.findByQuery(alias);
        var hasAlias = function (change) { return (bp ? change.mqAlias !== '' : true); };
        var media$ = this._matchMedia.observe(bp ? bp.mediaQuery : alias);
        return rxjs_operator_filter.filter.call(rxjs_operator_map.map.call(media$, function (change) { return mergeAlias(change, bp); }), hasAlias);
    };
    MediaMonitor.prototype._registerBreakpoints = function () {
        var queries = this._breakpoints.sortedItems.map(function (bp) { return bp.mediaQuery; });
        this._matchMedia.registerQuery(queries);
    };
    return MediaMonitor;
}());
MediaMonitor.decorators = [
    { type: _angular_core.Injectable },
];
MediaMonitor.ctorParameters = function () { return [
    { type: BreakPointRegistry, },
    { type: MatchMedia, },
]; };
var LayoutDirective = (function (_super) {
    __extends(LayoutDirective, _super);
    function LayoutDirective(monitor, elRef, renderer) {
        var _this = _super.call(this, monitor, elRef, renderer) || this;
        _this._announcer = new rxjs_BehaviorSubject.BehaviorSubject('row');
        _this.layout$ = _this._announcer.asObservable();
        return _this;
    }
    Object.defineProperty(LayoutDirective.prototype, "layout", {
        set: function (val) { this._cacheInput('layout', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutXs", {
        set: function (val) { this._cacheInput('layoutXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutSm", {
        set: function (val) { this._cacheInput('layoutSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutMd", {
        set: function (val) { this._cacheInput('layoutMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutLg", {
        set: function (val) { this._cacheInput('layoutLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutXl", {
        set: function (val) { this._cacheInput('layoutXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutGtXs", {
        set: function (val) { this._cacheInput('layoutGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutGtSm", {
        set: function (val) { this._cacheInput('layoutGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutGtMd", {
        set: function (val) { this._cacheInput('layoutGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutGtLg", {
        set: function (val) { this._cacheInput('layoutGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutLtSm", {
        set: function (val) { this._cacheInput('layoutLtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutLtMd", {
        set: function (val) { this._cacheInput('layoutLtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutLtLg", {
        set: function (val) { this._cacheInput('layoutLtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutDirective.prototype, "layoutLtXl", {
        set: function (val) { this._cacheInput('layoutLtXl', val); },
        enumerable: true,
        configurable: true
    });
    
    LayoutDirective.prototype.ngOnChanges = function (changes) {
        if (changes['layout'] != null || this._mqActivation) {
            this._updateWithDirection();
        }
    };
    LayoutDirective.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this._listenForMediaQueryChanges('layout', 'row', function (changes) {
            _this._updateWithDirection(changes.value);
        });
        this._updateWithDirection();
    };
    LayoutDirective.prototype._updateWithDirection = function (value) {
        value = value || this._queryInput('layout') || 'row';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        var css = buildLayoutCSS(value);
        this._applyStyleToElement(css);
        this._announcer.next(css['flex-direction']);
    };
    return LayoutDirective;
}(BaseFxDirective));
LayoutDirective.decorators = [
    { type: _angular_core.Directive, args: [{ selector: "\n  [fxLayout],\n  [fxLayout.xs], [fxLayout.sm], [fxLayout.md], [fxLayout.lg], [fxLayout.xl],\n  [fxLayout.lt-sm], [fxLayout.lt-md], [fxLayout.lt-lg], [fxLayout.lt-xl],\n  [fxLayout.gt-xs], [fxLayout.gt-sm], [fxLayout.gt-md], [fxLayout.gt-lg]\n" },] },
];
LayoutDirective.ctorParameters = function () { return [
    { type: MediaMonitor, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
]; };
LayoutDirective.propDecorators = {
    'layout': [{ type: _angular_core.Input, args: ['fxLayout',] },],
    'layoutXs': [{ type: _angular_core.Input, args: ['fxLayout.xs',] },],
    'layoutSm': [{ type: _angular_core.Input, args: ['fxLayout.sm',] },],
    'layoutMd': [{ type: _angular_core.Input, args: ['fxLayout.md',] },],
    'layoutLg': [{ type: _angular_core.Input, args: ['fxLayout.lg',] },],
    'layoutXl': [{ type: _angular_core.Input, args: ['fxLayout.xl',] },],
    'layoutGtXs': [{ type: _angular_core.Input, args: ['fxLayout.gt-xs',] },],
    'layoutGtSm': [{ type: _angular_core.Input, args: ['fxLayout.gt-sm',] },],
    'layoutGtMd': [{ type: _angular_core.Input, args: ['fxLayout.gt-md',] },],
    'layoutGtLg': [{ type: _angular_core.Input, args: ['fxLayout.gt-lg',] },],
    'layoutLtSm': [{ type: _angular_core.Input, args: ['fxLayout.lt-sm',] },],
    'layoutLtMd': [{ type: _angular_core.Input, args: ['fxLayout.lt-md',] },],
    'layoutLtLg': [{ type: _angular_core.Input, args: ['fxLayout.lt-lg',] },],
    'layoutLtXl': [{ type: _angular_core.Input, args: ['fxLayout.lt-xl',] },],
};
var LayoutAlignDirective = (function (_super) {
    __extends(LayoutAlignDirective, _super);
    function LayoutAlignDirective(monitor, elRef, renderer, container) {
        var _this = _super.call(this, monitor, elRef, renderer) || this;
        _this._layout = 'row';
        if (container) {
            _this._layoutWatcher = container.layout$.subscribe(_this._onLayoutChange.bind(_this));
        }
        return _this;
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
    Object.defineProperty(LayoutAlignDirective.prototype, "alignSm", {
        set: function (val) { this._cacheInput('alignSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignMd", {
        set: function (val) { this._cacheInput('alignMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignLg", {
        set: function (val) { this._cacheInput('alignLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignXl", {
        set: function (val) { this._cacheInput('alignXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignGtXs", {
        set: function (val) { this._cacheInput('alignGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignGtSm", {
        set: function (val) { this._cacheInput('alignGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignGtMd", {
        set: function (val) { this._cacheInput('alignGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignGtLg", {
        set: function (val) { this._cacheInput('alignGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignLtSm", {
        set: function (val) { this._cacheInput('alignLtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignLtMd", {
        set: function (val) { this._cacheInput('alignLtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignLtLg", {
        set: function (val) { this._cacheInput('alignLtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutAlignDirective.prototype, "alignLtXl", {
        set: function (val) { this._cacheInput('alignLtXl', val); },
        enumerable: true,
        configurable: true
    });
    
    LayoutAlignDirective.prototype.ngOnChanges = function (changes) {
        if (changes['align'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    LayoutAlignDirective.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
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
    LayoutAlignDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput('align') || 'start stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
        this._allowStretching(value, !this._layout ? 'row' : this._layout);
    };
    LayoutAlignDirective.prototype._onLayoutChange = function (direction) {
        var _this = this;
        this._layout = (direction || '').toLowerCase();
        if (!LAYOUT_VALUES.find(function (x) { return x === _this._layout; })) {
            this._layout = 'row';
        }
        var value = this._queryInput('align') || 'start stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._allowStretching(value, this._layout || 'row');
    };
    LayoutAlignDirective.prototype._buildCSS = function (align) {
        var css = {}, _a = align.split(' '), main_axis = _a[0], cross_axis = _a[1];
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
            case 'flex-end':
                css['justify-content'] = 'flex-end';
                break;
            case 'start':
            case 'flex-start':
            default:
                css['justify-content'] = 'flex-start';
                break;
        }
        switch (cross_axis) {
            case 'start':
            case 'flex-start':
                css['align-items'] = css['align-content'] = 'flex-start';
                break;
            case 'baseline':
                css['align-items'] = 'baseline';
                break;
            case 'center':
                css['align-items'] = css['align-content'] = 'center';
                break;
            case 'end':
            case 'flex-end':
                css['align-items'] = css['align-content'] = 'flex-end';
                break;
            case 'stretch':
            default:
                css['align-items'] = css['align-content'] = 'stretch';
                break;
        }
        return extendObject(css, {
            'display': 'flex',
            'flex-direction': this._layout || 'row',
            'box-sizing': 'border-box'
        });
    };
    LayoutAlignDirective.prototype._allowStretching = function (align, layout) {
        var _a = align.split(' '), cross_axis = _a[1];
        if (cross_axis == 'stretch') {
            this._applyStyleToElement({
                'box-sizing': 'border-box',
                'max-width': !isFlowHorizontal(layout) ? '100%' : null,
                'max-height': isFlowHorizontal(layout) ? '100%' : null
            });
        }
    };
    return LayoutAlignDirective;
}(BaseFxDirective));
LayoutAlignDirective.decorators = [
    { type: _angular_core.Directive, args: [{ selector: "\n  [fxLayoutAlign],\n  [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md], [fxLayoutAlign.lg],[fxLayoutAlign.xl],\n  [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md], [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl],\n  [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm], [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]\n" },] },
];
LayoutAlignDirective.ctorParameters = function () { return [
    { type: MediaMonitor, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: LayoutDirective, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self },] },
]; };
LayoutAlignDirective.propDecorators = {
    'align': [{ type: _angular_core.Input, args: ['fxLayoutAlign',] },],
    'alignXs': [{ type: _angular_core.Input, args: ['fxLayoutAlign.xs',] },],
    'alignSm': [{ type: _angular_core.Input, args: ['fxLayoutAlign.sm',] },],
    'alignMd': [{ type: _angular_core.Input, args: ['fxLayoutAlign.md',] },],
    'alignLg': [{ type: _angular_core.Input, args: ['fxLayoutAlign.lg',] },],
    'alignXl': [{ type: _angular_core.Input, args: ['fxLayoutAlign.xl',] },],
    'alignGtXs': [{ type: _angular_core.Input, args: ['fxLayoutAlign.gt-xs',] },],
    'alignGtSm': [{ type: _angular_core.Input, args: ['fxLayoutAlign.gt-sm',] },],
    'alignGtMd': [{ type: _angular_core.Input, args: ['fxLayoutAlign.gt-md',] },],
    'alignGtLg': [{ type: _angular_core.Input, args: ['fxLayoutAlign.gt-lg',] },],
    'alignLtSm': [{ type: _angular_core.Input, args: ['fxLayoutAlign.lt-sm',] },],
    'alignLtMd': [{ type: _angular_core.Input, args: ['fxLayoutAlign.lt-md',] },],
    'alignLtLg': [{ type: _angular_core.Input, args: ['fxLayoutAlign.lt-lg',] },],
    'alignLtXl': [{ type: _angular_core.Input, args: ['fxLayoutAlign.lt-xl',] },],
};
var LayoutGapDirective = (function (_super) {
    __extends(LayoutGapDirective, _super);
    function LayoutGapDirective(monitor, elRef, renderer, container, _zone) {
        var _this = _super.call(this, monitor, elRef, renderer) || this;
        _this._zone = _zone;
        _this._layout = 'row';
        if (container) {
            _this._layoutWatcher = container.layout$.subscribe(_this._onLayoutChange.bind(_this));
        }
        return _this;
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
    Object.defineProperty(LayoutGapDirective.prototype, "gapSm", {
        set: function (val) { this._cacheInput('gapSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapMd", {
        set: function (val) { this._cacheInput('gapMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapLg", {
        set: function (val) { this._cacheInput('gapLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapXl", {
        set: function (val) { this._cacheInput('gapXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapGtXs", {
        set: function (val) { this._cacheInput('gapGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapGtSm", {
        set: function (val) { this._cacheInput('gapGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapGtMd", {
        set: function (val) { this._cacheInput('gapGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapGtLg", {
        set: function (val) { this._cacheInput('gapGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapLtSm", {
        set: function (val) { this._cacheInput('gapLtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapLtMd", {
        set: function (val) { this._cacheInput('gapLtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapLtLg", {
        set: function (val) { this._cacheInput('gapLtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutGapDirective.prototype, "gapLtXl", {
        set: function (val) { this._cacheInput('gapLtXl', val); },
        enumerable: true,
        configurable: true
    });
    
    LayoutGapDirective.prototype.ngOnChanges = function (changes) {
        if (changes['gap'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    LayoutGapDirective.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._watchContentChanges();
        this._listenForMediaQueryChanges('gap', '0', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    LayoutGapDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
        if (this._observer) {
            this._observer.disconnect();
        }
    };
    LayoutGapDirective.prototype._watchContentChanges = function () {
        var _this = this;
        this._zone.runOutsideAngular(function () {
            if (typeof MutationObserver !== 'undefined') {
                _this._observer = new MutationObserver(function (mutations) {
                    var validatedChanges = function (it) {
                        return (it.addedNodes && it.addedNodes.length > 0) ||
                            (it.removedNodes && it.removedNodes.length > 0);
                    };
                    if (mutations.some(validatedChanges)) {
                        _this._updateWithValue();
                    }
                });
                _this._observer.observe(_this.nativeElement, { childList: true });
            }
        });
    };
    LayoutGapDirective.prototype._onLayoutChange = function (direction) {
        var _this = this;
        this._layout = (direction || '').toLowerCase();
        if (!LAYOUT_VALUES.find(function (x) { return x === _this._layout; })) {
            this._layout = 'row';
        }
        this._updateWithValue();
    };
    LayoutGapDirective.prototype._updateWithValue = function (value) {
        var _this = this;
        value = value || this._queryInput('gap') || '0';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        var items = this.childrenNodes
            .filter(function (el) { return el.nodeType === 1 && _this._getDisplayStyle(el) != 'none'; });
        var numItems = items.length;
        if (numItems > 1) {
            var lastItem = items[numItems - 1];
            items = items.filter(function (_, j) { return j < numItems - 1; });
            this._applyStyleToElements(this._buildCSS(value), items);
            this._applyStyleToElements(this._buildCSS(), [lastItem]);
        }
    };
    LayoutGapDirective.prototype._buildCSS = function (value) {
        if (value === void 0) { value = null; }
        var key, margins = {
            'margin-left': null,
            'margin-right': null,
            'margin-top': null,
            'margin-bottom': null
        };
        switch (this._layout) {
            case 'column':
            case 'column-reverse':
                key = 'margin-bottom';
                break;
            case 'row':
            case 'row-reverse':
            default:
                key = 'margin-right';
                break;
        }
        margins[key] = value;
        return margins;
    };
    return LayoutGapDirective;
}(BaseFxDirective));
LayoutGapDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: "\n  [fxLayoutGap],\n  [fxLayoutGap.xs], [fxLayoutGap.sm], [fxLayoutGap.md], [fxLayoutGap.lg], [fxLayoutGap.xl],\n  [fxLayoutGap.lt-sm], [fxLayoutGap.lt-md], [fxLayoutGap.lt-lg], [fxLayoutGap.lt-xl],\n  [fxLayoutGap.gt-xs], [fxLayoutGap.gt-sm], [fxLayoutGap.gt-md], [fxLayoutGap.gt-lg]\n"
            },] },
];
LayoutGapDirective.ctorParameters = function () { return [
    { type: MediaMonitor, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: LayoutDirective, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self },] },
    { type: _angular_core.NgZone, },
]; };
LayoutGapDirective.propDecorators = {
    'gap': [{ type: _angular_core.Input, args: ['fxLayoutGap',] },],
    'gapXs': [{ type: _angular_core.Input, args: ['fxLayoutGap.xs',] },],
    'gapSm': [{ type: _angular_core.Input, args: ['fxLayoutGap.sm',] },],
    'gapMd': [{ type: _angular_core.Input, args: ['fxLayoutGap.md',] },],
    'gapLg': [{ type: _angular_core.Input, args: ['fxLayoutGap.lg',] },],
    'gapXl': [{ type: _angular_core.Input, args: ['fxLayoutGap.xl',] },],
    'gapGtXs': [{ type: _angular_core.Input, args: ['fxLayoutGap.gt-xs',] },],
    'gapGtSm': [{ type: _angular_core.Input, args: ['fxLayoutGap.gt-sm',] },],
    'gapGtMd': [{ type: _angular_core.Input, args: ['fxLayoutGap.gt-md',] },],
    'gapGtLg': [{ type: _angular_core.Input, args: ['fxLayoutGap.gt-lg',] },],
    'gapLtSm': [{ type: _angular_core.Input, args: ['fxLayoutGap.lt-sm',] },],
    'gapLtMd': [{ type: _angular_core.Input, args: ['fxLayoutGap.lt-md',] },],
    'gapLtLg': [{ type: _angular_core.Input, args: ['fxLayoutGap.lt-lg',] },],
    'gapLtXl': [{ type: _angular_core.Input, args: ['fxLayoutGap.lt-xl',] },],
};
var LayoutWrapDirective = (function (_super) {
    __extends(LayoutWrapDirective, _super);
    function LayoutWrapDirective(monitor, elRef, renderer, container) {
        var _this = _super.call(this, monitor, elRef, renderer) || this;
        _this._layout = 'row';
        if (container) {
            _this._layoutWatcher = container.layout$.subscribe(_this._onLayoutChange.bind(_this));
        }
        return _this;
    }
    Object.defineProperty(LayoutWrapDirective.prototype, "wrap", {
        set: function (val) { this._cacheInput('wrap', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapXs", {
        set: function (val) { this._cacheInput('wrapXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapSm", {
        set: function (val) { this._cacheInput('wrapSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapMd", {
        set: function (val) { this._cacheInput('wrapMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapLg", {
        set: function (val) { this._cacheInput('wrapLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapXl", {
        set: function (val) { this._cacheInput('wrapXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapGtXs", {
        set: function (val) { this._cacheInput('wrapGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapGtSm", {
        set: function (val) { this._cacheInput('wrapGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapGtMd", {
        set: function (val) { this._cacheInput('wrapGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapGtLg", {
        set: function (val) { this._cacheInput('wrapGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapLtSm", {
        set: function (val) { this._cacheInput('wrapLtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapLtMd", {
        set: function (val) { this._cacheInput('wrapLtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapLtLg", {
        set: function (val) { this._cacheInput('wrapLtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(LayoutWrapDirective.prototype, "wrapLtXl", {
        set: function (val) { this._cacheInput('wrapLtXl', val); },
        enumerable: true,
        configurable: true
    });
    
    LayoutWrapDirective.prototype.ngOnChanges = function (changes) {
        if (changes['wrap'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    LayoutWrapDirective.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this._listenForMediaQueryChanges('wrap', 'wrap', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    LayoutWrapDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    };
    LayoutWrapDirective.prototype._onLayoutChange = function (direction) {
        var _this = this;
        this._layout = (direction || '').toLowerCase().replace('-reverse', '');
        if (!LAYOUT_VALUES.find(function (x) { return x === _this._layout; })) {
            this._layout = 'row';
        }
        this._updateWithValue();
    };
    LayoutWrapDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput('wrap');
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        value = validateWrapValue(value || 'wrap');
        this._applyStyleToElement(this._buildCSS(value));
    };
    LayoutWrapDirective.prototype._buildCSS = function (value) {
        return {
            'display': 'flex',
            'flex-wrap': value,
            'flex-direction': this.flowDirection
        };
    };
    Object.defineProperty(LayoutWrapDirective.prototype, "flowDirection", {
        get: function () {
            var _this = this;
            var computeFlowDirection = function () { return _this._getFlowDirection(_this.nativeElement); };
            return this._layoutWatcher ? this._layout : computeFlowDirection();
        },
        enumerable: true,
        configurable: true
    });
    return LayoutWrapDirective;
}(BaseFxDirective));
LayoutWrapDirective.decorators = [
    { type: _angular_core.Directive, args: [{ selector: "\n  [fxLayoutWrap], [fxLayoutWrap.xs], [fxLayoutWrap.sm], [fxLayoutWrap.lg], [fxLayoutWrap.xl],\n  [fxLayoutWrap.gt-xs], [fxLayoutWrap.gt-sm], [fxLayoutWrap.gt-md], [fxLayoutWrap.gt-lg],\n  [fxLayoutWrap.lt-xs], [fxLayoutWrap.lt-sm], [fxLayoutWrap.lt-md], [fxLayoutWrap.lt-lg]\n" },] },
];
LayoutWrapDirective.ctorParameters = function () { return [
    { type: MediaMonitor, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: LayoutDirective, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self },] },
]; };
LayoutWrapDirective.propDecorators = {
    'wrap': [{ type: _angular_core.Input, args: ['fxLayoutWrap',] },],
    'wrapXs': [{ type: _angular_core.Input, args: ['fxLayoutWrap.xs',] },],
    'wrapSm': [{ type: _angular_core.Input, args: ['fxLayoutWrap.sm',] },],
    'wrapMd': [{ type: _angular_core.Input, args: ['fxLayoutWrap.md',] },],
    'wrapLg': [{ type: _angular_core.Input, args: ['fxLayoutWrap.lg',] },],
    'wrapXl': [{ type: _angular_core.Input, args: ['fxLayoutWrap.xl',] },],
    'wrapGtXs': [{ type: _angular_core.Input, args: ['fxLayoutWrap.gt-xs',] },],
    'wrapGtSm': [{ type: _angular_core.Input, args: ['fxLayoutWrap.gt-sm',] },],
    'wrapGtMd': [{ type: _angular_core.Input, args: ['fxLayoutWrap.gt-md',] },],
    'wrapGtLg': [{ type: _angular_core.Input, args: ['fxLayoutWrap.gt-lg',] },],
    'wrapLtSm': [{ type: _angular_core.Input, args: ['fxLayoutWrap.lt-sm',] },],
    'wrapLtMd': [{ type: _angular_core.Input, args: ['fxLayoutWrap.lt-md',] },],
    'wrapLtLg': [{ type: _angular_core.Input, args: ['fxLayoutWrap.lt-lg',] },],
    'wrapLtXl': [{ type: _angular_core.Input, args: ['fxLayoutWrap.lt-xl',] },],
};
function validateBasis(basis, grow, shrink) {
    if (grow === void 0) { grow = '1'; }
    if (shrink === void 0) { shrink = '1'; }
    var parts = [grow, shrink, basis];
    var j = basis.indexOf('calc');
    if (j > 0) {
        parts[2] = _validateCalcValue(basis.substring(j).trim());
        var matches = basis.substr(0, j).trim().split(' ');
        if (matches.length == 2) {
            parts[0] = matches[0];
            parts[1] = matches[1];
        }
    }
    else if (j == 0) {
        parts[2] = _validateCalcValue(basis.trim());
    }
    else {
        var matches = basis.split(' ');
        parts = (matches.length === 3) ? matches : [
            grow, shrink, basis
        ];
    }
    return parts;
}
function _validateCalcValue(calc) {
    return calc.replace(/[\s]/g, '').replace(/[\/\*\+\-]/g, ' $& ');
}
var FlexDirective = (function (_super) {
    __extends(FlexDirective, _super);
    function FlexDirective(monitor, elRef, renderer, _container, _wrap) {
        var _this = _super.call(this, monitor, elRef, renderer) || this;
        _this._container = _container;
        _this._wrap = _wrap;
        _this._layout = 'row';
        _this._cacheInput('flex', '');
        _this._cacheInput('shrink', 1);
        _this._cacheInput('grow', 1);
        if (_container) {
            _this._layoutWatcher = _container.layout$.subscribe(function (direction) {
                _this._onLayoutChange(direction);
            });
        }
        return _this;
    }
    Object.defineProperty(FlexDirective.prototype, "shrink", {
        set: function (val) { this._cacheInput('shrink', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "grow", {
        set: function (val) { this._cacheInput('grow', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flex", {
        set: function (val) { this._cacheInput('flex', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexXs", {
        set: function (val) { this._cacheInput('flexXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexSm", {
        set: function (val) { this._cacheInput('flexSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexMd", {
        set: function (val) { this._cacheInput('flexMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexLg", {
        set: function (val) { this._cacheInput('flexLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexXl", {
        set: function (val) { this._cacheInput('flexXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexGtXs", {
        set: function (val) { this._cacheInput('flexGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexGtSm", {
        set: function (val) { this._cacheInput('flexGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexGtMd", {
        set: function (val) { this._cacheInput('flexGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexGtLg", {
        set: function (val) { this._cacheInput('flexGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexLtSm", {
        set: function (val) { this._cacheInput('flexLtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexLtMd", {
        set: function (val) { this._cacheInput('flexLtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexLtLg", {
        set: function (val) { this._cacheInput('flexLtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexDirective.prototype, "flexLtXl", {
        set: function (val) { this._cacheInput('flexLtXl', val); },
        enumerable: true,
        configurable: true
    });
    
    FlexDirective.prototype.ngOnChanges = function (changes) {
        if (changes['flex'] != null || this._mqActivation) {
            this._updateStyle();
        }
    };
    FlexDirective.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this._listenForMediaQueryChanges('flex', '', function (changes) {
            _this._updateStyle(changes.value);
        });
        this._updateStyle();
    };
    FlexDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    };
    FlexDirective.prototype._onLayoutChange = function (direction) {
        this._layout = direction || this._layout || 'row';
        this._updateStyle();
    };
    FlexDirective.prototype._updateStyle = function (value) {
        var flexBasis = value || this._queryInput('flex') || '';
        if (this._mqActivation) {
            flexBasis = this._mqActivation.activatedInput;
        }
        var basis = String(flexBasis).replace(';', '');
        var parts = validateBasis(basis, this._queryInput('grow'), this._queryInput('shrink'));
        this._applyStyleToElement(this._validateValue.apply(this, parts));
    };
    FlexDirective.prototype._validateValue = function (grow, shrink, basis) {
        var layout = this._getFlowDirection(this.parentElement, true);
        var direction = (layout.indexOf('column') > -1) ? 'column' : 'row';
        var css, isValue;
        grow = (grow == '0') ? 0 : grow;
        shrink = (shrink == '0') ? 0 : shrink;
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
            case 'initial':
            case 'nogrow':
                grow = 0;
                css = extendObject(clearStyles, { 'flex': '0 1 auto' });
                break;
            case 'grow':
                css = extendObject(clearStyles, { 'flex': '1 1 100%' });
                break;
            case 'noshrink':
                shrink = 0;
                css = extendObject(clearStyles, { 'flex': '1 0 auto' });
                break;
            case 'auto':
                css = extendObject(clearStyles, { 'flex': grow + " " + shrink + " auto" });
                break;
            case 'none':
                grow = 0;
                shrink = 0;
                css = extendObject(clearStyles, { 'flex': '0 0 auto' });
                break;
            default:
                var hasCalc = String(basis).indexOf('calc') > -1;
                var isPercent = String(basis).indexOf('%') > -1 && !hasCalc;
                isValue = hasCalc ||
                    String(basis).indexOf('px') > -1 ||
                    String(basis).indexOf('em') > -1 ||
                    String(basis).indexOf('vw') > -1 ||
                    String(basis).indexOf('vh') > -1;
                if (!isValue && !isPercent && !isNaN((basis))) {
                    basis = basis + '%';
                }
                if (basis === '0px') {
                    basis = '0%';
                }
                css = extendObject(clearStyles, {
                    'flex': grow + " " + shrink + " " + ((isValue || this._wrap) ? basis : '100%'),
                });
                break;
        }
        var max = isFlowHorizontal(direction) ? 'max-width' : 'max-height';
        var min = isFlowHorizontal(direction) ? 'min-width' : 'min-height';
        var usingCalc = (String(basis).indexOf('calc') > -1) || (basis == 'auto');
        var isPx = String(basis).indexOf('px') > -1 || usingCalc;
        var isFixed = !grow && !shrink;
        css[min] = (basis == '0%') ? 0 : isFixed || (isPx && grow) ? basis : null;
        css[max] = (basis == '0%') ? 0 : isFixed || (!usingCalc && shrink) ? basis : null;
        return extendObject(css, { 'box-sizing': 'border-box' });
    };
    return FlexDirective;
}(BaseFxDirective));
FlexDirective.decorators = [
    { type: _angular_core.Directive, args: [{ selector: "\n  [fxFlex],\n  [fxFlex.xs], [fxFlex.sm], [fxFlex.md], [fxFlex.lg], [fxFlex.xl],\n  [fxFlex.lt-sm], [fxFlex.lt-md], [fxFlex.lt-lg], [fxFlex.lt-xl],\n  [fxFlex.gt-xs], [fxFlex.gt-sm], [fxFlex.gt-md], [fxFlex.gt-lg],\n"
            },] },
];
FlexDirective.ctorParameters = function () { return [
    { type: MediaMonitor, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: LayoutDirective, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.SkipSelf },] },
    { type: LayoutWrapDirective, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.SkipSelf },] },
]; };
FlexDirective.propDecorators = {
    'shrink': [{ type: _angular_core.Input, args: ['fxShrink',] },],
    'grow': [{ type: _angular_core.Input, args: ['fxGrow',] },],
    'flex': [{ type: _angular_core.Input, args: ['fxFlex',] },],
    'flexXs': [{ type: _angular_core.Input, args: ['fxFlex.xs',] },],
    'flexSm': [{ type: _angular_core.Input, args: ['fxFlex.sm',] },],
    'flexMd': [{ type: _angular_core.Input, args: ['fxFlex.md',] },],
    'flexLg': [{ type: _angular_core.Input, args: ['fxFlex.lg',] },],
    'flexXl': [{ type: _angular_core.Input, args: ['fxFlex.xl',] },],
    'flexGtXs': [{ type: _angular_core.Input, args: ['fxFlex.gt-xs',] },],
    'flexGtSm': [{ type: _angular_core.Input, args: ['fxFlex.gt-sm',] },],
    'flexGtMd': [{ type: _angular_core.Input, args: ['fxFlex.gt-md',] },],
    'flexGtLg': [{ type: _angular_core.Input, args: ['fxFlex.gt-lg',] },],
    'flexLtSm': [{ type: _angular_core.Input, args: ['fxFlex.lt-sm',] },],
    'flexLtMd': [{ type: _angular_core.Input, args: ['fxFlex.lt-md',] },],
    'flexLtLg': [{ type: _angular_core.Input, args: ['fxFlex.lt-lg',] },],
    'flexLtXl': [{ type: _angular_core.Input, args: ['fxFlex.lt-xl',] },],
};
var FlexAlignDirective = (function (_super) {
    __extends(FlexAlignDirective, _super);
    function FlexAlignDirective(monitor, elRef, renderer) {
        return _super.call(this, monitor, elRef, renderer) || this;
    }
    Object.defineProperty(FlexAlignDirective.prototype, "align", {
        set: function (val) { this._cacheInput('align', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignXs", {
        set: function (val) { this._cacheInput('alignXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignSm", {
        set: function (val) { this._cacheInput('alignSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignMd", {
        set: function (val) { this._cacheInput('alignMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignLg", {
        set: function (val) { this._cacheInput('alignLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignXl", {
        set: function (val) { this._cacheInput('alignXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignLtSm", {
        set: function (val) { this._cacheInput('alignLtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignLtMd", {
        set: function (val) { this._cacheInput('alignLtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignLtLg", {
        set: function (val) { this._cacheInput('alignLtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignLtXl", {
        set: function (val) { this._cacheInput('alignLtXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtXs", {
        set: function (val) { this._cacheInput('alignGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtSm", {
        set: function (val) { this._cacheInput('alignGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtMd", {
        set: function (val) { this._cacheInput('alignGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexAlignDirective.prototype, "alignGtLg", {
        set: function (val) { this._cacheInput('alignGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    FlexAlignDirective.prototype.ngOnChanges = function (changes) {
        if (changes['align'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    FlexAlignDirective.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this._listenForMediaQueryChanges('align', 'stretch', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    FlexAlignDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput('align') || 'stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    };
    FlexAlignDirective.prototype._buildCSS = function (align) {
        var css = {};
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
    return FlexAlignDirective;
}(BaseFxDirective));
FlexAlignDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: "\n  [fxFlexAlign],\n  [fxFlexAlign.xs], [fxFlexAlign.sm], [fxFlexAlign.md], [fxFlexAlign.lg], [fxFlexAlign.xl],\n  [fxFlexAlign.lt-sm], [fxFlexAlign.lt-md], [fxFlexAlign.lt-lg], [fxFlexAlign.lt-xl],\n  [fxFlexAlign.gt-xs], [fxFlexAlign.gt-sm], [fxFlexAlign.gt-md], [fxFlexAlign.gt-lg]\n"
            },] },
];
FlexAlignDirective.ctorParameters = function () { return [
    { type: MediaMonitor, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
]; };
FlexAlignDirective.propDecorators = {
    'align': [{ type: _angular_core.Input, args: ['fxFlexAlign',] },],
    'alignXs': [{ type: _angular_core.Input, args: ['fxFlexAlign.xs',] },],
    'alignSm': [{ type: _angular_core.Input, args: ['fxFlexAlign.sm',] },],
    'alignMd': [{ type: _angular_core.Input, args: ['fxFlexAlign.md',] },],
    'alignLg': [{ type: _angular_core.Input, args: ['fxFlexAlign.lg',] },],
    'alignXl': [{ type: _angular_core.Input, args: ['fxFlexAlign.xl',] },],
    'alignLtSm': [{ type: _angular_core.Input, args: ['fxFlexAlign.lt-sm',] },],
    'alignLtMd': [{ type: _angular_core.Input, args: ['fxFlexAlign.lt-md',] },],
    'alignLtLg': [{ type: _angular_core.Input, args: ['fxFlexAlign.lt-lg',] },],
    'alignLtXl': [{ type: _angular_core.Input, args: ['fxFlexAlign.lt-xl',] },],
    'alignGtXs': [{ type: _angular_core.Input, args: ['fxFlexAlign.gt-xs',] },],
    'alignGtSm': [{ type: _angular_core.Input, args: ['fxFlexAlign.gt-sm',] },],
    'alignGtMd': [{ type: _angular_core.Input, args: ['fxFlexAlign.gt-md',] },],
    'alignGtLg': [{ type: _angular_core.Input, args: ['fxFlexAlign.gt-lg',] },],
};
var FLEX_FILL_CSS = {
    'margin': 0,
    'width': '100%',
    'height': '100%',
    'min-width': '100%',
    'min-height': '100%'
};
var FlexFillDirective = (function (_super) {
    __extends(FlexFillDirective, _super);
    function FlexFillDirective(monitor, elRef, renderer) {
        var _this = _super.call(this, monitor, elRef, renderer) || this;
        _this.elRef = elRef;
        _this.renderer = renderer;
        _this._applyStyleToElement(FLEX_FILL_CSS);
        return _this;
    }
    return FlexFillDirective;
}(BaseFxDirective));
FlexFillDirective.decorators = [
    { type: _angular_core.Directive, args: [{ selector: "\n  [fxFill],\n  [fxFlexFill]\n" },] },
];
FlexFillDirective.ctorParameters = function () { return [
    { type: MediaMonitor, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
]; };
var FlexOffsetDirective = (function (_super) {
    __extends(FlexOffsetDirective, _super);
    function FlexOffsetDirective(monitor, elRef, renderer, _container) {
        var _this = _super.call(this, monitor, elRef, renderer) || this;
        _this._container = _container;
        _this._layout = 'row';
        _this.watchParentFlow();
        return _this;
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
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetSm", {
        set: function (val) { this._cacheInput('offsetSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetMd", {
        set: function (val) { this._cacheInput('offsetMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetLg", {
        set: function (val) { this._cacheInput('offsetLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetXl", {
        set: function (val) { this._cacheInput('offsetXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetLtSm", {
        set: function (val) { this._cacheInput('offsetLtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetLtMd", {
        set: function (val) { this._cacheInput('offsetLtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetLtLg", {
        set: function (val) { this._cacheInput('offsetLtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetLtXl", {
        set: function (val) { this._cacheInput('offsetLtXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtXs", {
        set: function (val) { this._cacheInput('offsetGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtSm", {
        set: function (val) { this._cacheInput('offsetGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtMd", {
        set: function (val) { this._cacheInput('offsetGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOffsetDirective.prototype, "offsetGtLg", {
        set: function (val) { this._cacheInput('offsetGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    FlexOffsetDirective.prototype.ngOnChanges = function (changes) {
        if (changes['offset'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    FlexOffsetDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    };
    FlexOffsetDirective.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this._listenForMediaQueryChanges('offset', 0, function (changes) {
            _this._updateWithValue(changes.value);
        });
    };
    FlexOffsetDirective.prototype.watchParentFlow = function () {
        var _this = this;
        if (this._container) {
            this._layoutWatcher = this._container.layout$.subscribe(function (direction) {
                _this._onLayoutChange(direction);
            });
        }
    };
    FlexOffsetDirective.prototype._onLayoutChange = function (direction) {
        this._layout = direction || this._layout || 'row';
        this._updateWithValue();
    };
    FlexOffsetDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput('offset') || 0;
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    };
    FlexOffsetDirective.prototype._buildCSS = function (offset) {
        var isPercent = String(offset).indexOf('%') > -1;
        var isPx = String(offset).indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(offset)) {
            offset = offset + '%';
        }
        var layout = this._getFlowDirection(this.parentElement, true);
        return isFlowHorizontal(layout) ? { 'margin-left': "" + offset } : { 'margin-top': "" + offset };
    };
    return FlexOffsetDirective;
}(BaseFxDirective));
FlexOffsetDirective.decorators = [
    { type: _angular_core.Directive, args: [{ selector: "\n  [fxFlexOffset],\n  [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md], [fxFlexOffset.lg], [fxFlexOffset.xl],\n  [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md], [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl],\n  [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm], [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]\n" },] },
];
FlexOffsetDirective.ctorParameters = function () { return [
    { type: MediaMonitor, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: LayoutDirective, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.SkipSelf },] },
]; };
FlexOffsetDirective.propDecorators = {
    'offset': [{ type: _angular_core.Input, args: ['fxFlexOffset',] },],
    'offsetXs': [{ type: _angular_core.Input, args: ['fxFlexOffset.xs',] },],
    'offsetSm': [{ type: _angular_core.Input, args: ['fxFlexOffset.sm',] },],
    'offsetMd': [{ type: _angular_core.Input, args: ['fxFlexOffset.md',] },],
    'offsetLg': [{ type: _angular_core.Input, args: ['fxFlexOffset.lg',] },],
    'offsetXl': [{ type: _angular_core.Input, args: ['fxFlexOffset.xl',] },],
    'offsetLtSm': [{ type: _angular_core.Input, args: ['fxFlexOffset.lt-sm',] },],
    'offsetLtMd': [{ type: _angular_core.Input, args: ['fxFlexOffset.lt-md',] },],
    'offsetLtLg': [{ type: _angular_core.Input, args: ['fxFlexOffset.lt-lg',] },],
    'offsetLtXl': [{ type: _angular_core.Input, args: ['fxFlexOffset.lt-xl',] },],
    'offsetGtXs': [{ type: _angular_core.Input, args: ['fxFlexOffset.gt-xs',] },],
    'offsetGtSm': [{ type: _angular_core.Input, args: ['fxFlexOffset.gt-sm',] },],
    'offsetGtMd': [{ type: _angular_core.Input, args: ['fxFlexOffset.gt-md',] },],
    'offsetGtLg': [{ type: _angular_core.Input, args: ['fxFlexOffset.gt-lg',] },],
};
var FlexOrderDirective = (function (_super) {
    __extends(FlexOrderDirective, _super);
    function FlexOrderDirective(monitor, elRef, renderer) {
        return _super.call(this, monitor, elRef, renderer) || this;
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
    Object.defineProperty(FlexOrderDirective.prototype, "orderSm", {
        set: function (val) { this._cacheInput('orderSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderMd", {
        set: function (val) { this._cacheInput('orderMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderLg", {
        set: function (val) { this._cacheInput('orderLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderXl", {
        set: function (val) { this._cacheInput('orderXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtXs", {
        set: function (val) { this._cacheInput('orderGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtSm", {
        set: function (val) { this._cacheInput('orderGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtMd", {
        set: function (val) { this._cacheInput('orderGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderGtLg", {
        set: function (val) { this._cacheInput('orderGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderLtSm", {
        set: function (val) { this._cacheInput('orderLtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderLtMd", {
        set: function (val) { this._cacheInput('orderLtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderLtLg", {
        set: function (val) { this._cacheInput('orderLtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(FlexOrderDirective.prototype, "orderLtXl", {
        set: function (val) { this._cacheInput('orderLtXl', val); },
        enumerable: true,
        configurable: true
    });
    
    FlexOrderDirective.prototype.ngOnChanges = function (changes) {
        if (changes['order'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    };
    FlexOrderDirective.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this._listenForMediaQueryChanges('order', '0', function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    FlexOrderDirective.prototype._updateWithValue = function (value) {
        value = value || this._queryInput('order') || '0';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    };
    FlexOrderDirective.prototype._buildCSS = function (value) {
        value = parseInt(value, 10);
        return { order: isNaN(value) ? 0 : value };
    };
    return FlexOrderDirective;
}(BaseFxDirective));
FlexOrderDirective.decorators = [
    { type: _angular_core.Directive, args: [{ selector: "\n  [fxFlexOrder],\n  [fxFlexOrder.xs], [fxFlexOrder.sm], [fxFlexOrder.md], [fxFlexOrder.lg], [fxFlexOrder.xl],\n  [fxFlexOrder.lt-sm], [fxFlexOrder.lt-md], [fxFlexOrder.lt-lg], [fxFlexOrder.lt-xl],\n  [fxFlexOrder.gt-xs], [fxFlexOrder.gt-sm], [fxFlexOrder.gt-md], [fxFlexOrder.gt-lg]\n" },] },
];
FlexOrderDirective.ctorParameters = function () { return [
    { type: MediaMonitor, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
]; };
FlexOrderDirective.propDecorators = {
    'order': [{ type: _angular_core.Input, args: ['fxFlexOrder',] },],
    'orderXs': [{ type: _angular_core.Input, args: ['fxFlexOrder.xs',] },],
    'orderSm': [{ type: _angular_core.Input, args: ['fxFlexOrder.sm',] },],
    'orderMd': [{ type: _angular_core.Input, args: ['fxFlexOrder.md',] },],
    'orderLg': [{ type: _angular_core.Input, args: ['fxFlexOrder.lg',] },],
    'orderXl': [{ type: _angular_core.Input, args: ['fxFlexOrder.xl',] },],
    'orderGtXs': [{ type: _angular_core.Input, args: ['fxFlexOrder.gt-xs',] },],
    'orderGtSm': [{ type: _angular_core.Input, args: ['fxFlexOrder.gt-sm',] },],
    'orderGtMd': [{ type: _angular_core.Input, args: ['fxFlexOrder.gt-md',] },],
    'orderGtLg': [{ type: _angular_core.Input, args: ['fxFlexOrder.gt-lg',] },],
    'orderLtSm': [{ type: _angular_core.Input, args: ['fxFlexOrder.lt-sm',] },],
    'orderLtMd': [{ type: _angular_core.Input, args: ['fxFlexOrder.lt-md',] },],
    'orderLtLg': [{ type: _angular_core.Input, args: ['fxFlexOrder.lt-lg',] },],
    'orderLtXl': [{ type: _angular_core.Input, args: ['fxFlexOrder.lt-xl',] },],
};
var ClassDirective = (function (_super) {
    __extends(ClassDirective, _super);
    function ClassDirective(monitor, _ngEl, _renderer, _oldRenderer, _iterableDiffers, _keyValueDiffers, _ngClassInstance) {
        var _this = _super.call(this, monitor, _ngEl, _renderer) || this;
        _this.monitor = monitor;
        _this._ngClassInstance = _ngClassInstance;
        _this._classAdapter = new BaseFxDirectiveAdapter('class', monitor, _ngEl, _renderer);
        _this._ngClassAdapter = new BaseFxDirectiveAdapter('ngClass', monitor, _ngEl, _renderer);
        if (!_this._ngClassInstance) {
            _this._ngClassInstance = new _angular_common.NgClass(_iterableDiffers, _keyValueDiffers, _ngEl, _oldRenderer);
        }
        return _this;
    }
    Object.defineProperty(ClassDirective.prototype, "ngClassBase", {
        set: function (val) {
            this._ngClassAdapter.cacheInput('ngClass', val, true);
            this._ngClassInstance.ngClass = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassXs", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassXs', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassSm", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassSm', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassMd", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassMd', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassLg", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassLg', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassXl", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassXl', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassLtSm", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassLtSm', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassLtMd", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassLtMd', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassLtLg", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassLtLg', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassLtXl", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassLtXl', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassGtXs", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassGtXs', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassGtSm", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassGtSm', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassGtMd", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassGtMd', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "ngClassGtLg", {
        set: function (val) { this._ngClassAdapter.cacheInput('ngClassGtLg', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classBase", {
        set: function (val) {
            this._classAdapter.cacheInput('_rawClass', val, true);
            this._ngClassInstance.klass = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classXs", {
        set: function (val) { this._classAdapter.cacheInput('classXs', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classSm", {
        set: function (val) { this._classAdapter.cacheInput('classSm', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classMd", {
        set: function (val) { this._classAdapter.cacheInput('classMd', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classLg", {
        set: function (val) { this._classAdapter.cacheInput('classLg', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classXl", {
        set: function (val) { this._classAdapter.cacheInput('classXl', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classLtSm", {
        set: function (val) { this._classAdapter.cacheInput('classLtSm', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classLtMd", {
        set: function (val) { this._classAdapter.cacheInput('classLtMd', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classLtLg", {
        set: function (val) { this._classAdapter.cacheInput('classLtLg', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classLtXl", {
        set: function (val) { this._classAdapter.cacheInput('classLtXl', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classGtXs", {
        set: function (val) { this._classAdapter.cacheInput('classGtXs', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classGtSm", {
        set: function (val) { this._classAdapter.cacheInput('classGtSm', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classGtMd", {
        set: function (val) { this._classAdapter.cacheInput('classGtMd', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "classGtLg", {
        set: function (val) { this._classAdapter.cacheInput('classGtLg', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClassDirective.prototype, "initialClasses", {
        get: function () {
            return this._classAdapter.queryInput('_rawClass') || "";
        },
        enumerable: true,
        configurable: true
    });
    ClassDirective.prototype.ngOnChanges = function (changes) {
        if (this.hasInitialized) {
            if (this._classAdapter.activeKey in changes) {
                this._updateKlass();
            }
            if (this._ngClassAdapter.activeKey in changes) {
                this._updateNgClass();
            }
        }
    };
    ClassDirective.prototype.ngDoCheck = function () {
        if (!this._classAdapter.hasMediaQueryListener) {
            this._configureMQListener();
        }
        this._ngClassInstance.ngDoCheck();
    };
    ClassDirective.prototype.ngOnDestroy = function () {
        this._classAdapter.ngOnDestroy();
        this._ngClassAdapter.ngOnDestroy();
        this._ngClassInstance = null;
    };
    ClassDirective.prototype._configureMQListener = function () {
        var _this = this;
        this._classAdapter.listenForMediaQueryChanges('class', '', function (changes) {
            _this._updateKlass(changes.value);
        });
        this._ngClassAdapter.listenForMediaQueryChanges('ngClass', '', function (changes) {
            _this._updateNgClass(changes.value);
            _this._ngClassInstance.ngDoCheck();
        });
    };
    ClassDirective.prototype._updateKlass = function (value) {
        var klass = value || this._classAdapter.queryInput('class') || '';
        if (this._classAdapter.mqActivation) {
            klass = this._classAdapter.mqActivation.activatedInput;
        }
        this._ngClassInstance.klass = klass || this.initialClasses;
    };
    ClassDirective.prototype._updateNgClass = function (value) {
        if (this._ngClassAdapter.mqActivation) {
            value = this._ngClassAdapter.mqActivation.activatedInput;
        }
        this._ngClassInstance.ngClass = value || '';
    };
    return ClassDirective;
}(BaseFxDirective));
ClassDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: "\n    [class], [class.xs], [class.sm], [class.md], [class.lg], [class.xl],\n    [class.lt-sm], [class.lt-md], [class.lt-lg], [class.lt-xl],\n    [class.gt-xs], [class.gt-sm], [class.gt-md], [class.gt-lg],\n\n    [ngClass], [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],\n    [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl],\n    [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]\n  "
            },] },
];
ClassDirective.ctorParameters = function () { return [
    { type: MediaMonitor, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.Renderer, },
    { type: _angular_core.IterableDiffers, },
    { type: _angular_core.KeyValueDiffers, },
    { type: _angular_common.NgClass, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self },] },
]; };
ClassDirective.propDecorators = {
    'ngClassBase': [{ type: _angular_core.Input, args: ['ngClass',] },],
    'ngClassXs': [{ type: _angular_core.Input, args: ['ngClass.xs',] },],
    'ngClassSm': [{ type: _angular_core.Input, args: ['ngClass.sm',] },],
    'ngClassMd': [{ type: _angular_core.Input, args: ['ngClass.md',] },],
    'ngClassLg': [{ type: _angular_core.Input, args: ['ngClass.lg',] },],
    'ngClassXl': [{ type: _angular_core.Input, args: ['ngClass.xl',] },],
    'ngClassLtSm': [{ type: _angular_core.Input, args: ['ngClass.lt-sm',] },],
    'ngClassLtMd': [{ type: _angular_core.Input, args: ['ngClass.lt-md',] },],
    'ngClassLtLg': [{ type: _angular_core.Input, args: ['ngClass.lt-lg',] },],
    'ngClassLtXl': [{ type: _angular_core.Input, args: ['ngClass.lt-xl',] },],
    'ngClassGtXs': [{ type: _angular_core.Input, args: ['ngClass.gt-xs',] },],
    'ngClassGtSm': [{ type: _angular_core.Input, args: ['ngClass.gt-sm',] },],
    'ngClassGtMd': [{ type: _angular_core.Input, args: ['ngClass.gt-md',] },],
    'ngClassGtLg': [{ type: _angular_core.Input, args: ['ngClass.gt-lg',] },],
    'classBase': [{ type: _angular_core.Input, args: ['class',] },],
    'classXs': [{ type: _angular_core.Input, args: ['class.xs',] },],
    'classSm': [{ type: _angular_core.Input, args: ['class.sm',] },],
    'classMd': [{ type: _angular_core.Input, args: ['class.md',] },],
    'classLg': [{ type: _angular_core.Input, args: ['class.lg',] },],
    'classXl': [{ type: _angular_core.Input, args: ['class.xl',] },],
    'classLtSm': [{ type: _angular_core.Input, args: ['class.lt-sm',] },],
    'classLtMd': [{ type: _angular_core.Input, args: ['class.lt-md',] },],
    'classLtLg': [{ type: _angular_core.Input, args: ['class.lt-lg',] },],
    'classLtXl': [{ type: _angular_core.Input, args: ['class.lt-xl',] },],
    'classGtXs': [{ type: _angular_core.Input, args: ['class.gt-xs',] },],
    'classGtSm': [{ type: _angular_core.Input, args: ['class.gt-sm',] },],
    'classGtMd': [{ type: _angular_core.Input, args: ['class.gt-md',] },],
    'classGtLg': [{ type: _angular_core.Input, args: ['class.gt-lg',] },],
};
var NgStyleKeyValue = (function () {
    function NgStyleKeyValue(key, value, noQuotes) {
        if (noQuotes === void 0) { noQuotes = true; }
        this.key = key;
        this.value = value;
        this.key = noQuotes ? key.replace(/['"]/g, '').trim() : key.trim();
        this.value = noQuotes ? value.replace(/['"]/g, '').trim() : value.trim();
        this.value = this.value.replace(/;/, '');
    }
    return NgStyleKeyValue;
}());
var ngStyleUtils = {
    getType: getType,
    buildRawList: buildRawList,
    buildMapFromList: buildMapFromList,
    buildMapFromSet: buildMapFromSet
};
function getType(target) {
    var what = typeof target;
    if (what === 'object') {
        return (target.constructor === Array) ? 'array' :
            (target.constructor === Set) ? 'set' : 'object';
    }
    return what;
}
function buildRawList(source, delimiter) {
    if (delimiter === void 0) { delimiter = ';'; }
    return String(source)
        .trim()
        .split(delimiter)
        .map(function (val) { return val.trim(); })
        .filter(function (val) { return val !== ''; });
}
function buildMapFromList(styles, sanitize) {
    var sanitizeValue = function (it) {
        if (sanitize) {
            it.value = sanitize(it.value);
        }
        return it;
    };
    return styles
        .map(stringToKeyValue)
        .filter(function (entry) { return !!entry; })
        .map(sanitizeValue)
        .reduce(keyValuesToMap, {});
}
function buildMapFromSet(source, sanitize) {
    var list = new Array();
    if (getType(source) == 'set') {
        source.forEach(function (entry) { return list.push(entry); });
    }
    else {
        Object.keys(source).forEach(function (key) {
            list.push(key + ":" + source[key]);
        });
    }
    return buildMapFromList(list, sanitize);
}
function stringToKeyValue(it) {
    var _a = it.split(':'), key = _a[0], val = _a[1];
    return val ? new NgStyleKeyValue(key, val) : null;
}
function keyValuesToMap(map$$1, entry) {
    if (!!entry.key) {
        map$$1[entry.key] = entry.value;
    }
    return map$$1;
}
var StyleDirective = (function (_super) {
    __extends(StyleDirective, _super);
    function StyleDirective(monitor, _sanitizer, _ngEl, _renderer, _differs, _oldRenderer, _ngStyleInstance) {
        var _this = _super.call(this, monitor, _ngEl, _renderer) || this;
        _this.monitor = monitor;
        _this._sanitizer = _sanitizer;
        _this._ngStyleInstance = _ngStyleInstance;
        _this._buildAdapter(_this.monitor, _ngEl, _renderer);
        _this._base.cacheInput('style', _ngEl.nativeElement.getAttribute('style'), true);
        if (!_this._ngStyleInstance) {
            _this._ngStyleInstance = new _angular_common.NgStyle(_differs, _ngEl, _oldRenderer);
        }
        return _this;
    }
    Object.defineProperty(StyleDirective.prototype, "styleBase", {
        set: function (val) {
            this._base.cacheInput('style', val, true);
            this._ngStyleInstance.ngStyle = this._base.inputMap['style'];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StyleDirective.prototype, "ngStyleXs", {
        set: function (val) { this._base.cacheInput('styleXs', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StyleDirective.prototype, "ngStyleSm", {
        set: function (val) { this._base.cacheInput('styleSm', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "ngStyleMd", {
        set: function (val) { this._base.cacheInput('styleMd', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "ngStyleLg", {
        set: function (val) { this._base.cacheInput('styleLg', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "ngStyleXl", {
        set: function (val) { this._base.cacheInput('styleXl', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "ngStyleLtSm", {
        set: function (val) { this._base.cacheInput('styleLtSm', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "ngStyleLtMd", {
        set: function (val) { this._base.cacheInput('styleLtMd', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "ngStyleLtLg", {
        set: function (val) { this._base.cacheInput('styleLtLg', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "ngStyleLtXl", {
        set: function (val) { this._base.cacheInput('styleLtXl', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "ngStyleGtXs", {
        set: function (val) { this._base.cacheInput('styleGtXs', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "ngStyleGtSm", {
        set: function (val) { this._base.cacheInput('styleGtSm', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "ngStyleGtMd", {
        set: function (val) { this._base.cacheInput('styleGtMd', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "ngStyleGtLg", {
        set: function (val) { this._base.cacheInput('styleGtLg', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "styleXs", {
        set: function (val) { this._base.cacheInput('styleXs', val, true); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StyleDirective.prototype, "styleSm", {
        set: function (val) { this._base.cacheInput('styleSm', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "styleMd", {
        set: function (val) { this._base.cacheInput('styleMd', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "styleLg", {
        set: function (val) { this._base.cacheInput('styleLg', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "styleXl", {
        set: function (val) { this._base.cacheInput('styleXl', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "styleLtSm", {
        set: function (val) { this._base.cacheInput('styleLtSm', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "styleLtMd", {
        set: function (val) { this._base.cacheInput('styleLtMd', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "styleLtLg", {
        set: function (val) { this._base.cacheInput('styleLtLg', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "styleLtXl", {
        set: function (val) { this._base.cacheInput('styleLtXl', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "styleGtXs", {
        set: function (val) { this._base.cacheInput('styleGtXs', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "styleGtSm", {
        set: function (val) { this._base.cacheInput('styleGtSm', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "styleGtMd", {
        set: function (val) { this._base.cacheInput('styleGtMd', val, true); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(StyleDirective.prototype, "styleGtLg", {
        set: function (val) { this._base.cacheInput('styleGtLg', val, true); },
        enumerable: true,
        configurable: true
    });
    
    StyleDirective.prototype.ngOnChanges = function (changes) {
        if (this._base.activeKey in changes) {
            this._updateStyle();
        }
    };
    StyleDirective.prototype.ngDoCheck = function () {
        if (!this._base.hasMediaQueryListener) {
            this._configureMQListener();
        }
        this._ngStyleInstance.ngDoCheck();
    };
    StyleDirective.prototype.ngOnDestroy = function () {
        this._base.ngOnDestroy();
        this._ngStyleInstance = null;
    };
    StyleDirective.prototype._configureMQListener = function () {
        var _this = this;
        this._base.listenForMediaQueryChanges('style', '', function (changes) {
            _this._updateStyle(changes.value);
            _this._ngStyleInstance.ngDoCheck();
        });
    };
    StyleDirective.prototype._updateStyle = function (value) {
        var style = value || this._base.queryInput('style') || '';
        if (this._base.mqActivation) {
            style = this._base.mqActivation.activatedInput;
        }
        this._ngStyleInstance.ngStyle = style;
    };
    StyleDirective.prototype._buildAdapter = function (monitor, _ngEl, _renderer) {
        this._base = new BaseFxDirectiveAdapter('style', monitor, _ngEl, _renderer);
        this._buildCacheInterceptor();
    };
    StyleDirective.prototype._buildCacheInterceptor = function () {
        var _this = this;
        var cacheInput = this._base.cacheInput.bind(this._base);
        this._base.cacheInput = function (key, source, cacheRaw, merge) {
            if (cacheRaw === void 0) { cacheRaw = false; }
            if (merge === void 0) { merge = true; }
            var styles = _this._buildStyleMap(source);
            if (merge) {
                styles = extendObject({}, _this._base.inputMap['style'], styles);
            }
            cacheInput(key, styles, cacheRaw);
        };
    };
    StyleDirective.prototype._buildStyleMap = function (styles) {
        var _this = this;
        var sanitizer = function (val) {
            return _this._sanitizer.sanitize(_angular_core.SecurityContext.STYLE, val);
        };
        if (styles) {
            switch (ngStyleUtils.getType(styles)) {
                case 'string': return ngStyleUtils.buildMapFromList(ngStyleUtils.buildRawList(styles), sanitizer);
                case 'array': return ngStyleUtils.buildMapFromList((styles), sanitizer);
                case 'set': return ngStyleUtils.buildMapFromSet(styles, sanitizer);
                default: return ngStyleUtils.buildMapFromSet(styles, sanitizer);
            }
        }
        return styles;
    };
    return StyleDirective;
}(BaseFxDirective));
StyleDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: "\n    [style.xs], [style.sm], [style.md], [style.lg], [style.xl],\n    [style.lt-sm], [style.lt-md], [style.lt-lg], [style.lt-xl],\n    [style.gt-xs], [style.gt-sm], [style.gt-md], [style.gt-lg],\n    [ngStyle],\n    [ngStyle.xs], [ngStyle.sm], [ngStyle.lg], [ngStyle.xl],\n    [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],\n    [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]\n  "
            },] },
];
StyleDirective.ctorParameters = function () { return [
    { type: MediaMonitor, },
    { type: _angular_platformBrowser.DomSanitizer, },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
    { type: _angular_core.KeyValueDiffers, },
    { type: _angular_core.Renderer, },
    { type: _angular_common.NgStyle, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self },] },
]; };
StyleDirective.propDecorators = {
    'styleBase': [{ type: _angular_core.Input, args: ['ngStyle',] },],
    'ngStyleXs': [{ type: _angular_core.Input, args: ['ngStyle.xs',] },],
    'ngStyleSm': [{ type: _angular_core.Input, args: ['ngStyle.sm',] },],
    'ngStyleMd': [{ type: _angular_core.Input, args: ['ngStyle.md',] },],
    'ngStyleLg': [{ type: _angular_core.Input, args: ['ngStyle.lg',] },],
    'ngStyleXl': [{ type: _angular_core.Input, args: ['ngStyle.xl',] },],
    'ngStyleLtSm': [{ type: _angular_core.Input, args: ['ngStyle.lt-sm',] },],
    'ngStyleLtMd': [{ type: _angular_core.Input, args: ['ngStyle.lt-md',] },],
    'ngStyleLtLg': [{ type: _angular_core.Input, args: ['ngStyle.lt-lg',] },],
    'ngStyleLtXl': [{ type: _angular_core.Input, args: ['ngStyle.lt-xl',] },],
    'ngStyleGtXs': [{ type: _angular_core.Input, args: ['ngStyle.gt-xs',] },],
    'ngStyleGtSm': [{ type: _angular_core.Input, args: ['ngStyle.gt-sm',] },],
    'ngStyleGtMd': [{ type: _angular_core.Input, args: ['ngStyle.gt-md',] },],
    'ngStyleGtLg': [{ type: _angular_core.Input, args: ['ngStyle.gt-lg',] },],
    'styleXs': [{ type: _angular_core.Input, args: ['style.xs',] },],
    'styleSm': [{ type: _angular_core.Input, args: ['style.sm',] },],
    'styleMd': [{ type: _angular_core.Input, args: ['style.md',] },],
    'styleLg': [{ type: _angular_core.Input, args: ['style.lg',] },],
    'styleXl': [{ type: _angular_core.Input, args: ['style.xl',] },],
    'styleLtSm': [{ type: _angular_core.Input, args: ['style.lt-sm',] },],
    'styleLtMd': [{ type: _angular_core.Input, args: ['style.lt-md',] },],
    'styleLtLg': [{ type: _angular_core.Input, args: ['style.lt-lg',] },],
    'styleLtXl': [{ type: _angular_core.Input, args: ['style.lt-xl',] },],
    'styleGtXs': [{ type: _angular_core.Input, args: ['style.gt-xs',] },],
    'styleGtSm': [{ type: _angular_core.Input, args: ['style.gt-sm',] },],
    'styleGtMd': [{ type: _angular_core.Input, args: ['style.gt-md',] },],
    'styleGtLg': [{ type: _angular_core.Input, args: ['style.gt-lg',] },],
};
var FALSY = ['false', false, 0];
function negativeOf(hide) {
    return (hide === '') ? false :
        ((hide === 'false') || (hide === 0)) ? true : !hide;
}
var ShowHideDirective = (function (_super) {
    __extends(ShowHideDirective, _super);
    function ShowHideDirective(monitor, _layout, elRef, renderer) {
        var _this = _super.call(this, monitor, elRef, renderer) || this;
        _this._layout = _layout;
        _this.elRef = elRef;
        _this.renderer = renderer;
        if (_layout) {
            _this._layoutWatcher = _layout.layout$.subscribe(function () { return _this._updateWithValue(); });
        }
        return _this;
    }
    Object.defineProperty(ShowHideDirective.prototype, "show", {
        set: function (val) { this._cacheInput('show', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowHideDirective.prototype, "showXs", {
        set: function (val) { this._cacheInput('showXs', val); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowHideDirective.prototype, "showSm", {
        set: function (val) { this._cacheInput('showSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "showMd", {
        set: function (val) { this._cacheInput('showMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "showLg", {
        set: function (val) { this._cacheInput('showLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "showXl", {
        set: function (val) { this._cacheInput('showXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "showLtSm", {
        set: function (val) { this._cacheInput('showLtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "showLtMd", {
        set: function (val) { this._cacheInput('showLtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "showLtLg", {
        set: function (val) { this._cacheInput('showLtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "showLtXl", {
        set: function (val) { this._cacheInput('showLtXl', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "showGtXs", {
        set: function (val) { this._cacheInput('showGtXs', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "showGtSm", {
        set: function (val) { this._cacheInput('showGtSm', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "showGtMd", {
        set: function (val) { this._cacheInput('showGtMd', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "showGtLg", {
        set: function (val) { this._cacheInput('showGtLg', val); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "hide", {
        set: function (val) { this._cacheInput('show', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowHideDirective.prototype, "hideXs", {
        set: function (val) { this._cacheInput('showXs', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowHideDirective.prototype, "hideSm", {
        set: function (val) { this._cacheInput('showSm', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "hideMd", {
        set: function (val) { this._cacheInput('showMd', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "hideLg", {
        set: function (val) { this._cacheInput('showLg', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "hideXl", {
        set: function (val) { this._cacheInput('showXl', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "hideLtSm", {
        set: function (val) { this._cacheInput('showLtSm', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "hideLtMd", {
        set: function (val) { this._cacheInput('showLtMd', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "hideLtLg", {
        set: function (val) { this._cacheInput('showLtLg', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "hideLtXl", {
        set: function (val) { this._cacheInput('showLtXl', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "hideGtXs", {
        set: function (val) { this._cacheInput('showGtXs', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "hideGtSm", {
        set: function (val) { this._cacheInput('showGtSm', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "hideGtMd", {
        set: function (val) { this._cacheInput('showGtMd', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(ShowHideDirective.prototype, "hideGtLg", {
        set: function (val) { this._cacheInput('showGtLg', negativeOf(val)); },
        enumerable: true,
        configurable: true
    });
    
    ShowHideDirective.prototype._getDisplayStyle = function () {
        return this._layout ? 'flex' : _super.prototype._getDisplayStyle.call(this);
    };
    ShowHideDirective.prototype.ngOnChanges = function (changes) {
        if (this.hasInitialized && (changes['show'] != null || this._mqActivation)) {
            this._updateWithValue();
        }
    };
    ShowHideDirective.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        var value = this._getDefaultVal('show', true);
        this._listenForMediaQueryChanges('show', value, function (changes) {
            _this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    };
    ShowHideDirective.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    };
    ShowHideDirective.prototype._updateWithValue = function (value) {
        value = value || this._getDefaultVal('show', true);
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        var shouldShow = this._validateTruthy(value);
        this._applyStyleToElement(this._buildCSS(shouldShow));
    };
    ShowHideDirective.prototype._buildCSS = function (show) {
        return { 'display': show ? this._display : 'none' };
    };
    ShowHideDirective.prototype._validateTruthy = function (show) {
        return (FALSY.indexOf(show) == -1);
    };
    return ShowHideDirective;
}(BaseFxDirective));
ShowHideDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: "\n  [fxShow],\n  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],\n  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],\n  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],\n  [fxHide],\n  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],\n  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],\n  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]\n"
            },] },
];
ShowHideDirective.ctorParameters = function () { return [
    { type: MediaMonitor, },
    { type: LayoutDirective, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Self },] },
    { type: _angular_core.ElementRef, },
    { type: _angular_core.Renderer2, },
]; };
ShowHideDirective.propDecorators = {
    'show': [{ type: _angular_core.Input, args: ['fxShow',] },],
    'showXs': [{ type: _angular_core.Input, args: ['fxShow.xs',] },],
    'showSm': [{ type: _angular_core.Input, args: ['fxShow.sm',] },],
    'showMd': [{ type: _angular_core.Input, args: ['fxShow.md',] },],
    'showLg': [{ type: _angular_core.Input, args: ['fxShow.lg',] },],
    'showXl': [{ type: _angular_core.Input, args: ['fxShow.xl',] },],
    'showLtSm': [{ type: _angular_core.Input, args: ['fxShow.lt-sm',] },],
    'showLtMd': [{ type: _angular_core.Input, args: ['fxShow.lt-md',] },],
    'showLtLg': [{ type: _angular_core.Input, args: ['fxShow.lt-lg',] },],
    'showLtXl': [{ type: _angular_core.Input, args: ['fxShow.lt-xl',] },],
    'showGtXs': [{ type: _angular_core.Input, args: ['fxShow.gt-xs',] },],
    'showGtSm': [{ type: _angular_core.Input, args: ['fxShow.gt-sm',] },],
    'showGtMd': [{ type: _angular_core.Input, args: ['fxShow.gt-md',] },],
    'showGtLg': [{ type: _angular_core.Input, args: ['fxShow.gt-lg',] },],
    'hide': [{ type: _angular_core.Input, args: ['fxHide',] },],
    'hideXs': [{ type: _angular_core.Input, args: ['fxHide.xs',] },],
    'hideSm': [{ type: _angular_core.Input, args: ['fxHide.sm',] },],
    'hideMd': [{ type: _angular_core.Input, args: ['fxHide.md',] },],
    'hideLg': [{ type: _angular_core.Input, args: ['fxHide.lg',] },],
    'hideXl': [{ type: _angular_core.Input, args: ['fxHide.xl',] },],
    'hideLtSm': [{ type: _angular_core.Input, args: ['fxHide.lt-sm',] },],
    'hideLtMd': [{ type: _angular_core.Input, args: ['fxHide.lt-md',] },],
    'hideLtLg': [{ type: _angular_core.Input, args: ['fxHide.lt-lg',] },],
    'hideLtXl': [{ type: _angular_core.Input, args: ['fxHide.lt-xl',] },],
    'hideGtXs': [{ type: _angular_core.Input, args: ['fxHide.gt-xs',] },],
    'hideGtSm': [{ type: _angular_core.Input, args: ['fxHide.gt-sm',] },],
    'hideGtMd': [{ type: _angular_core.Input, args: ['fxHide.gt-md',] },],
    'hideGtLg': [{ type: _angular_core.Input, args: ['fxHide.gt-lg',] },],
};
var RESPONSIVE_ALIASES = [
    'xs', 'gt-xs', 'sm', 'gt-sm', 'md', 'gt-md', 'lg', 'gt-lg', 'xl'
];
var DEFAULT_BREAKPOINTS = [
    {
        alias: 'xs',
        mediaQuery: '(max-width: 599px)'
    },
    {
        alias: 'gt-xs',
        overlapping: true,
        mediaQuery: '(min-width: 600px)'
    },
    {
        alias: 'lt-sm',
        overlapping: true,
        mediaQuery: '(max-width: 599px)'
    },
    {
        alias: 'sm',
        mediaQuery: '(min-width: 600px) and (max-width: 959px)'
    },
    {
        alias: 'gt-sm',
        overlapping: true,
        mediaQuery: '(min-width: 960px)'
    },
    {
        alias: 'lt-md',
        overlapping: true,
        mediaQuery: '(max-width: 959px)'
    },
    {
        alias: 'md',
        mediaQuery: '(min-width: 960px) and (max-width: 1279px)'
    },
    {
        alias: 'gt-md',
        overlapping: true,
        mediaQuery: '(min-width: 1280px)'
    },
    {
        alias: 'lt-lg',
        overlapping: true,
        mediaQuery: '(max-width: 1279px)'
    },
    {
        alias: 'lg',
        mediaQuery: '(min-width: 1280px) and (max-width: 1919px)'
    },
    {
        alias: 'gt-lg',
        overlapping: true,
        mediaQuery: '(min-width: 1920px)'
    },
    {
        alias: 'lt-xl',
        overlapping: true,
        mediaQuery: '(max-width: 1920px)'
    },
    {
        alias: 'xl',
        mediaQuery: '(min-width: 1920px) and (max-width: 5000px)'
    }
];
var HANDSET_PORTRAIT = '(orientations: portrait) and (max-width: 599px)';
var HANDSET_LANDSCAPE = '(orientations: landscape) and (max-width: 959px)';
var TABLET_LANDSCAPE = '(orientations: landscape) and (min-width: 960px) and (max-width: 1279px)';
var TABLET_PORTRAIT = '(orientations: portrait) and (min-width: 600px) and (max-width: 839px)';
var WEB_PORTRAIT = '(orientations: portrait) and (min-width: 840px)';
var WEB_LANDSCAPE = '(orientations: landscape) and (min-width: 1280px)';
var ScreenTypes = {
    'HANDSET': HANDSET_PORTRAIT + ", " + HANDSET_LANDSCAPE,
    'TABLET': TABLET_PORTRAIT + " , " + TABLET_LANDSCAPE,
    'WEB': WEB_PORTRAIT + ", " + WEB_LANDSCAPE + " ",
    'HANDSET_PORTRAIT': "" + HANDSET_PORTRAIT,
    'TABLET_PORTRAIT': TABLET_PORTRAIT + " ",
    'WEB_PORTRAIT': "" + WEB_PORTRAIT,
    'HANDSET_LANDSCAPE': HANDSET_LANDSCAPE + "]",
    'TABLET_LANDSCAPE': "" + TABLET_LANDSCAPE,
    'WEB_LANDSCAPE': "" + WEB_LANDSCAPE
};
var ORIENTATION_BREAKPOINTS = [
    { 'alias': 'handset', 'mediaQuery': ScreenTypes.HANDSET },
    { 'alias': 'handset.landscape', 'mediaQuery': ScreenTypes.HANDSET_LANDSCAPE },
    { 'alias': 'handset.portrait', 'mediaQuery': ScreenTypes.HANDSET_PORTRAIT },
    { 'alias': 'tablet', 'mediaQuery': ScreenTypes.TABLET },
    { 'alias': 'tablet.landscape', 'mediaQuery': ScreenTypes.TABLET },
    { 'alias': 'tablet.portrait', 'mediaQuery': ScreenTypes.TABLET_PORTRAIT },
    { 'alias': 'web', 'mediaQuery': ScreenTypes.WEB, overlapping: true },
    { 'alias': 'web.landscape', 'mediaQuery': ScreenTypes.WEB_LANDSCAPE, overlapping: true },
    { 'alias': 'web.portrait', 'mediaQuery': ScreenTypes.WEB_PORTRAIT, overlapping: true }
];
var ObservableMedia = (function () {
    function ObservableMedia() {
    }
    ObservableMedia.prototype.isActive = function (query) { };
    ObservableMedia.prototype.asObservable = function () { };
    ObservableMedia.prototype.subscribe = function (next, error, complete) { };
    return ObservableMedia;
}());
var MediaService = (function () {
    function MediaService(breakpoints, mediaWatcher) {
        this.breakpoints = breakpoints;
        this.mediaWatcher = mediaWatcher;
        this.filterOverlaps = true;
        this._registerBreakPoints();
        this.observable$ = this._buildObservable();
    }
    MediaService.prototype.isActive = function (alias) {
        var query = this._toMediaQuery(alias);
        return this.mediaWatcher.isActive(query);
    };
    MediaService.prototype.subscribe = function (next, error, complete) {
        return this.observable$.subscribe(next, error, complete);
    };
    MediaService.prototype.asObservable = function () {
        return this.observable$;
    };
    MediaService.prototype._registerBreakPoints = function () {
        var queries = this.breakpoints.sortedItems.map(function (bp) { return bp.mediaQuery; });
        this.mediaWatcher.registerQuery(queries);
    };
    MediaService.prototype._buildObservable = function () {
        var _this = this;
        var self = this;
        var activationsOnly = function (change) {
            return change.matches === true;
        };
        var addAliasInformation = function (change) {
            return mergeAlias(change, _this._findByQuery(change.mediaQuery));
        };
        var excludeOverlaps = function (change) {
            var bp = _this.breakpoints.findByQuery(change.mediaQuery);
            return !bp ? true : !(self.filterOverlaps && bp.overlapping);
        };
        return rxjs_operator_filter.filter.call(rxjs_operator_map.map.call(rxjs_operator_filter.filter.call(this.mediaWatcher.observe(), activationsOnly), addAliasInformation), excludeOverlaps);
    };
    MediaService.prototype._findByAlias = function (alias) {
        return this.breakpoints.findByAlias(alias);
    };
    MediaService.prototype._findByQuery = function (query) {
        return this.breakpoints.findByQuery(query);
    };
    MediaService.prototype._toMediaQuery = function (query) {
        var bp = this._findByAlias(query) || this._findByQuery(query);
        return bp ? bp.mediaQuery : query;
    };
    return MediaService;
}());
MediaService.decorators = [
    { type: _angular_core.Injectable },
];
MediaService.ctorParameters = function () { return [
    { type: BreakPointRegistry, },
    { type: MatchMedia, },
]; };
var ALIAS_DELIMITERS = /(\.|-|_)/g;
function firstUpperCase(part) {
    var first = part.length > 0 ? part.charAt(0) : '';
    var remainder = (part.length > 1) ? part.slice(1) : '';
    return first.toUpperCase() + remainder;
}
function camelCase(name) {
    return name
        .replace(ALIAS_DELIMITERS, '|')
        .split('|')
        .map(firstUpperCase)
        .join('');
}
function validateSuffixes(list) {
    list.forEach(function (bp) {
        if (!bp.suffix || bp.suffix === '') {
            bp.suffix = camelCase(bp.alias);
            bp.overlapping = bp.overlapping || false;
        }
    });
    return list;
}
function mergeByAlias(defaults, custom) {
    if (custom === void 0) { custom = []; }
    var merged = defaults.map(function (bp) { return extendObject({}, bp); });
    var findByAlias = function (alias) { return merged.reduce(function (result, bp) {
        return result || ((bp.alias === alias) ? bp : null);
    }, null); };
    custom.forEach(function (bp) {
        var target = findByAlias(bp.alias);
        if (target) {
            extendObject(target, bp);
        }
        else {
            merged.push(bp);
        }
    });
    return validateSuffixes(merged);
}
function buildMergedBreakPoints(_custom, options) {
    options = extendObject({}, {
        defaults: true,
        orientation: false
    }, options || {});
    return function () {
        var defaults = options.orientations ? ORIENTATION_BREAKPOINTS.concat(DEFAULT_BREAKPOINTS) :
            DEFAULT_BREAKPOINTS;
        return options.defaults ? mergeByAlias(defaults, _custom || []) : mergeByAlias(_custom);
    };
}
function DEFAULT_BREAKPOINTS_PROVIDER_FACTORY() {
    return validateSuffixes(DEFAULT_BREAKPOINTS);
}
var DEFAULT_BREAKPOINTS_PROVIDER = {
    provide: BREAKPOINTS,
    useFactory: DEFAULT_BREAKPOINTS_PROVIDER_FACTORY
};
function CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(_custom, options) {
    return {
        provide: BREAKPOINTS,
        useFactory: buildMergedBreakPoints(_custom, options)
    };
}
function OBSERVABLE_MEDIA_PROVIDER_FACTORY(parentService, matchMedia, breakpoints) {
    return parentService || new MediaService(breakpoints, matchMedia);
}
var OBSERVABLE_MEDIA_PROVIDER = {
    provide: ObservableMedia,
    deps: [
        [new _angular_core.Optional(), new _angular_core.SkipSelf(), ObservableMedia],
        MatchMedia,
        BreakPointRegistry
    ],
    useFactory: OBSERVABLE_MEDIA_PROVIDER_FACTORY
};
function MEDIA_MONITOR_PROVIDER_FACTORY(parentMonitor, breakpoints, matchMedia) {
    return parentMonitor || new MediaMonitor(breakpoints, matchMedia);
}
var MEDIA_MONITOR_PROVIDER = {
    provide: MediaMonitor,
    deps: [
        [new _angular_core.Optional(), new _angular_core.SkipSelf(), MediaMonitor],
        BreakPointRegistry,
        MatchMedia,
    ],
    useFactory: MEDIA_MONITOR_PROVIDER_FACTORY
};
var MediaQueriesModule = (function () {
    function MediaQueriesModule() {
    }
    return MediaQueriesModule;
}());
MediaQueriesModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                providers: [
                    DEFAULT_BREAKPOINTS_PROVIDER,
                    BreakPointRegistry,
                    MatchMedia,
                    MediaMonitor,
                    OBSERVABLE_MEDIA_PROVIDER
                ]
            },] },
];
MediaQueriesModule.ctorParameters = function () { return []; };
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
    ShowHideDirective,
    ClassDirective,
    StyleDirective
];
var FlexLayoutModule = (function () {
    function FlexLayoutModule() {
    }
    FlexLayoutModule.provideBreakPoints = function (breakpoints, options) {
        return {
            ngModule: FlexLayoutModule,
            providers: [
                CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(breakpoints, options || { orientations: false })
            ]
        };
    };
    return FlexLayoutModule;
}());
FlexLayoutModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [MediaQueriesModule],
                exports: [MediaQueriesModule].concat(ALL_DIRECTIVES),
                declarations: ALL_DIRECTIVES.slice(),
                providers: [
                    MEDIA_MONITOR_PROVIDER,
                    DEFAULT_BREAKPOINTS_PROVIDER,
                    OBSERVABLE_MEDIA_PROVIDER
                ]
            },] },
];
FlexLayoutModule.ctorParameters = function () { return []; };

exports.VERSION = VERSION;
exports.BaseFxDirective = BaseFxDirective;
exports.BaseFxDirectiveAdapter = BaseFxDirectiveAdapter;
exports.KeyOptions = KeyOptions;
exports.ResponsiveActivation = ResponsiveActivation;
exports.LayoutDirective = LayoutDirective;
exports.LayoutAlignDirective = LayoutAlignDirective;
exports.LayoutGapDirective = LayoutGapDirective;
exports.LayoutWrapDirective = LayoutWrapDirective;
exports.FlexDirective = FlexDirective;
exports.FlexAlignDirective = FlexAlignDirective;
exports.FlexFillDirective = FlexFillDirective;
exports.FlexOffsetDirective = FlexOffsetDirective;
exports.FlexOrderDirective = FlexOrderDirective;
exports.ClassDirective = ClassDirective;
exports.StyleDirective = StyleDirective;
exports.negativeOf = negativeOf;
exports.ShowHideDirective = ShowHideDirective;
exports.RESPONSIVE_ALIASES = RESPONSIVE_ALIASES;
exports.DEFAULT_BREAKPOINTS = DEFAULT_BREAKPOINTS;
exports.ScreenTypes = ScreenTypes;
exports.ORIENTATION_BREAKPOINTS = ORIENTATION_BREAKPOINTS;
exports.BREAKPOINTS = BREAKPOINTS;
exports.BreakPointRegistry = BreakPointRegistry;
exports.ObservableMedia = ObservableMedia;
exports.MediaService = MediaService;
exports.MatchMedia = MatchMedia;
exports.isBrowser = isBrowser;
exports.MediaChange = MediaChange;
exports.MediaMonitor = MediaMonitor;
exports.buildMergedBreakPoints = buildMergedBreakPoints;
exports.DEFAULT_BREAKPOINTS_PROVIDER_FACTORY = DEFAULT_BREAKPOINTS_PROVIDER_FACTORY;
exports.DEFAULT_BREAKPOINTS_PROVIDER = DEFAULT_BREAKPOINTS_PROVIDER;
exports.CUSTOM_BREAKPOINTS_PROVIDER_FACTORY = CUSTOM_BREAKPOINTS_PROVIDER_FACTORY;
exports.OBSERVABLE_MEDIA_PROVIDER_FACTORY = OBSERVABLE_MEDIA_PROVIDER_FACTORY;
exports.OBSERVABLE_MEDIA_PROVIDER = OBSERVABLE_MEDIA_PROVIDER;
exports.MEDIA_MONITOR_PROVIDER_FACTORY = MEDIA_MONITOR_PROVIDER_FACTORY;
exports.MEDIA_MONITOR_PROVIDER = MEDIA_MONITOR_PROVIDER;
exports.MediaQueriesModule = MediaQueriesModule;
exports.mergeAlias = mergeAlias;
exports.applyCssPrefixes = applyCssPrefixes;
exports.validateBasis = validateBasis;
exports.LAYOUT_VALUES = LAYOUT_VALUES;
exports.buildLayoutCSS = buildLayoutCSS;
exports.validateValue = validateValue;
exports.isFlowHorizontal = isFlowHorizontal;
exports.validateWrapValue = validateWrapValue;
exports.validateSuffixes = validateSuffixes;
exports.mergeByAlias = mergeByAlias;
exports.extendObject = extendObject;
exports.NgStyleKeyValue = NgStyleKeyValue;
exports.ngStyleUtils = ngStyleUtils;
exports.FlexLayoutModule = FlexLayoutModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=flex-layout.umd.js.map
