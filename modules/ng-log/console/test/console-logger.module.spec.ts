// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { LOGGER_PROVIDER, LoggerProvider } from '../../src/logger-provider';

import { ConsoleLoggerProvider } from '../src/console-logger-provider';
import { ConsoleLoggerModule } from '../src/console-logger.module';

describe('ConsoleLoggerModule', () => {
    it("should provide 'ConsoleLoggerProvider'", () => {
        TestBed.configureTestingModule({
            imports: [
                ConsoleLoggerModule
            ]
        });

        const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER);

        expect(loggerProviders).toBeDefined();
        expect((loggerProviders as LoggerProvider[])[0] instanceof ConsoleLoggerProvider).toBeTruthy();
    });
});
