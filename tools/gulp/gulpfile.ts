import {createPackageBuildTasks} from 'lib-build-tools';
import {flexLayoutPackage} from './packages';

/** Create gulp tasks to build the different packages in the project. */
createPackageBuildTasks(flexLayoutPackage);

import './tasks/aot';
import './tasks/build-release';       // release build `github.com/angular/flex-layout-builds`
import './tasks/clean';
import './tasks/changelog';
import './tasks/ci';
import './tasks/default';
import './tasks/development';
import './tasks/hello-world';
import './tasks/lint';
import './tasks/publish';             // publish release to npm
import './tasks/unit-test';
import './tasks/unit-test-ssr';
import './tasks/universal';
import './tasks/validate-release';
