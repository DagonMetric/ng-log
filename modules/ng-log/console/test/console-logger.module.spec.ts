// tslint:disable: no-floating-promises
// tslint:disable: no-console

import { TestBed } from '@angular/core/testing';

import { LoggerProvider } from '../../src/logger-provider';

import { ConsoleLoggerProvider } from '../src/console-logger-provider';
import { ConsoleLoggerModule } from '../src/console-logger.module';

describe('ConsoleLoggerModule', () => {
    it("should provide 'ConsoleLoggerProvider'", () => {
        TestBed.configureTestingModule({
            imports: [
                ConsoleLoggerModule
            ]
        });

        const loggerProviders = TestBed.get<LoggerProvider[]>(LoggerProvider as any);

        expect(loggerProviders).toBeDefined();
        expect((loggerProviders as LoggerProvider[])[0] instanceof ConsoleLoggerProvider).toBeTruthy();
    });
});
