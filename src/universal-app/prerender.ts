import 'reflect-metadata';
import 'zone.js';

import {enableProdMode} from '@angular/core';
import {renderModuleFactory} from '@angular/platform-server';
import {join} from 'path';
import {readFileSync} from 'fs-extra';
import {log} from 'gulp-util';
import {ResponsiveAppServerModuleNgFactory} from './app/responsive-app.ngfactory';

enableProdMode();

const result = renderModuleFactory(ResponsiveAppServerModuleNgFactory, {
  document: readFileSync(join(__dirname, 'index.html'), 'utf-8')
});

result
  .then((html) => console.log(html) && log('Prerender done.'))
  // If rendering the module factory fails, exit the process with an error code because otherwise
  // the CI task will not recognize the failure and will show as "success". The error message
  // will be printed automatically by the `renderModuleFactory` method.
  .catch(() => process.exit(1));
