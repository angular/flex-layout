import {createPackageBuildTasks} from 'lib-build-tools';

/** Create gulp tasks to build the different packages in the project. */
createPackageBuildTasks('flex-layout');

import './tasks/aot';
import './tasks/build-release';       // release build `github.com/angular/flex-layout-builds`
import './tasks/clean';
import './tasks/ci';
import './tasks/default';
import './tasks/development';
import './tasks/lint';
import './tasks/publish';             // publish release to npm
import './tasks/unit-test';
import './tasks/universal';
import './tasks/validate-release';
