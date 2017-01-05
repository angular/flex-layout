import {Injectable, Inject} from '@angular/core';

import {BreakPoint} from './break-point';
import {BREAKPOINTS} from "../providers/break-points-provider";

/**
 * @internal
 *
 * Registry of 1..n MediaQuery breakpoint ranges
 * This is published as a provider and may be overriden from custom, application-specific ranges
 *
 */
@Injectable()
export class BreakPointRegistry {

  constructor(@Inject(BREAKPOINTS) private _registry: BreakPoint[ ]) {
  }

  /**
   * Accessor to raw list
   */
  get items(): BreakPoint[ ] {
    return [...this._registry];
  }

  /**
   * Search breakpoints by alias (e.g. gt-xs)
   */
  findByAlias(alias: string): BreakPoint {
    return this._registry.find(bp => bp.alias == alias);
  }

  findByQuery(query: string): BreakPoint {
    return this._registry.find(bp => bp.mediaQuery == query);
  }

  /**
   * Get all the breakpoints whose ranges could overlapping `normal` ranges;
   * e.g. gt-sm overlaps md, lg, and xl
   */
  get overlappings(): BreakPoint[] {
    return this._registry.filter(it => it.overlapping == true);
  }

  /**
   * Get list of all registered (non-empty) breakpoint aliases
   */
  get aliases(): string[] {
    return this._registry.map(it => it.alias);
  }

  /**
   * Aliases are mapped to properties using suffixes
   * e.g.  'gt-sm' for property 'layout'  uses suffix 'GtSm'
   * for property layoutGtSM.
   */
  get suffixes(): string[] {
    return this._registry.map(it => it.suffix);
  }
}
