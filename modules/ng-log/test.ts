// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// tslint:disable: no-implicit-dependencies no-import-side-effect

import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';

import { getTestBed } from '@angular/core/testing';

import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// tslint:disable-next-line: no-any no-reserved-keywords
declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);

// Then we find all the tests.
// tslint:disable-next-line: no-unsafe-any
const context = require.context('./', true, /\.spec\.ts$/);

// And load the modules.
// tslint:disable-next-line: no-unsafe-any
context.keys().map(context);
