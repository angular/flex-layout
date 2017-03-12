import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MaterialModule} from '@angular/material';
import {FlexLayoutModule} from "../../../lib";     // `gulp build:components` to deploy to node_modules manually

import {MediaQueryStatus} from './media-query-status';

@NgModule({
  imports: [CommonModule, MaterialModule, FlexLayoutModule],
  exports: [CommonModule, MaterialModule, FlexLayoutModule, MediaQueryStatus],
  declarations: [MediaQueryStatus],
})
export class SharedModule {
}
