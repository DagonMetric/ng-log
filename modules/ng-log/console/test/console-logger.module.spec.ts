import { TestBed } from '@angular/core/testing';

import { LOGGER_PROVIDER, LoggerProvider } from '../../src/logger-provider';

import { CONSOLE_LOGGER_OPTIONS, ConsoleLoggerOptions } from '../src/console-logger';
import { ConsoleLoggerProvider } from '../src/console-logger-provider';
import { ConsoleLoggerModule } from '../src/console-logger.module';

describe('ConsoleLoggerModule', () => {
    it("should provide 'ConsoleLoggerProvider'", () => {
        TestBed.configureTestingModule({
            imports: [ConsoleLoggerModule]
        });

        const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER);

        expect(loggerProviders).toBeDefined();
        expect((loggerProviders as LoggerProvider[])[0] instanceof ConsoleLoggerProvider).toBeTruthy();
    });

    describe('withOptions', () => {
        it("should provide 'CONSOLE_LOGGER_OPTIONS' value", () => {
            TestBed.configureTestingModule({
                imports: [
                    ConsoleLoggerModule.withOptions({
                        enableDebug: true
                    })
                ]
            });

            const options = TestBed.get<ConsoleLoggerOptions>(CONSOLE_LOGGER_OPTIONS) as ConsoleLoggerOptions;

            expect(options).toBeDefined();
            expect(options.enableDebug).toBeTruthy();
        });
    });
});
