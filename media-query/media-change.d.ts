export declare type MediaQuerySubscriber = (changes: MediaChange) => void;
/**
 * Class instances emitted [to observers] for each mql notification
 */
export declare class MediaChange {
    matches: boolean;
    mediaQuery: string;
    mqAlias: string;
    suffix: string;
    property: string;
    value: any;
    constructor(matches?: boolean, mediaQuery?: string, mqAlias?: string, suffix?: string);
}
