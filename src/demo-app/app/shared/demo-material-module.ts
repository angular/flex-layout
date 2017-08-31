import {NgModule} from '@angular/core';

import {
  MdButtonModule,
  MdCardModule,
  MdRadioModule,
  MdRippleModule,
  StyleModule
} from '@angular/material';

import {PlatformModule} from '@angular/cdk/platform';
import {ObserversModule} from '@angular/cdk/observers';

/**
 * NgModule that includes all Material modules that are required to serve the demo-app.
 */
@NgModule({
  exports: [
    MdButtonModule,
    MdCardModule,
    MdRadioModule,
    MdRippleModule,
    StyleModule,

    ObserversModule,
    PlatformModule
  ]
})
export class DemoMaterialModule {}
