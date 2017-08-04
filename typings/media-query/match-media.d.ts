import { NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { MediaChange } from './media-change';
export interface MediaQueryListListener {
    (mql: MediaQueryList): void;
}
export interface MediaQueryList {
    readonly matches: boolean;
    readonly media: string;
    addListener(listener: MediaQueryListListener): void;
    removeListener(listener: MediaQueryListListener): void;
}
export declare class MatchMedia {
    protected _zone: NgZone;
    protected _document: any;
    protected _registry: Map<string, MediaQueryList>;
    protected _source: BehaviorSubject<MediaChange>;
    protected _observable$: Observable<MediaChange>;
    constructor(_zone: NgZone, _document: any);
    isActive(mediaQuery: string): boolean;
    observe(mediaQuery?: string): Observable<MediaChange>;
    registerQuery(mediaQuery: string | string[]): void;
    protected _buildMQL(query: string): MediaQueryList;
}
export declare function isBrowser(): boolean;
