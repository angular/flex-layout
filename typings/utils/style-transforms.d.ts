export declare type NgStyleRawList = string[];
export declare type NgStyleMap = {
    [klass: string]: string;
};
export declare type NgStyleType = string | Set<string> | NgStyleRawList | NgStyleMap;
export declare type NgStyleSanitizer = (val: any) => string;
export declare class NgStyleKeyValue {
    key: string;
    value: string;
    constructor(key: string, value: string, noQuotes?: boolean);
}
export declare const ngStyleUtils: {
    getType: (target: any) => string;
    buildRawList: (source: any, delimiter?: string) => string[];
    buildMapFromList: (styles: string[], sanitize?: NgStyleSanitizer) => NgStyleMap;
    buildMapFromSet: (source: any, sanitize?: NgStyleSanitizer) => NgStyleMap;
};
