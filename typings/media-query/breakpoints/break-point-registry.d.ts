import { BreakPoint } from './break-point';
export declare class BreakPointRegistry {
    private _registry;
    constructor(_registry: BreakPoint[]);
    readonly items: BreakPoint[];
    readonly sortedItems: BreakPoint[];
    findByAlias(alias: string): BreakPoint;
    findByQuery(query: string): BreakPoint;
    readonly overlappings: BreakPoint[];
    readonly aliases: string[];
    readonly suffixes: string[];
}
