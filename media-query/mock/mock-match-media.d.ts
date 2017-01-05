/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgZone } from '@angular/core';
import { MatchMedia } from '../match-media';
import { BreakPointRegistry } from '../breakpoints/break-point-registry';
/**
 * MockMatchMedia mocks calls to the Window API matchMedia with a build of a simulated
 * MockMediaQueryListener. Methods are available to simulate an activation of a mediaQuery
 * range and to clearAll mediaQuery listeners.
 */
export declare class MockMatchMedia extends MatchMedia {
    private _breakpoints;
    /**
     * Special flag used to test BreakPoint registrations with MatchMedia
     */
    autoRegisterQueries: boolean;
    constructor(_zone: NgZone, _breakpoints: BreakPointRegistry);
    /**
     * Easy method to clear all listeners for all mediaQueries
     */
    clearAll(): void;
    /**
     * Feature to support manual, simulated activation of a mediaQuery.
     */
    activate(mediaQuery: string, useOverlaps?: boolean): boolean;
    /**
     * Converts an optional mediaQuery alias to a specific, valid mediaQuery
     */
    _validateQuery(queryOrAlias: any): any;
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
    private _activateWithOverlaps(mediaQuery, useOverlaps);
    /**
     *
     */
    private _activateByAlias(alias);
    /**
     *
     */
    private _activateByQuery(mediaQuery);
    /**
     * Deactivate all current Mock MQLs
     */
    private _deactivateAll();
    /**
     * Insure the mediaQuery is registered with MatchMedia
     */
    private _registerMediaQuery(mediaQuery);
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    protected _buildMQL(query: string): MediaQueryList;
    protected readonly hasActivated: boolean;
    private _actives;
}
/**
 * Special internal class to simulate a MediaQueryList and
 * - supports manual activation to simulate mediaQuery matching
 * - manages listeners
 */
export declare class MockMediaQueryList implements MediaQueryList {
    private _mediaQuery;
    private _isActive;
    private _listeners;
    readonly matches: boolean;
    readonly media: string;
    constructor(_mediaQuery: string);
    /**
     *
     */
    destroy(): void;
    /**
     * Notify all listeners that 'matches === TRUE'
     */
    activate(): MockMediaQueryList;
    /**
     * Notify all listeners that 'matches === false'
     */
    deactivate(): MockMediaQueryList;
    /**
     *
     */
    addListener(listener: MediaQueryListListener): void;
    removeListener(listener: MediaQueryListListener): void;
}
