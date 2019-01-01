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

export declare class CoreModule {
}

export declare const DEFAULT_BREAKPOINTS: BreakPoint[];

export declare const DEFAULT_CONFIG: LayoutConfigOptions;

export interface ElementMatcher {
    element: HTMLElement;
    key: string;
    value: any;
}

export declare function extendObject(dest: any, ...sources: any[]): any;

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
    printWithBreakpoints?: string[];
    serverLoaded?: boolean;
    useColumnBasisZero?: boolean;
}

export declare class MatchMedia {
    protected _document: any;
    protected _observable$: Observable<MediaChange>;
    protected _platformId: Object;
    protected _registry: Map<string, MediaQueryList>;
    protected _source: BehaviorSubject<MediaChange>;
    protected _zone: NgZone;
    constructor(_zone: NgZone, _platformId: Object, _document: any);
    protected buildMQL(query: string): MediaQueryList;
    isActive(mediaQuery: string): boolean;
    observe(): Observable<MediaChange>;
    observe(mediaQueries: string[]): Observable<MediaChange>;
    observe(mediaQueries: string[], filterOthers: boolean): Observable<MediaChange>;
    registerQuery(mediaQuery: string | string[]): MediaChange[];
}

export declare class MediaChange {
    matches: boolean;
    mediaQuery: string;
    mqAlias: string;
    property: string;
    suffix: string;
    value: any;
    constructor(matches?: boolean, mediaQuery?: string, mqAlias?: string, suffix?: string);
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
    updateElement(element: HTMLElement, key: string, value: any): void;
    updateStyles(): void;
}

export declare class MediaObserver {
    protected breakpoints: BreakPointRegistry;
    filterOverlaps: boolean;
    protected hook: PrintHook;
    readonly media$: Observable<MediaChange>;
    protected mediaWatcher: MatchMedia;
    constructor(breakpoints: BreakPointRegistry, mediaWatcher: MatchMedia, hook: PrintHook);
    isActive(alias: string): boolean;
}

export declare type MediaQuerySubscriber = (changes: MediaChange) => void;

export declare class MockMatchMedia extends MatchMedia {
    protected _registry: Map<string, MockMediaQueryList>;
    autoRegisterQueries: boolean;
    protected readonly hasActivated: boolean;
    useOverlaps: boolean;
    constructor(_zone: NgZone, _platformId: Object, _document: any, _breakpoints: BreakPointRegistry);
    _validateQuery(queryOrAlias: string): string;
    activate(mediaQuery: string, useOverlaps?: boolean): boolean;
    protected buildMQL(query: string): MediaQueryList;
    clearAll(): void;
}

export declare const MockMatchMediaProvider: {
    provide: typeof MatchMedia;
    useClass: typeof MockMatchMedia;
};

export declare class MockMediaQueryList implements MediaQueryList {
    readonly matches: boolean;
    readonly media: string;
    onchange: MediaQueryListListener;
    constructor(_mediaQuery: string);
    activate(): MockMediaQueryList;
    addEventListener<K extends keyof MediaQueryListEventMap>(_: K, __: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any, ___?: boolean | AddEventListenerOptions): void;
    addListener(listener: MediaQueryListListener): void;
    deactivate(): MockMediaQueryList;
    destroy(): void;
    dispatchEvent(_: Event): boolean;
    removeEventListener<K extends keyof MediaQueryListEventMap>(_: K, __: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any, ___?: boolean | EventListenerOptions): void;
    removeListener(_: EventListenerOrEventListenerObject | null): void;
}

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

export declare class ServerMatchMedia extends MatchMedia {
    protected _document: any;
    protected _platformId: Object;
    protected _registry: Map<string, ServerMediaQueryList>;
    protected _zone: NgZone;
    constructor(_zone: NgZone, _platformId: Object, _document: any);
    activateBreakpoint(bp: BreakPoint): void;
    protected buildMQL(query: string): ServerMediaQueryList;
    deactivateBreakpoint(bp: BreakPoint): void;
}

export declare class ServerMediaQueryList implements MediaQueryList {
    readonly matches: boolean;
    readonly media: string;
    onchange: MediaQueryListListener;
    constructor(_mediaQuery: string);
    activate(): ServerMediaQueryList;
    addEventListener<K extends keyof MediaQueryListEventMap>(_: K, __: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any, ___?: boolean | AddEventListenerOptions): void;
    addListener(listener: MediaQueryListListener): void;
    deactivate(): ServerMediaQueryList;
    destroy(): void;
    dispatchEvent(_: Event): boolean;
    removeEventListener<K extends keyof MediaQueryListEventMap>(_: K, __: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any, ___?: boolean | EventListenerOptions): void;
    removeListener(_: EventListenerOrEventListenerObject | null): void;
}

export declare function sortAscendingPriority(a: BreakPoint, b: BreakPoint): number;

export declare function sortDescendingPriority(a: OptionalBreakPoint, b: OptionalBreakPoint): number;

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
