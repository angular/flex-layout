/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { MediaChange } from './media-change';
/**
 * EventHandler callback with the mediaQuery [range] activates or deactivates
 */
export interface MediaQueryListListener {
    (mql: MediaQueryList): void;
}
/**
 * EventDispatcher for a specific mediaQuery [range]
 */
export interface MediaQueryList {
    readonly matches: boolean;
    readonly media: string;
    addListener(listener: MediaQueryListListener): void;
    removeListener(listener: MediaQueryListListener): void;
}
/**
 * MediaMonitor configures listeners to mediaQuery changes and publishes an Observable facade to
 * convert mediaQuery change callbacks to subscriber notifications. These notifications will be
 * performed within the ng Zone to trigger change detections and component updates.
 *
 * NOTE: both mediaQuery activations and de-activations are announced in notifications
 */
export declare class MatchMedia {
    protected _zone: NgZone;
    protected _registry: Map<string, MediaQueryList>;
    protected _source: BehaviorSubject<MediaChange>;
    protected _observable$: Observable<MediaChange>;
    constructor(_zone: NgZone);
    /**
     * For the specified mediaQuery?
     */
    isActive(mediaQuery: string): boolean;
    /**
     * External observers can watch for all (or a specific) mql changes.
     * Typically used by the MediaQueryAdaptor; optionally available to components
     * who wish to use the MediaMonitor as mediaMonitor$ observable service.
     *
     * NOTE: if a mediaQuery is not specified, then ALL mediaQuery activations will
     *       be announced.
     */
    observe(mediaQuery?: string): Observable<MediaChange>;
    /**
     * Based on the BreakPointRegistry provider, register internal listeners for each unique
     * mediaQuery. Each listener emits specific MediaChange data to observers
     */
    registerQuery(mediaQuery: string): void;
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    protected _buildMQL(query: string): MediaQueryList;
}
