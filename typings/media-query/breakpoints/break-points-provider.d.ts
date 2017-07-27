import { InjectionToken } from '@angular/core';
import { BreakPoint } from './break-point';
export interface BreakPointProviderOptions {
    defaults?: boolean;
    orientations?: boolean;
}
export declare function buildMergedBreakPoints(_custom?: BreakPoint[], options?: BreakPointProviderOptions): () => BreakPoint[];
export declare function DEFAULT_BREAKPOINTS_PROVIDER_FACTORY(): BreakPoint[];
export declare const DEFAULT_BREAKPOINTS_PROVIDER: {
    provide: InjectionToken<BreakPoint[]>;
    useFactory: () => BreakPoint[];
};
export declare function CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(_custom?: BreakPoint[], options?: BreakPointProviderOptions): {
    provide: InjectionToken<BreakPoint[]>;
    useFactory: () => BreakPoint[];
};
