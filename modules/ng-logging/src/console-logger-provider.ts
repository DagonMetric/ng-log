// tslint:disable:no-unsafe-any

import { Injectable } from '@angular/core';

import { ConsoleLogger } from './console-logger';
import { Logger } from './logger';
import { LoggerProvider } from './logger-provider';

@Injectable({
    providedIn: 'root'
})
export class ConsoleLoggerProvider implements LoggerProvider {
    get name(): string {
        return 'console';
    }

    createLogger(category: string): Logger {
        return new ConsoleLogger(category);
    }
}
