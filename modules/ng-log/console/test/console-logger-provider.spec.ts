// tslint:disable: no-floating-promises
// tslint:disable: no-console

import { TestBed } from '@angular/core/testing';

import { LogLevel } from '../../src';

import { CONSOLE_LOGGER_OPTIONS, ConsoleLogger } from '../src/console-logger';
import { ConsoleLoggerProvider } from '../src/console-logger-provider';

describe('ConsoleLoggerProvider', () => {
    let loggerProvider: ConsoleLoggerProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ConsoleLoggerProvider,
                {
                    provide: CONSOLE_LOGGER_OPTIONS,
                    useValue: { enableDebug: true }
                }
            ]
        });

        loggerProvider = TestBed.get<ConsoleLoggerProvider>(ConsoleLoggerProvider) as ConsoleLoggerProvider;
    });

    it('should be created', () => {
        expect(loggerProvider).toBeDefined();
        expect(loggerProvider.name).toBe('console');
    });

    it("should create a new 'ConsoleLogger' instance with 'createLogger' method", () => {
        const logger = loggerProvider.createLogger('test');
        expect(logger instanceof ConsoleLogger).toBeTruthy();
        expect((logger as ConsoleLogger).name).toBe('test');
    });

    it("should log a message when calling 'destroyLogger' method", () => {
        spyOn(console, 'log');

        const category = 'test';
        loggerProvider.destroyLogger(category);
        expect(console.log).toHaveBeenCalledWith(`Destroying logger: ${category}`);

        // Coverage only without debug
        const loggerProviderWithoutDebug = new ConsoleLoggerProvider();
        loggerProviderWithoutDebug.destroyLogger(category);
    });

    it("should work with 'setUserProperties'", () => {
        spyOn(console, 'log');

        const userId = 'user1';
        const accountId = 'account1';
        loggerProvider.setUserProperties(userId, accountId);

        expect(console.log).toHaveBeenCalledWith(`SET_USER_PROPERTIES: userId: ${userId}, accountId: ${accountId}.`);

        // Coverage only without debug
        const loggerProviderWithoutDebug = new ConsoleLoggerProvider();
        loggerProviderWithoutDebug.setUserProperties(userId, accountId);
    });

    it("should work with 'clearUserProperties'", () => {
        const userId = 'user1';
        const accountId = 'account1';
        loggerProvider.setUserProperties(userId, accountId);

        spyOn(console, 'log');

        loggerProvider.clearUserProperties();
        expect(console.log).toHaveBeenCalledWith(`CLEAR_USER_PROPERTIES: userId: ${userId}, accountId: ${accountId}.`);

        // Coverage only without debug
        const loggerProviderWithoutDebug = new ConsoleLoggerProvider();
        loggerProviderWithoutDebug.clearUserProperties();
    });

    it("should work with 'log'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'log');

        const logLevel = LogLevel.Info;
        const msg = 'This is a message.';
        const logInfo = { properties: { key1: 'value1' } };
        loggerProvider.log(logLevel, msg, logInfo);
        expect(currentLogger.log).toHaveBeenCalledWith(logLevel, msg, logInfo);
    });

    it("should work with 'startTrackPage'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'startTrackPage');

        loggerProvider.startTrackPage('page1');
        expect(currentLogger.startTrackPage).toHaveBeenCalledWith('page1');
    });

    it("should work with 'stopTrackPage'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'stopTrackPage');

        const name = 'page1';
        const pageViewInfo = { uri: '/home' };
        loggerProvider.stopTrackPage(name, pageViewInfo);
        expect(currentLogger.stopTrackPage).toHaveBeenCalledWith(name, pageViewInfo);
    });

    it("should work with 'trackPageView'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'trackPageView');

        const pageViewInfo = { name: 'page1', uri: '/home' };
        loggerProvider.trackPageView(pageViewInfo);
        expect(currentLogger.trackPageView).toHaveBeenCalledWith(pageViewInfo);
    });

    it("should work with 'startTrackEvent'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'startTrackEvent');

        loggerProvider.startTrackEvent('event1');
        expect(currentLogger.startTrackEvent).toHaveBeenCalledWith('event1');
    });

    it("should work with 'stopTrackEvent'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'stopTrackEvent');

        const name = 'event1';
        const eventInfo = { properties: { prop1: 'value1' } };
        loggerProvider.stopTrackEvent(name, eventInfo);
        expect(currentLogger.stopTrackEvent).toHaveBeenCalledWith(name, eventInfo);
    });

    it("should work with 'trackEvent'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'trackEvent');

        const eventInfo = { name: 'event1', eventCategory: 'test' };
        loggerProvider.trackEvent(eventInfo);
        expect(currentLogger.trackEvent).toHaveBeenCalledWith(eventInfo);
    });

    it("should work with 'flush'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'flush');

        loggerProvider.flush();
        expect(currentLogger.flush).toHaveBeenCalled();
    });
});
