import {NgModule} from '@angular/core';

import {BreakPoints} from './break-points';
import {MediaQueries} from './media-queries';

const ALL_COMPONENTS = [BreakPoints, MediaQueries];

/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */


@NgModule({providers: [BreakPoints, MediaQueries]})
export class MediaQueriesModule {
  static forRoot() {
    return {
      ngModule: MediaQueriesModule,
      providers: [
        BreakPoints,  // Default Breakpoints for application
        MediaQueries
      ]
    };
  }
}
