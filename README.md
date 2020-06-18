# Angular Logging, Analytics and Telemetry Service

[![GitHub Actions Status](https://github.com/DagonMetric/ng-log/workflows/Main%20Workflow/badge.svg)](https://github.com/DagonMetric/ng-log/actions)
[![Azure Pipelines Status](https://dev.azure.com/DagonMetric/ng-log/_apis/build/status/DagonMetric.ng-log?branchName=master)](https://dev.azure.com/DagonMetric/ng-log/_build?definitionId=10)
[![codecov](https://codecov.io/gh/DagonMetric/ng-log/branch/master/graph/badge.svg)](https://codecov.io/gh/DagonMetric/ng-log)
[![npm version](https://badge.fury.io/js/%40dagonmetric%2Fng-log.svg)](https://www.npmjs.com/package/@dagonmetric/ng-log)
[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Vendor-agnostic logging, analytics and telemetry service abstractions and some implementations for Angular applications.

## Features

* Log service provides both application scoped root logger and category scoped child loggers with `createLogger(categoryName)` method.
* Category scoped child loggers can be destroyed with `destroyLogger(categoryName)` method
* Supports both standard logging api (`trace`, `debug`, `info`, `warn`, `error`, `fatal`) and telemetry tracking api (`trackPageView`, `trackEvent`, etc.)
* Support measuring user timings for events and page views with `startTrackEvent`, `stopTrackEvent`, `startTrackPage` and `stopTrackPage`
* Extendable and plugable logging providers (see built-in [ConsoleLoggerProvider](https://github.com/DagonMetric/ng-log/blob/master/modules/ng-log/console/src/console-logger-provider.ts) for implementation demo)
* Flexable logging configuration
* Latest version of Angular and compatible with server side rendering (SSR / Angular Universal)

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

See [log-config.ts](https://github.com/DagonMetric/ng-log/blob/master/modules/ng-log/src/log-config.ts) source file to learn more about options for `LogModule`.

Live edit [app.module.ts in stackblitz](https://stackblitz.com/github/dagonmetric/ng-log/tree/master/samples/demo-app?file=src%2Fapp%2Fapp.module.ts)

### Usage (app.component.ts)

```typescript
import { Component, OnInit } from '@angular/core';

import { LogService } from '@dagonmetric/ng-log';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private readonly logService: LogService) { }

  ngOnInit(): void {
    // Track traces
    this.logService.trace('Testing trace');
    this.logService.debug('Testing debug');
    this.logService.info('Testing info');
    this.logService.warn('Testing warn');

    // Track exceptions
    this.logService.error(new Error('Testing error'));
    this.logService.fatal(new Error('Testing critical'));

    // Track page view
    this.logService.trackPageView({
      name: 'My Angular App',
      uri: '/home'
    });

    // Track custom event
    this.logService.trackEvent({
      name: 'video_auto_play_start',
      properties: {
        non_interaction: true
      }
    });

    // Create child logger with category name
    const childLogger = this.logService.createLogger('component1');

    // Log with child logger
    childLogger.info('Testing info');

    // Destroy child logger
    this.logService.destroyLogger('component1');
  }
}
```

Live edit [app.component.ts in stackblitz](https://stackblitz.com/github/dagonmetric/ng-log/tree/master/samples/demo-app?file=src%2Fapp%2Fapp.component.ts)

## Samples

* Demo app [view source](https://github.com/DagonMetric/ng-log/tree/master/samples/demo-app) / [live edit in stackblitz](https://stackblitz.com/github/dagonmetric/ng-log/tree/master/samples/demo-app)

## Sub-modules

* [ng-log-console](https://github.com/DagonMetric/ng-log/tree/master/modules/ng-log/console) - Console logging implementation for `ng-log`

## Integrations

* [ng-log-applicationinsights](https://github.com/DagonMetric/ng-log-applicationinsights) - Microsoft Azure Application Insights implementation for `ng-log`
* [ng-log-gtag](https://github.com/DagonMetric/ng-log-gtag) - Google Analytics Global Site Tag gtag.js implementation for `ng-log`
* [ng-log-firebase-analytics](https://github.com/DagonMetric/ng-log-firebase-analytics) - Google Firebase Analytics implementation for `ng-log`
* [ng-log-facebook-analytics](https://github.com/DagonMetric/ng-log-facebook-analytics) - Facebook Pixel Analytics implementation for `ng-log`

## Related Projects

* [ng-config](https://github.com/DagonMetric/ng-config) - Configuration & options service for Angular applications
* [ng-cache](https://github.com/DagonMetric/ng-cache) - Caching service for Angular applications

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-log/blob/master/CONTRIBUTING.md) page.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-log/blob/master/LICENSE) license.
