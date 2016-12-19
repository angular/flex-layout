// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import { TestBed, inject, async } from '@angular/core/testing';

import {RAW_DEFAULTS} from './providers/break-points-provider';
import {MediaChange} from './media-change';
import {MockMatchMedia} from './mock/mock-match-media';
import {BreakPointRegistry} from './breakpoints/break-point-registry';
import {BreakPointsProvider} from './providers/break-points-provider';
import {MatchMedia} from './match-media';
import {MediaMonitor} from './media-monitor';

describe('media-monitor', () => {
  let monitor : MediaMonitor;
  let matchMedia : MockMatchMedia;
  let breakPoints : BreakPointRegistry;
  let findQuery = (alias) => breakPoints.findByAlias(alias).mediaQuery;

  beforeEach(()=> {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [
        MediaMonitor,
        BreakPointRegistry,           // Registry of known/used BreakPoint(s)
        BreakPointsProvider,          // Supports developer overrides of list of known breakpoints
        { provide: MatchMedia, useClass:MockMatchMedia }
      ]
    });
  });

  // Single async inject to save references; which are used in all tests below
  beforeEach( async(inject(
    [ MediaMonitor, MatchMedia, BreakPointRegistry ],
    (_mediaMonitor_, _matchMedia_, _breakPoints_) => {
      monitor = _mediaMonitor_;
      matchMedia = _matchMedia_;      // Only used to manual/simulate activate a mediaQuery
      breakPoints = _breakPoints_;    // Only used to look up mediaQuery by aliases
    }
  )));

  it('has default breakpoints already registered', () => {
    expect( monitor.breakpoints.length ).toEqual(RAW_DEFAULTS.length);
    expect( monitor.active ).toBeNull();
  });

  it('can test is a mediaQuery is active', () => {
    let queryXs = findQuery('xs'), queryGtMd = findQuery('gt-md');

    expect( monitor.isActive( queryXs )).toBeFalsy();

    expect( matchMedia.activate( queryGtMd ) ).toBeTruthy();
    expect( monitor.isActive( queryXs )).toBeFalsy();
    expect( monitor.isActive( queryGtMd )).toBeTruthy();

    expect( matchMedia.activate( queryXs ) ).toBeTruthy();
    expect( monitor.isActive( queryGtMd )).toBeFalsy();
    expect( monitor.isActive( queryXs )).toBeTruthy();
  });

  it('can observe specific mediaQuery activations', () => {
    let current : MediaChange;
    let queryXs = findQuery('xs'), queryGtMd = findQuery('gt-md');
    let subscription = monitor.observe( queryGtMd )
                              .subscribe( (change:MediaChange) => {
                                current = change;
                              });
    try {
      expect( current ).toBeUndefined();

      matchMedia.activate( queryGtMd );
      expect( current.mediaQuery ).toBe( queryGtMd );
      expect( current.matches ).toBeTruthy();

      matchMedia.activate( queryXs );
      expect( current.mediaQuery ).toBe( queryGtMd );
      expect( current.matches ).toBeFalsy();
    } finally {
      subscription.unsubscribe();
    }
  });

  it('can observe all de-activations', () => {
      let deactivationCount = 0,
        queryXs = findQuery('xs'), queryGtMd = findQuery('gt-md'),
        subscription = monitor.observe( queryGtMd )
                              .subscribe( (change:MediaChange) => {
                                if ( change && !change.matches) {
                                  ++deactivationCount;
                                }
                              });
      try {
        expect( deactivationCount ).toEqual(0);

        matchMedia.activate( queryGtMd );
        expect( deactivationCount ).toEqual(0);

        matchMedia.activate( queryXs );
        expect( deactivationCount ).toEqual(1);

        // Next, we do not expect deactivation for queryXs
        matchMedia.activate( queryGtMd );
        expect( deactivationCount ).toEqual(1);
      } finally {
        subscription.unsubscribe();
      }
    });

  it('can observe all known BreakPoint activations', () => {
    let current : MediaChange,
        queryXs = findQuery('xs'), queryGtMd = findQuery('gt-md'),
        subscription = monitor.observe( )
                              .subscribe( (change:MediaChange) => {
                                current = change;
                              });
      try {
        expect( current.mediaQuery ).toEqual("all");

        matchMedia.activate( queryGtMd );
        expect( current.mediaQuery ).toBe( queryGtMd );
        expect( current.matches ).toBeTruthy();

        matchMedia.activate( queryXs );
        expect( current.mediaQuery ).toBe( queryXs );
        expect( current.matches ).toBeTruthy();
      } finally {
        subscription.unsubscribe();
      }
  });

  it('can observe all de-activations', () => {
    let deactivationCount = 0,
      queryXs = findQuery('xs'), queryGtMd = findQuery('gt-md'),
      subscription = monitor.observe( )
                            .subscribe( (change:MediaChange) => {
                              if ( change && !change.matches) {
                                ++deactivationCount;
                              }
                            });
    try {
      expect( deactivationCount ).toEqual(0);

      // Now the mediaQuery 'all' will always stay matched.
      matchMedia.activate( queryGtMd );
      expect( deactivationCount ).toEqual(0);

      matchMedia.activate( queryXs );
      expect( deactivationCount ).toEqual(1);

      matchMedia.activate( queryGtMd );
      expect( deactivationCount ).toEqual(2);
    } finally {
      subscription.unsubscribe();
    }
  });

});
