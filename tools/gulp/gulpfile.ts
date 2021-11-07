import {createPackageBuildTasks} from 'lib-build-tools';
import {series, task} from 'gulp';
import {flexLayoutPackage} from './packages';
import './tasks/clean';

/** Create gulp tasks to build the different packages in the project. */
createPackageBuildTasks(flexLayoutPackage);

import './tasks/build-release';       // release build `github.com/angular/flex-layout-builds`
import './tasks/aot';
import './tasks/changelog';
import './tasks/lint';
import './tasks/unit-test';
import './tasks/hello-world';
import './tasks/universal';
import './tasks/unit-test-ssr';
import './tasks/ci';
import './tasks/default';
import './tasks/development';

/** Task that builds all releases that will be published. */
task(':publish:build-releases', series(
  'clean',
  'flex-layout:build-release'
));

import './tasks/validate-release';


