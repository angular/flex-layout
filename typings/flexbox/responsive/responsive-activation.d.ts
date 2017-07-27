import { Subscription } from 'rxjs/Subscription';
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
export declare class ResponsiveActivation {
    private _options;
    private _mediaMonitor;
    private _onMediaChanges;
    private _subscribers;
    private _activatedInputKey;
    constructor(_options: KeyOptions, _mediaMonitor: MediaMonitor, _onMediaChanges: MediaQuerySubscriber);
    readonly mediaMonitor: MediaMonitor;
    readonly activatedInputKey: string;
    readonly activatedInput: any;
    hasKeyValue(key: any): boolean;
    destroy(): void;
    private _configureChangeObservers();
    private _buildRegistryMap();
    protected _onMonitorEvents(change: MediaChange): void;
    private _keyInUse(key);
    private _calculateActivatedValue(current);
    private _validateInputKey(inputKey);
    private _lookupKeyValue(key);
}
