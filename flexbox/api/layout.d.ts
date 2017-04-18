/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnInit, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
export declare class LayoutDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    /**
     * Create Observable for nested/child 'flex' directives. This allows
     * child flex directives to subscribe/listen for flexbox direction changes.
     */
    protected _announcer: BehaviorSubject<string>;
    /**
     * Publish observer to enabled nested, dependent directives to listen
     * to parent "layout" direction changes
     */
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
    /**
     *
     */
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2);
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxLayout')
     * Then conditionally override with the mq-activated Input's current value
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit(): void;
    /**
     * Validate the direction value and then update the host's inline flexbox styles
     */
    protected _updateWithDirection(value?: string): void;
}
