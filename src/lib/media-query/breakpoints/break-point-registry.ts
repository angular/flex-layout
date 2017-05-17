/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Injectable, Inject} from '@angular/core';

import {BreakPoint} from './break-point';
import {BREAKPOINTS} from "./break-points-token";
import {MatchMedia} from '../match-media';


/**
 * Registry of 1..n MediaQuery breakpoint ranges
 * This is published as a provider and may be overriden from custom, application-specific ranges
 *
 */
@Injectable()
export class BreakPointRegistry {

  constructor(private matchMedia: MatchMedia,
              @Inject(BREAKPOINTS) private registry: BreakPoint[ ]) {
    this._registerBreakPoints();
  }

  get activeOverlaps(): BreakPoint[] {
    let items: BreakPoint[] = this.registry.reverse();
    return items.filter((bp: BreakPoint) => {
      return this.isActive(bp.mediaQuery);
    });
  }

  /**
   * Return the least specific (largest mediaQuery range) active breakpoint
   * (since 1...n may be active)
   */
  get active(): BreakPoint {
    let found = null, items = this.registry.reverse();
    items.forEach(bp => {
      if (bp.alias !== '') {
        if (!found && this.matchMedia.isActive(bp.mediaQuery)) {
          found = bp;
        }
      }
    });

    let first = this.registry[0];
    return found || (this.matchMedia.isActive(first.mediaQuery) ? first : null);
  }

  /**
   * Test if specified query/alias is active.
   */
  isActive(alias): boolean {
    let query = this._toMediaQuery(alias);
    return this.matchMedia.isActive(query);
  };


  /**
   * Accessor to raw list
   */
  get items(): BreakPoint[ ] {
    return [...this.registry];
  }

  /**
   * Search breakpoints by alias (e.g. gt-xs)
   */
  findByAlias(alias: string): BreakPoint {
    return this.registry.find(bp => bp.alias == alias);
  }

  /**
   * Breakpoint locator by mediaQuery
   */
  findByQuery(query: string): BreakPoint {
    return this.registry.find(bp => bp.mediaQuery == query);
  }

  /**
   * Get all the breakpoints whose ranges could overlapping `normal` ranges;
   * e.g. gt-sm overlaps md, lg, and xl
   */
  get overlappings(): BreakPoint[] {
    return this.registry.filter(it => it.overlapping == true);
  }

  /**
   * Get list of all registered (non-empty) breakpoint aliases
   */
  get aliases(): string[] {
    return this.registry.map(it => it.alias);
  }

  /**
   * Aliases are mapped to properties using suffixes
   * e.g.  'gt-sm' for property 'layout'  uses suffix 'GtSm'
   * for property layoutGtSM.
   */
  get suffixes(): string[] {
    return this.registry.map(it => it.suffix);
  }

  /**
   * Register all the mediaQueries registered in the BreakPointRegistry
   * This is needed so subscribers can be auto-notified of all standard, registered
   * mediaQuery activations
   */
  private _registerBreakPoints() {
    this.registry.forEach((bp: BreakPoint) => {
      this.matchMedia.registerQuery(bp.mediaQuery);
    });
  }

  /**
   * Find associated breakpoint (if any)
   */
  private _toMediaQuery(query) {
    let bp: BreakPoint = this.findByAlias(query) || this.findByQuery(query);
    return bp ? bp.mediaQuery : query;
  };
}
