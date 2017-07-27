export declare type MediaQuerySubscriber = (changes: MediaChange) => void;
export declare class MediaChange {
    matches: boolean;
    mediaQuery: string;
    mqAlias: string;
    suffix: string;
    property: string;
    value: any;
    constructor(matches?: boolean, mediaQuery?: string, mqAlias?: string, suffix?: string);
    clone(): MediaChange;
}
