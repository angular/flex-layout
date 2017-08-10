import { ElementRef, OnInit, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
export declare class LayoutDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    protected _announcer: BehaviorSubject<string>;
    layout$: Observable<string>;
    layout: any;
    layoutXs: any;
    layoutSm: any;
    layoutMd: any;
    layoutLg: any;
    layoutXl: any;
    layoutGtXs: any;
    layoutGtSm: any;
    layoutGtMd: any;
    layoutGtLg: any;
    layoutLtSm: any;
    layoutLtMd: any;
    layoutLtLg: any;
    layoutLtXl: any;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    protected _updateWithDirection(value?: string): void;
}
