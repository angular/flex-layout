import { ModuleWithProviders } from '@angular/core';
import { BreakPoint } from './media-query/breakpoints/break-point';
import { BreakPointProviderOptions } from './media-query/breakpoints/break-points-provider';
export declare class FlexLayoutModule {
    static provideBreakPoints(breakpoints: BreakPoint[], options?: BreakPointProviderOptions): ModuleWithProviders;
}
