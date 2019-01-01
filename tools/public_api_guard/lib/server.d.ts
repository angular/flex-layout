export declare type ClassMap = Map<HTMLElement, string>;

export declare function FLEX_SSR_SERIALIZER_FACTORY(serverSheet: StylesheetMap, matchMedia: MatchMedia, _document: Document, breakpoints: BreakPoint[]): () => void;

export declare class FlexLayoutServerModule {
}

export declare function generateStaticFlexLayoutStyles(serverSheet: StylesheetMap, matchMedia: MatchMedia, breakpoints: BreakPoint[]): string;

export declare const SERVER_PROVIDERS: ({
    provide: InjectionToken<() => void>;
    useFactory: typeof FLEX_SSR_SERIALIZER_FACTORY;
    deps: (typeof StylesheetMap | typeof MatchMedia | InjectionToken<Document>)[];
    multi: boolean;
    useValue?: undefined;
    useClass?: undefined;
} | {
    provide: InjectionToken<boolean>;
    useValue: boolean;
    useFactory?: undefined;
    deps?: undefined;
    multi?: undefined;
    useClass?: undefined;
} | {
    provide: typeof MatchMedia;
    useClass: typeof ServerMatchMedia;
    useFactory?: undefined;
    deps?: undefined;
    multi?: undefined;
    useValue?: undefined;
})[];

export declare type StyleSheet = Map<HTMLElement, Map<string, string | number>>;
