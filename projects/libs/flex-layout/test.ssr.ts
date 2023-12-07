import 'zone.js';
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
    ServerTestingModule,
    platformServerTesting,
} from '@angular/platform-server/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(ServerTestingModule, platformServerTesting());

declare const require: {
    context(
        path: string,
        deep?: boolean,
        filter?: RegExp
    ): {
        keys(): string[]
        <T>(id: string): T
    }
};

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
