import {NgModule, ModuleWithProviders} from '@angular/core';

import {BreakPoints} from './break-points';
import {MediaQueries} from './media-queries';

/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */
export const MediaQueryObservableProvider = {
        provide: 'mediaQuery$',
        deps: [ MediaQueries ],
        useFactory:(mq:MediaQueries) =>{
          debugger;
          // Return observable to MediaQuery events
          return mq.observe();
        }
      };

@NgModule({providers: [BreakPoints, MediaQueries]})
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
