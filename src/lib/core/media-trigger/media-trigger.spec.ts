/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {TestBed, inject, fakeAsync, tick} from '@angular/core/testing';

import {MediaTrigger} from './media-trigger';
import {MediaChange} from '../media-change';
import {MatchMedia} from '../match-media/match-media';
import {MockMatchMedia, MockMatchMediaProvider} from '../match-media/mock/mock-match-media';
import {MediaObserver} from '../media-observer/media-observer';

describe('media-trigger', () => {
  let mediaObserver: MediaObserver;
  let mediaTrigger: MediaTrigger;
  let matchMedia: MockMatchMedia;

  const activateQuery = (aliases: string[]) => {
    mediaTrigger.activate(aliases);
    tick(100);  // Since MediaObserver has 50ms debounceTime
  };

  describe('', () => {
    beforeEach(() => {
      // Configure testbed to prepare services
      TestBed.configureTestingModule({
        providers: [
          MockMatchMediaProvider,
          MediaTrigger
        ]
      });
    });

    beforeEach(inject([MediaObserver, MediaTrigger, MatchMedia],
        (_mediaObserver: MediaObserver, _mediaTrigger: MediaTrigger, _matchMedia: MockMatchMedia) => { // tslint:disable-line:max-line-length
          mediaObserver = _mediaObserver;
          mediaTrigger = _mediaTrigger;
          matchMedia = _matchMedia;

          _matchMedia.useOverlaps = true;
        }));

    it('can trigger activations with list of breakpoint aliases', fakeAsync(() => {
      let activations: MediaChange[] = [];
      let subscription = mediaObserver.asObservable().subscribe(
          (changes: MediaChange[]) => {
            activations = [...changes];
          });

      // assign default activation(s) with overlaps allowed
      matchMedia.activate('xl');
      const originalActivations = matchMedia.activations.length;

      // Activate mediaQuery associated with 'md' alias
      activateQuery(['sm']);
      expect(activations.length).toEqual(1);
      expect(activations[0].mqAlias).toEqual('sm');

      // Activations are sorted by descending priority
      activateQuery(['lt-lg', 'md']);
      expect(activations.length).toEqual(2);
      expect(activations[0].mqAlias).toEqual('md');
      expect(activations[1].mqAlias).toEqual('lt-lg');

      // Clean manual activation overrides
      mediaTrigger.restore();
      tick(100);
      expect(activations.length).toEqual(originalActivations);

      subscription.unsubscribe();
    }));
  });
});
