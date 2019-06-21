// tslint:disable: no-floating-promises
// tslint:disable: no-console

import { TestBed } from '@angular/core/testing';

import { ConsoleLogger } from '../src/console-logger';
import { ConsoleLoggerProvider } from '../src/console-logger-provider';

describe('ConsoleLoggerProvider', () => {
    let loggerProvider: ConsoleLoggerProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ConsoleLoggerProvider
            ]
        });

        loggerProvider = TestBed.get<ConsoleLoggerProvider>(ConsoleLoggerProvider) as ConsoleLoggerProvider;
    });

    it('should be created', () => {
        expect(loggerProvider).toBeDefined();
        expect(loggerProvider.name).toBe('console');
    });

    describe('createLogger', () => {
        it("should create 'ConsoleLogger'", () => {
            const logger = loggerProvider.createLogger('test');

            expect(logger instanceof ConsoleLogger).toBeTruthy();

            // Coverage only
            loggerProvider.setAuthenticatedUserContext();
            loggerProvider.clearAuthenticatedUserContext();
        });
    });
});
