export declare class ClassDirective extends BaseDirective2 implements DoCheck {
    protected DIRECTIVE_KEY: string;
    protected elementRef: ElementRef;
    protected iterableDiffers: IterableDiffers;
    protected keyValueDiffers: KeyValueDiffers;
    klass: string;
    protected marshal: MediaMarshaller;
    protected readonly ngClassInstance: NgClass;
    protected renderer: Renderer2;
    protected styler: StyleUtils;
    constructor(elementRef: ElementRef, styler: StyleUtils, marshal: MediaMarshaller, iterableDiffers: IterableDiffers, keyValueDiffers: KeyValueDiffers, renderer: Renderer2, ngClassInstance: NgClass);
    ngDoCheck(): void;
    protected updateWithValue(value: any): void;
}

export declare class DefaultClassDirective extends ClassDirective {
    protected inputs: string[];
}

export declare class DefaultImgSrcDirective extends ImgSrcDirective {
    protected inputs: string[];
}

export declare class DefaultShowHideDirective extends ShowHideDirective {
    protected inputs: string[];
}

export declare class DefaultStyleDirective extends StyleDirective implements DoCheck {
    protected inputs: string[];
}

export declare class ExtendedModule {
}

export declare class ImgSrcDirective extends BaseDirective2 {
    protected DIRECTIVE_KEY: string;
    protected defaultSrc: string;
    protected elementRef: ElementRef;
    protected marshal: MediaMarshaller;
    protected platformId: Object;
    protected serverModuleLoaded: boolean;
    src: string;
    protected styleBuilder: ImgSrcStyleBuilder;
    protected styleCache: Map<string, StyleDefinition>;
    protected styler: StyleUtils;
    constructor(elementRef: ElementRef, styleBuilder: ImgSrcStyleBuilder, styler: StyleUtils, marshal: MediaMarshaller, platformId: Object, serverModuleLoaded: boolean);
    protected updateWithValue(): void;
}

export declare class ImgSrcStyleBuilder extends StyleBuilder {
    buildStyles(url: string): {
        'content': string;
    };
}

export declare class ShowHideDirective extends BaseDirective2 implements AfterViewInit, OnChanges {
    protected DIRECTIVE_KEY: string;
    protected display: string;
    protected elementRef: ElementRef;
    protected hasFlexChild: boolean;
    protected hasLayout: boolean;
    protected layoutConfig: LayoutConfigOptions;
    protected marshal: MediaMarshaller;
    protected platformId: Object;
    protected serverModuleLoaded: boolean;
    protected styleBuilder: ShowHideStyleBuilder;
    protected styler: StyleUtils;
    constructor(elementRef: ElementRef, styleBuilder: ShowHideStyleBuilder, styler: StyleUtils, marshal: MediaMarshaller, layoutConfig: LayoutConfigOptions, platformId: Object, serverModuleLoaded: boolean);
    protected getDisplayStyle(): string;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    protected trackExtraTriggers(): void;
    protected updateWithValue(value?: boolean | string): void;
}

export interface ShowHideParent {
    display: string;
}

export declare class ShowHideStyleBuilder extends StyleBuilder {
    buildStyles(show: string, parent: ShowHideParent): {
        'display': string;
    };
}

export declare class StyleDirective extends BaseDirective2 implements DoCheck {
    protected DIRECTIVE_KEY: string;
    protected elementRef: ElementRef;
    protected fallbackStyles: NgStyleMap;
    protected isServer: boolean;
    protected keyValueDiffers: KeyValueDiffers;
    protected marshal: MediaMarshaller;
    protected renderer: Renderer2;
    protected sanitizer: DomSanitizer;
    protected styler: StyleUtils;
    constructor(elementRef: ElementRef, styler: StyleUtils, marshal: MediaMarshaller, keyValueDiffers: KeyValueDiffers, renderer: Renderer2, sanitizer: DomSanitizer, ngStyleInstance: NgStyle, serverLoaded: boolean, platformId: Object);
    protected buildStyleMap(styles: NgStyleType): NgStyleMap;
    protected clearStyles(): void;
    ngDoCheck(): void;
    protected updateWithValue(value: any): void;
}
