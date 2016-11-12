import { MediaQueryList, MediaQueryListFactory} from './media-query-factory';
import { BreakPoint, BreakPoints } from './break-points';

describe('media-query-factory', () => {
  it('can create listeners for all mediaQueries', () =>{
    let breakPoints : BreakPoints = new BreakPoints();
    let noMatchCount = 0;

    breakPoints.registry.forEach( (bp:BreakPoint) =>{
      let mql : MediaQueryList = MediaQueryListFactory.instanceOf(bp.mediaQuery);
      if (bp.alias == "") expect(mql.matches).toBeTruthy();

      if ( mql.matches !== true ) ++noMatchCount;
    });

    expect( noMatchCount ).toBeGreaterThan( 0 );
  });

});
