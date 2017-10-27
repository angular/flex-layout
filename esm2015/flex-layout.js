/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Inject, Injectable, InjectionToken, Input, IterableDiffers, KeyValueDiffers, NgModule, NgZone, Optional, Renderer2, SecurityContext, Self, SimpleChange, SkipSelf, Version } from '@angular/core';
import { DomSanitizer, ɵgetDOM } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { DOCUMENT, NgClass, NgStyle } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

const VERSION = new Version('2.0.0-beta.9-e3b7fde');

const LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];
function buildLayoutCSS(value) {
    let [direction, wrap] = validateValue(value);
    return buildCSS(direction, wrap);
}
function validateValue(value) {
    value = value ? value.toLowerCase() : '';
    let [direction, wrap] = value.split(' ');
    if (!LAYOUT_VALUES.find(x => x === direction)) {
        direction = LAYOUT_VALUES[0];
    }
    return [direction, validateWrapValue(wrap)];
}
function isFlowHorizontal(value) {
    let [flow, _] = validateValue(value);
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
function buildCSS(direction, wrap = null) {
    return {
        'display': 'flex',
        'box-sizing': 'border-box',
        'flex-direction': direction,
        'flex-wrap': !!wrap ? wrap : null
    };
}

function applyCssPrefixes(target) {
    for (let key in target) {
        let value = target[key] || '';
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
    let styles = {};
    if (typeof style === 'string') {
        styles[style] = value;
        style = styles;
    }
    styles = applyCssPrefixes(style);
    applyMultiValueStyleToElement(styles, element, renderer);
}
function applyStyleToElements(renderer, style, elements) {
    let styles = applyCssPrefixes(style);
    elements.forEach(el => {
        applyMultiValueStyleToElement(styles, el, renderer);
    });
}
function applyMultiValueStyleToElement(styles, element, renderer) {
    Object.keys(styles).sort().forEach(key => {
        const values = Array.isArray(styles[key]) ? styles[key] : [styles[key]];
        for (let value of values) {
            renderer.setStyle(element, key, value);
        }
    });
}
function lookupAttributeValue(element, attribute) {
    return ɵgetDOM().getAttribute(element, attribute) || '';
}
function lookupInlineStyle(element, styleName) {
    return ɵgetDOM().getStyle(element, styleName);
}
function lookupStyle(element, styleName, inlineOnly = false) {
    let value = '';
    if (element) {
        try {
            let immediateValue = value = lookupInlineStyle(element, styleName);
            if (!inlineOnly) {
                value = immediateValue || ɵgetDOM().getComputedStyle(element).getPropertyValue(styleName);
            }
        }
        catch (e) {
        }
    }
    return value ? value.trim() : 'block';
}

function extendObject(dest, ...sources) {
    if (dest == null) {
        throw TypeError('Cannot convert undefined or null to object');
    }
    for (let source of sources) {
        if (source != null) {
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            }
        }
    }
    return dest;
}

class KeyOptions {
    constructor(baseKey, defaultValue, inputKeys) {
        this.baseKey = baseKey;
        this.defaultValue = defaultValue;
        this.inputKeys = inputKeys;
    }
}
class ResponsiveActivation {
    constructor(_options, _mediaMonitor, _onMediaChanges) {
        this._options = _options;
        this._mediaMonitor = _mediaMonitor;
        this._onMediaChanges = _onMediaChanges;
        this._subscribers = [];
        this._registryMap = this._buildRegistryMap();
        this._subscribers = this._configureChangeObservers();
    }
    get registryFromLargest() {
        return [...this._registryMap].reverse();
    }
    get mediaMonitor() {
        return this._mediaMonitor;
    }
    get activatedInputKey() {
        return this._activatedInputKey || this._options.baseKey;
    }
    get activatedInput() {
        let key = this.activatedInputKey;
        return this.hasKeyValue(key) ? this._lookupKeyValue(key) : this._options.defaultValue;
    }
    hasKeyValue(key) {
        let value = this._options.inputKeys[key];
        return typeof value !== 'undefined';
    }
    destroy() {
        this._subscribers.forEach((link) => {
            link.unsubscribe();
        });
        this._subscribers = [];
    }
    _configureChangeObservers() {
        let subscriptions = [];
        this._registryMap.forEach((bp) => {
            if (this._keyInUse(bp.key)) {
                let buildChanges = (change) => {
                    change = change.clone();
                    change.property = this._options.baseKey;
                    return change;
                };
                subscriptions.push(this.mediaMonitor.observe(bp.alias).pipe(map(buildChanges))
                    .subscribe(change => {
                    this._onMonitorEvents(change);
                }));
            }
        });
        return subscriptions;
    }
    _buildRegistryMap() {
        return this.mediaMonitor.breakpoints
            .map(bp => {
            return (extendObject({}, bp, {
                baseKey: this._options.baseKey,
                key: this._options.baseKey + bp.suffix
            }));
        })
            .filter(bp => this._keyInUse(bp.key));
    }
    _onMonitorEvents(change) {
        if (change.property == this._options.baseKey) {
            change.value = this._calculateActivatedValue(change);
            this._onMediaChanges(change);
        }
    }
    _keyInUse(key) {
        return this._lookupKeyValue(key) !== undefined;
    }
    _calculateActivatedValue(current) {
        const currentKey = this._options.baseKey + current.suffix;
        let newKey = this._activatedInputKey;
        newKey = current.matches ? currentKey : ((newKey == currentKey) ? '' : newKey);
        this._activatedInputKey = this._validateInputKey(newKey);
        return this.activatedInput;
    }
    _validateInputKey(inputKey) {
        let isMissingKey = (key) => !this._keyInUse(key);
        if (isMissingKey(inputKey)) {
            this.mediaMonitor.activeOverlaps.some(bp => {
                let key = this._options.baseKey + bp.suffix;
                if (!isMissingKey(key)) {
                    inputKey = key;
                    return true;
                }
                return false;
            });
        }
        return inputKey;
    }
    _lookupKeyValue(key) {
        return this._options.inputKeys[key];
    }
}

class BaseFxDirective {
    constructor(_mediaMonitor, _elementRef, _renderer) {
        this._mediaMonitor = _mediaMonitor;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._inputMap = {};
        this._hasInitialized = false;
    }
    get hasMediaQueryListener() {
        return !!this._mqActivation;
    }
    get activatedValue() {
        return this._mqActivation ? this._mqActivation.activatedInput : undefined;
    }
    set activatedValue(value) {
        let key = 'baseKey', previousVal;
        if (this._mqActivation) {
            key = this._mqActivation.activatedInputKey;
            previousVal = this._inputMap[key];
            this._inputMap[key] = value;
        }
        let change = new SimpleChange(previousVal, value, false);
        this.ngOnChanges(({ [key]: change }));
    }
    get parentElement() {
        return this._elementRef.nativeElement.parentNode;
    }
    get nativeElement() {
        return this._elementRef.nativeElement;
    }
    _queryInput(key) {
        return this._inputMap[key];
    }
    ngOnInit() {
        this._display = this._getDisplayStyle();
        this._hasInitialized = true;
    }
    ngOnChanges(change) {
        throw new Error(`BaseFxDirective::ngOnChanges should be overridden in subclass: ${change}`);
    }
    ngOnDestroy() {
        if (this._mqActivation) {
            this._mqActivation.destroy();
        }
        this._mediaMonitor = null;
    }
    _getDefaultVal(key, fallbackVal) {
        let val = this._queryInput(key);
        let hasDefaultVal = (val !== undefined && val !== null);
        return (hasDefaultVal && val !== '') ? val : fallbackVal;
    }
    _getDisplayStyle(source = this.nativeElement) {
        return lookupStyle(source || this.nativeElement, 'display');
    }
    _getAttributeValue(attribute, source = this.nativeElement) {
        return lookupAttributeValue(source || this.nativeElement, attribute);
    }
    _getFlowDirection(target, addIfMissing = false) {
        let value = 'row';
        if (target) {
            value = lookupStyle(target, 'flex-direction') || 'row';
            let hasInlineValue = lookupInlineStyle(target, 'flex-direction');
            if (!hasInlineValue && addIfMissing) {
                applyStyleToElements(this._renderer, buildLayoutCSS(value), [target]);
            }
        }
        return value.trim();
    }
    _applyStyleToElement(style, value, nativeElement = this.nativeElement) {
        let element = nativeElement || this.nativeElement;
        applyStyleToElement(this._renderer, element, style, value);
    }
    _applyStyleToElements(style, elements) {
        applyStyleToElements(this._renderer, style, elements || []);
    }
    _cacheInput(key, source) {
        if (typeof source === 'object') {
            for (let prop in source) {
                this._inputMap[prop] = source[prop];
            }
        }
        else {
            if (!!key) {
                this._inputMap[key] = source;
            }
        }
    }
    _listenForMediaQueryChanges(key, defaultValue, onMediaQueryChange) {
        if (!this._mqActivation) {
            let keyOptions = new KeyOptions(key, defaultValue, this._inputMap);
            this._mqActivation = new ResponsiveActivation(keyOptions, this._mediaMonitor, (change) => onMediaQueryChange(change));
        }
        return this._mqActivation;
    }
    get childrenNodes() {
        const obj = this.nativeElement.children;
        const buffer = [];
        for (let i = obj.length; i--;) {
            buffer[i] = obj[i];
        }
        return buffer;
    }
    hasResponsiveAPI(baseKey) {
        const totalKeys = Object.keys(this._inputMap).length;
        const baseValue = this._inputMap[baseKey];
        return (totalKeys - (!!baseValue ? 1 : 0)) > 0;
    }
    hasKeyValue(key) {
        return this._mqActivation.hasKeyValue(key);
    }
    get hasInitialized() {
        return this._hasInitialized;
    }
}

class BaseFxDirectiveAdapter extends BaseFxDirective {
    constructor(_baseKey, _mediaMonitor, _elementRef, _renderer) {
        super(_mediaMonitor, _elementRef, _renderer);
        this._baseKey = _baseKey;
        this._mediaMonitor = _mediaMonitor;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
    }
    get activeKey() {
        let mqa = this._mqActivation;
        let key = mqa ? mqa.activatedInputKey : this._baseKey;
        return (key === 'class') ? 'klazz' : key;
    }
    get inputMap() {
        return this._inputMap;
    }
    get mqActivation() {
        return this._mqActivation;
    }
    hasResponsiveAPI() {
        return super.hasResponsiveAPI(this._baseKey);
    }
    queryInput(key) {
        return key ? this._queryInput(key) : undefined;
    }
    cacheInput(key, source, cacheRaw = false) {
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
            throw new Error(`Invalid class value '${key}' provided. Did you want to cache the raw value?`);
        }
    }
    listenForMediaQueryChanges(key, defaultValue, onMediaQueryChange) {
        return this._listenForMediaQueryChanges(key, defaultValue, onMediaQueryChange);
    }
    _cacheInputRaw(key, source) {
        this._inputMap[key] = source;
    }
    _cacheInputArray(key = '', source) {
        this._inputMap[key] = source.join(' ');
    }
    _cacheInputObject(key = '', source) {
        let classes = [];
        for (let prop in source) {
            if (!!source[prop]) {
                classes.push(prop);
            }
        }
        this._inputMap[key] = classes.join(' ');
    }
    _cacheInputString(key = '', source) {
        this._inputMap[key] = source;
    }
}

const BREAKPOINTS = new InjectionToken('Token (@angular/flex-layout) Breakpoints');

class BreakPointRegistry {
    constructor(_registry) {
        this._registry = _registry;
    }
    get items() {
        return [...this._registry];
    }
    get sortedItems() {
        let overlaps = this._registry.filter(it => it.overlapping === true);
        let nonOverlaps = this._registry.filter(it => it.overlapping !== true);
        return [...overlaps, ...nonOverlaps];
    }
    findByAlias(alias) {
        return this._registry.find(bp => bp.alias == alias) || null;
    }
    findByQuery(query) {
        return this._registry.find(bp => bp.mediaQuery == query) || null;
    }
    get overlappings() {
        return this._registry.filter(it => it.overlapping == true);
    }
    get aliases() {
        return this._registry.map(it => it.alias);
    }
    get suffixes() {
        return this._registry.map(it => !!it.suffix ? it.suffix : '');
    }
}
BreakPointRegistry.decorators = [
    { type: Injectable },
];
BreakPointRegistry.ctorParameters = () => [
    { type: Array, decorators: [{ type: Inject, args: [BREAKPOINTS,] },] },
];

class MediaChange {
    constructor(matches = false, mediaQuery = 'all', mqAlias = '', suffix = '') {
        this.matches = matches;
        this.mediaQuery = mediaQuery;
        this.mqAlias = mqAlias;
        this.suffix = suffix;
    }
    clone() {
        return new MediaChange(this.matches, this.mediaQuery, this.mqAlias, this.suffix);
    }
}

class MatchMedia {
    constructor(_zone, _document) {
        this._zone = _zone;
        this._document = _document;
        this._registry = new Map();
        this._source = new BehaviorSubject(new MediaChange(true));
        this._observable$ = this._source.asObservable();
    }
    isActive(mediaQuery) {
        let mql = this._registry.get(mediaQuery);
        return !!mql ? mql.matches : false;
    }
    observe(mediaQuery) {
        if (mediaQuery) {
            this.registerQuery(mediaQuery);
        }
        return this._observable$.pipe(filter((change) => {
            return mediaQuery ? (change.mediaQuery === mediaQuery) : true;
        }));
    }
    registerQuery(mediaQuery) {
        let list = normalizeQuery(mediaQuery);
        if (list.length > 0) {
            prepareQueryCSS(list, this._document);
            list.forEach(query => {
                let mql = this._registry.get(query);
                let onMQLEvent = (e) => {
                    this._zone.run(() => {
                        let change = new MediaChange(e.matches, query);
                        this._source.next(change);
                    });
                };
                if (!mql) {
                    mql = this._buildMQL(query);
                    mql.addListener(onMQLEvent);
                    this._registry.set(query, mql);
                }
                if (mql.matches) {
                    onMQLEvent(mql);
                }
            });
        }
    }
    _buildMQL(query) {
        let canListen = isBrowser() && !!((window)).matchMedia('all').addListener;
        return canListen ? ((window)).matchMedia(query) : ({
            matches: query === 'all' || query === '',
            media: query,
            addListener: () => {
            },
            removeListener: () => {
            }
        });
    }
}
MatchMedia.decorators = [
    { type: Injectable },
];
MatchMedia.ctorParameters = () => [
    { type: NgZone, },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
];
function isBrowser() {
    return ɵgetDOM().supportsDOMEvents();
}
const ALL_STYLES = {};
function prepareQueryCSS(mediaQueries, _document) {
    let list = mediaQueries.filter(it => !ALL_STYLES[it]);
    if (list.length > 0) {
        let query = list.join(', ');
        try {
            let styleEl = ɵgetDOM().createElement('style');
            ɵgetDOM().setAttribute(styleEl, 'type', 'text/css');
            if (!styleEl['styleSheet']) {
                let cssText = `/*
  @angular/flex-layout - workaround for possible browser quirk with mediaQuery listeners
  see http://bit.ly/2sd4HMP
*/
@media ${query} {.fx-query-test{ }}`;
                ɵgetDOM().appendChild(styleEl, ɵgetDOM().createTextNode(cssText));
            }
            ɵgetDOM().appendChild(_document.head, styleEl);
            list.forEach(mq => ALL_STYLES[mq] = styleEl);
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
    let seen = {};
    return list.filter(item => {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function mergeAlias(dest, source) {
    return extendObject(dest, source ? {
        mqAlias: source.alias,
        suffix: source.suffix
    } : {});
}

class MediaMonitor {
    constructor(_breakpoints, _matchMedia) {
        this._breakpoints = _breakpoints;
        this._matchMedia = _matchMedia;
        this._registerBreakpoints();
    }
    get breakpoints() {
        return [...this._breakpoints.items];
    }
    get activeOverlaps() {
        let items = this._breakpoints.overlappings.reverse();
        return items.filter((bp) => {
            return this._matchMedia.isActive(bp.mediaQuery);
        });
    }
    get active() {
        let found = null, items = this.breakpoints.reverse();
        items.forEach(bp => {
            if (bp.alias !== '') {
                if (!found && this._matchMedia.isActive(bp.mediaQuery)) {
                    found = bp;
                }
            }
        });
        let first = this.breakpoints[0];
        return found || (this._matchMedia.isActive(first.mediaQuery) ? first : null);
    }
    isActive(alias) {
        let bp = this._breakpoints.findByAlias(alias) || this._breakpoints.findByQuery(alias);
        return this._matchMedia.isActive(bp ? bp.mediaQuery : alias);
    }
    observe(alias) {
        let bp = this._breakpoints.findByAlias(alias || '') ||
            this._breakpoints.findByQuery(alias || '');
        let hasAlias = (change) => (bp ? change.mqAlias !== '' : true);
        let media$ = this._matchMedia.observe(bp ? bp.mediaQuery : alias);
        return media$.pipe(map(change => mergeAlias(change, bp)), filter(hasAlias));
    }
    _registerBreakpoints() {
        let queries = this._breakpoints.sortedItems.map(bp => bp.mediaQuery);
        this._matchMedia.registerQuery(queries);
    }
}
MediaMonitor.decorators = [
    { type: Injectable },
];
MediaMonitor.ctorParameters = () => [
    { type: BreakPointRegistry, },
    { type: MatchMedia, },
];

class LayoutDirective extends BaseFxDirective {
    constructor(monitor, elRef, renderer) {
        super(monitor, elRef, renderer);
        this._announcer = new ReplaySubject(1);
        this.layout$ = this._announcer.asObservable();
    }
    set layout(val) { this._cacheInput('layout', val); }
    ;
    set layoutXs(val) { this._cacheInput('layoutXs', val); }
    ;
    set layoutSm(val) { this._cacheInput('layoutSm', val); }
    ;
    set layoutMd(val) { this._cacheInput('layoutMd', val); }
    ;
    set layoutLg(val) { this._cacheInput('layoutLg', val); }
    ;
    set layoutXl(val) { this._cacheInput('layoutXl', val); }
    ;
    set layoutGtXs(val) { this._cacheInput('layoutGtXs', val); }
    ;
    set layoutGtSm(val) { this._cacheInput('layoutGtSm', val); }
    ;
    set layoutGtMd(val) { this._cacheInput('layoutGtMd', val); }
    ;
    set layoutGtLg(val) { this._cacheInput('layoutGtLg', val); }
    ;
    set layoutLtSm(val) { this._cacheInput('layoutLtSm', val); }
    ;
    set layoutLtMd(val) { this._cacheInput('layoutLtMd', val); }
    ;
    set layoutLtLg(val) { this._cacheInput('layoutLtLg', val); }
    ;
    set layoutLtXl(val) { this._cacheInput('layoutLtXl', val); }
    ;
    ngOnChanges(changes) {
        if (changes['layout'] != null || this._mqActivation) {
            this._updateWithDirection();
        }
    }
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('layout', 'row', (changes) => {
            this._updateWithDirection(changes.value);
        });
        this._updateWithDirection();
    }
    _updateWithDirection(value) {
        value = value || this._queryInput('layout') || 'row';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        let css = buildLayoutCSS(!!value ? value : '');
        this._applyStyleToElement(css);
        this._announcer.next(css['flex-direction']);
    }
}
LayoutDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxLayout],
  [fxLayout.xs], [fxLayout.sm], [fxLayout.md], [fxLayout.lg], [fxLayout.xl],
  [fxLayout.lt-sm], [fxLayout.lt-md], [fxLayout.lt-lg], [fxLayout.lt-xl],
  [fxLayout.gt-xs], [fxLayout.gt-sm], [fxLayout.gt-md], [fxLayout.gt-lg]
` },] },
];
LayoutDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: Renderer2, },
];
LayoutDirective.propDecorators = {
    'layout': [{ type: Input, args: ['fxLayout',] },],
    'layoutXs': [{ type: Input, args: ['fxLayout.xs',] },],
    'layoutSm': [{ type: Input, args: ['fxLayout.sm',] },],
    'layoutMd': [{ type: Input, args: ['fxLayout.md',] },],
    'layoutLg': [{ type: Input, args: ['fxLayout.lg',] },],
    'layoutXl': [{ type: Input, args: ['fxLayout.xl',] },],
    'layoutGtXs': [{ type: Input, args: ['fxLayout.gt-xs',] },],
    'layoutGtSm': [{ type: Input, args: ['fxLayout.gt-sm',] },],
    'layoutGtMd': [{ type: Input, args: ['fxLayout.gt-md',] },],
    'layoutGtLg': [{ type: Input, args: ['fxLayout.gt-lg',] },],
    'layoutLtSm': [{ type: Input, args: ['fxLayout.lt-sm',] },],
    'layoutLtMd': [{ type: Input, args: ['fxLayout.lt-md',] },],
    'layoutLtLg': [{ type: Input, args: ['fxLayout.lt-lg',] },],
    'layoutLtXl': [{ type: Input, args: ['fxLayout.lt-xl',] },],
};

class LayoutAlignDirective extends BaseFxDirective {
    constructor(monitor, elRef, renderer, container) {
        super(monitor, elRef, renderer);
        this._layout = 'row';
        if (container) {
            this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
        }
    }
    set align(val) { this._cacheInput('align', val); }
    set alignXs(val) { this._cacheInput('alignXs', val); }
    set alignSm(val) { this._cacheInput('alignSm', val); }
    ;
    set alignMd(val) { this._cacheInput('alignMd', val); }
    ;
    set alignLg(val) { this._cacheInput('alignLg', val); }
    ;
    set alignXl(val) { this._cacheInput('alignXl', val); }
    ;
    set alignGtXs(val) { this._cacheInput('alignGtXs', val); }
    ;
    set alignGtSm(val) { this._cacheInput('alignGtSm', val); }
    ;
    set alignGtMd(val) { this._cacheInput('alignGtMd', val); }
    ;
    set alignGtLg(val) { this._cacheInput('alignGtLg', val); }
    ;
    set alignLtSm(val) { this._cacheInput('alignLtSm', val); }
    ;
    set alignLtMd(val) { this._cacheInput('alignLtMd', val); }
    ;
    set alignLtLg(val) { this._cacheInput('alignLtLg', val); }
    ;
    set alignLtXl(val) { this._cacheInput('alignLtXl', val); }
    ;
    ngOnChanges(changes) {
        if (changes['align'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('align', 'start stretch', (changes) => {
            this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    }
    _updateWithValue(value) {
        value = value || this._queryInput('align') || 'start stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
        this._allowStretching(value, !this._layout ? 'row' : this._layout);
    }
    _onLayoutChange(direction) {
        this._layout = (direction || '').toLowerCase();
        if (!LAYOUT_VALUES.find(x => x === this._layout)) {
            this._layout = 'row';
        }
        let value = this._queryInput('align') || 'start stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._allowStretching(value, this._layout || 'row');
    }
    _buildCSS(align) {
        let css = {}, [main_axis, cross_axis] = align.split(' ');
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
            case 'space-evenly':
                css['justify-content'] = 'space-evenly';
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
    }
    _allowStretching(align, layout) {
        let [, cross_axis] = align.split(' ');
        if (cross_axis == 'stretch') {
            this._applyStyleToElement({
                'box-sizing': 'border-box',
                'max-width': !isFlowHorizontal(layout) ? '100%' : null,
                'max-height': isFlowHorizontal(layout) ? '100%' : null
            });
        }
    }
}
LayoutAlignDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxLayoutAlign],
  [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md], [fxLayoutAlign.lg],[fxLayoutAlign.xl],
  [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md], [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl],
  [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm], [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]
` },] },
];
LayoutAlignDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
];
LayoutAlignDirective.propDecorators = {
    'align': [{ type: Input, args: ['fxLayoutAlign',] },],
    'alignXs': [{ type: Input, args: ['fxLayoutAlign.xs',] },],
    'alignSm': [{ type: Input, args: ['fxLayoutAlign.sm',] },],
    'alignMd': [{ type: Input, args: ['fxLayoutAlign.md',] },],
    'alignLg': [{ type: Input, args: ['fxLayoutAlign.lg',] },],
    'alignXl': [{ type: Input, args: ['fxLayoutAlign.xl',] },],
    'alignGtXs': [{ type: Input, args: ['fxLayoutAlign.gt-xs',] },],
    'alignGtSm': [{ type: Input, args: ['fxLayoutAlign.gt-sm',] },],
    'alignGtMd': [{ type: Input, args: ['fxLayoutAlign.gt-md',] },],
    'alignGtLg': [{ type: Input, args: ['fxLayoutAlign.gt-lg',] },],
    'alignLtSm': [{ type: Input, args: ['fxLayoutAlign.lt-sm',] },],
    'alignLtMd': [{ type: Input, args: ['fxLayoutAlign.lt-md',] },],
    'alignLtLg': [{ type: Input, args: ['fxLayoutAlign.lt-lg',] },],
    'alignLtXl': [{ type: Input, args: ['fxLayoutAlign.lt-xl',] },],
};

class LayoutGapDirective extends BaseFxDirective {
    constructor(monitor, elRef, renderer, container, _zone) {
        super(monitor, elRef, renderer);
        this._zone = _zone;
        this._layout = 'row';
        if (container) {
            this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
        }
    }
    set gap(val) { this._cacheInput('gap', val); }
    set gapXs(val) { this._cacheInput('gapXs', val); }
    set gapSm(val) { this._cacheInput('gapSm', val); }
    ;
    set gapMd(val) { this._cacheInput('gapMd', val); }
    ;
    set gapLg(val) { this._cacheInput('gapLg', val); }
    ;
    set gapXl(val) { this._cacheInput('gapXl', val); }
    ;
    set gapGtXs(val) { this._cacheInput('gapGtXs', val); }
    ;
    set gapGtSm(val) { this._cacheInput('gapGtSm', val); }
    ;
    set gapGtMd(val) { this._cacheInput('gapGtMd', val); }
    ;
    set gapGtLg(val) { this._cacheInput('gapGtLg', val); }
    ;
    set gapLtSm(val) { this._cacheInput('gapLtSm', val); }
    ;
    set gapLtMd(val) { this._cacheInput('gapLtMd', val); }
    ;
    set gapLtLg(val) { this._cacheInput('gapLtLg', val); }
    ;
    set gapLtXl(val) { this._cacheInput('gapLtXl', val); }
    ;
    ngOnChanges(changes) {
        if (changes['gap'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    ngAfterContentInit() {
        this._watchContentChanges();
        this._listenForMediaQueryChanges('gap', '0', (changes) => {
            this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
        if (this._observer) {
            this._observer.disconnect();
        }
    }
    _watchContentChanges() {
        this._zone.runOutsideAngular(() => {
            if (typeof MutationObserver !== 'undefined') {
                this._observer = new MutationObserver((mutations) => {
                    let validatedChanges = (it) => {
                        return (it.addedNodes && it.addedNodes.length > 0) ||
                            (it.removedNodes && it.removedNodes.length > 0);
                    };
                    if (mutations.some(validatedChanges)) {
                        this._updateWithValue();
                    }
                });
                this._observer.observe(this.nativeElement, { childList: true });
            }
        });
    }
    _onLayoutChange(direction) {
        this._layout = (direction || '').toLowerCase();
        if (!LAYOUT_VALUES.find(x => x === this._layout)) {
            this._layout = 'row';
        }
        this._updateWithValue();
    }
    _updateWithValue(value) {
        value = value || this._queryInput('gap') || '0';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        let items = this.childrenNodes
            .filter(el => el.nodeType === 1 && this._getDisplayStyle(el) != 'none');
        let numItems = items.length;
        if (numItems > 0) {
            let lastItem = items[numItems - 1];
            items = items.filter((_, j) => j < numItems - 1);
            this._applyStyleToElements(this._buildCSS(value), items);
            this._applyStyleToElements(this._buildCSS(), [lastItem]);
        }
    }
    _buildCSS(value = null) {
        let key, margins = {
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
    }
}
LayoutGapDirective.decorators = [
    { type: Directive, args: [{
                selector: `
  [fxLayoutGap],
  [fxLayoutGap.xs], [fxLayoutGap.sm], [fxLayoutGap.md], [fxLayoutGap.lg], [fxLayoutGap.xl],
  [fxLayoutGap.lt-sm], [fxLayoutGap.lt-md], [fxLayoutGap.lt-lg], [fxLayoutGap.lt-xl],
  [fxLayoutGap.gt-xs], [fxLayoutGap.gt-sm], [fxLayoutGap.gt-md], [fxLayoutGap.gt-lg]
`
            },] },
];
LayoutGapDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
    { type: NgZone, },
];
LayoutGapDirective.propDecorators = {
    'gap': [{ type: Input, args: ['fxLayoutGap',] },],
    'gapXs': [{ type: Input, args: ['fxLayoutGap.xs',] },],
    'gapSm': [{ type: Input, args: ['fxLayoutGap.sm',] },],
    'gapMd': [{ type: Input, args: ['fxLayoutGap.md',] },],
    'gapLg': [{ type: Input, args: ['fxLayoutGap.lg',] },],
    'gapXl': [{ type: Input, args: ['fxLayoutGap.xl',] },],
    'gapGtXs': [{ type: Input, args: ['fxLayoutGap.gt-xs',] },],
    'gapGtSm': [{ type: Input, args: ['fxLayoutGap.gt-sm',] },],
    'gapGtMd': [{ type: Input, args: ['fxLayoutGap.gt-md',] },],
    'gapGtLg': [{ type: Input, args: ['fxLayoutGap.gt-lg',] },],
    'gapLtSm': [{ type: Input, args: ['fxLayoutGap.lt-sm',] },],
    'gapLtMd': [{ type: Input, args: ['fxLayoutGap.lt-md',] },],
    'gapLtLg': [{ type: Input, args: ['fxLayoutGap.lt-lg',] },],
    'gapLtXl': [{ type: Input, args: ['fxLayoutGap.lt-xl',] },],
};

class LayoutWrapDirective extends BaseFxDirective {
    constructor(monitor, elRef, renderer, container) {
        super(monitor, elRef, renderer);
        this._layout = 'row';
        if (container) {
            this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
        }
    }
    set wrap(val) { this._cacheInput('wrap', val); }
    set wrapXs(val) { this._cacheInput('wrapXs', val); }
    set wrapSm(val) { this._cacheInput('wrapSm', val); }
    ;
    set wrapMd(val) { this._cacheInput('wrapMd', val); }
    ;
    set wrapLg(val) { this._cacheInput('wrapLg', val); }
    ;
    set wrapXl(val) { this._cacheInput('wrapXl', val); }
    ;
    set wrapGtXs(val) { this._cacheInput('wrapGtXs', val); }
    ;
    set wrapGtSm(val) { this._cacheInput('wrapGtSm', val); }
    ;
    set wrapGtMd(val) { this._cacheInput('wrapGtMd', val); }
    ;
    set wrapGtLg(val) { this._cacheInput('wrapGtLg', val); }
    ;
    set wrapLtSm(val) { this._cacheInput('wrapLtSm', val); }
    ;
    set wrapLtMd(val) { this._cacheInput('wrapLtMd', val); }
    ;
    set wrapLtLg(val) { this._cacheInput('wrapLtLg', val); }
    ;
    set wrapLtXl(val) { this._cacheInput('wrapLtXl', val); }
    ;
    ngOnChanges(changes) {
        if (changes['wrap'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('wrap', 'wrap', (changes) => {
            this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    }
    _onLayoutChange(direction) {
        this._layout = (direction || '').toLowerCase().replace('-reverse', '');
        if (!LAYOUT_VALUES.find(x => x === this._layout)) {
            this._layout = 'row';
        }
        this._updateWithValue();
    }
    _updateWithValue(value) {
        value = value || this._queryInput('wrap');
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        value = validateWrapValue(value || 'wrap');
        this._applyStyleToElement(this._buildCSS(value));
    }
    _buildCSS(value) {
        return {
            'display': 'flex',
            'flex-wrap': value,
            'flex-direction': this.flowDirection
        };
    }
    get flowDirection() {
        let computeFlowDirection = () => this._getFlowDirection(this.nativeElement);
        return this._layoutWatcher ? this._layout : computeFlowDirection();
    }
}
LayoutWrapDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxLayoutWrap], [fxLayoutWrap.xs], [fxLayoutWrap.sm], [fxLayoutWrap.lg], [fxLayoutWrap.xl],
  [fxLayoutWrap.gt-xs], [fxLayoutWrap.gt-sm], [fxLayoutWrap.gt-md], [fxLayoutWrap.gt-lg],
  [fxLayoutWrap.lt-xs], [fxLayoutWrap.lt-sm], [fxLayoutWrap.lt-md], [fxLayoutWrap.lt-lg]
` },] },
];
LayoutWrapDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
];
LayoutWrapDirective.propDecorators = {
    'wrap': [{ type: Input, args: ['fxLayoutWrap',] },],
    'wrapXs': [{ type: Input, args: ['fxLayoutWrap.xs',] },],
    'wrapSm': [{ type: Input, args: ['fxLayoutWrap.sm',] },],
    'wrapMd': [{ type: Input, args: ['fxLayoutWrap.md',] },],
    'wrapLg': [{ type: Input, args: ['fxLayoutWrap.lg',] },],
    'wrapXl': [{ type: Input, args: ['fxLayoutWrap.xl',] },],
    'wrapGtXs': [{ type: Input, args: ['fxLayoutWrap.gt-xs',] },],
    'wrapGtSm': [{ type: Input, args: ['fxLayoutWrap.gt-sm',] },],
    'wrapGtMd': [{ type: Input, args: ['fxLayoutWrap.gt-md',] },],
    'wrapGtLg': [{ type: Input, args: ['fxLayoutWrap.gt-lg',] },],
    'wrapLtSm': [{ type: Input, args: ['fxLayoutWrap.lt-sm',] },],
    'wrapLtMd': [{ type: Input, args: ['fxLayoutWrap.lt-md',] },],
    'wrapLtLg': [{ type: Input, args: ['fxLayoutWrap.lt-lg',] },],
    'wrapLtXl': [{ type: Input, args: ['fxLayoutWrap.lt-xl',] },],
};

function validateBasis(basis, grow = '1', shrink = '1') {
    let parts = [grow, shrink, basis];
    let j = basis.indexOf('calc');
    if (j > 0) {
        parts[2] = _validateCalcValue(basis.substring(j).trim());
        let matches = basis.substr(0, j).trim().split(' ');
        if (matches.length == 2) {
            parts[0] = matches[0];
            parts[1] = matches[1];
        }
    }
    else if (j == 0) {
        parts[2] = _validateCalcValue(basis.trim());
    }
    else {
        let matches = basis.split(' ');
        parts = (matches.length === 3) ? matches : [
            grow, shrink, basis
        ];
    }
    return parts;
}
function _validateCalcValue(calc) {
    return calc.replace(/[\s]/g, '').replace(/[\/\*\+\-]/g, ' $& ');
}

class FlexDirective extends BaseFxDirective {
    constructor(monitor, elRef, renderer, _container, _wrap) {
        super(monitor, elRef, renderer);
        this._container = _container;
        this._wrap = _wrap;
        this._cacheInput('flex', '');
        this._cacheInput('shrink', 1);
        this._cacheInput('grow', 1);
        if (_container) {
            this._layoutWatcher = _container.layout$.subscribe((direction) => {
                this._onLayoutChange(direction);
            });
        }
    }
    set shrink(val) { this._cacheInput('shrink', val); }
    ;
    set grow(val) { this._cacheInput('grow', val); }
    ;
    set flex(val) { this._cacheInput('flex', val); }
    ;
    set flexXs(val) { this._cacheInput('flexXs', val); }
    ;
    set flexSm(val) { this._cacheInput('flexSm', val); }
    ;
    set flexMd(val) { this._cacheInput('flexMd', val); }
    ;
    set flexLg(val) { this._cacheInput('flexLg', val); }
    ;
    set flexXl(val) { this._cacheInput('flexXl', val); }
    ;
    set flexGtXs(val) { this._cacheInput('flexGtXs', val); }
    ;
    set flexGtSm(val) { this._cacheInput('flexGtSm', val); }
    ;
    set flexGtMd(val) { this._cacheInput('flexGtMd', val); }
    ;
    set flexGtLg(val) { this._cacheInput('flexGtLg', val); }
    ;
    set flexLtSm(val) { this._cacheInput('flexLtSm', val); }
    ;
    set flexLtMd(val) { this._cacheInput('flexLtMd', val); }
    ;
    set flexLtLg(val) { this._cacheInput('flexLtLg', val); }
    ;
    set flexLtXl(val) { this._cacheInput('flexLtXl', val); }
    ;
    ngOnChanges(changes) {
        if (changes['flex'] != null || this._mqActivation) {
            this._updateStyle();
        }
    }
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('flex', '', (changes) => {
            this._updateStyle(changes.value);
        });
        this._updateStyle();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    }
    _onLayoutChange(direction) {
        this._layout = direction || this._layout || 'row';
        this._updateStyle();
    }
    _updateStyle(value) {
        let flexBasis = value || this._queryInput('flex') || '';
        if (this._mqActivation) {
            flexBasis = this._mqActivation.activatedInput;
        }
        let basis = String(flexBasis).replace(';', '');
        let parts = validateBasis(basis, this._queryInput('grow'), this._queryInput('shrink'));
        this._applyStyleToElement(this._validateValue.apply(this, parts));
    }
    _validateValue(grow, shrink, basis) {
        let layout = this._getFlowDirection(this.parentElement, true);
        let direction = (layout.indexOf('column') > -1) ? 'column' : 'row';
        let css, isValue;
        grow = (grow == '0') ? 0 : grow;
        shrink = (shrink == '0') ? 0 : shrink;
        let clearStyles = {
            'max-width': null,
            'max-height': null,
            'min-width': null,
            'min-height': null
        };
        switch (basis || '') {
            case '':
                css = extendObject(clearStyles, { 'flex': `${grow} ${shrink} 0.000000001px` });
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
                css = extendObject(clearStyles, { 'flex': `${grow} ${shrink} auto` });
                break;
            case 'none':
                grow = 0;
                shrink = 0;
                css = extendObject(clearStyles, { 'flex': '0 0 auto' });
                break;
            default:
                let hasCalc = String(basis).indexOf('calc') > -1;
                let isPercent = String(basis).indexOf('%') > -1 && !hasCalc;
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
                    'flex-grow': `${grow}`,
                    'flex-shrink': `${shrink}`,
                    'flex-basis': (isValue || this._wrap) ? `${basis}` : '100%'
                });
                break;
        }
        let max = isFlowHorizontal(direction) ? 'max-width' : 'max-height';
        let min = isFlowHorizontal(direction) ? 'min-width' : 'min-height';
        let usingCalc = (String(basis).indexOf('calc') > -1) || (basis == 'auto');
        let isPx = String(basis).indexOf('px') > -1 || usingCalc;
        let isFixed = !grow && !shrink;
        css[min] = (basis == '0%') ? 0 : isFixed || (isPx && grow) ? basis : null;
        css[max] = (basis == '0%') ? 0 : isFixed || (!usingCalc && shrink) ? basis : null;
        return extendObject(css, { 'box-sizing': 'border-box' });
    }
}
FlexDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxFlex],
  [fxFlex.xs], [fxFlex.sm], [fxFlex.md], [fxFlex.lg], [fxFlex.xl],
  [fxFlex.lt-sm], [fxFlex.lt-md], [fxFlex.lt-lg], [fxFlex.lt-xl],
  [fxFlex.gt-xs], [fxFlex.gt-sm], [fxFlex.gt-md], [fxFlex.gt-lg],
`
            },] },
];
FlexDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: SkipSelf },] },
    { type: LayoutWrapDirective, decorators: [{ type: Optional }, { type: SkipSelf },] },
];
FlexDirective.propDecorators = {
    'shrink': [{ type: Input, args: ['fxShrink',] },],
    'grow': [{ type: Input, args: ['fxGrow',] },],
    'flex': [{ type: Input, args: ['fxFlex',] },],
    'flexXs': [{ type: Input, args: ['fxFlex.xs',] },],
    'flexSm': [{ type: Input, args: ['fxFlex.sm',] },],
    'flexMd': [{ type: Input, args: ['fxFlex.md',] },],
    'flexLg': [{ type: Input, args: ['fxFlex.lg',] },],
    'flexXl': [{ type: Input, args: ['fxFlex.xl',] },],
    'flexGtXs': [{ type: Input, args: ['fxFlex.gt-xs',] },],
    'flexGtSm': [{ type: Input, args: ['fxFlex.gt-sm',] },],
    'flexGtMd': [{ type: Input, args: ['fxFlex.gt-md',] },],
    'flexGtLg': [{ type: Input, args: ['fxFlex.gt-lg',] },],
    'flexLtSm': [{ type: Input, args: ['fxFlex.lt-sm',] },],
    'flexLtMd': [{ type: Input, args: ['fxFlex.lt-md',] },],
    'flexLtLg': [{ type: Input, args: ['fxFlex.lt-lg',] },],
    'flexLtXl': [{ type: Input, args: ['fxFlex.lt-xl',] },],
};

class FlexAlignDirective extends BaseFxDirective {
    constructor(monitor, elRef, renderer) {
        super(monitor, elRef, renderer);
    }
    set align(val) { this._cacheInput('align', val); }
    ;
    set alignXs(val) { this._cacheInput('alignXs', val); }
    ;
    set alignSm(val) { this._cacheInput('alignSm', val); }
    ;
    set alignMd(val) { this._cacheInput('alignMd', val); }
    ;
    set alignLg(val) { this._cacheInput('alignLg', val); }
    ;
    set alignXl(val) { this._cacheInput('alignXl', val); }
    ;
    set alignLtSm(val) { this._cacheInput('alignLtSm', val); }
    ;
    set alignLtMd(val) { this._cacheInput('alignLtMd', val); }
    ;
    set alignLtLg(val) { this._cacheInput('alignLtLg', val); }
    ;
    set alignLtXl(val) { this._cacheInput('alignLtXl', val); }
    ;
    set alignGtXs(val) { this._cacheInput('alignGtXs', val); }
    ;
    set alignGtSm(val) { this._cacheInput('alignGtSm', val); }
    ;
    set alignGtMd(val) { this._cacheInput('alignGtMd', val); }
    ;
    set alignGtLg(val) { this._cacheInput('alignGtLg', val); }
    ;
    ngOnChanges(changes) {
        if (changes['align'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('align', 'stretch', (changes) => {
            this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    }
    _updateWithValue(value) {
        value = value || this._queryInput('align') || 'stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    }
    _buildCSS(align) {
        let css = {};
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
    }
}
FlexAlignDirective.decorators = [
    { type: Directive, args: [{
                selector: `
  [fxFlexAlign],
  [fxFlexAlign.xs], [fxFlexAlign.sm], [fxFlexAlign.md], [fxFlexAlign.lg], [fxFlexAlign.xl],
  [fxFlexAlign.lt-sm], [fxFlexAlign.lt-md], [fxFlexAlign.lt-lg], [fxFlexAlign.lt-xl],
  [fxFlexAlign.gt-xs], [fxFlexAlign.gt-sm], [fxFlexAlign.gt-md], [fxFlexAlign.gt-lg]
`
            },] },
];
FlexAlignDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: Renderer2, },
];
FlexAlignDirective.propDecorators = {
    'align': [{ type: Input, args: ['fxFlexAlign',] },],
    'alignXs': [{ type: Input, args: ['fxFlexAlign.xs',] },],
    'alignSm': [{ type: Input, args: ['fxFlexAlign.sm',] },],
    'alignMd': [{ type: Input, args: ['fxFlexAlign.md',] },],
    'alignLg': [{ type: Input, args: ['fxFlexAlign.lg',] },],
    'alignXl': [{ type: Input, args: ['fxFlexAlign.xl',] },],
    'alignLtSm': [{ type: Input, args: ['fxFlexAlign.lt-sm',] },],
    'alignLtMd': [{ type: Input, args: ['fxFlexAlign.lt-md',] },],
    'alignLtLg': [{ type: Input, args: ['fxFlexAlign.lt-lg',] },],
    'alignLtXl': [{ type: Input, args: ['fxFlexAlign.lt-xl',] },],
    'alignGtXs': [{ type: Input, args: ['fxFlexAlign.gt-xs',] },],
    'alignGtSm': [{ type: Input, args: ['fxFlexAlign.gt-sm',] },],
    'alignGtMd': [{ type: Input, args: ['fxFlexAlign.gt-md',] },],
    'alignGtLg': [{ type: Input, args: ['fxFlexAlign.gt-lg',] },],
};

const FLEX_FILL_CSS = {
    'margin': 0,
    'width': '100%',
    'height': '100%',
    'min-width': '100%',
    'min-height': '100%'
};
class FlexFillDirective extends BaseFxDirective {
    constructor(monitor, elRef, renderer) {
        super(monitor, elRef, renderer);
        this.elRef = elRef;
        this.renderer = renderer;
        this._applyStyleToElement(FLEX_FILL_CSS);
    }
}
FlexFillDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxFill],
  [fxFlexFill]
` },] },
];
FlexFillDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: Renderer2, },
];

class FlexOffsetDirective extends BaseFxDirective {
    constructor(monitor, elRef, renderer, _container) {
        super(monitor, elRef, renderer);
        this._container = _container;
        this._layout = 'row';
        this.watchParentFlow();
    }
    set offset(val) { this._cacheInput('offset', val); }
    set offsetXs(val) { this._cacheInput('offsetXs', val); }
    set offsetSm(val) { this._cacheInput('offsetSm', val); }
    ;
    set offsetMd(val) { this._cacheInput('offsetMd', val); }
    ;
    set offsetLg(val) { this._cacheInput('offsetLg', val); }
    ;
    set offsetXl(val) { this._cacheInput('offsetXl', val); }
    ;
    set offsetLtSm(val) { this._cacheInput('offsetLtSm', val); }
    ;
    set offsetLtMd(val) { this._cacheInput('offsetLtMd', val); }
    ;
    set offsetLtLg(val) { this._cacheInput('offsetLtLg', val); }
    ;
    set offsetLtXl(val) { this._cacheInput('offsetLtXl', val); }
    ;
    set offsetGtXs(val) { this._cacheInput('offsetGtXs', val); }
    ;
    set offsetGtSm(val) { this._cacheInput('offsetGtSm', val); }
    ;
    set offsetGtMd(val) { this._cacheInput('offsetGtMd', val); }
    ;
    set offsetGtLg(val) { this._cacheInput('offsetGtLg', val); }
    ;
    ngOnChanges(changes) {
        if (changes['offset'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    }
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('offset', 0, (changes) => {
            this._updateWithValue(changes.value);
        });
    }
    watchParentFlow() {
        if (this._container) {
            this._layoutWatcher = this._container.layout$.subscribe((direction) => {
                this._onLayoutChange(direction);
            });
        }
    }
    _onLayoutChange(direction) {
        this._layout = direction || this._layout || 'row';
        this._updateWithValue();
    }
    _updateWithValue(value) {
        value = value || this._queryInput('offset') || 0;
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    }
    _buildCSS(offset) {
        let isPercent = String(offset).indexOf('%') > -1;
        let isPx = String(offset).indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(offset)) {
            offset = offset + '%';
        }
        let layout = this._getFlowDirection(this.parentElement, true);
        return isFlowHorizontal(layout) ? { 'margin-left': `${offset}` } : { 'margin-top': `${offset}` };
    }
}
FlexOffsetDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxFlexOffset],
  [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md], [fxFlexOffset.lg], [fxFlexOffset.xl],
  [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md], [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl],
  [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm], [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]
` },] },
];
FlexOffsetDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: SkipSelf },] },
];
FlexOffsetDirective.propDecorators = {
    'offset': [{ type: Input, args: ['fxFlexOffset',] },],
    'offsetXs': [{ type: Input, args: ['fxFlexOffset.xs',] },],
    'offsetSm': [{ type: Input, args: ['fxFlexOffset.sm',] },],
    'offsetMd': [{ type: Input, args: ['fxFlexOffset.md',] },],
    'offsetLg': [{ type: Input, args: ['fxFlexOffset.lg',] },],
    'offsetXl': [{ type: Input, args: ['fxFlexOffset.xl',] },],
    'offsetLtSm': [{ type: Input, args: ['fxFlexOffset.lt-sm',] },],
    'offsetLtMd': [{ type: Input, args: ['fxFlexOffset.lt-md',] },],
    'offsetLtLg': [{ type: Input, args: ['fxFlexOffset.lt-lg',] },],
    'offsetLtXl': [{ type: Input, args: ['fxFlexOffset.lt-xl',] },],
    'offsetGtXs': [{ type: Input, args: ['fxFlexOffset.gt-xs',] },],
    'offsetGtSm': [{ type: Input, args: ['fxFlexOffset.gt-sm',] },],
    'offsetGtMd': [{ type: Input, args: ['fxFlexOffset.gt-md',] },],
    'offsetGtLg': [{ type: Input, args: ['fxFlexOffset.gt-lg',] },],
};

class FlexOrderDirective extends BaseFxDirective {
    constructor(monitor, elRef, renderer) {
        super(monitor, elRef, renderer);
    }
    set order(val) { this._cacheInput('order', val); }
    set orderXs(val) { this._cacheInput('orderXs', val); }
    set orderSm(val) { this._cacheInput('orderSm', val); }
    ;
    set orderMd(val) { this._cacheInput('orderMd', val); }
    ;
    set orderLg(val) { this._cacheInput('orderLg', val); }
    ;
    set orderXl(val) { this._cacheInput('orderXl', val); }
    ;
    set orderGtXs(val) { this._cacheInput('orderGtXs', val); }
    ;
    set orderGtSm(val) { this._cacheInput('orderGtSm', val); }
    ;
    set orderGtMd(val) { this._cacheInput('orderGtMd', val); }
    ;
    set orderGtLg(val) { this._cacheInput('orderGtLg', val); }
    ;
    set orderLtSm(val) { this._cacheInput('orderLtSm', val); }
    ;
    set orderLtMd(val) { this._cacheInput('orderLtMd', val); }
    ;
    set orderLtLg(val) { this._cacheInput('orderLtLg', val); }
    ;
    set orderLtXl(val) { this._cacheInput('orderLtXl', val); }
    ;
    ngOnChanges(changes) {
        if (changes['order'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('order', '0', (changes) => {
            this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    }
    _updateWithValue(value) {
        value = value || this._queryInput('order') || '0';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this._applyStyleToElement(this._buildCSS(value));
    }
    _buildCSS(value) {
        value = parseInt(value, 10);
        return { order: isNaN(value) ? 0 : value };
    }
}
FlexOrderDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxFlexOrder],
  [fxFlexOrder.xs], [fxFlexOrder.sm], [fxFlexOrder.md], [fxFlexOrder.lg], [fxFlexOrder.xl],
  [fxFlexOrder.lt-sm], [fxFlexOrder.lt-md], [fxFlexOrder.lt-lg], [fxFlexOrder.lt-xl],
  [fxFlexOrder.gt-xs], [fxFlexOrder.gt-sm], [fxFlexOrder.gt-md], [fxFlexOrder.gt-lg]
` },] },
];
FlexOrderDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: ElementRef, },
    { type: Renderer2, },
];
FlexOrderDirective.propDecorators = {
    'order': [{ type: Input, args: ['fxFlexOrder',] },],
    'orderXs': [{ type: Input, args: ['fxFlexOrder.xs',] },],
    'orderSm': [{ type: Input, args: ['fxFlexOrder.sm',] },],
    'orderMd': [{ type: Input, args: ['fxFlexOrder.md',] },],
    'orderLg': [{ type: Input, args: ['fxFlexOrder.lg',] },],
    'orderXl': [{ type: Input, args: ['fxFlexOrder.xl',] },],
    'orderGtXs': [{ type: Input, args: ['fxFlexOrder.gt-xs',] },],
    'orderGtSm': [{ type: Input, args: ['fxFlexOrder.gt-sm',] },],
    'orderGtMd': [{ type: Input, args: ['fxFlexOrder.gt-md',] },],
    'orderGtLg': [{ type: Input, args: ['fxFlexOrder.gt-lg',] },],
    'orderLtSm': [{ type: Input, args: ['fxFlexOrder.lt-sm',] },],
    'orderLtMd': [{ type: Input, args: ['fxFlexOrder.lt-md',] },],
    'orderLtLg': [{ type: Input, args: ['fxFlexOrder.lt-lg',] },],
    'orderLtXl': [{ type: Input, args: ['fxFlexOrder.lt-xl',] },],
};

class RendererAdapter {
    constructor(_renderer) {
        this._renderer = _renderer;
    }
    setElementClass(el, className, isAdd) {
        if (isAdd) {
            this._renderer.addClass(el, className);
        }
        else {
            this._renderer.removeClass(el, className);
        }
    }
    setElementStyle(el, styleName, styleValue) {
        if (styleValue) {
            this._renderer.setStyle(el, styleName, styleValue);
        }
        else {
            this._renderer.removeStyle(el, styleName);
        }
    }
    addClass(el, name) {
        this._renderer.addClass(el, name);
    }
    removeClass(el, name) {
        this._renderer.removeClass(el, name);
    }
    setStyle(el, style, value, flags) {
        this._renderer.setStyle(el, style, value, flags);
    }
    removeStyle(el, style, flags) {
        this._renderer.removeStyle(el, style, flags);
    }
    animate() { throw _notImplemented('animate'); }
    attachViewAfter() { throw _notImplemented('attachViewAfter'); }
    detachView() { throw _notImplemented('detachView'); }
    destroyView() { throw _notImplemented('destroyView'); }
    createElement() { throw _notImplemented('createElement'); }
    createViewRoot() { throw _notImplemented('createViewRoot'); }
    createTemplateAnchor() { throw _notImplemented('createTemplateAnchor'); }
    createText() { throw _notImplemented('createText'); }
    invokeElementMethod() { throw _notImplemented('invokeElementMethod'); }
    projectNodes() { throw _notImplemented('projectNodes'); }
    selectRootElement() { throw _notImplemented('selectRootElement'); }
    setBindingDebugInfo() { throw _notImplemented('setBindingDebugInfo'); }
    setElementProperty() { throw _notImplemented('setElementProperty'); }
    setElementAttribute() { throw _notImplemented('setElementAttribute'); }
    setText() { throw _notImplemented('setText'); }
    listen() { throw _notImplemented('listen'); }
    listenGlobal() { throw _notImplemented('listenGlobal'); }
}
function _notImplemented(methodName) {
    return new Error(`The method RendererAdapter::${methodName}() has not been implemented`);
}

class ClassDirective extends BaseFxDirective {
    constructor(monitor, _iterableDiffers, _keyValueDiffers, _ngEl, _renderer, _ngClassInstance) {
        super(monitor, _ngEl, _renderer);
        this.monitor = monitor;
        this._iterableDiffers = _iterableDiffers;
        this._keyValueDiffers = _keyValueDiffers;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
        this._ngClassInstance = _ngClassInstance;
        this._configureAdapters();
    }
    set ngClassBase(val) {
        const key = 'ngClass';
        this._base.cacheInput(key, val, true);
        this._ngClassInstance.ngClass = this._base.queryInput(key);
    }
    set klazz(val) {
        const key = 'class';
        this._base.cacheInput(key, val);
        this._ngClassInstance.klass = val;
    }
    set ngClassXs(val) { this._base.cacheInput('ngClassXs', val, true); }
    set ngClassSm(val) { this._base.cacheInput('ngClassSm', val, true); }
    set ngClassMd(val) { this._base.cacheInput('ngClassMd', val, true); }
    set ngClassLg(val) { this._base.cacheInput('ngClassLg', val, true); }
    set ngClassXl(val) { this._base.cacheInput('ngClassXl', val, true); }
    set ngClassLtSm(val) { this._base.cacheInput('ngClassLtSm', val, true); }
    set ngClassLtMd(val) { this._base.cacheInput('ngClassLtMd', val, true); }
    set ngClassLtLg(val) { this._base.cacheInput('ngClassLtLg', val, true); }
    set ngClassLtXl(val) { this._base.cacheInput('ngClassLtXl', val, true); }
    set ngClassGtXs(val) { this._base.cacheInput('ngClassGtXs', val, true); }
    set ngClassGtSm(val) { this._base.cacheInput('ngClassGtSm', val, true); }
    set ngClassGtMd(val) { this._base.cacheInput('ngClassGtMd', val, true); }
    set ngClassGtLg(val) { this._base.cacheInput('ngClassGtLg', val, true); }
    ngOnChanges(changes) {
        if (this._base.activeKey in changes) {
            this._ngClassInstance.ngClass = this._base.mqActivation.activatedInput || '';
        }
    }
    ngOnInit() {
        this._configureMQListener();
    }
    ngDoCheck() {
        this._ngClassInstance.ngDoCheck();
    }
    ngOnDestroy() {
        this._base.ngOnDestroy();
        this._ngClassInstance = null;
    }
    _configureAdapters() {
        this._base = new BaseFxDirectiveAdapter('ngClass', this.monitor, this._ngEl, this._renderer);
        if (!this._ngClassInstance) {
            let adapter = new RendererAdapter(this._renderer);
            this._ngClassInstance = new NgClass(this._iterableDiffers, this._keyValueDiffers, this._ngEl, (adapter));
        }
    }
    _configureMQListener(baseKey = 'ngClass') {
        const fallbackValue = this._base.queryInput(baseKey);
        this._base.listenForMediaQueryChanges(baseKey, fallbackValue, (changes) => {
            this._ngClassInstance.ngClass = changes.value || '';
            this._ngClassInstance.ngDoCheck();
        });
    }
}
ClassDirective.decorators = [
    { type: Directive, args: [{
                selector: `
    [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],
    [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl],
    [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]
  `
            },] },
];
ClassDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: IterableDiffers, },
    { type: KeyValueDiffers, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: NgClass, decorators: [{ type: Optional }, { type: Self },] },
];
ClassDirective.propDecorators = {
    'ngClassBase': [{ type: Input, args: ['ngClass',] },],
    'klazz': [{ type: Input, args: ['class',] },],
    'ngClassXs': [{ type: Input, args: ['ngClass.xs',] },],
    'ngClassSm': [{ type: Input, args: ['ngClass.sm',] },],
    'ngClassMd': [{ type: Input, args: ['ngClass.md',] },],
    'ngClassLg': [{ type: Input, args: ['ngClass.lg',] },],
    'ngClassXl': [{ type: Input, args: ['ngClass.xl',] },],
    'ngClassLtSm': [{ type: Input, args: ['ngClass.lt-sm',] },],
    'ngClassLtMd': [{ type: Input, args: ['ngClass.lt-md',] },],
    'ngClassLtLg': [{ type: Input, args: ['ngClass.lt-lg',] },],
    'ngClassLtXl': [{ type: Input, args: ['ngClass.lt-xl',] },],
    'ngClassGtXs': [{ type: Input, args: ['ngClass.gt-xs',] },],
    'ngClassGtSm': [{ type: Input, args: ['ngClass.gt-sm',] },],
    'ngClassGtMd': [{ type: Input, args: ['ngClass.gt-md',] },],
    'ngClassGtLg': [{ type: Input, args: ['ngClass.gt-lg',] },],
};

class NgStyleKeyValue {
    constructor(key, value, noQuotes = true) {
        this.key = key;
        this.value = value;
        this.key = noQuotes ? key.replace(/['"]/g, '').trim() : key.trim();
        this.value = noQuotes ? value.replace(/['"]/g, '').trim() : value.trim();
        this.value = this.value.replace(/;/, '');
    }
}
const ngStyleUtils = {
    getType,
    buildRawList,
    buildMapFromList,
    buildMapFromSet
};
function getType(target) {
    let what = typeof target;
    if (what === 'object') {
        return (target.constructor === Array) ? 'array' :
            (target.constructor === Set) ? 'set' : 'object';
    }
    return what;
}
function buildRawList(source, delimiter = ';') {
    return String(source)
        .trim()
        .split(delimiter)
        .map((val) => val.trim())
        .filter(val => val !== '');
}
function buildMapFromList(styles, sanitize) {
    let sanitizeValue = (it) => {
        if (sanitize) {
            it.value = sanitize(it.value);
        }
        return it;
    };
    return styles
        .map(stringToKeyValue)
        .filter(entry => !!entry)
        .map(sanitizeValue)
        .reduce(keyValuesToMap, {});
}
function buildMapFromSet(source, sanitize) {
    let list = new Array();
    if (getType(source) == 'set') {
        source.forEach(entry => list.push(entry));
    }
    else {
        Object.keys(source).forEach(key => {
            list.push(`${key}:${source[key]}`);
        });
    }
    return buildMapFromList(list, sanitize);
}
function stringToKeyValue(it) {
    let [key, val] = it.split(':');
    return val ? new NgStyleKeyValue(key, val) : null;
}
function keyValuesToMap(map$$1, entry) {
    if (!!entry.key) {
        map$$1[entry.key] = entry.value;
    }
    return map$$1;
}

class StyleDirective extends BaseFxDirective {
    constructor(monitor, _sanitizer, _ngEl, _renderer, _differs, _ngStyleInstance) {
        super(monitor, _ngEl, _renderer);
        this.monitor = monitor;
        this._sanitizer = _sanitizer;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
        this._differs = _differs;
        this._ngStyleInstance = _ngStyleInstance;
        this._configureAdapters();
    }
    set ngStyleBase(val) {
        const key = 'ngStyle';
        this._base.cacheInput(key, val, true);
        this._ngStyleInstance.ngStyle = this._base.queryInput(key);
    }
    set ngStyleXs(val) { this._base.cacheInput('ngStyleXs', val, true); }
    set ngStyleSm(val) { this._base.cacheInput('ngStyleSm', val, true); }
    ;
    set ngStyleMd(val) { this._base.cacheInput('ngStyleMd', val, true); }
    ;
    set ngStyleLg(val) { this._base.cacheInput('ngStyleLg', val, true); }
    ;
    set ngStyleXl(val) { this._base.cacheInput('ngStyleXl', val, true); }
    ;
    set ngStyleLtSm(val) { this._base.cacheInput('ngStyleLtSm', val, true); }
    ;
    set ngStyleLtMd(val) { this._base.cacheInput('ngStyleLtMd', val, true); }
    ;
    set ngStyleLtLg(val) { this._base.cacheInput('ngStyleLtLg', val, true); }
    ;
    set ngStyleLtXl(val) { this._base.cacheInput('ngStyleLtXl', val, true); }
    ;
    set ngStyleGtXs(val) { this._base.cacheInput('ngStyleGtXs', val, true); }
    ;
    set ngStyleGtSm(val) { this._base.cacheInput('ngStyleGtSm', val, true); }
    ;
    set ngStyleGtMd(val) { this._base.cacheInput('ngStyleGtMd', val, true); }
    ;
    set ngStyleGtLg(val) { this._base.cacheInput('ngStyleGtLg', val, true); }
    ;
    ngOnChanges(changes) {
        if (this._base.activeKey in changes) {
            this._ngStyleInstance.ngStyle = this._base.mqActivation.activatedInput || '';
        }
    }
    ngOnInit() {
        this._configureMQListener();
    }
    ngDoCheck() {
        this._ngStyleInstance.ngDoCheck();
    }
    ngOnDestroy() {
        this._base.ngOnDestroy();
        this._ngStyleInstance = null;
    }
    _configureAdapters() {
        this._base = new BaseFxDirectiveAdapter('ngStyle', this.monitor, this._ngEl, this._renderer);
        if (!this._ngStyleInstance) {
            let adapter = new RendererAdapter(this._renderer);
            this._ngStyleInstance = new NgStyle(this._differs, this._ngEl, (adapter));
        }
        this._buildCacheInterceptor();
        this._fallbackToStyle();
    }
    _configureMQListener(baseKey = 'ngStyle') {
        const fallbackValue = this._base.queryInput(baseKey);
        this._base.listenForMediaQueryChanges(baseKey, fallbackValue, (changes) => {
            this._ngStyleInstance.ngStyle = changes.value || '';
            this._ngStyleInstance.ngDoCheck();
        });
    }
    _buildCacheInterceptor() {
        let cacheInput = this._base.cacheInput.bind(this._base);
        this._base.cacheInput = (key, source, cacheRaw = false, merge = true) => {
            let styles = this._buildStyleMap(source);
            if (merge) {
                styles = extendObject({}, this._base.inputMap['ngStyle'], styles);
            }
            cacheInput(key, styles, cacheRaw);
        };
    }
    _buildStyleMap(styles) {
        let sanitizer = (val) => {
            return this._sanitizer.sanitize(SecurityContext.STYLE, val);
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
    }
    _fallbackToStyle() {
        if (!this._base.queryInput('ngStyle')) {
            this.ngStyleBase = this._getAttributeValue('style') || '';
        }
    }
}
StyleDirective.decorators = [
    { type: Directive, args: [{
                selector: `
    [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],
    [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],
    [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]
  `
            },] },
];
StyleDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: DomSanitizer, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: KeyValueDiffers, },
    { type: NgStyle, decorators: [{ type: Optional }, { type: Self },] },
];
StyleDirective.propDecorators = {
    'ngStyleBase': [{ type: Input, args: ['ngStyle',] },],
    'ngStyleXs': [{ type: Input, args: ['ngStyle.xs',] },],
    'ngStyleSm': [{ type: Input, args: ['ngStyle.sm',] },],
    'ngStyleMd': [{ type: Input, args: ['ngStyle.md',] },],
    'ngStyleLg': [{ type: Input, args: ['ngStyle.lg',] },],
    'ngStyleXl': [{ type: Input, args: ['ngStyle.xl',] },],
    'ngStyleLtSm': [{ type: Input, args: ['ngStyle.lt-sm',] },],
    'ngStyleLtMd': [{ type: Input, args: ['ngStyle.lt-md',] },],
    'ngStyleLtLg': [{ type: Input, args: ['ngStyle.lt-lg',] },],
    'ngStyleLtXl': [{ type: Input, args: ['ngStyle.lt-xl',] },],
    'ngStyleGtXs': [{ type: Input, args: ['ngStyle.gt-xs',] },],
    'ngStyleGtSm': [{ type: Input, args: ['ngStyle.gt-sm',] },],
    'ngStyleGtMd': [{ type: Input, args: ['ngStyle.gt-md',] },],
    'ngStyleGtLg': [{ type: Input, args: ['ngStyle.gt-lg',] },],
};

const FALSY = ['false', false, 0];
function negativeOf(hide) {
    return (hide === '') ? false :
        ((hide === 'false') || (hide === 0)) ? true : !hide;
}
class ShowHideDirective extends BaseFxDirective {
    constructor(monitor, _layout, elRef, renderer) {
        super(monitor, elRef, renderer);
        this._layout = _layout;
        this.elRef = elRef;
        this.renderer = renderer;
        if (_layout) {
            this._layoutWatcher = _layout.layout$.subscribe(() => this._updateWithValue());
        }
    }
    set show(val) { this._cacheInput('show', val); }
    set showXs(val) { this._cacheInput('showXs', val); }
    set showSm(val) { this._cacheInput('showSm', val); }
    ;
    set showMd(val) { this._cacheInput('showMd', val); }
    ;
    set showLg(val) { this._cacheInput('showLg', val); }
    ;
    set showXl(val) { this._cacheInput('showXl', val); }
    ;
    set showLtSm(val) { this._cacheInput('showLtSm', val); }
    ;
    set showLtMd(val) { this._cacheInput('showLtMd', val); }
    ;
    set showLtLg(val) { this._cacheInput('showLtLg', val); }
    ;
    set showLtXl(val) { this._cacheInput('showLtXl', val); }
    ;
    set showGtXs(val) { this._cacheInput('showGtXs', val); }
    ;
    set showGtSm(val) { this._cacheInput('showGtSm', val); }
    ;
    set showGtMd(val) { this._cacheInput('showGtMd', val); }
    ;
    set showGtLg(val) { this._cacheInput('showGtLg', val); }
    ;
    set hide(val) { this._cacheInput('show', negativeOf(val)); }
    set hideXs(val) { this._cacheInput('showXs', negativeOf(val)); }
    set hideSm(val) { this._cacheInput('showSm', negativeOf(val)); }
    ;
    set hideMd(val) { this._cacheInput('showMd', negativeOf(val)); }
    ;
    set hideLg(val) { this._cacheInput('showLg', negativeOf(val)); }
    ;
    set hideXl(val) { this._cacheInput('showXl', negativeOf(val)); }
    ;
    set hideLtSm(val) { this._cacheInput('showLtSm', negativeOf(val)); }
    ;
    set hideLtMd(val) { this._cacheInput('showLtMd', negativeOf(val)); }
    ;
    set hideLtLg(val) { this._cacheInput('showLtLg', negativeOf(val)); }
    ;
    set hideLtXl(val) { this._cacheInput('showLtXl', negativeOf(val)); }
    ;
    set hideGtXs(val) { this._cacheInput('showGtXs', negativeOf(val)); }
    ;
    set hideGtSm(val) { this._cacheInput('showGtSm', negativeOf(val)); }
    ;
    set hideGtMd(val) { this._cacheInput('showGtMd', negativeOf(val)); }
    ;
    set hideGtLg(val) { this._cacheInput('showGtLg', negativeOf(val)); }
    ;
    _getDisplayStyle() {
        return this._layout ? 'flex' : super._getDisplayStyle();
    }
    ngOnChanges(changes) {
        if (this.hasInitialized && (changes['show'] != null || this._mqActivation)) {
            this._updateWithValue();
        }
    }
    ngOnInit() {
        super.ngOnInit();
        let value = this._getDefaultVal('show', true);
        this._listenForMediaQueryChanges('show', value, (changes) => {
            this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    }
    _updateWithValue(value) {
        value = value || this._getDefaultVal('show', true);
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        let shouldShow = this._validateTruthy(value);
        this._applyStyleToElement(this._buildCSS(shouldShow));
    }
    _buildCSS(show) {
        return { 'display': show ? this._display : 'none' };
    }
    _validateTruthy(show) {
        return (FALSY.indexOf(show) == -1);
    }
}
ShowHideDirective.decorators = [
    { type: Directive, args: [{
                selector: `
  [fxShow],
  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],
  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],
  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],
  [fxHide],
  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],
  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],
  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]
`
            },] },
];
ShowHideDirective.ctorParameters = () => [
    { type: MediaMonitor, },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self },] },
    { type: ElementRef, },
    { type: Renderer2, },
];
ShowHideDirective.propDecorators = {
    'show': [{ type: Input, args: ['fxShow',] },],
    'showXs': [{ type: Input, args: ['fxShow.xs',] },],
    'showSm': [{ type: Input, args: ['fxShow.sm',] },],
    'showMd': [{ type: Input, args: ['fxShow.md',] },],
    'showLg': [{ type: Input, args: ['fxShow.lg',] },],
    'showXl': [{ type: Input, args: ['fxShow.xl',] },],
    'showLtSm': [{ type: Input, args: ['fxShow.lt-sm',] },],
    'showLtMd': [{ type: Input, args: ['fxShow.lt-md',] },],
    'showLtLg': [{ type: Input, args: ['fxShow.lt-lg',] },],
    'showLtXl': [{ type: Input, args: ['fxShow.lt-xl',] },],
    'showGtXs': [{ type: Input, args: ['fxShow.gt-xs',] },],
    'showGtSm': [{ type: Input, args: ['fxShow.gt-sm',] },],
    'showGtMd': [{ type: Input, args: ['fxShow.gt-md',] },],
    'showGtLg': [{ type: Input, args: ['fxShow.gt-lg',] },],
    'hide': [{ type: Input, args: ['fxHide',] },],
    'hideXs': [{ type: Input, args: ['fxHide.xs',] },],
    'hideSm': [{ type: Input, args: ['fxHide.sm',] },],
    'hideMd': [{ type: Input, args: ['fxHide.md',] },],
    'hideLg': [{ type: Input, args: ['fxHide.lg',] },],
    'hideXl': [{ type: Input, args: ['fxHide.xl',] },],
    'hideLtSm': [{ type: Input, args: ['fxHide.lt-sm',] },],
    'hideLtMd': [{ type: Input, args: ['fxHide.lt-md',] },],
    'hideLtLg': [{ type: Input, args: ['fxHide.lt-lg',] },],
    'hideLtXl': [{ type: Input, args: ['fxHide.lt-xl',] },],
    'hideGtXs': [{ type: Input, args: ['fxHide.gt-xs',] },],
    'hideGtSm': [{ type: Input, args: ['fxHide.gt-sm',] },],
    'hideGtMd': [{ type: Input, args: ['fxHide.gt-md',] },],
    'hideGtLg': [{ type: Input, args: ['fxHide.gt-lg',] },],
};

class ImgSrcDirective extends BaseFxDirective {
    constructor(elRef, renderer, monitor) {
        super(monitor, elRef, renderer);
        this._cacheInput('src', elRef.nativeElement.getAttribute('src') || '');
    }
    set srcBase(val) { this.cacheDefaultSrc(val); }
    set srcXs(val) { this._cacheInput('srcXs', val); }
    set srcSm(val) { this._cacheInput('srcSm', val); }
    set srcMd(val) { this._cacheInput('srcMd', val); }
    set srcLg(val) { this._cacheInput('srcLg', val); }
    set srcXl(val) { this._cacheInput('srcXl', val); }
    set srcLtSm(val) { this._cacheInput('srcLtSm', val); }
    set srcLtMd(val) { this._cacheInput('srcLtMd', val); }
    set srcLtLg(val) { this._cacheInput('srcLtLg', val); }
    set srcLtXl(val) { this._cacheInput('srcLtXl', val); }
    set srcGtXs(val) { this._cacheInput('srcGtXs', val); }
    set srcGtSm(val) { this._cacheInput('srcGtSm', val); }
    set srcGtMd(val) { this._cacheInput('srcGtMd', val); }
    set srcGtLg(val) { this._cacheInput('srcGtLg', val); }
    ngOnInit() {
        super.ngOnInit();
        if (this.hasResponsiveKeys) {
            this._listenForMediaQueryChanges('src', this.defaultSrc, () => {
                this._updateSrcFor();
            });
        }
        this._updateSrcFor();
    }
    ngOnChanges() {
        if (this.hasInitialized) {
            this._updateSrcFor();
        }
    }
    _updateSrcFor() {
        if (this.hasResponsiveKeys) {
            let url = this.activatedValue || this.defaultSrc;
            this._renderer.setAttribute(this.nativeElement, 'src', String(url));
        }
    }
    cacheDefaultSrc(value) {
        this._cacheInput('src', value || '');
    }
    get defaultSrc() {
        return this._queryInput('src') || '';
    }
    get hasResponsiveKeys() {
        return Object.keys(this._inputMap).length > 1;
    }
}
ImgSrcDirective.decorators = [
    { type: Directive, args: [{
                selector: `
  img[src.xs],    img[src.sm],    img[src.md],    img[src.lg],   img[src.xl],
  img[src.lt-sm], img[src.lt-md], img[src.lt-lg], img[src.lt-xl],
  img[src.gt-xs], img[src.gt-sm], img[src.gt-md], img[src.gt-lg]
`
            },] },
];
ImgSrcDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: MediaMonitor, },
];
ImgSrcDirective.propDecorators = {
    'srcBase': [{ type: Input, args: ['src',] },],
    'srcXs': [{ type: Input, args: ['src.xs',] },],
    'srcSm': [{ type: Input, args: ['src.sm',] },],
    'srcMd': [{ type: Input, args: ['src.md',] },],
    'srcLg': [{ type: Input, args: ['src.lg',] },],
    'srcXl': [{ type: Input, args: ['src.xl',] },],
    'srcLtSm': [{ type: Input, args: ['src.lt-sm',] },],
    'srcLtMd': [{ type: Input, args: ['src.lt-md',] },],
    'srcLtLg': [{ type: Input, args: ['src.lt-lg',] },],
    'srcLtXl': [{ type: Input, args: ['src.lt-xl',] },],
    'srcGtXs': [{ type: Input, args: ['src.gt-xs',] },],
    'srcGtSm': [{ type: Input, args: ['src.gt-sm',] },],
    'srcGtMd': [{ type: Input, args: ['src.gt-md',] },],
    'srcGtLg': [{ type: Input, args: ['src.gt-lg',] },],
};

const RESPONSIVE_ALIASES = [
    'xs', 'gt-xs', 'sm', 'gt-sm', 'md', 'gt-md', 'lg', 'gt-lg', 'xl'
];
const DEFAULT_BREAKPOINTS = [
    {
        alias: 'xs',
        mediaQuery: '(min-width: 0px) and (max-width: 599px)'
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

const HANDSET_PORTRAIT = '(orientations: portrait) and (max-width: 599px)';
const HANDSET_LANDSCAPE = '(orientations: landscape) and (max-width: 959px)';
const TABLET_LANDSCAPE = '(orientations: landscape) and (min-width: 960px) and (max-width: 1279px)';
const TABLET_PORTRAIT = '(orientations: portrait) and (min-width: 600px) and (max-width: 839px)';
const WEB_PORTRAIT = '(orientations: portrait) and (min-width: 840px)';
const WEB_LANDSCAPE = '(orientations: landscape) and (min-width: 1280px)';
const ScreenTypes = {
    'HANDSET': `${HANDSET_PORTRAIT}, ${HANDSET_LANDSCAPE}`,
    'TABLET': `${TABLET_PORTRAIT} , ${TABLET_LANDSCAPE}`,
    'WEB': `${WEB_PORTRAIT}, ${WEB_LANDSCAPE} `,
    'HANDSET_PORTRAIT': `${HANDSET_PORTRAIT}`,
    'TABLET_PORTRAIT': `${TABLET_PORTRAIT} `,
    'WEB_PORTRAIT': `${WEB_PORTRAIT}`,
    'HANDSET_LANDSCAPE': `${HANDSET_LANDSCAPE}]`,
    'TABLET_LANDSCAPE': `${TABLET_LANDSCAPE}`,
    'WEB_LANDSCAPE': `${WEB_LANDSCAPE}`
};
const ORIENTATION_BREAKPOINTS = [
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

class ObservableMedia {
    isActive(query) { }
    asObservable() { }
    subscribe(next, error, complete) { }
}
class MediaService {
    constructor(breakpoints, mediaWatcher) {
        this.breakpoints = breakpoints;
        this.mediaWatcher = mediaWatcher;
        this.filterOverlaps = true;
        this._registerBreakPoints();
        this.observable$ = this._buildObservable();
    }
    isActive(alias) {
        let query = this._toMediaQuery(alias);
        return this.mediaWatcher.isActive(query);
    }
    subscribe(next, error, complete) {
        return this.observable$.subscribe(next, error, complete);
    }
    asObservable() {
        return this.observable$;
    }
    _registerBreakPoints() {
        let queries = this.breakpoints.sortedItems.map(bp => bp.mediaQuery);
        this.mediaWatcher.registerQuery(queries);
    }
    _buildObservable() {
        const self = this;
        const media$ = this.mediaWatcher.observe();
        const activationsOnly = (change) => {
            return change.matches === true;
        };
        const addAliasInformation = (change) => {
            return mergeAlias(change, this._findByQuery(change.mediaQuery));
        };
        const excludeOverlaps = (change) => {
            let bp = this.breakpoints.findByQuery(change.mediaQuery);
            return !bp ? true : !(self.filterOverlaps && bp.overlapping);
        };
        return media$.pipe(filter(activationsOnly), filter(excludeOverlaps), map(addAliasInformation));
    }
    _findByAlias(alias) {
        return this.breakpoints.findByAlias(alias);
    }
    _findByQuery(query) {
        return this.breakpoints.findByQuery(query);
    }
    _toMediaQuery(query) {
        let bp = this._findByAlias(query) || this._findByQuery(query);
        return bp ? bp.mediaQuery : query;
    }
}
MediaService.decorators = [
    { type: Injectable },
];
MediaService.ctorParameters = () => [
    { type: BreakPointRegistry, },
    { type: MatchMedia, },
];

const ALIAS_DELIMITERS = /(\.|-|_)/g;
function firstUpperCase(part) {
    let first = part.length > 0 ? part.charAt(0) : '';
    let remainder = (part.length > 1) ? part.slice(1) : '';
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
    list.forEach((bp) => {
        if (!bp.suffix || bp.suffix === '') {
            bp.suffix = camelCase(bp.alias);
            bp.overlapping = bp.overlapping || false;
        }
    });
    return list;
}
function mergeByAlias(defaults, custom = []) {
    const merged = defaults.map((bp) => extendObject({}, bp));
    const findByAlias = (alias) => merged.reduce((result, bp) => {
        return result || ((bp.alias === alias) ? bp : null);
    }, null);
    custom.forEach((bp) => {
        let target = findByAlias(bp.alias);
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
    return () => {
        let defaults = options.orientations ? ORIENTATION_BREAKPOINTS.concat(DEFAULT_BREAKPOINTS) :
            DEFAULT_BREAKPOINTS;
        return options.defaults ? mergeByAlias(defaults, _custom || []) : mergeByAlias(_custom);
    };
}
function DEFAULT_BREAKPOINTS_PROVIDER_FACTORY() {
    return validateSuffixes(DEFAULT_BREAKPOINTS);
}
const DEFAULT_BREAKPOINTS_PROVIDER = {
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
const OBSERVABLE_MEDIA_PROVIDER = {
    provide: ObservableMedia,
    deps: [
        [new Optional(), new SkipSelf(), ObservableMedia],
        MatchMedia,
        BreakPointRegistry
    ],
    useFactory: OBSERVABLE_MEDIA_PROVIDER_FACTORY
};

function MEDIA_MONITOR_PROVIDER_FACTORY(parentMonitor, breakpoints, matchMedia) {
    return parentMonitor || new MediaMonitor(breakpoints, matchMedia);
}
const MEDIA_MONITOR_PROVIDER = {
    provide: MediaMonitor,
    deps: [
        [new Optional(), new SkipSelf(), MediaMonitor],
        BreakPointRegistry,
        MatchMedia,
    ],
    useFactory: MEDIA_MONITOR_PROVIDER_FACTORY
};

class MediaQueriesModule {
}
MediaQueriesModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    DEFAULT_BREAKPOINTS_PROVIDER,
                    BreakPointRegistry,
                    MatchMedia,
                    MediaMonitor,
                    OBSERVABLE_MEDIA_PROVIDER
                ]
            },] },
];
MediaQueriesModule.ctorParameters = () => [];

const ALL_DIRECTIVES = [
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
    StyleDirective,
    ImgSrcDirective
];
class FlexLayoutModule {
    static provideBreakPoints(breakpoints, options) {
        return {
            ngModule: FlexLayoutModule,
            providers: [
                CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(breakpoints, options || { orientations: false })
            ]
        };
    }
}
FlexLayoutModule.decorators = [
    { type: NgModule, args: [{
                imports: [MediaQueriesModule],
                exports: [MediaQueriesModule, ...ALL_DIRECTIVES],
                declarations: [...ALL_DIRECTIVES],
                providers: [
                    MEDIA_MONITOR_PROVIDER,
                    DEFAULT_BREAKPOINTS_PROVIDER,
                    OBSERVABLE_MEDIA_PROVIDER
                ]
            },] },
];
FlexLayoutModule.ctorParameters = () => [];

export { VERSION, BaseFxDirective, BaseFxDirectiveAdapter, KeyOptions, ResponsiveActivation, LayoutDirective, LayoutAlignDirective, LayoutGapDirective, LayoutWrapDirective, FlexDirective, FlexAlignDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective, ClassDirective, StyleDirective, negativeOf, ShowHideDirective, ImgSrcDirective, RESPONSIVE_ALIASES, DEFAULT_BREAKPOINTS, ScreenTypes, ORIENTATION_BREAKPOINTS, BREAKPOINTS, BreakPointRegistry, ObservableMedia, MediaService, MatchMedia, isBrowser, MediaChange, MediaMonitor, buildMergedBreakPoints, DEFAULT_BREAKPOINTS_PROVIDER_FACTORY, DEFAULT_BREAKPOINTS_PROVIDER, CUSTOM_BREAKPOINTS_PROVIDER_FACTORY, OBSERVABLE_MEDIA_PROVIDER_FACTORY, OBSERVABLE_MEDIA_PROVIDER, MEDIA_MONITOR_PROVIDER_FACTORY, MEDIA_MONITOR_PROVIDER, MediaQueriesModule, mergeAlias, applyCssPrefixes, validateBasis, LAYOUT_VALUES, buildLayoutCSS, validateValue, isFlowHorizontal, validateWrapValue, validateSuffixes, mergeByAlias, extendObject, NgStyleKeyValue, ngStyleUtils, FlexLayoutModule };
//# sourceMappingURL=flex-layout.js.map
