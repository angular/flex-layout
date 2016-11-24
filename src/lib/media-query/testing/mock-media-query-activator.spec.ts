import {BreakPoint, BreakPoints} from '../break-points';
import {MockMediaQueryActivator, MockMediaQueryList} from "./mock-media-query-activator";

describe('mock-media-query-activator', () => {
  let breakPoints : BreakPoints;
  let mediaQueries : MockMediaQueryActivator;

  beforeEach(()=> {
    breakPoints = new BreakPoints();
    mediaQueries = new MockMediaQueryActivator().init(breakPoints);
  });
  afterEach(() => { mediaQueries.destroy(); });


  describe("matchMedia(<query>)",()=>{
    it('can match with known mediaQueries', () =>{
      breakPoints.registry.forEach(bp => {
        expect( mediaQueries.matchMedia(bp.mediaQuery)).not.toBeNull();
      });
    });

    it('can match with an unknown mediaQuery', () =>{
      let mediaQuery = 'screen and (min-width: 500px)';
      expect( mediaQueries.matchMedia(mediaQuery)).toBeTruthy();
    });

  });

  describe("activate(<query>)",()=>{

    it('cannot activate with an unknown mediaQuery', () =>{
      let query = 'screen and (min-width: 500px)';

      expect( ()=> mediaQueries.activate(query) ).toThrow();
    });

    it('can activate with a mediaQuery', () =>{
      let countGtSm = 0,
          bpGtSm = breakPoints.findByAlias("sm"),
          mqlGtSm = mediaQueries.matchMedia(bpGtSm.mediaQuery);
      let countMd = 0,
          bpMd   = breakPoints.findByAlias("md"),
          mqlMd = mediaQueries.matchMedia(bpMd.mediaQuery);

      // Listeners are notified for BOTH activate (match === true) and deactivate
      mqlGtSm.addListener((src:MockMediaQueryList) => { if(src.matches) ++countGtSm; });
      mqlMd.addListener((src:MockMediaQueryList) => { if(src.matches) ++countMd; });

      mediaQueries.activate(bpGtSm.mediaQuery);

        expect( countGtSm ).toBe( 1 );
        expect( mqlGtSm.matches ).toBeTruthy();

        expect( countMd ).toBe( 0 );
        expect( mqlMd.matches ).toBeFalsy();

      mediaQueries.activate(bpMd.mediaQuery);

        expect( countGtSm ).toBe( 1 );
        expect( mqlGtSm.matches ).toBeFalsy();

        expect( countMd ).toBe( 1 );
        expect( mqlMd.matches ).toBeTruthy();

    });

  });


});
