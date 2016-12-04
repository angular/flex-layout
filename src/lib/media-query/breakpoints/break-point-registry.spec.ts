import {BreakPointRegistry } from './break-point-registry';
import {RAW_DEFAULTS} from "../providers/break-points-provider";

describe('break-points', () => {
  let breakPoints : BreakPointRegistry;
  beforeEach(() => { breakPoints = new BreakPointRegistry(RAW_DEFAULTS); });

  it('registry has all aliases defined', () =>{
    expect(breakPoints.items.length).toBeGreaterThan(0);

    expect(breakPoints.findByAlias('xs')).toBeDefined();
    expect(breakPoints.findByAlias('gt-xs')).toBeDefined();   // Overlapping
    expect(breakPoints.findByAlias('sm')).toBeDefined();
    expect(breakPoints.findByAlias('gt-sm')).toBeDefined();   // Overlapping
    expect(breakPoints.findByAlias('md')).toBeDefined();
    expect(breakPoints.findByAlias('gt-md')).toBeDefined();   // Overlapping
    expect(breakPoints.findByAlias('lg')).toBeDefined();
    expect(breakPoints.findByAlias('gt-lg')).toBeDefined();   // Overlapping
    expect(breakPoints.findByAlias('xl')).toBeDefined();

    expect(breakPoints.overlappings.length).toBe(4);
  });

});
