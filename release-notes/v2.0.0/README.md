## Features

* Log service provides both application scoped root logger and category scoped child loggers with `createLogger(categoryName)` method.
* Supports standard logging api (`trace`, `debug`, `info`, `warn`, `error`, `fatal`) and telemetry tracking api (`trackPageView`, `trackEvent`, etc.)
* Extendable and plugable logging provider (see built-in [ConsoleLoggerProvider](https://github.com/DagonMetric/ng-log/blob/master/modules/ng-log/console/src/console-logger-provider.ts) for implementation demo)
* Flexable logging configuration (similar and same as [Microsoft ASP.NET Core Logging Configuration](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-2.2#configuration))
* Logging configuration can be set by code or with a configuration loader (see [LogConfigModule](https://github.com/DagonMetric/ng-log/tree/master/modules/ng-log/config) for detail)
* Latest versions of Angular are supported
* Work with Angular Universal (Server Side Rendering - SSR)

npm package is available on:

[@dagonmetric/ng-log](https://www.npmjs.com/package/@dagonmetric/ng-log)
