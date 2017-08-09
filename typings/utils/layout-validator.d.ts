export declare const LAYOUT_VALUES: string[];
export declare function buildLayoutCSS(value: string): {
    'display': string;
    'box-sizing': string;
    'flex-direction': any;
    'flex-wrap': any;
};
export declare function validateValue(value: string): any[];
export declare function isFlowHorizontal(value: string): boolean;
export declare function validateWrapValue(value: any): any;
