import { Optional } from '@angular/core';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
import { MatchMedia } from './match-media';
import { ObservableMedia } from './observable-media';
export declare function OBSERVABLE_MEDIA_PROVIDER_FACTORY(parentService: ObservableMedia, matchMedia: MatchMedia, breakpoints: BreakPointRegistry): ObservableMedia;
export declare const OBSERVABLE_MEDIA_PROVIDER: {
    provide: typeof ObservableMedia;
    deps: (typeof MatchMedia | typeof BreakPointRegistry | Optional[])[];
    useFactory: (parentService: ObservableMedia, matchMedia: MatchMedia, breakpoints: BreakPointRegistry) => ObservableMedia;
};
