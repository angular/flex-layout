/// <reference path="../../../typings/browser.d.ts" />

import { BreakPointsService } from './break-points';

describe('BreakPointsService', () => {
  describe('#findBreakpointBy', () => {
    let service: BreakPointsService;
    beforeEach(() => service = new BreakPointsService());

    it('returns a known breakpoint', () => {
      let bp = service.findBreakpointBy('xs');
      expect(bp).toBeTruthy();
      expect(bp.mediaQuery).toEqual('screen and (max-width: 599px)');
    });

    it('returns null for an unknow breakpoint', () => {
      let bp = service.findBreakpointBy('unknown');
      expect(bp).toBeFalsy();
    });
  });
});
