/**
 * Used to launch the application under Bazel development mode.
 */
import {platformBrowser} from '@angular/platform-browser';
import {AppModuleDevNgFactory} from './app/app.module.dev.ngfactory';

platformBrowser().bootstrapModuleFactory(AppModuleDevNgFactory);
