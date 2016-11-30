import {BreakPoints} from '../break-points';
import {MockMediaQueryActivator, MockMediaQueryList} from "./mock-media-query-activator";

describe('mock-media-query-activator', () => {
  let breakPoints : BreakPoints;
  let mockMQA : MockMediaQueryActivator;

  beforeEach(()=> {
    breakPoints = new BreakPoints();
    mockMQA = new MockMediaQueryActivator();
  });
  afterEach(() => { mockMQA.destroy(); });


  describe("matchMedia(<query>)",()=>{
    it('can match with known mediaQueries', () =>{
      breakPoints.registry.forEach(bp => {
        expect( mockMQA.matchMedia(bp.mediaQuery)).not.toBeNull();
      });
    });

    it('can match with an unknown mediaQuery', () =>{
      let mediaQuery = 'screen and (min-width: 500px)';
      expect( mockMQA.matchMedia(mediaQuery)).toBeTruthy();
    });

  });

  describe("activate(<query>)",()=>{

    it('cannot activate with an unknown mediaQuery', () =>{
      let query = 'screen and (min-width: 500px)';

      expect( ()=> mockMQA.activate(query) ).toThrow();
    });

    it('can activate with a mediaQuery', () =>{
      let countGtSm = 0,
          bpGtSm = breakPoints.findByAlias("sm"),
          mqlGtSm = mockMQA.matchMedia(bpGtSm.mediaQuery);
      let countMd = 0,
          bpMd   = breakPoints.findByAlias("md"),
          mqlMd = mockMQA.matchMedia(bpMd.mediaQuery);

      // Listeners are notified for BOTH activate (match === true) and deactivate
      mqlGtSm.addListener((src:MockMediaQueryList) => { if(src.matches) ++countGtSm; });
      mqlMd.addListener((src:MockMediaQueryList) => { if(src.matches) ++countMd; });

      mockMQA.activate(bpGtSm.mediaQuery);

        expect( countGtSm ).toBe( 1 );
        expect( mqlGtSm.matches ).toBeTruthy();

        expect( countMd ).toBe( 0 );
        expect( mqlMd.matches ).toBeFalsy();

      mockMQA.activate(bpMd.mediaQuery);

        expect( countGtSm ).toBe( 1 );
        expect( mqlGtSm.matches ).toBeFalsy();

        expect( countMd ).toBe( 1 );
        expect( mqlMd.matches ).toBeTruthy();

    });

  });


});
