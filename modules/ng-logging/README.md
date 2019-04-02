ng-logging
=====================

Installation
---------------

```bash
npm install @dagonmetric/ng-logging
```

Setup
---------------

```typescript
import { ConsoleLoggerModule, LoggerModule } from '@dagonmetric/ng-logging';

@NgModule({
    imports: [
        // Other module imports

        // Logging
        LoggerModule.forRoot({ minLevel: 'trace' }),
        ConsoleLoggerModule
    ]
})
export class AppModule { }
```

Usage
---------------

```typescript
import { Component, OnInit } from '@angular/core';

import { Logger, LoggerFactory } from '@dagonmetric/ng-logging';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
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