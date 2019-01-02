/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Inject, Injectable} from '@angular/core';

import {mergeAlias} from '../add-alias';
import {MediaChange} from '../media-change';
import {BreakPoint} from '../breakpoints/break-point';
import {LAYOUT_CONFIG, LayoutConfigOptions} from '../tokens/library-config';
import {BreakPointRegistry, OptionalBreakPoint} from '../breakpoints/break-point-registry';
import {sortDescendingPriority} from '../breakpoints/breakpoint-tools';

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
export class PrintHook {
  constructor(
      protected breakpoints: BreakPointRegistry,
      @Inject(LAYOUT_CONFIG) protected layoutConfig: LayoutConfigOptions) {
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

  /**
   * Prepare RxJs filter operator with partial application
   * @return pipeable filter predicate
   */
  interceptEvents(target: HookTarget) {
    return (event: MediaChange) => {
      if (this.isPrintEvent(event)) {
        if (event.matches && !this.isPrinting) {
          this.startPrinting(target, this.getEventBreakpoints(event));
          target.updateStyles();

        } else if (!event.matches && this.isPrinting) {
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
   * is not supported; so 'print' mediaQuery activations must be used.
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
    if (!this.isPrinting) {
      if (!event.matches) {
        const bp = this.breakpoints.findByQuery(event.mediaQuery);
        if (bp) {   // Deactivating a breakpoint
          this.deactivations.push(bp);
          this.deactivations.sort(sortDescendingPriority);
        }
      } else {
        this.deactivations = [];
      }
    }
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
