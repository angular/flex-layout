export declare class BaseFlexFlowDirective extends BaseDirective2 {
    protected getFlexFlowDirection(target: HTMLElement, addIfMissing?: boolean): string;
}

export declare class DefaultFlexAlignDirective extends FlexAlignDirective {
    protected inputs: string[];
}

export declare class DefaultFlexDirective extends FlexDirective {
    protected inputs: string[];
}

export declare class DefaultFlexOffsetDirective extends FlexOffsetDirective {
    protected inputs: string[];
}

export declare class DefaultFlexOrderDirective extends FlexOrderDirective {
    protected inputs: string[];
}

export declare class DefaultLayoutAlignDirective extends LayoutAlignDirective {
    protected inputs: string[];
}

export declare class DefaultLayoutDirective extends LayoutDirective {
    protected inputs: string[];
}

export declare class DefaultLayoutGapDirective extends LayoutGapDirective {
    protected inputs: string[];
}

export declare class FlexAlignDirective extends BaseDirective2 {
    protected DIRECTIVE_KEY: string;
    protected elRef: ElementRef;
    protected marshal: MediaMarshaller;
    protected styleBuilder: FlexAlignStyleBuilder;
    protected styleCache: Map<string, StyleDefinition>;
    protected styleUtils: StyleUtils;
    constructor(elRef: ElementRef, styleUtils: StyleUtils, styleBuilder: FlexAlignStyleBuilder, marshal: MediaMarshaller);
}

export declare class FlexAlignStyleBuilder extends StyleBuilder {
    buildStyles(input: string): StyleDefinition;
}

export declare class FlexDirective extends BaseFlexFlowDirective {
    protected DIRECTIVE_KEY: string;
    protected direction: string;
    protected elRef: ElementRef;
    protected flexGrow: string;
    protected flexShrink: string;
    grow: string;
    protected layoutConfig: LayoutConfigOptions;
    protected marshal: MediaMarshaller;
    shrink: string;
    protected styleBuilder: FlexStyleBuilder;
    protected styleUtils: StyleUtils;
    protected wrap: boolean;
    constructor(elRef: ElementRef, styleUtils: StyleUtils, layoutConfig: LayoutConfigOptions, styleBuilder: FlexStyleBuilder, marshal: MediaMarshaller);
    protected onLayoutChange(matcher: ElementMatcher): void;
    protected triggerReflow(): void;
    protected updateWithValue(value: string): void;
}

export declare class FlexFillDirective extends BaseDirective2 {
    protected elRef: ElementRef;
    protected marshal: MediaMarshaller;
    protected styleBuilder: FlexFillStyleBuilder;
    protected styleCache: Map<string, StyleDefinition>;
    protected styleUtils: StyleUtils;
    constructor(elRef: ElementRef, styleUtils: StyleUtils, styleBuilder: FlexFillStyleBuilder, marshal: MediaMarshaller);
}

export declare class FlexFillStyleBuilder extends StyleBuilder {
    buildStyles(_input: string): {
        'margin': number;
        'width': string;
        'height': string;
        'min-width': string;
        'min-height': string;
    };
}

export declare class FlexModule {
}

export declare class FlexOffsetDirective extends BaseFlexFlowDirective implements OnChanges {
    protected DIRECTIVE_KEY: string;
    protected directionality: Directionality;
    protected elRef: ElementRef;
    protected marshal: MediaMarshaller;
    protected styleBuilder: FlexOffsetStyleBuilder;
    protected styler: StyleUtils;
    constructor(elRef: ElementRef, directionality: Directionality, styleBuilder: FlexOffsetStyleBuilder, marshal: MediaMarshaller, styler: StyleUtils);
    protected updateWithValue(value?: string | number): void;
}

export interface FlexOffsetParent {
    isRtl: boolean;
    layout: string;
}

export declare class FlexOffsetStyleBuilder extends StyleBuilder {
    buildStyles(offset: string, parent: FlexOffsetParent): StyleDefinition;
}

export declare class FlexOrderDirective extends BaseDirective2 implements OnChanges {
    protected DIRECTIVE_KEY: string;
    protected elRef: ElementRef;
    protected marshal: MediaMarshaller;
    protected styleBuilder: FlexOrderStyleBuilder;
    protected styleCache: Map<string, StyleDefinition>;
    protected styleUtils: StyleUtils;
    constructor(elRef: ElementRef, styleUtils: StyleUtils, styleBuilder: FlexOrderStyleBuilder, marshal: MediaMarshaller);
}

export declare class FlexOrderStyleBuilder extends StyleBuilder {
    buildStyles(value: string): {
        order: string | number;
    };
}

export declare class FlexStyleBuilder extends StyleBuilder {
    protected layoutConfig: LayoutConfigOptions;
    constructor(layoutConfig: LayoutConfigOptions);
    buildStyles(input: string, parent: FlexBuilderParent): StyleDefinition;
}

export declare class LayoutAlignDirective extends BaseDirective2 {
    protected DIRECTIVE_KEY: string;
    protected elRef: ElementRef;
    protected layout: string;
    protected marshal: MediaMarshaller;
    protected styleBuilder: LayoutAlignStyleBuilder;
    protected styleUtils: StyleUtils;
    constructor(elRef: ElementRef, styleUtils: StyleUtils, styleBuilder: LayoutAlignStyleBuilder, marshal: MediaMarshaller);
    protected onLayoutChange(matcher: ElementMatcher): void;
    protected updateWithValue(value: string): void;
}

export interface LayoutAlignParent {
    layout: string;
}

export declare class LayoutAlignStyleBuilder extends StyleBuilder {
    buildStyles(align: string, parent: LayoutAlignParent): StyleDefinition;
}

export declare class LayoutDirective extends BaseDirective2 implements OnChanges {
    protected DIRECTIVE_KEY: string;
    protected elRef: ElementRef;
    protected marshal: MediaMarshaller;
    protected styleBuilder: LayoutStyleBuilder;
    protected styleCache: Map<string, StyleDefinition>;
    protected styleUtils: StyleUtils;
    constructor(elRef: ElementRef, styleUtils: StyleUtils, styleBuilder: LayoutStyleBuilder, marshal: MediaMarshaller);
}

export declare class LayoutGapDirective extends BaseDirective2 implements AfterContentInit, OnDestroy {
    protected DIRECTIVE_KEY: string;
    protected readonly childrenNodes: HTMLElement[];
    protected directionality: Directionality;
    protected elRef: ElementRef;
    protected layout: string;
    protected marshal: MediaMarshaller;
    protected observer?: MutationObserver;
    protected observerSubject: Subject<void>;
    protected styleBuilder: LayoutGapStyleBuilder;
    protected styleUtils: StyleUtils;
    protected zone: NgZone;
    constructor(elRef: ElementRef, zone: NgZone, directionality: Directionality, styleUtils: StyleUtils, styleBuilder: LayoutGapStyleBuilder, marshal: MediaMarshaller);
    protected buildChildObservable(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    protected onLayoutChange(matcher: ElementMatcher): void;
    protected updateWithValue(value: string): void;
    protected willDisplay(source: HTMLElement): boolean;
}

export interface LayoutGapParent {
    directionality: string;
    items: HTMLElement[];
    layout: string;
}

export declare class LayoutGapStyleBuilder extends StyleBuilder {
    constructor(_styler: StyleUtils);
    buildStyles(gapValue: string, parent: LayoutGapParent): StyleDefinition;
    sideEffect(gapValue: string, _styles: StyleDefinition, parent: LayoutGapParent): void;
}

export declare class LayoutStyleBuilder extends StyleBuilder {
    buildStyles(input: string): {
        'display': string;
        'box-sizing': string;
        'flex-direction': string;
        'flex-wrap': string | null;
    };
}
