import {task} from 'gulp';
import {join} from 'path';
import {buildConfig} from 'lib-build-tools';
import {register} from 'tsconfig-paths';

const {projectDir} = buildConfig;
const {patchTestBed} = require(join(projectDir, 'test/patch-testbed'));


/**
 * Gulp tasks to run the unit tests in SSR mode
 * This sets the PLATFORM_ID flag to the server and
 * sets the DOCUMENT value to the Domino instance
 */
task('test:ssr', [':test:build'], (done: () => void) => {
  const baseUrl = join(projectDir, 'dist', 'packages', 'flex-layout');
  const paths = {
    '@angular/flex-layout/*': ['./*']
  };
  register({baseUrl, paths});
  const jasmine = new (require('jasmine'))({projectBaseDir: projectDir});
  require('zone.js');
  require('zone.js/dist/zone-testing');
  const {TestBed} = require('@angular/core/testing');
  const {ServerTestingModule, platformServerTesting} = require('@angular/platform-server/testing');
  let testBed = TestBed.initTestEnvironment(
    ServerTestingModule,
    platformServerTesting()
  );

  patchTestBed(testBed);
  jasmine.loadConfigFile('test/jasmine-ssr.json');
  jasmine.execute();
  done();
});
