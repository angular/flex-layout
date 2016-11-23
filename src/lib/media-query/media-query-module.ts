import {NgModule, ModuleWithProviders} from '@angular/core';

import {BreakPoints} from './break-points';
import {MediaQueries, MediaQueryChange} from './media-queries';
import {Observable} from "rxjs";

/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */

/**
 *  Provider to return observable to ALL MediaQuery events
 */
export const MediaQueryObservableProvider = {
  provide: 'mediaQuery$',
  deps: [ MediaQueries ],
  useFactory:(mq:MediaQueries) => mq.observe()
};

@NgModule({
  providers: [BreakPoints, MediaQueries]
})
export class MediaQueriesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MediaQueriesModule,
      providers: [
        MediaQueryObservableProvider
      ]
    };
  }
}
