import {NgModule, ModuleWithProviders} from '@angular/core';

import { ShowDirective, HideDirective } from "./api/show-hide";
import { LayoutDirective, LayoutWrapDirective, LayoutAlignDirective } from "./api/layout";
import { FlexDirective, FlexOrderDirective, FlexOffsetDirective, FlexFillDirective, FlexAlignDirective } from "./api/flex";

import { MediaQueryAdapter }  from "./media-query/media-query-adapter";
import { MediaQueriesModule } from '../media-query/media-query-module';

// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

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
  HideDirective
];

const ALL_MODULES = [
  MediaQueriesModule
];

@NgModule({
  declarations  : ALL_DIRECTIVES,
  imports       : [ MediaQueriesModule],
  exports       : [ MediaQueriesModule, ...ALL_DIRECTIVES ],
  providers     : [ MediaQueryAdapter ]
})
export class LayoutsModule {
  static forRoot(): ModuleWithProviders {
      return {
        ngModule  : LayoutsModule,
        providers : [ MediaQueryAdapter ]
      };
    }
}

