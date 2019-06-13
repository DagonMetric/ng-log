# Logging Package for Angular

Contains logging abstractions and a few implementations for Angular.

## Features

[WIP]

## Getting Started

### Installation

npm

```shell
npm install @dagonmetric/ng-log
```

or yarn

```shell
yarn add @dagonmetric/ng-log
```

### Module Setup (app.module.ts)

The following code is a simple module setup with `ConsoleLoggerModule`.

```typescript
import { ConsoleLoggerModule, LoggerModule } from '@dagonmetric/ng-log';

@NgModule({
  imports: [
    // Other module imports

    // ng-log module
    LoggerModule.withOptions({ minLevel: 'trace' }),
    ConsoleLoggerModule
  ]
})
export class AppModule { }
```

### Usage (app.component.ts)

```typescript
import { Component, OnInit } from '@angular/core';

import { Logger, LoggerFactory } from '@dagonmetric/ng-log';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly _logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this._logger = loggerFactory.createLogger('app');
  }

  ngOnInit(): void {
    this._logger.trace('Testing trace');
    this._logger.debug('Testing debug');
    this._logger.info('Testing info');
    this._logger.warn('Testing warn');
    this._logger.error('Testing error');
  }
}
```

## Documentation

[Wiki](https://github.com/DagonMetric/ng-log/wiki)

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-log/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-log/blob/master/LICENSE) license.
