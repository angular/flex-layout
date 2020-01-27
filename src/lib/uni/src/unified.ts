/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  QueryList,
  SkipSelf,
} from '@angular/core';

import {GrandCentral} from './central';
import {BPS, Breakpoint, FALLBACK_BREAKPOINT, FALLBACK_BREAKPOINT_KEY} from './breakpoint';
import {Tag, ValuePriority} from './tags/tag';
import {TAGS} from './tags/tags';
import {ATTR_KEY, CLASS_KEY, KEY_DELIMITER, STYLE_KEY, CLEAR_VALUE} from './constants';


/**
 * This is a simplistic, wrapping directive meant only to
 * capture and record values for individual breakpoints.
 */
@Directive({selector: `bp`})
export class BreakpointDirective {

  @Input('tag') name: string = '';

  readonly element: HTMLElement;
  constructor(elementRef: ElementRef<HTMLElement>) {
    this.element = elementRef.nativeElement;
  }
}

/**
 * One directive to rule them all. This directive is responsible for
 * tagging an HTML element as part of the layout system, and then
 * coordinating all updates with GrandCentral.
 */
@Directive({selector: `[ngl]`})
export class UnifiedDirective implements AfterContentInit, OnDestroy {

  readonly element: HTMLElement;
  readonly valueMap: Map<string, Map<string, string>> = new Map();

  @ContentChildren(BreakpointDirective) bpElements !: QueryList<BreakpointDirective>;

  private readonly rootObserver: MutationObserver | undefined;
  private readonly observerMap: Map<Element, MutationObserver> = new Map();
  private readonly tagNames: Array<string>;
  private readonly fallbacks: Map<string, string>;

  constructor(@Optional() @SkipSelf() readonly parent: UnifiedDirective,
              elementRef: ElementRef<HTMLElement>,
              @Inject(BPS) private readonly breakpoints: Breakpoint[],
              @Inject(TAGS) private readonly tags: Map<string, Tag>,
              private readonly grandCentral: GrandCentral) {
    breakpoints.forEach(bp => this.valueMap.set(bp.name, new Map()));
    this.element = elementRef.nativeElement;
    this.fallbacks = new Map(Array.from(this.element.classList).map(c => [c, '']));
    this.tagNames = Array.from(this.tags.keys());
    const callback = (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          this.processAttributeMutation(mutation, true);
        }
      });
    };
    this.tagNames.forEach(tagName => {
      const attr = this.element.getAttribute(tagName);
      if (attr !== null) {
        this.valueMap.get(FALLBACK_BREAKPOINT_KEY)!.set(tagName, attr);
      }
    });
    this.grandCentral.addDirective(this, FALLBACK_BREAKPOINT);
    if (typeof MutationObserver !== 'undefined') {
      this.rootObserver = new MutationObserver(callback);
      this.rootObserver.observe(this.element, {
        attributes: true,
        attributeFilter: this.tagNames
      });
    }
  }

  ngAfterContentInit(): void {
    const childCallback = (mutations: MutationRecord[]) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          this.processAttributeMutation(mutation);
        }
      });
    };

    this.bpElements.forEach(ref => {
      const el = ref.element;
      const breakpoint = this.breakpoints.find(bp => bp.name === ref.name)!;
      this.tagNames.forEach(tagName => {
        const attr = el.getAttribute(tagName);
        if (attr !== null) {
          this.valueMap.get(ref.name)!.set(tagName, attr);
        }
      });
      this.grandCentral.addDirective(this, breakpoint);
      if (typeof MutationObserver !== 'undefined') {
        const mo = new MutationObserver(childCallback);
        mo.observe(el, {
          attributes: true,
          attributeFilter: this.tagNames,
        });
        this.observerMap.set(el, mo);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.rootObserver) {
      this.rootObserver.disconnect();
    }
    this.observerMap.forEach(observer => observer.disconnect());
    this.grandCentral.removeDirective(this);
  }

  /** Apply the given styles, attributes, and classes to the underlying HTMLElement */
  apply(map: Map<string, ValuePriority>) {
    const keys = new Set(this.fallbacks.keys());
    map.forEach((value, key) => {
      let [type, typeKey] = key.split(KEY_DELIMITER);
      if (typeKey === undefined) {
        typeKey = type;
        type = STYLE_KEY;
      }
      if (!this.fallbacks.has(key)) {
        switch (type) {
          case ATTR_KEY:
            this.fallbacks.set(key, this.element.getAttribute(typeKey)!);
            break;
          case STYLE_KEY:
          default:
            this.fallbacks.set(key, this.element.style.getPropertyValue(typeKey));
        }
      }

      if (value.value === CLEAR_VALUE) {
        return;
      }

      this.addToElement(type, typeKey, value.value);
      keys.delete(key);
    });

    keys.forEach(key => {
      let [type, typeKey] = key.split(KEY_DELIMITER);
      if (typeKey === undefined) {
        typeKey = type;
        type = STYLE_KEY;
      }

      const value = this.fallbacks.get(key)!;
      this.addToElement(type, typeKey, value);
    });
  }

  /** Apply the given value to the underlying HTMLElement */
  private addToElement(type: string, key: string, value: string) {
    switch (type) {
      case ATTR_KEY:
        this.element.setAttribute(key, value);
        break;
      case CLASS_KEY:
        this.element.classList.add(key);
        break;
      case STYLE_KEY:
      default:
        this.element.style.setProperty(key, value);
    }
  }

  /** Process a MutationObserver's attribute-type mutation */
  private processAttributeMutation(mutation: MutationRecord, isParent: boolean = false) {
    if (mutation.attributeName) {
      const target = mutation.target as Element;
      const newValue = target.getAttribute(mutation.attributeName);
      const tagName = isParent ? FALLBACK_BREAKPOINT_KEY : target.tagName.toLowerCase();
      if (newValue) {
        this.valueMap.get(tagName)!.set(mutation.attributeName, newValue);
      } else {
        this.valueMap.get(tagName)!.delete(mutation.attributeName);
      }
      this.grandCentral.updateDirective(this);
    }
  }
}
