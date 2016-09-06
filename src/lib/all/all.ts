import {NgModule, ModuleWithProviders} from '@angular/core';

import { NgLayoutModule } from '../api/layout';
import { NgFlexModule } from '../api/flex';



const LAYOUTS_MODULES = [
   NgLayoutModule,
   NgFlexModule
];

@NgModule({
  imports: LAYOUTS_MODULES,
  exports: LAYOUTS_MODULES
})
export class LayoutsRootModule { }


@NgModule({
  imports: LAYOUTS_MODULES,
  exports: LAYOUTS_MODULES,
})
export class LayoutsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LayoutsRootModule
    };
  }
}


