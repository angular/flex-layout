var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, NgZone } from '@angular/core';
import { MatchMedia } from '../match-media';
import { BreakPointRegistry } from '../breakpoints/break-point-registry';
/**
 * MockMatchMedia mocks calls to the Window API matchMedia with a build of a simulated
 * MockMediaQueryListener. Methods are available to simulate an activation of a mediaQuery
 * range and to clearAll mediaQuery listeners.
 */
var MockMatchMedia = (function (_super) {
    __extends(MockMatchMedia, _super);
    function MockMatchMedia(_zone, _breakpoints) {
        var _this = _super.call(this, _zone) || this;
        _this._breakpoints = _breakpoints;
        /**
         * Special flag used to test BreakPoint registrations with MatchMedia
         */
        _this.autoRegisterQueries = true;
        /**
         * Allow fallback to overlapping mediaQueries to determine
         * activatedInput(s).
         */
        _this.useOverlaps = false;
        _this._actives = [];
        _this._actives = [];
        return _this;
    }
    /**
     * Easy method to clear all listeners for all mediaQueries
     */
    MockMatchMedia.prototype.clearAll = function () {
        this._registry.forEach(function (mql, mediaQuery) {
            mql.destroy();
        });
        this._registry.clear();
        this.useOverlaps = false;
    };
    /**
     * Feature to support manual, simulated activation of a mediaQuery.
     */
    MockMatchMedia.prototype.activate = function (mediaQuery, useOverlaps) {
        if (useOverlaps === void 0) { useOverlaps = false; }
        useOverlaps = useOverlaps || this.useOverlaps;
        mediaQuery = this._validateQuery(mediaQuery);
        if (useOverlaps || !this.isActive(mediaQuery)) {
            this._deactivateAll();
            this._registerMediaQuery(mediaQuery);
            this._activateWithOverlaps(mediaQuery, useOverlaps);
        }
        return this.hasActivated;
    };
    /**
     * Converts an optional mediaQuery alias to a specific, valid mediaQuery
     */
    MockMatchMedia.prototype._validateQuery = function (queryOrAlias) {
        var bp = this._breakpoints.findByAlias(queryOrAlias);
        if (bp) {
            queryOrAlias = bp.mediaQuery;
        }
        return queryOrAlias;
    };
    /**
     * Manually activate any overlapping mediaQueries to simulate
     * similar functionality in the window.matchMedia()
     */
    MockMatchMedia.prototype._activateWithOverlaps = function (mediaQuery, useOverlaps) {
        if (useOverlaps) {
            var bp = this._breakpoints.findByQuery(mediaQuery);
            var alias = bp ? bp.alias : 'unknown';
            // Simulate activation of overlapping lt-<XXX> ranges
            switch (alias) {
                case 'lg':
                    this._activateByAlias('lt-xl');
                    break;
                case 'md':
                    this._activateByAlias('lt-xl, lt-lg');
                    break;
                case 'sm':
                    this._activateByAlias('lt-xl, lt-lg, lt-md');
                    break;
                case 'xs':
                    this._activateByAlias('lt-xl, lt-lg, lt-md, lt-sm');
                    break;
            }
            // Simulate activate of overlapping gt-<xxxx> mediaQuery ranges
            switch (alias) {
                case 'xl':
                    this._activateByAlias('gt-lg, gt-md, gt-sm, gt-xs');
                    break;
                case 'lg':
                    this._activateByAlias('gt-md, gt-sm, gt-xs');
                    break;
                case 'md':
                    this._activateByAlias('gt-sm, gt-xs');
                    break;
                case 'sm':
                    this._activateByAlias('gt-xs');
                    break;
            }
        }
        // Activate last since the responsiveActivation is watching *this* mediaQuery
        return this._activateByQuery(mediaQuery);
    };
    /**
     *
     */
    MockMatchMedia.prototype._activateByAlias = function (aliases) {
        var _this = this;
        var activate = function (alias) {
            var bp = _this._breakpoints.findByAlias(alias);
            _this._activateByQuery(bp ? bp.mediaQuery : alias);
        };
        aliases.split(",").forEach(function (alias) { return activate(alias.trim()); });
    };
    /**
     *
     */
    MockMatchMedia.prototype._activateByQuery = function (mediaQuery) {
        var mql = this._registry.get(mediaQuery);
        var alreadyAdded = this._actives.reduce(function (found, it) {
            return found || (mql && (it.media === mql.media));
        }, false);
        if (mql && !alreadyAdded) {
            this._actives.push(mql.activate());
        }
        return this.hasActivated;
    };
    /**
     * Deactivate all current Mock MQLs
     */
    MockMatchMedia.prototype._deactivateAll = function () {
        if (this._actives.length) {
            // Deactivate all current MQLs and reset the buffer
            this._actives.map(function (it) { return it.deactivate(); });
            this._actives = [];
        }
        return this;
    };
    /**
     * Insure the mediaQuery is registered with MatchMedia
     */
    MockMatchMedia.prototype._registerMediaQuery = function (mediaQuery) {
        if (!this._registry.has(mediaQuery) && this.autoRegisterQueries) {
            this.registerQuery(mediaQuery);
        }
    };
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    MockMatchMedia.prototype._buildMQL = function (query) {
        return new MockMediaQueryList(query);
    };
    Object.defineProperty(MockMatchMedia.prototype, "hasActivated", {
        get: function () {
            return (this._actives.length > 0);
        },
        enumerable: true,
        configurable: true
    });
    return MockMatchMedia;
}(MatchMedia));
export { MockMatchMedia };
MockMatchMedia.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MockMatchMedia.ctorParameters = function () { return [
    { type: NgZone, },
    { type: BreakPointRegistry, },
]; };
/**
 * Special internal class to simulate a MediaQueryList and
 * - supports manual activation to simulate mediaQuery matching
 * - manages listeners
 */
var MockMediaQueryList = (function () {
    function MockMediaQueryList(_mediaQuery) {
        this._mediaQuery = _mediaQuery;
        this._isActive = false;
        this._listeners = [];
    }
    Object.defineProperty(MockMediaQueryList.prototype, "matches", {
        get: function () {
            return this._isActive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockMediaQueryList.prototype, "media", {
        get: function () {
            return this._mediaQuery;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    MockMediaQueryList.prototype.destroy = function () {
        this.deactivate();
        this._listeners = [];
    };
    /**
     * Notify all listeners that 'matches === TRUE'
     */
    MockMediaQueryList.prototype.activate = function () {
        var _this = this;
        if (!this._isActive) {
            this._isActive = true;
            this._listeners.forEach(function (callback) {
                callback(_this);
            });
        }
        return this;
    };
    /**
     * Notify all listeners that 'matches === false'
     */
    MockMediaQueryList.prototype.deactivate = function () {
        var _this = this;
        if (this._isActive) {
            this._isActive = false;
            this._listeners.forEach(function (callback) {
                callback(_this);
            });
        }
        return this;
    };
    /**
     *
     */
    MockMediaQueryList.prototype.addListener = function (listener) {
        if (this._listeners.indexOf(listener) === -1) {
            this._listeners.push(listener);
        }
        if (this._isActive) {
            listener(this);
        }
    };
    MockMediaQueryList.prototype.removeListener = function (listener) {
    };
    return MockMediaQueryList;
}());
export { MockMediaQueryList };
/**
 * Pre-configured provider for MockMatchMedia
 */
export var MockMatchMediaProvider = {
    provide: MatchMedia,
    useClass: MockMatchMedia
};
//# sourceMappingURL=mock-match-media.js.map