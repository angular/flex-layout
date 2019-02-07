export declare abstract class BaseDirective2 implements OnChanges, OnDestroy {
    protected DIRECTIVE_KEY: string;
    activatedValue: string;
    protected destroySubject: Subject<void>;
    protected elementRef: ElementRef;
    protected inputs: string[];
    protected marshal: MediaMarshaller;
    protected mru: StyleDefinition;
    protected readonly nativeElement: HTMLElement;
    protected readonly parentElement: HTMLElement | null;
    protected styleBuilder: StyleBuilder;
    protected styleCache: Map<string, StyleDefinition>;
    protected styler: StyleUtils;
    protected constructor(elementRef: ElementRef, styleBuilder: StyleBuilder, styler: StyleUtils, marshal: MediaMarshaller);
    protected addStyles(input: string, parent?: Object): void;
    protected applyStyleToElement(style: StyleDefinition, value?: string | number, element?: HTMLElement): void;
    protected clearStyles(): void;
    protected init(extraTriggers?: Observable<any>[]): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    protected setValue(val: any, bp: string): void;
    protected triggerUpdate(): void;
    protected updateWithValue(input: string): void;
}

export interface BreakPoint {
    alias: string;
    mediaQuery: string;
    overlapping?: boolean;
    priority?: number;
    suffix?: string;
}

export declare const BREAKPOINT: InjectionToken<BreakPoint | BreakPoint[] | null>;

export declare const BREAKPOINT_PRINT: {
    alias: string;
    mediaQuery: string;
    priority: number;
};

export declare class BreakPointRegistry {
    readonly aliases: string[];
    readonly items: BreakPoint[];
    readonly overlappings: BreakPoint[];
    readonly suffixes: string[];
    constructor(list: BreakPoint[]);
    findByAlias(alias: string): OptionalBreakPoint;
    findByQuery(query: string): OptionalBreakPoint;
}

export declare const BREAKPOINTS: InjectionToken<BreakPoint[]>;

export declare const BROWSER_PROVIDER: {
    provide: InjectionToken<(() => void)[]>;
    useFactory: typeof removeStyles;
    deps: InjectionToken<Object>[];
    multi: boolean;
};

export declare const CLASS_NAME = "flex-layout-";

export declare function coerceArray<T>(value: T | T[]): T[];

export declare class CoreModule {
}

export declare const DEFAULT_BREAKPOINTS: BreakPoint[];

export declare const DEFAULT_CONFIG: LayoutConfigOptions;

export interface ElementMatcher {
    element: HTMLElement;
    key: string;
    value: any;
}

export interface HookTarget {
    activatedBreakpoints: BreakPoint[];
    updateStyles(): void;
}

export declare const LAYOUT_CONFIG: InjectionToken<LayoutConfigOptions>;

export interface LayoutConfigOptions {
    addFlexToParent?: boolean;
    addOrientationBps?: boolean;
    disableDefaultBps?: boolean;
    disableVendorPrefixes?: boolean;
    mediaTriggerAutoRestore?: boolean;
    printWithBreakpoints?: string[];
    serverLoaded?: boolean;
    ssrObserveBreakpoints?: string[];
    useColumnBasisZero?: boolean;
}

export declare class MediaChange {
    matches: boolean;
    mediaQuery: string;
    mqAlias: string;
    priority: number;
    property: string;
    suffix: string;
    value: any;
    constructor(matches?: boolean, mediaQuery?: string, mqAlias?: string, suffix?: string, priority?: number);
    clone(): MediaChange;
}

export declare class MediaMarshaller {
    readonly activatedAlias: string;
    protected breakpoints: BreakPointRegistry;
    protected hook: PrintHook;
    protected matchMedia: MatchMedia;
    constructor(matchMedia: MatchMedia, breakpoints: BreakPointRegistry, hook: PrintHook);
    clearElement(element: HTMLElement, key: string): void;
    getValue(element: HTMLElement, key: string, bp?: string): any;
    hasValue(element: HTMLElement, key: string): boolean;
    init(element: HTMLElement, key: string, updateFn?: UpdateCallback, clearFn?: ClearCallback, extraTriggers?: Observable<any>[]): void;
    onMediaChange(mc: MediaChange): void;
    releaseElement(element: HTMLElement): void;
    setValue(element: HTMLElement, key: string, val: any, bp: string): void;
    trackValue(element: HTMLElement, key: string): Observable<ElementMatcher>;
    triggerUpdate(element: HTMLElement, key?: string): void;
    updateElement(element: HTMLElement, key: string, value: any): void;
    updateStyles(): void;
}

export declare class MediaObserver implements OnDestroy {
    protected breakpoints: BreakPointRegistry;
    filterOverlaps: boolean;
    protected hook: PrintHook;
    protected matchMedia: MatchMedia;
    readonly media$: Observable<MediaChange>;
    constructor(breakpoints: BreakPointRegistry, matchMedia: MatchMedia, hook: PrintHook);
    asObservable(): Observable<MediaChange[]>;
    isActive(value: string | string[]): boolean;
    ngOnDestroy(): void;
}

export declare type MediaQuerySubscriber = (changes: MediaChange) => void;

export declare class MediaTrigger {
    protected _document: any;
    protected _platformId: Object;
    protected breakpoints: BreakPointRegistry;
    protected layoutConfig: LayoutConfigOptions;
    protected matchMedia: MatchMedia;
    constructor(breakpoints: BreakPointRegistry, matchMedia: MatchMedia, layoutConfig: LayoutConfigOptions, _platformId: Object, _document: any);
    activate(list: string[]): void;
    restore(): void;
}

export declare function mergeAlias(dest: MediaChange, source: BreakPoint | null): MediaChange;

export declare type OptionalBreakPoint = BreakPoint | null;

export declare const ORIENTATION_BREAKPOINTS: BreakPoint[];

export declare class PrintHook {
    protected breakpoints: BreakPointRegistry;
    protected layoutConfig: LayoutConfigOptions;
    readonly printAlias: string[];
    readonly printBreakPoints: BreakPoint[];
    constructor(breakpoints: BreakPointRegistry, layoutConfig: LayoutConfigOptions);
    blockPropagation(): (event: MediaChange) => boolean;
    collectActivations(event: MediaChange): void;
    getEventBreakpoints({ mediaQuery }: MediaChange): BreakPoint[];
    interceptEvents(target: HookTarget): (event: MediaChange) => void;
    isPrintEvent(e: MediaChange): Boolean;
    protected startPrinting(target: HookTarget, bpList: OptionalBreakPoint[]): void;
    protected stopPrinting(target: HookTarget): void;
    updateEvent(event: MediaChange): MediaChange;
    withPrintQuery(queries: string[]): string[];
}

export declare function removeStyles(_document: Document, platformId: Object): () => void;

export declare const ScreenTypes: {
    'HANDSET': string;
    'TABLET': string;
    'WEB': string;
    'HANDSET_PORTRAIT': string;
    'TABLET_PORTRAIT': string;
    'WEB_PORTRAIT': string;
    'HANDSET_LANDSCAPE': string;
    'TABLET_LANDSCAPE': string;
    'WEB_LANDSCAPE': string;
};

export declare const SERVER_TOKEN: InjectionToken<boolean>;

export declare function sortAscendingPriority<T extends WithPriority>(a: T, b: T): number;

export declare function sortDescendingPriority<T extends WithPriority>(a: T | null, b: T | null): number;

export declare abstract class StyleBuilder {
    shouldCache: boolean;
    abstract buildStyles(input: string, parent?: Object): StyleDefinition;
    sideEffect(_input: string, _styles: StyleDefinition, _parent?: Object): void;
}

export declare type StyleDefinition = {
    [property: string]: string | number | null;
};

export declare class StylesheetMap {
    readonly stylesheet: Map<HTMLElement, Map<string, string | number>>;
    addStyleToElement(element: HTMLElement, style: string, value: string | number): void;
    clearStyles(): void;
    getStyleForElement(el: HTMLElement, styleName: string): string;
}

export declare class StyleUtils {
    constructor(_serverStylesheet: StylesheetMap, _serverModuleLoaded: boolean, _platformId: Object, layoutConfig: LayoutConfigOptions);
    applyStyleToElement(element: HTMLElement, style: StyleDefinition | string, value?: string | number | null): void;
    applyStyleToElements(style: StyleDefinition, elements?: HTMLElement[]): void;
    getFlowDirection(target: HTMLElement): [string, string];
    lookupAttributeValue(element: HTMLElement, attribute: string): string;
    lookupInlineStyle(element: HTMLElement, styleName: string): string;
    lookupStyle(element: HTMLElement, styleName: string, inlineOnly?: boolean): string;
}

export declare function validateBasis(basis: string, grow?: string, shrink?: string): string[];
