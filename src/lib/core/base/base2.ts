/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ElementRef, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {Subject} from 'rxjs';

import {StyleDefinition, StyleUtils} from '../style-utils/style-utils';
import {StyleBuilder} from '../style-builder/style-builder';
import {MediaMarshaller} from '../media-marshaller/media-marshaller';
import {buildLayoutCSS} from '../../utils/layout-validator';

export abstract class BaseDirective2 implements OnChanges, OnDestroy {

  protected DIRECTIVE_KEY = '';
  protected inputs: string[] = [];
  protected destroySubject: Subject<void> = new Subject();

  /** Access to host element's parent DOM node */
  protected get parentElement(): HTMLElement | null {
    return this.elementRef.nativeElement.parentElement;
  }

  /** Access to the HTMLElement for the directive */
  protected get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /** Access to the activated value for the directive */
  get activatedValue(): string {
    return this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY);
  }
  set activatedValue(value: string) {
    this.marshal.setValue(this.nativeElement, this.DIRECTIVE_KEY, value,
      this.marshal.activatedBreakpoint);
  }

  /** Cache map for style computation */
  protected styleCache: Map<string, StyleDefinition> = new Map();

  protected constructor(protected elementRef: ElementRef,
                        protected styleBuilder: StyleBuilder,
                        protected styler: StyleUtils,
                        protected marshal: MediaMarshaller) {
  }

  /** For @Input changes */
  ngOnChanges(changes: SimpleChanges) {
    Object.keys(changes).forEach(key => {
      if (this.inputs.indexOf(key) !== -1) {
        const bp = key.split('.')[1] || '';
        const val = changes[key].currentValue;
        this.setValue(val, bp);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.marshal.releaseElement(this.nativeElement);
  }

  /** Add styles to the element using predefined style builder */
  protected addStyles(input: string, parent?: Object) {
    const builder = this.styleBuilder;
    const useCache = builder.shouldCache;

    let genStyles: StyleDefinition | undefined = this.styleCache.get(input);

    if (!genStyles || !useCache) {
      genStyles = builder.buildStyles(input, parent);
      if (useCache) {
        this.styleCache.set(input, genStyles);
      }
    }

    this.applyStyleToElement(genStyles);
    builder.sideEffect(input, genStyles, parent);
  }

  protected triggerUpdate() {
    const val = this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY);
    this.marshal.updateElement(this.nativeElement, this.DIRECTIVE_KEY, val);
  }

  /**
   * Determine the DOM element's Flexbox flow (flex-direction).
   *
   * Check inline style first then check computed (stylesheet) style.
   * And optionally add the flow value to element's inline style.
   */
  protected getFlexFlowDirection(target: HTMLElement, addIfMissing = false): string {
    if (target) {
      const [value, hasInlineValue] = this.styler.getFlowDirection(target);

      if (!hasInlineValue && addIfMissing) {
        const style = buildLayoutCSS(value);
        const elements = [target];
        this.styler.applyStyleToElements(style, elements);
      }

      return value.trim();
    }

    return 'row';
  }

  /** Applies styles given via string pair or object map to the directive element */
  protected applyStyleToElement(style: StyleDefinition,
                                value?: string | number,
                                element: HTMLElement = this.nativeElement) {
    this.styler.applyStyleToElement(element, style, value);
  }

  protected setValue(val: any, bp: string): void {
    this.marshal.setValue(this.nativeElement, this.DIRECTIVE_KEY, val, bp);
  }
}
