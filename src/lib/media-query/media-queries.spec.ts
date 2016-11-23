import { BreakPoint, BreakPoints } from './break-points';
import { MediaQueryList } from './media-query-factory';
import {MockMediaQueries} from "./testing/mock-media-queries";
import {inject} from "@angular/core/testing";

describe('media-queries', () => {
  let mediaQueries : MockMediaQueries;

  // beforeEach(inject([BreakPoints], (breakpoints:BreakPoints)=> {
  //   mediaQueries = new MockMediaQueries(breakpoints);
  // }));
  // afterEach(() => { mediaQueries.destroy(); });
  //
  //
  // it('can create listeners for all mediaQueries', () =>{
  //   let breakPoints : BreakPoints = new BreakPoints();
  //   let noMatchCount = 0;
  //
  //   breakPoints.registry.forEach( (bp:BreakPoint) =>{
  //     let mql : MediaQueryList = mediaQueries.activate(bp.mediaQuery);
  //     if (bp.alias == "") expect(mql.matches).toBeTruthy();
  //
  //     if ( mql.matches !== true ) ++noMatchCount;
  //   });
  //
  //   expect( noMatchCount ).toBeGreaterThan( 0 );
  // });

});

