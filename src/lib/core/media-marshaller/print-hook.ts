/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Inject, Injectable, OnDestroy} from '@angular/core';

import {mergeAlias} from '../add-alias';
import {MediaChange} from '../media-change';
import {BreakPoint} from '../breakpoints/break-point';
import {LAYOUT_CONFIG, LayoutConfigOptions} from '../tokens/library-config';
import {BreakPointRegistry, OptionalBreakPoint} from '../breakpoints/break-point-registry';
import {sortDescendingPriority} from '../utils/sort';
import {DOCUMENT} from '@angular/common';

/**
 * Interface to apply PrintHook to call anonymous `target.updateStyles()`
 */
export interface HookTarget {
  activatedBreakpoints: BreakPoint[];
  updateStyles(): void;
}

const PRINT = 'print';
export const BREAKPOINT_PRINT = {
  alias: PRINT,
  mediaQuery: PRINT,
  priority: 1000
};

/**
 * PrintHook - Use to intercept print MediaQuery activations and force
 *             layouts to render with the specified print alias/breakpoint
 *
 * Used in MediaMarshaller and MediaObserver
 */
@Injectable({providedIn: 'root'})
export class PrintHook implements OnDestroy {
  constructor(
      protected breakpoints: BreakPointRegistry,
      @Inject(LAYOUT_CONFIG) protected layoutConfig: LayoutConfigOptions,
      @Inject(DOCUMENT) protected _document: any) {
  }

  /** Add 'print' mediaQuery: to listen for matchMedia activations */
  withPrintQuery(queries: string[]): string[] {
    return [...queries, PRINT];
  }

  /** Is the MediaChange event for any 'print' @media */
  isPrintEvent(e: MediaChange): Boolean {
    return e.mediaQuery.startsWith(PRINT);
  }

  /** What is the desired mqAlias to use while printing? */
  get printAlias(): string[] {
    return this.layoutConfig.printWithBreakpoints || [];
  }

  /** Lookup breakpoints associated with print aliases. */
  get printBreakPoints(): BreakPoint[] {
    return this.printAlias
        .map(alias => this.breakpoints.findByAlias(alias))
        .filter(bp => bp !== null) as BreakPoint[];
  }

  /** Lookup breakpoint associated with mediaQuery */
  getEventBreakpoints({mediaQuery}: MediaChange): BreakPoint[] {
    const bp = this.breakpoints.findByQuery(mediaQuery);
    const list = bp ? [...this.printBreakPoints, bp] : this.printBreakPoints;

    return list.sort(sortDescendingPriority);
  }

  /** Update event with printAlias mediaQuery information */
  updateEvent(event: MediaChange): MediaChange {
    let bp: OptionalBreakPoint = this.breakpoints.findByQuery(event.mediaQuery);
    if (this.isPrintEvent(event)) {
      // Reset from 'print' to first (highest priority) print breakpoint
      bp = this.getEventBreakpoints(event)[0];
      event.mediaQuery = bp ? bp.mediaQuery : '';
    }
    return mergeAlias(event, bp);
  }


  // registeredBeforeAfterPrintHooks tracks if we registered the `beforeprint`
  //  and `afterprint` event listeners.
  private registeredBeforeAfterPrintHooks: boolean = false;

  // isPrintingBeforeAfterEvent is used to track if we are printing from within
  // a `beforeprint` event handler. This prevents the typicall `stopPrinting`
  // form `interceptEvents` so that printing is not stopped while the dialog
  // is still open. This is an extension of the `isPrinting` property on
  // browsers which support `beforeprint` and `afterprint` events.
  private isPrintingBeforeAfterEvent: boolean = false;

  private beforePrintEventListeners: Function[] = [];
  private afterPrintEventListeners: Function[] = [];

  // registerBeforeAfterPrintHooks registers a `beforeprint` event hook so we can
  // trigger print styles synchronously and apply proper layout styles.
  // It is a noop if the hooks have already been registered or if the document's
  // `defaultView` is not available.
  private registerBeforeAfterPrintHooks(target: HookTarget) {
    // `defaultView` may be null when rendering on the server or in other contexts.
    if (!this._document.defaultView || this.registeredBeforeAfterPrintHooks) {
      return;
    }

    this.registeredBeforeAfterPrintHooks = true;

    const beforePrintListener = () => {
      // If we aren't already printing, start printing and update the styles as
      // if there was a regular print `MediaChange`(from matchMedia).
      if (!this.isPrinting) {
        this.isPrintingBeforeAfterEvent = true;
        this.startPrinting(target, this.getEventBreakpoints(new MediaChange(true, PRINT)));
        target.updateStyles();
      }
    };

    const afterPrintListener = () => {
      // If we aren't already printing, start printing and update the styles as
      // if there was a regular print `MediaChange`(from matchMedia).
      this.isPrintingBeforeAfterEvent = false;
      if (this.isPrinting) {
        this.stopPrinting(target);
        target.updateStyles();
      }
    };

    // Could we have teardown logic to remove if there are no print listeners being used?
    this._document.defaultView.addEventListener('beforeprint', beforePrintListener);
    this._document.defaultView.addEventListener('afterprint', afterPrintListener);

    this.beforePrintEventListeners.push(beforePrintListener);
    this.afterPrintEventListeners.push(afterPrintListener);
  }

  /**
   * Prepare RxJS filter operator with partial application
   * @return pipeable filter predicate
   */
  interceptEvents(target: HookTarget) {
    this.registerBeforeAfterPrintHooks(target);

    return (event: MediaChange) => {
      if (this.isPrintEvent(event)) {
        if (event.matches && !this.isPrinting) {
          this.startPrinting(target, this.getEventBreakpoints(event));
          target.updateStyles();

        } else if (!event.matches && this.isPrinting && !this.isPrintingBeforeAfterEvent) {
          this.stopPrinting(target);
          target.updateStyles();
        }
      } else {
        this.collectActivations(event);
      }
    };
  }

  /** Stop mediaChange event propagation in event streams */
  blockPropagation() {
    return (event: MediaChange): boolean => {
      return !(this.isPrinting || this.isPrintEvent(event));
    };
  }

  /**
   * Save current activateBreakpoints (for later restore)
   * and substitute only the printAlias breakpoint
   */
  protected startPrinting(target: HookTarget, bpList: OptionalBreakPoint[]) {
    this.isPrinting = true;
    target.activatedBreakpoints = this.queue.addPrintBreakpoints(bpList);
  }

  /** For any print de-activations, reset the entire print queue */
  protected stopPrinting(target: HookTarget) {
    target.activatedBreakpoints = this.deactivations;
    this.deactivations = [];
    this.queue.clear();
    this.isPrinting = false;
  }

  /**
   * To restore pre-Print Activations, we must capture the proper
   * list of breakpoint activations BEFORE print starts. OnBeforePrint()
   * is supported; so 'print' mediaQuery activations are used as a fallback
   * in browsers without `beforeprint` support.
   *
   * >  But activated breakpoints are deactivated BEFORE 'print' activation.
   *
   * Let's capture all de-activations using the following logic:
   *
   *  When not printing:
   *    - clear cache when activating non-print breakpoint
   *    - update cache (and sort) when deactivating
   *
   *  When printing:
   *    - sort and save when starting print
   *    - restore as activatedTargets and clear when stop printing
   */
  collectActivations(event: MediaChange) {
    if (!this.isPrinting || this.isPrintingBeforeAfterEvent) {
      if (!event.matches) {
        const bp = this.breakpoints.findByQuery(event.mediaQuery);
        if (bp) {   // Deactivating a breakpoint
          this.deactivations.push(bp);
          this.deactivations.sort(sortDescendingPriority);
        }
      } else if (!this.isPrintingBeforeAfterEvent) {
        // Only clear deactivations if we aren't printing from a `beforeprint` event.
        // Otherwise this will clear before `stopPrinting()` is called to restore
        // the pre-Print Activations.
        this.deactivations = [];
      }
    }
  }

  /** Teardown logic for the service. */
  ngOnDestroy() {
    this.beforePrintEventListeners.forEach(l => this._document.defaultView.removeEventListener('beforeprint', l));
    this.afterPrintEventListeners.forEach(l => this._document.defaultView.removeEventListener('afterprint', l));
  }

  /** Is this service currently in Print-mode ? */
  private isPrinting = false;
  private queue: PrintQueue = new PrintQueue();
  private deactivations: BreakPoint[] = [];

}

// ************************************************************************
// Internal Utility class 'PrintQueue'
// ************************************************************************

/**
 * Utility class to manage print breakpoints + activatedBreakpoints
 * with correct sorting WHILE printing
 */
class PrintQueue {
  /** Sorted queue with prioritized print breakpoints */
  printBreakpoints: BreakPoint[] = [];

  addPrintBreakpoints(bpList: OptionalBreakPoint[]): BreakPoint[] {
    bpList.push(BREAKPOINT_PRINT);
    bpList.sort(sortDescendingPriority);
    bpList.forEach(bp => this.addBreakpoint(bp));

    return this.printBreakpoints;
  }

  /** Add Print breakpoint to queue */
  addBreakpoint(bp: OptionalBreakPoint) {
    if (!!bp) {
      const bpInList = this.printBreakpoints.find(it => it.mediaQuery === bp.mediaQuery);
      if (bpInList === undefined) {
        // If this is a `printAlias` breakpoint, then append. If a true 'print' breakpoint,
        // register as highest priority in the queue
        this.printBreakpoints = isPrintBreakPoint(bp) ? [bp, ...this.printBreakpoints]
            : [...this.printBreakpoints, bp];
      }
    }
  }

  /** Restore original activated breakpoints and clear internal caches */
  clear() {
    this.printBreakpoints = [];
  }
}

// ************************************************************************
// Internal Utility methods
// ************************************************************************

/** Only support intercept queueing if the Breakpoint is a print @media query */
function isPrintBreakPoint(bp: OptionalBreakPoint) {
  return bp ? bp.mediaQuery.startsWith(PRINT) : false;
}
