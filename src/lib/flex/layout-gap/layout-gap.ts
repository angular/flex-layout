/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  ElementRef,
  Optional,
  OnDestroy,
  NgZone,
  Injectable,
  AfterContentInit,
} from '@angular/core';
import {Directionality} from '@angular/cdk/bidi';
import {
  BaseDirective2,
  StyleBuilder,
  StyleDefinition,
  StyleUtils,
  MediaMarshaller,
  ElementMatcher,
} from '@angular/flex-layout/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {LAYOUT_VALUES} from '../../utils/layout-validator';

export interface LayoutGapParent {
  directionality: string;
  items: HTMLElement[];
  layout: string;
}

const CLEAR_MARGIN_CSS = {
  'margin-left': null,
  'margin-right': null,
  'margin-top': null,
  'margin-bottom': null
};

@Injectable({providedIn: 'root'})
export class LayoutGapStyleBuilder extends StyleBuilder {
  constructor(private _styler: StyleUtils) {
    super();
  }

  buildStyles(gapValue: string, parent: LayoutGapParent) {
    if (gapValue.endsWith(GRID_SPECIFIER)) {
      gapValue = gapValue.slice(0, gapValue.indexOf(GRID_SPECIFIER));

      // Add the margin to the host element
      return buildGridMargin(gapValue, parent.directionality);
    } else {
      return {};
    }
  }

  sideEffect(gapValue: string, _styles: StyleDefinition, parent: LayoutGapParent) {
    const items = parent.items;
    if (gapValue.endsWith(GRID_SPECIFIER)) {
      gapValue = gapValue.slice(0, gapValue.indexOf(GRID_SPECIFIER));
      // For each `element` children, set the padding
      const paddingStyles = buildGridPadding(gapValue, parent.directionality);
      this._styler.applyStyleToElements(paddingStyles, parent.items);
    } else {
      const lastItem = items.pop();

      // For each `element` children EXCEPT the last,
      // set the margin right/bottom styles...
      const gapCss = buildGapCSS(gapValue, parent);
      this._styler.applyStyleToElements(gapCss, items);

      // Clear all gaps for all visible elements
      this._styler.applyStyleToElements(CLEAR_MARGIN_CSS, [lastItem!]);
    }
  }
}

const inputs = [
  'fxLayoutGap', 'fxLayoutGap.xs', 'fxLayoutGap.sm', 'fxLayoutGap.md',
  'fxLayoutGap.lg', 'fxLayoutGap.xl', 'fxLayoutGap.lt-sm', 'fxLayoutGap.lt-md',
  'fxLayoutGap.lt-lg', 'fxLayoutGap.lt-xl', 'fxLayoutGap.gt-xs', 'fxLayoutGap.gt-sm',
  'fxLayoutGap.gt-md', 'fxLayoutGap.gt-lg'
];
const selector = `
  [fxLayoutGap], [fxLayoutGap.xs], [fxLayoutGap.sm], [fxLayoutGap.md],
  [fxLayoutGap.lg], [fxLayoutGap.xl], [fxLayoutGap.lt-sm], [fxLayoutGap.lt-md],
  [fxLayoutGap.lt-lg], [fxLayoutGap.lt-xl], [fxLayoutGap.gt-xs], [fxLayoutGap.gt-sm],
  [fxLayoutGap.gt-md], [fxLayoutGap.gt-lg]
`;

/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
export class LayoutGapDirective extends BaseDirective2 implements AfterContentInit, OnDestroy {
  protected layout = 'row';  // default flex-direction
  protected DIRECTIVE_KEY = 'layout-gap';
  protected observerSubject = new Subject<void>();

  /** Special accessor to query for all child 'element' nodes regardless of type, class, etc */
  protected get childrenNodes(): HTMLElement[] {
    const obj = this.nativeElement.children;
    const buffer: any[] = [];

    // iterate backwards ensuring that length is an UInt32
    for (let i = obj.length; i--;) {
      buffer[i] = obj[i];
    }
    return buffer;
  }

  constructor(protected elRef: ElementRef,
              protected zone: NgZone,
              protected directionality: Directionality,
              protected styleUtils: StyleUtils,
              // NOTE: not actually optional, but we need to force DI without a
              // constructor call
              @Optional() protected styleBuilder: LayoutGapStyleBuilder,
              protected marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    const extraTriggers = [this.directionality.change, this.observerSubject.asObservable()];
    this.init(extraTriggers);
    this.marshal
      .trackValue(this.nativeElement, 'layout')
      .pipe(takeUntil(this.destroySubject))
      .subscribe(this.onLayoutChange.bind(this));
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngAfterContentInit() {
    this.buildChildObservable();
    this.triggerUpdate();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Cache the parent container 'flex-direction' and update the 'margin' styles
   */
  protected onLayoutChange(matcher: ElementMatcher) {
    const layout: string = matcher.value;
    // Make sure to filter out 'wrap' option
    const direction = layout.split(' ');
    this.layout = direction[0];
    if (!LAYOUT_VALUES.find(x => x === this.layout)) {
      this.layout = 'row';
    }
    this.triggerUpdate();
  }

  /**
   *
   */
  protected updateWithValue(value: string) {
    if (!value) {
      value = this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY);
    }
    // Gather all non-hidden Element nodes
    const items = this.childrenNodes
      .filter(el => el.nodeType === 1 && this.getDisplayStyle(el) !== 'none')
      .sort((a, b) => {
        const orderA = +this.styler.lookupStyle(a, 'order');
        const orderB = +this.styler.lookupStyle(b, 'order');
        if (isNaN(orderA) || isNaN(orderB) || orderA === orderB) {
          return 0;
        } else {
          return orderA > orderB ? 1 : -1;
        }
      });

    if (items.length > 0) {
      const directionality = this.directionality.value;
      const layout = this.layout;
      if (layout === 'row' && directionality === 'rtl') {
        this.styleCache = layoutGapCacheRowRtl;
      } else if (layout === 'row' && directionality !== 'rtl') {
        this.styleCache = layoutGapCacheRowLtr;
      } else if (layout === 'column' && directionality === 'rtl') {
        this.styleCache = layoutGapCacheColumnRtl;
      } else if (layout === 'column' && directionality !== 'rtl') {
        this.styleCache = layoutGapCacheColumnLtr;
      }
      this.addStyles(value, {directionality, items, layout});
    }
  }

  /**
   * Quick accessor to the current HTMLElement's `display` style
   * Note: this allows us to preserve the original style
   * and optional restore it when the mediaQueries deactivate
   */
  protected getDisplayStyle(source: HTMLElement = this.nativeElement): string {
    const query = 'display';
    return this.styler.lookupStyle(source, query);
  }

  protected buildChildObservable(): void {
    this.zone.runOutsideAngular(() => {
      if (typeof MutationObserver !== 'undefined') {
        this.observer = new MutationObserver((mutations: MutationRecord[]) => {
          const validatedChanges = (it: MutationRecord): boolean => {
            return (it.addedNodes && it.addedNodes.length > 0) ||
              (it.removedNodes && it.removedNodes.length > 0);
          };

          // update gap styles only for child 'added' or 'removed' events
          if (mutations.some(validatedChanges)) {
            this.observerSubject.next();
          }
        });
        this.observer.observe(this.nativeElement, {childList: true});
      }
    });
  }

  protected observer?: MutationObserver;
}

@Directive({selector, inputs})
export class DefaultLayoutGapDirective extends LayoutGapDirective {
  protected inputs = inputs;
}

const layoutGapCacheRowRtl: Map<string, StyleDefinition> = new Map();
const layoutGapCacheColumnRtl: Map<string, StyleDefinition> = new Map();
const layoutGapCacheRowLtr: Map<string, StyleDefinition> = new Map();
const layoutGapCacheColumnLtr: Map<string, StyleDefinition> = new Map();

const GRID_SPECIFIER = ' grid';

function buildGridPadding(value: string, directionality: string): StyleDefinition {
  let paddingTop = '0px', paddingRight = '0px', paddingBottom = value, paddingLeft = '0px';

  if (directionality === 'rtl') {
    paddingLeft = value;
  } else {
    paddingRight = value;
  }

  return {'padding': `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`};
}

function buildGridMargin(value: string, directionality: string): StyleDefinition {
  let marginTop = '0px', marginRight = '0px', marginBottom = '-' + value, marginLeft = '0px';

  if (directionality === 'rtl') {
    marginLeft = '-' + value;
  } else {
    marginRight = '-' + value;
  }

  return {'margin': `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`};
}

function buildGapCSS(gapValue: string,
                     parent: {directionality: string, layout: string}): StyleDefinition {
  let key, margins: {[key: string]: string | null} = {...CLEAR_MARGIN_CSS};

  switch (parent.layout) {
    case 'column':
      key = 'margin-bottom';
      break;
    case 'column-reverse':
      key = 'margin-top';
      break;
    case 'row':
      key = parent.directionality === 'rtl' ? 'margin-left' : 'margin-right';
      break;
    case 'row-reverse':
      key = parent.directionality === 'rtl' ? 'margin-right' : 'margin-left';
      break;
    default :
      key = parent.directionality === 'rtl' ? 'margin-left' : 'margin-right';
      break;
  }
  margins[key] = gapValue;

  return margins;
}
