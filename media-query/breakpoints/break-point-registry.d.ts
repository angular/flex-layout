import { BreakPoint } from './break-point';
/**
 * Registry of 1..n MediaQuery breakpoint ranges
 * This is published as a provider and may be overriden from custom, application-specific ranges
 *
 */
export declare class BreakPointRegistry {
    private _registry;
    constructor(_registry: BreakPoint[]);
    /**
     * Accessor to raw list
     */
    readonly items: BreakPoint[];
    /**
     * Accessor to sorted list used for registration with matchMedia API
     *
     * NOTE: During breakpoint registration, we want to register the overlaps FIRST
     *       so the non-overlaps will trigger the MatchMedia:BehaviorSubject last!
     *       And the largest, non-overlap, matching breakpoint should be the lastReplay value
     */
    readonly sortedItems: BreakPoint[];
    /**
     * Search breakpoints by alias (e.g. gt-xs)
     */
    findByAlias(alias: string): BreakPoint;
    findByQuery(query: string): BreakPoint;
    /**
     * Get all the breakpoints whose ranges could overlapping `normal` ranges;
     * e.g. gt-sm overlaps md, lg, and xl
     */
    readonly overlappings: BreakPoint[];
    /**
     * Get list of all registered (non-empty) breakpoint aliases
     */
    readonly aliases: string[];
    /**
     * Aliases are mapped to properties using suffixes
     * e.g.  'gt-sm' for property 'layout'  uses suffix 'GtSm'
     * for property layoutGtSM.
     */
    readonly suffixes: string[];
}
