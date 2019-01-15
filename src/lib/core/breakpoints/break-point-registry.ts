/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Injectable, Inject} from '@angular/core';

import {BreakPoint} from './break-point';
import {BREAKPOINTS} from './break-points-token';
import {sortAscendingPriority} from '../utils/sort';

export type OptionalBreakPoint = BreakPoint | null;

/**
 * Registry of 1..n MediaQuery breakpoint ranges
 * This is published as a provider and may be overridden from custom, application-specific ranges
 *
 */
@Injectable({providedIn: 'root'})
export class BreakPointRegistry {
  readonly items: BreakPoint[];

  constructor(@Inject(BREAKPOINTS) list: BreakPoint[]) {
    this.items = [...list].sort(sortAscendingPriority);
  }

  /**
   * Search breakpoints by alias (e.g. gt-xs)
   */
  findByAlias(alias: string): OptionalBreakPoint {
    return !alias ? null : this.findWithPredicate(alias, (bp) => bp.alias == alias);
  }

  findByQuery(query: string): OptionalBreakPoint {
    return this.findWithPredicate(query, (bp) => bp.mediaQuery == query);
  }

  /**
   * Get all the breakpoints whose ranges could overlapping `normal` ranges;
   * e.g. gt-sm overlaps md, lg, and xl
   */
  get overlappings(): BreakPoint[] {
    return this.items.filter(it => it.overlapping == true);
  }

  /**
   * Get list of all registered (non-empty) breakpoint aliases
   */
  get aliases(): string[] {
    return this.items.map(it => it.alias);
  }

  /**
   * Aliases are mapped to properties using suffixes
   * e.g.  'gt-sm' for property 'layout'  uses suffix 'GtSm'
   * for property layoutGtSM.
   */
  get suffixes(): string[] {
    return this.items.map(it => !!it.suffix ? it.suffix : '');
  }

  /**
   * Memoized lookup using custom predicate function
   */
  private findWithPredicate(key: string,
      searchFn: (bp: BreakPoint) => boolean): OptionalBreakPoint {
    let response = this.findByMap.get(key);
    if (!response) {
      response = this.items.find(searchFn) || null;
      this.findByMap.set(key, response);
    }
    return response || null;

  }

  /**
   * Memoized BreakPoint Lookups
   */
  private readonly findByMap = new Map<String, OptionalBreakPoint>();
}

