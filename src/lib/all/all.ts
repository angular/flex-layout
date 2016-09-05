import {NgModule, ModuleWithProviders} from '@angular/core';

import { NgLayoutModule } from '../layout/layout';
import { NgFlexModule } from '../flex/flex';



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


