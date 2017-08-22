import { Optional } from '@angular/core';
import { MediaMonitor } from './media-monitor';
import { MatchMedia } from './match-media';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
export declare function MEDIA_MONITOR_PROVIDER_FACTORY(parentMonitor: MediaMonitor, breakpoints: BreakPointRegistry, matchMedia: MatchMedia): MediaMonitor;
export declare const MEDIA_MONITOR_PROVIDER: {
    provide: typeof MediaMonitor;
    deps: (typeof MatchMedia | typeof BreakPointRegistry | Optional[])[];
    useFactory: (parentMonitor: MediaMonitor, breakpoints: BreakPointRegistry, matchMedia: MatchMedia) => MediaMonitor;
};
