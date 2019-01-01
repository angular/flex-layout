/**
 * Used to launch the application under Bazel production mode.
 */
import {enableProdMode} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';
import {AppModuleNgFactory} from './app/app.module.ngfactory';

enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
