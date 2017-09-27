import { DoCheck, ElementRef, IterableDiffers, KeyValueDiffers, OnChanges, OnDestroy, Renderer2, SimpleChanges, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { BaseFxDirective } from '../core/base';
import { BaseFxDirectiveAdapter } from '../core/base-adapter';
import { MediaMonitor } from '../../media-query/media-monitor';
export declare type NgClassType = string | string[] | Set<string> | {
    [klass: string]: any;
};
export declare class ClassDirective extends BaseFxDirective implements DoCheck, OnChanges, OnDestroy, OnInit {
    protected monitor: MediaMonitor;
    protected _iterableDiffers: IterableDiffers;
    protected _keyValueDiffers: KeyValueDiffers;
    protected _ngEl: ElementRef;
    protected _renderer: Renderer2;
    private _ngClassInstance;
    ngClassBase: NgClassType;
    klazz: string;
    ngClassXs: NgClassType;
    ngClassSm: NgClassType;
    ngClassMd: NgClassType;
    ngClassLg: NgClassType;
    ngClassXl: NgClassType;
    ngClassLtSm: NgClassType;
    ngClassLtMd: NgClassType;
    ngClassLtLg: NgClassType;
    ngClassLtXl: NgClassType;
    ngClassGtXs: NgClassType;
    ngClassGtSm: NgClassType;
    ngClassGtMd: NgClassType;
    ngClassGtLg: NgClassType;
    constructor(monitor: MediaMonitor, _iterableDiffers: IterableDiffers, _keyValueDiffers: KeyValueDiffers, _ngEl: ElementRef, _renderer: Renderer2, _ngClassInstance: NgClass);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    protected _configureAdapters(): void;
    protected _configureMQListener(baseKey?: string): void;
    protected _base: BaseFxDirectiveAdapter;
}
