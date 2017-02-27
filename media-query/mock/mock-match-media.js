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
    };
    /**
     * Feature to support manual, simulated activation of a mediaQuery.
     */
    MockMatchMedia.prototype.activate = function (mediaQuery, useOverlaps) {
        if (useOverlaps === void 0) { useOverlaps = false; }
        mediaQuery = this._validateQuery(mediaQuery);
        if (!this.isActive(mediaQuery)) {
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
     *
     *   "md"    active == true
     *   "gt-sm" active == true
     *   "sm"    active == false
     *   "gt-xs" active == true
     *   "xs"    active == false
     *
     */
    MockMatchMedia.prototype._activateWithOverlaps = function (mediaQuery, useOverlaps) {
        if (useOverlaps) {
            var bp = this._breakpoints.findByQuery(mediaQuery);
            switch (bp ? bp.alias : 'unknown') {
                case 'xl':
                    this._activateByAlias('gt-lg'); // note the fall-thrus
                case 'gt-lg':
                case 'lg':
                    this._activateByAlias('gt-md');
                case 'gt-md':
                case 'md':
                    this._activateByAlias('gt-sm');
                case 'gt-sm':
                case 'sm':
                    this._activateByAlias('gt-xs');
                    break;
                default:
                    break;
            }
        }
        // Activate last since the responsiveActivation is watching *this* mediaQuery
        return this._activateByQuery(mediaQuery);
    };
    /**
     *
     */
    MockMatchMedia.prototype._activateByAlias = function (alias) {
        var bp = this._breakpoints.findByAlias(alias);
        if (bp) {
            alias = bp.mediaQuery;
        }
        this._activateByQuery(alias);
    };
    /**
     *
     */
    MockMatchMedia.prototype._activateByQuery = function (mediaQuery) {
        var mql = this._registry.get(mediaQuery);
        if (mql) {
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
MockMatchMedia = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [NgZone, BreakPointRegistry])
], MockMatchMedia);
export { MockMatchMedia };
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
        this._isActive = true;
        this._listeners.forEach(function (callback) {
            callback(_this);
        });
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
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/media-query/mock/mock-match-media.js.map