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
      const lastItem = items.pop()!;

      // For each `element` children EXCEPT the last,
      // set the margin right/bottom styles...
      const gapCss = buildGapCSS(gapValue, parent);
      this._styler.applyStyleToElements(gapCss, items);

      // Clear all gaps for all visible elements
      this._styler.applyStyleToElements(CLEAR_MARGIN_CSS, [lastItem]);
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
@Directive()
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

  constructor(elRef: ElementRef,
              protected zone: NgZone,
              protected directionality: Directionality,
              protected styleUtils: StyleUtils,
              styleBuilder: LayoutGapStyleBuilder,
              marshal: MediaMarshaller) {
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
    // Gather all non-hidden Element nodes
    const items = this.childrenNodes
      .filter(el => el.nodeType === 1 && this.willDisplay(el))
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

  /** We need to override clearStyles because in most cases mru isn't populated */
  protected clearStyles() {
    const gridMode = Object.keys(this.mru).length > 0;
    const childrenStyle = gridMode ? 'padding' :
      getMarginType(this.directionality.value, this.layout);

    // If there are styles on the parent remove them
    if (gridMode) {
      super.clearStyles();
    }

    // Then remove the children styles too
    this.styleUtils.applyStyleToElements({[childrenStyle]: ''}, this.childrenNodes);
  }

  /** Determine if an element will show or hide based on current activation */
  protected willDisplay(source: HTMLElement): boolean {
    const value = this.marshal.getValue(source, 'show-hide');
    return value === true ||
      (value === undefined && this.styleUtils.lookupStyle(source, 'display') !== 'none');
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
  const [between, below] = value.split(' ');
  const bottom = below || between;
  let paddingRight = '0px', paddingBottom = bottom, paddingLeft = '0px';

  if (directionality === 'rtl') {
    paddingLeft = between;
  } else {
    paddingRight = between;
  }

  return {'padding': `0px ${paddingRight} ${paddingBottom} ${paddingLeft}`};
}

function buildGridMargin(value: string, directionality: string): StyleDefinition {
  const [between, below] = value.split(' ');
  const bottom = below || between;
  const minus = (str: string) => `-${str}`;
  let marginRight = '0px', marginBottom = minus(bottom), marginLeft = '0px';

  if (directionality === 'rtl') {
    marginLeft = minus(between);
  } else {
    marginRight = minus(between);
  }

  return {'margin': `0px ${marginRight} ${marginBottom} ${marginLeft}`};
}

function getMarginType(directionality: string, layout: string) {
  switch (layout) {
    case 'column':
      return 'margin-bottom';
    case 'column-reverse':
      return 'margin-top';
    case 'row':
      return directionality === 'rtl' ? 'margin-left' : 'margin-right';
    case 'row-reverse':
      return directionality === 'rtl' ? 'margin-right' : 'margin-left';
    default :
      return directionality === 'rtl' ? 'margin-left' : 'margin-right';
  }
}

function buildGapCSS(gapValue: string,
                     parent: {directionality: string, layout: string}): StyleDefinition {
  const key = getMarginType(parent.directionality, parent.layout);
  const margins: {[key: string]: string | null} = {...CLEAR_MARGIN_CSS};
  margins[key] = gapValue;
  return margins;
}
