// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import { TestBed, inject, async } from '@angular/core/testing';

import {BreakPointRegistry} from '../breakpoints/break-point-registry';
import {MediaChange} from '../media-change';
import {MockMatchMedia} from '../mock/mock-match-media';
import {MatchMediaObservable, MatchMedia} from '../match-media';
import {MatchMediaObservableProvider} from './match-media-observable-provider';
import {BreakPointsProvider, RAW_DEFAULTS} from './break-points-provider';

describe('match-media-observable-provider', () => {
   let findMediaQuery = (alias) => {
      let mediaQuery;
      RAW_DEFAULTS.forEach(bp => {
        if (bp.alias === alias ) {
          mediaQuery = bp.mediaQuery
        }
      });
      return mediaQuery;
   };
   beforeEach(()=> {
     // Configure testbed to prepare services
     TestBed.configureTestingModule({
       providers: [
         BreakPointRegistry,   // Registry of known/used BreakPoint(s)
         BreakPointsProvider,  // Supports developer overrides of list of known breakpoints
         {provide:MatchMedia, useClass:MockMatchMedia},
         MatchMediaObservableProvider
       ]
     });
   });

   it('can inject a MatchMediaObservable instance', async(inject(
     [MatchMediaObservable, MatchMedia],
     (media$, matchMedia) => {
       let current : MediaChange;

       expect( media$ ).toBeDefined();

       let subscription = media$.subscribe((change:MediaChange)=>{
         current = change;
       });

       // Confirm initial match is for 'all'
       expect(current).toBeDefined();
       expect(current.matches).toBeTruthy();
       expect(current.mediaQuery).toEqual("all");

       // Activate mediaQuery associated with 'md' alias
       matchMedia.activate('md');
       expect(current.mediaQuery).toEqual(findMediaQuery('md'));

       subscription.unsubscribe();
   })));
});

