// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {ModuleWithProviders, NgModule} from '@angular/core';

import {MediaQueriesModule} from '../media-query/media-query-module';

import {FlexAlignDirective, FlexDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective} from './api/flex';
import {LayoutAlignDirective, LayoutDirective, LayoutWrapDirective} from './api/layout';
import {HideDirective, ShowDirective} from './api/show-hide';
import {MediaQueryAdapter} from './media-query/media-query-adapter';

const ALL_DIRECTIVES = [
  LayoutDirective, LayoutWrapDirective, LayoutAlignDirective, FlexDirective, FlexOrderDirective,
  FlexOffsetDirective, FlexFillDirective, FlexAlignDirective, ShowDirective, HideDirective
];

/**
 *
 */
@NgModule({
  declarations: ALL_DIRECTIVES,
  imports: [MediaQueriesModule],
  exports: [MediaQueriesModule, ...ALL_DIRECTIVES],
  providers: []
})
export class FlexLayoutModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: FlexLayoutModule, providers: [MediaQueryAdapter]};
  }
}
