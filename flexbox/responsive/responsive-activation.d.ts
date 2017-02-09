/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { MediaChange, MediaQuerySubscriber } from '../../media-query/media-change';
import { BreakPoint } from '../../media-query/breakpoints/break-point';
import { MediaMonitor } from '../../media-query/media-monitor';
export declare type SubscriptionList = Subscription[];
export interface BreakPointX extends BreakPoint {
    key: string;
    baseKey: string;
}
export declare class KeyOptions {
    baseKey: string;
    defaultValue: string | number | boolean;
    inputKeys: {
        [key: string]: any;
    };
    constructor(baseKey: string, defaultValue: string | number | boolean, inputKeys: {
        [key: string]: any;
    });
}
/**
 * ResponsiveActivation acts as a proxy between the MonitorMedia service (which emits mediaQuery
 * changes) and the fx API directives. The MQA proxies mediaQuery change events and notifies the
 * directive via the specified callback.
 *
 * - The MQA also determines which directive property should be used to determine the
 *   current change 'value'... BEFORE the original `onMediaQueryChanges()` method is called.
 * - The `ngOnDestroy()` method is also head-hooked to enable auto-unsubscribe from the
 *   MediaQueryServices.
 *
 * NOTE: these interceptions enables the logic in the fx API directives to remain terse and clean.
 */
export declare class ResponsiveActivation {
    private _options;
    private _mediaMonitor;
    private _onMediaChanges;
    private _subscribers;
    private _activatedInputKey;
    /**
     * Constructor
     */
    constructor(_options: KeyOptions, _mediaMonitor: MediaMonitor, _onMediaChanges: MediaQuerySubscriber);
    /**
     * Accessor to the DI'ed directive property
     * Each directive instance has a reference to the MediaMonitor which is
     * used HERE to subscribe to mediaQuery change notifications.
     */
    readonly mediaMonitor: MediaMonitor;
    /**
     * Determine which directive @Input() property is currently active (for the viewport size):
     * The key must be defined (in use) or fallback to the 'closest' overlapping property key
     * that is defined; otherwise the default property key will be used.
     * e.g.
     *      if `<div fxHide fxHide.gt-sm="false">` is used but the current activated mediaQuery alias
     *      key is `.md` then `.gt-sm` should be used instead
     */
    readonly activatedInputKey: string;
    /**
     * Get the currently activated @Input value or the fallback default @Input value
     */
    readonly activatedInput: any;
    /**
     * Fast validator for presence of attribute on the host element
     */
    hasKeyValue(key: any): boolean;
    /**
     * Remove interceptors, restore original functions, and forward the onDestroy() call
     */
    destroy(): void;
    /**
     * For each *defined* API property, register a callback to `_onMonitorEvents( )`
     * Cache 1..n subscriptions for internal auto-unsubscribes when the the directive destructs
     */
    private _configureChangeObservers();
    /**
     * Build mediaQuery key-hashmap; only for the directive properties that are actually defined/used
     * in the HTML markup
     */
    private _buildRegistryMap();
    /**
     * Synchronizes change notifications with the current mq-activated @Input and calculates the
     * mq-activated input value or the default value
     */
    protected _onMonitorEvents(change: MediaChange): void;
    /**
     * Has the key been specified in the HTML markup and thus is intended
     * to participate in activation processes.
     */
    private _keyInUse(key);
    /**
     *  Map input key associated with mediaQuery activation to closest defined input key
     *  then return the values associated with the targeted input property
     *
     *  !! change events may arrive out-of-order (activate before deactivate)
     *     so make sure the deactivate is used ONLY when the keys match
     *     (since a different activate may be in use)
     */
    private _calculateActivatedValue(current);
    /**
     * For the specified input property key, validate it is defined (used in the markup)
     * If not see if a overlapping mediaQuery-related input key fallback has been defined
     *
     * NOTE: scans in the order defined by activeOverLaps (largest viewport ranges -> smallest ranges)
     */
    private _validateInputKey(inputKey);
    /**
     * Get the value (if any) for the directive instances @Input property (aka key)
     */
    private _lookupKeyValue(key);
}
