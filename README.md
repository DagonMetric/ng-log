# Logging and Telemetry Client for Angular

Vendor-agnostic Logging and telemetry client abstractions and some implementations for Angular applications.

[WIP]

## Modules

[ng-log](https://github.com/DagonMetric/ng-log/tree/master/modules/ng-log)

The core log service and telemetry client abstractions

[ng-log-console](https://github.com/DagonMetric/ng-log/tree/master/modules/ng-log/console)

Console logging implementation for `Logger`

[ng-log-config](https://github.com/DagonMetric/ng-log/tree/master/modules/ng-log/config)

`LogConfigModule` for setting logging configuration with `ConfigService`.

## Features

* Log service provides both application scoped root logger and category scoped child loggers with `createLogger(categoryName)` method.
* Supports standard logging api (`trace`, `debug`, `info`, `warn`, `error`, `fatal`) and telemetry tracking api (`trackPageView`, `trackEvent`, etc.)
* Extendable and plugable logging provider (see built-in [ConsoleLoggerProvider](https://github.com/DagonMetric/ng-log/blob/master/modules/ng-log/console/src/console-logger-provider.ts) for implementation demo)
* Flexable logging configuration (similar and same as [Microsoft ASP.NET Core Logging Configuration](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-2.2#configuration))
* Logging configuration can be set by code or with a configuration loader (see [LogConfigModule](https://github.com/DagonMetric/ng-log/tree/master/modules/ng-log/config) for detail)
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
export class AppComponent {
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
      eventLabel: 'My promotional video',
      eventCategory: 'video_auto_play',
      properties: {
        nonInteraction: true
      }
    });
  }
}
```

## Documentation

[Wiki](https://github.com/DagonMetric/ng-log/wiki)

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-log/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-log/blob/master/LICENSE) license.
