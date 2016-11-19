import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {MediaQueriesModule} from '../media-query/media-query-module';
import {FlexDirective} from './api/flex';
import {LayoutDirective} from './api/layout';
import {HideDirective} from './api/hide';
import {ShowDirective} from './api/show';
import {MediaQueryAdapter} from './media-query/media-query-adapter';
import {FlexAlignDirective} from './api/flex-align';
import {FlexFillDirective} from './api/flex-fill';
import {FlexOffsetDirective} from './api/flex-offset';
import {FlexOrderDirective} from './api/flex-order';
import {LayoutAlignDirective} from './api/layout-align';
import {LayoutWrapDirective} from './api/layout-wrap';


const ALL_DIRECTIVES = [
  LayoutDirective,
  LayoutWrapDirective,
  LayoutAlignDirective,
  FlexDirective,
  FlexOrderDirective,
  FlexOffsetDirective,
  FlexFillDirective,
  FlexAlignDirective,
  ShowDirective,
  HideDirective,
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
