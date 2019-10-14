# Angular Logging, Analytics and Telemetry Service

[![Build Status](https://dev.azure.com/DagonMetric/ng-log/_apis/build/status/DagonMetric.ng-log?branchName=master)](https://dev.azure.com/DagonMetric/ng-log/_build/latest?definitionId=10&branchName=master)
[![CircleCI](https://circleci.com/gh/DagonMetric/ng-log.svg?style=svg)](https://circleci.com/gh/DagonMetric/ng-log)
[![codecov](https://codecov.io/gh/DagonMetric/ng-log/branch/master/graph/badge.svg)](https://codecov.io/gh/DagonMetric/ng-log)
[![npm version](https://img.shields.io/npm/v/@dagonmetric/ng-log.svg)](https://www.npmjs.com/package/@dagonmetric/ng-log)
[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Vendor-agnostic logging, analytics and telemetry service abstractions and some implementations for Angular applications.

## Features

* Log service provides both application scoped root logger and category scoped child loggers with `createLogger(categoryName)` method.
* Category scoped child loggers can be destroyed with `destroyLogger(categoryName)` method
* Supports both standard logging api (`trace`, `debug`, `info`, `warn`, `error`, `fatal`) and telemetry tracking api (`trackPageView`, `trackEvent`, etc.)
* Support measuring user timings for events and page views with `startTrackEvent`, `stopTrackEvent`, `startTrackPage` and `stopTrackPage`
* Extendable and plugable logging providers (see built-in [ConsoleLoggerProvider](https://github.com/DagonMetric/ng-log/blob/master/modules/ng-log/console/src/console-logger-provider.ts) for implementation demo)
* Flexable logging configuration (similar and same as [Microsoft ASP.NET Core Logging Configuration](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-2.2#configuration))
* Logging configuration can be set by code or with a configuration loader service (see [LogConfigModule](https://github.com/DagonMetric/ng-log/tree/master/modules/ng-log/config) for detail)
* Latest versions of Angular are supported
* Work with Angular Universal (Server Side Rendering - SSR)

## Getting Started

### Installation

npm

```bash
npm install @dagonmetric/ng-log
```

or yarn

```bash
yarn add @dagonmetric/ng-log
```

### Module Setup (app.module.ts)

The following code is a simple module setup with `ConsoleLoggerModule`.

```typescript
import { LogModule } from '@dagonmetric/ng-log';
import { ConsoleLoggerModule } from '@dagonmetric/ng-log/console';

@NgModule({
  imports: [
    // Other module imports

    // ng-log modules
    LogModule.withConfig({ minLevel: 'debug' }),
    ConsoleLoggerModule
  ]
})
export class AppModule { }
```

### Usage (app.component.ts)

```typescript
import { Component, OnInit } from '@angular/core';

import { LogService } from '@dagonmetric/ng-log';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private readonly _logService: LogService) { }

  ngOnInit(): void {
    // Track traces
    this._logService.trace('Testing trace');
    this._logService.debug('Testing debug');
    this._logService.info('Testing info');
    this._logService.warn('Testing warn');

    // Track exceptions
    this._logService.error(new Error('Testing error'));
    this._logService.fatal(new Error('Testing critical'));

    // Track page view
    this._logService.trackPageView({
      name: 'My Angular App',
      uri: '/home'
    });

    // Track custom event
    this._logService.trackEvent({
      name: 'video_auto_play_start',
      properties: {
        non_interaction: true
      }
    });

    // Create child logger with category name
    const childLogger = this._logService.createLogger('component1');

    // Log with child logger
    childLogger.info('Testing info');

    // Destroy child logger
    this._logService.destroyLogger('component1');
  }
}
```

## Documentation

See [ng-log wiki](https://github.com/DagonMetric/ng-log/wiki) for more information.

## Sub-modules

* [ng-log-console](https://github.com/DagonMetric/ng-log/tree/master/modules/ng-log/console) - Console logging implementation for `Logger`

* [ng-log-config](https://github.com/DagonMetric/ng-log/tree/master/modules/ng-log/config) - `LogConfigModule` for loading logging configuration with `ConfigService`

## Integrations

* [ng-log-applicationinsights](https://github.com/DagonMetric/ng-log-applicationinsights) - Microsoft Azure Application Insights implementation for `Logger`

* [ng-log-gtag](https://github.com/DagonMetric/ng-log-gtag) - Google Analytics Global Site Tag gtag.js implementation for `Logger`

* [ng-log-firebase-analytics](https://github.com/DagonMetric/ng-log-firebase-analytics) - Firebase Analytics implementation for `Logger`

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-log/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-log/blob/master/LICENSE) license.
