import { BreakPoint, BreakPoints } from './break-points';

describe('break-points', () => {
  let breakPoints : BreakPoints;
  beforeEach(() => { breakPoints = new BreakPoints(); });

  it('registry has all aliases defined', () =>{
    expect(breakPoints.registry.length).toBeGreaterThan(0);

    expect(breakPoints.findBreakpointBy('')).toBeDefined();
    expect(breakPoints.findBreakpointBy('xs')).toBeDefined();
    expect(breakPoints.findBreakpointBy('gt-xs')).toBeDefined();
    expect(breakPoints.findBreakpointBy('sm')).toBeDefined();
    expect(breakPoints.findBreakpointBy('gt-sm')).toBeDefined();
    expect(breakPoints.findBreakpointBy('md')).toBeDefined();
    expect(breakPoints.findBreakpointBy('gt-md')).toBeDefined();
    expect(breakPoints.findBreakpointBy('lg')).toBeDefined();
    expect(breakPoints.findBreakpointBy('gt-lg')).toBeDefined();
    expect(breakPoints.findBreakpointBy('xl')).toBeDefined();

    expect(breakPoints.overlappings.length).toBe(5);
  });

});
