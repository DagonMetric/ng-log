/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable max-classes-per-file */

import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DefaultLogger } from '../src/default-logger';
import { LOG_CONFIG, LogConfig } from '../src/log-config';
import { LogLevel, LogLevelString } from '../src/log-level';
import { LogService } from '../src/log.service';
import { Logger } from '../src/logger';
import { LOGGER_PROVIDER, LoggerProvider } from '../src/logger-provider';

/**
 * Mock logger implementation.
 */
export class MockLogger extends Logger {
    constructor(readonly name?: string) {
        super();
    }

    log(): void {
        // Do nothing
    }

    startTrackPage(): void {
        // Do nothing
    }

    stopTrackPage(): void {
        // Do nothing
    }

    trackPageView(): void {
        // Do nothing
    }

    startTrackEvent(): void {
        // Do nothing
    }

    stopTrackEvent(): void {
        // Do nothing
    }

    trackEvent(): void {
        // Do nothing
    }

    flush(): void {
        // Do nothing
    }
}

/**
 * Mock logger provider implementation 1.
 */
@Injectable({
    providedIn: 'root'
})
export class MockLoggerProvider1 extends Logger implements LoggerProvider {
    get name(): string {
        return 'mock';
    }

    createLogger(category: string): Logger {
        return new MockLogger(category);
    }

    log(): void {
        // Do nothing
    }

    startTrackPage(): void {
        // Do nothing
    }

    stopTrackPage(): void {
        // Do nothing
    }

    trackPageView(): void {
        // Do nothing
    }

    startTrackEvent(): void {
        // Do nothing
    }

    stopTrackEvent(): void {
        // Do nothing
    }

    trackEvent(): void {
        // Do nothing
    }

    flush(): void {
        // Do nothing
    }
}

/**
 * Mock logger provider implementation 2.
 */
@Injectable({
    providedIn: 'root'
})
export class MockLoggerProvider2 extends Logger implements LoggerProvider {
    get name(): string {
        return 'mock';
    }

    createLogger(category: string): Logger {
        return new MockLogger(category);
    }

    destroyLogger(): void {
        // Do nothing
    }

    setUserProperties(): void {
        // Do nothing
    }

    clearUserProperties(): void {
        // Do nothing
    }

    log(): void {
        // Do nothing
    }

    startTrackPage(): void {
        // Do nothing
    }

    stopTrackPage(): void {
        // Do nothing
    }

    trackPageView(): void {
        // Do nothing
    }

    startTrackEvent(): void {
        // Do nothing
    }

    stopTrackEvent(): void {
        // Do nothing
    }

    trackEvent(): void {
        // Do nothing
    }

    flush(): void {
        // Do nothing
    }
}

describe('LogService', () => {
    it('should be created', () => {
        TestBed.configureTestingModule({
            providers: [LogService]
        });

        const logService = TestBed.inject<LogService>(LogService);

        void expect(logService).toBeDefined();
    });

    describe('createLogger', () => {
        it("should create a logger without 'LOGGER_PROVIDER' registration", () => {
            TestBed.configureTestingModule({
                providers: [LogService]
            });

            const logService = TestBed.inject<LogService>(LogService);
            const logger = logService.createLogger('test');

            void expect(logger instanceof DefaultLogger).toBeTruthy();
        });

        it("should create a logger with 'LOGGER_PROVIDER' and 'LOG_CONFIG'", () => {
            const config: LogConfig = {
                userId: true,
                minLevel: 'trace',
                logLevel: {
                    default: 'debug',
                    'angular*log': 'warn'
                },
                pageView: {
                    default: false,
                    test: true
                },
                event: {
                    default: {
                        payment: false
                    },
                    test: {
                        payment: true
                    }
                },
                mock: {
                    logLevel: 'info',
                    event: {
                        add_to_cart: true
                    }
                },
                console: {
                    logLevel: {
                        default: 'error'
                    },
                    event: {
                        test: {
                            payment: false
                        },
                        'angular*log': {
                            add_to_cart: false
                        }
                    },
                    pageView: false
                }
            };

            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    },
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider2,
                        multi: true
                    },
                    {
                        provide: LOG_CONFIG,
                        useValue: config
                    }
                ]
            });

            const logService = TestBed.inject<LogService>(LogService);
            const logger = logService.createLogger('test') as DefaultLogger;

            void expect(logger).toBeDefined();
            void expect(logger.loggerInformations.length).toBe(2);
            void expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Info);
            void expect(logger.loggerInformations[0].pageView).toBe(true);
            void expect((logger.loggerInformations[0].event as { [name: string]: boolean }).payment).toBeTruthy();
            void expect((logger.loggerInformations[0].event as { [name: string]: boolean }).add_to_cart).toBeTruthy();
        });

        it('should create the same logger instance if same category name is passed', () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    },
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider2,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.inject<LogService>(LogService);
            const logger1 = logService.createLogger('test1');
            const logger2 = logService.createLogger('test1');

            void expect(logger1).toEqual(logger2);
        });

        it('should create a unique logger instance if unique category name is passed', () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.inject<LogService>(LogService);
            const logger1 = logService.createLogger('test1');
            const logger2 = logService.createLogger('test2');

            void expect(logger1 === logger2).toBeFalsy();
        });

        it('should re-create a unique logger instance if the old one is destroy', () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.inject<LogService>(LogService);

            const logger1 = logService.createLogger('test1');
            logService.destroyLogger('test1');
            // Coverage only
            logService.destroyLogger('test1');

            const logger2 = logService.createLogger('test1');

            void expect(logger1 === logger2).toBeFalsy();
        });
    });

    describe('destroyLogger', () => {
        it("should be able to call 'destroyLogger'", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    },
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider2,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.inject<LogService>(LogService);
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[1] as MockLoggerProvider2;

            spyOn(loggerProvider, 'destroyLogger');

            logService.destroyLogger('test');

            // eslint-disable-next-line @typescript-eslint/unbound-method
            void expect(loggerProvider.destroyLogger).toHaveBeenCalled();
        });
    });

    describe('setConfig', () => {
        it('can be called with empty config value', () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.inject<LogService>(LogService);
            const logger = logService.createLogger('test') as DefaultLogger;

            logService.setConfig({});

            void expect(logger.loggerInformations[0].minLevel).toBeUndefined();
            void expect(logger.loggerInformations[0].pageView).toBeUndefined();
            void expect(logger.loggerInformations[0].event).toBeUndefined();
        });

        it("should be able to set config 'minLevel' values", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.inject<LogService>(LogService);
            const logger = logService.createLogger('test') as DefaultLogger;

            logService.setConfig({
                minLevel: 'trace'
            });
            void expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Trace);

            logService.setConfig({
                minLevel: 'debug'
            });
            void expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Debug);

            logService.setConfig({
                minLevel: 'info'
            });
            void expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Info);

            logService.setConfig({
                minLevel: 'warn'
            });
            void expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Warn);

            logService.setConfig({
                minLevel: 'error'
            });
            void expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Error);

            logService.setConfig({
                minLevel: 'critical'
            });
            void expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Critical);

            logService.setConfig({
                minLevel: 'none'
            });
            void expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.None);
        });

        it("should log an error when invalid 'minLevel' is provided", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.inject<LogService>(LogService);

            spyOn(console, 'error');

            logService.setConfig({
                // Invalid log level
                minLevel: ('important' as unknown) as undefined
            });

            expect(console.error).toHaveBeenCalledWith(
                "Invalid logging configuration, minLevel value 'important' is not supported."
            );
        });

        it("should be able to set config 'logLevel' value", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const logger = logService.createLogger('ng-log-test') as DefaultLogger;

            logService.setConfig({
                logLevel: {
                    default: 'trace',
                    angular: 'debug',
                    'ng-log-test': 'info',
                    'ng-log': 'warn'
                }
            });

            void expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Info);

            logService.setConfig({
                mock: {
                    logLevel: 'error'
                },
                logLevel: {
                    default: 'critical'
                }
            });

            void expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Error);

            logService.setConfig({
                mock: {
                    logLevel: {
                        default: 'error',
                        'ng-log*test': 'critical'
                    }
                }
            });

            void expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Critical);
        });

        it("should log an error when invalid 'logLevel' value is provided", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;

            spyOn(console, 'error');

            logService.setConfig({
                logLevel: {
                    // Invalid category name
                    'angular*unit*test': 'error'
                }
            });
            logService.setConfig({
                logLevel: {
                    // Invalid log level
                    default: ('important' as unknown) as LogLevelString
                }
            });
            logService.setConfig({
                logLevel: {
                    // Invalid log level
                    test: (100 as unknown) as LogLevelString
                }
            });
            logService.setConfig({
                console: {
                    logLevel: {
                        'angular*unit*test': 'error'
                    }
                },
                debug: {
                    logLevel: ('important' as unknown) as LogLevelString
                },
                test: {
                    logLevel: false
                },
                invalid: 'info'
            });

            expect(console.error).toHaveBeenCalledWith(
                'Invalid logging configuration, only one wildcard character is allowed in category name.'
            );
            expect(console.error).toHaveBeenCalledWith(
                "Invalid logging configuration, logLevel value 'important' is not supported."
            );
            expect(console.error).toHaveBeenCalledWith(
                "Invalid logging configuration, logLevel value '100' is not supported."
            );
            expect(console.error).toHaveBeenCalledWith(
                'Invalid logging configuration, only one wildcard character is allowed in category name.'
            );
            expect(console.error).toHaveBeenCalledWith(
                "Invalid logging configuration, logLevel value 'important' is not supported."
            );
            expect(console.error).toHaveBeenCalledWith(
                "Invalid logging configuration, logLevel value 'false' is not supported."
            );
        });

        it("should be able to set config 'pageView' value", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const logger = logService.createLogger('test') as DefaultLogger;

            logService.setConfig({
                pageView: true
            });

            void expect(logger.loggerInformations[0].pageView).toBeTruthy();

            logService.setConfig({
                pageView: {
                    default: false,
                    test: true
                }
            });

            void expect(logger.loggerInformations[0].pageView).toBeTruthy();

            logService.setConfig({
                // With provider name
                mock: {
                    pageView: true
                },
                // Without provider name
                pageView: false
            });

            void expect(logger.loggerInformations[0].pageView).toBeTruthy();

            logService.setConfig({
                mock: {
                    // With provider & category name
                    pageView: {
                        default: true,
                        test: false
                    }
                },
                // Without provider & category name
                pageView: true
            });

            void expect(logger.loggerInformations[0].pageView === false).toBeTruthy();
        });

        it("should log an error when invalid 'pageView' value is provided", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;

            spyOn(console, 'error');

            logService.setConfig({
                pageView: {
                    'angular*unit*test': true
                }
            });
            logService.setConfig({
                pageView: ('info' as unknown) as undefined
            });
            logService.setConfig({
                pageView: (0 as unknown) as undefined
            });
            logService.setConfig({
                console: {
                    pageView: {
                        'angular*unit*test': true
                    }
                },
                debug: {
                    pageView: 'info'
                },
                test: {
                    pageView: {
                        default: (0 as unknown) as boolean
                    }
                }
            });

            expect(console.error).toHaveBeenCalledWith(
                'Invalid logging configuration, only one wildcard character is allowed in category name.'
            );
            expect(console.error).toHaveBeenCalledWith(
                "Invalid logging configuration, pageView value 'info' is not supported."
            );
            expect(console.error).toHaveBeenCalledWith(
                "Invalid logging configuration, pageView value '0' is not supported."
            );

            expect(console.error).toHaveBeenCalledWith(
                'Invalid logging configuration, only one wildcard character is allowed in category name.'
            );
            expect(console.error).toHaveBeenCalledWith(
                "Invalid logging configuration, pageView value 'info' is not supported."
            );
            expect(console.error).toHaveBeenCalledWith(
                "Invalid logging configuration, pageView value '0' is not supported."
            );
        });

        it("should be able to set config 'event' value", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const logger = logService.createLogger('test') as DefaultLogger;

            // event object
            logService.setConfig({
                event: {
                    payment: true,
                    add_to_cart: false
                }
            });

            void expect((logger.loggerInformations[0].event as { [name: string]: boolean }).payment).toBeTruthy();
            void expect(
                (logger.loggerInformations[0].event as { [name: string]: boolean }).add_to_cart === false
            ).toBeTruthy();

            // event object with category
            logService.setConfig({
                event: {
                    default: {
                        payment: true,
                        add_to_cart: false
                    },
                    test: {
                        payment: false,
                        add_to_cart: true
                    }
                }
            });

            void expect(
                (logger.loggerInformations[0].event as { [name: string]: boolean }).payment === false
            ).toBeTruthy();
            void expect((logger.loggerInformations[0].event as { [name: string]: boolean }).add_to_cart).toBeTruthy();

            // event object in logger section
            logService.setConfig({
                mock: {
                    event: {
                        payment: true
                    }
                }
            });

            void expect((logger.loggerInformations[0].event as { [name: string]: boolean }).payment).toBeTruthy();

            // event object with category in logger section
            logService.setConfig({
                mock: {
                    event: {
                        default: {
                            payment: false
                        },
                        test: {
                            payment: true
                        }
                    }
                }
            });

            void expect((logger.loggerInformations[0].event as { [name: string]: boolean }).payment).toBeTruthy();
        });

        it("should log an error when invalid 'event' value is provided", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;

            spyOn(console, 'error');

            logService.setConfig({
                event: {
                    // Invalid category name
                    'angular*unit*test': {
                        payment: true
                    }
                }
            });
            logService.setConfig({
                // Invalid event value
                event: ('info' as unknown) as undefined
            });
            logService.setConfig({
                console: {
                    event: {
                        // Invalid category name in logger section
                        'angular*unit*test': {
                            payment: true
                        }
                    }
                },
                mock: {
                    event: {
                        // Invalid event value
                        test: ('info' as unknown) as boolean
                    }
                },
                debug: {
                    // Invalid event value
                    event: 'info'
                }
            });

            expect(console.error).toHaveBeenCalledWith(
                'Invalid logging configuration, only one wildcard character is allowed in category name.'
            );
            expect(console.error).toHaveBeenCalledWith(
                "Invalid logging configuration, event value 'info' is not supported."
            );
            expect(console.error).toHaveBeenCalledWith(
                'Invalid logging configuration, only one wildcard character is allowed in category name.'
            );
            expect(console.error).toHaveBeenCalledWith(
                "Invalid logging configuration, event value 'info' is not supported."
            );
            expect(console.error).toHaveBeenCalledWith(
                "Invalid logging configuration, event value 'info' is not supported."
            );
        });
    });

    describe('setUserProperties', () => {
        it("should call registered logger provider's 'setUserProperties' method", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    },
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider2,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[1] as MockLoggerProvider2;

            spyOn(loggerProvider, 'setUserProperties');

            const userId = 'test_user';
            const accountId = 'test_account';
            logService.setUserProperties(userId, accountId);

            void expect(loggerProvider.setUserProperties).toHaveBeenCalled();
        });

        it("should not call registered logger provider's 'setUserProperties' method if userId is disabled", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    },
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider2,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[1] as MockLoggerProvider2;
            logService.setConfig({
                userId: false
            });

            spyOn(loggerProvider, 'setUserProperties');

            const userId = 'test_user';
            const accountId = 'test_account';

            logService.setUserProperties(userId, accountId);

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
            void expect((loggerProvider.setUserProperties as any).calls.any()).toEqual(false);
        });
    });

    describe('clearUserProperties', () => {
        it("should call registered logger provider's 'clearUserProperties' method if userId is set", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    },
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider2,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[1] as MockLoggerProvider2;

            const userId = 'test_user';
            const accountId = 'test_account';
            logService.setUserProperties(userId, accountId);

            spyOn(loggerProvider, 'clearUserProperties');

            logService.clearUserProperties();

            void expect(loggerProvider.clearUserProperties).toHaveBeenCalled();
        });

        it("should call registered logger provider's 'clearUserProperties' method after setting userId to false", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    },
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider2,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[1] as MockLoggerProvider2;

            const userId = 'test_user';
            const accountId = 'test_account';
            logService.setUserProperties(userId, accountId);
            logService.setConfig({
                userId: false
            });

            spyOn(loggerProvider, 'clearUserProperties');

            logService.clearUserProperties();

            void expect(loggerProvider.clearUserProperties).toHaveBeenCalled();
        });

        it("should not call registered logger provider's 'clearUserProperties' method if userId is disabled", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    },
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider2,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[1] as MockLoggerProvider2;
            logService.setConfig({
                userId: false
            });

            spyOn(loggerProvider, 'clearUserProperties');

            logService.clearUserProperties();

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
            void expect((loggerProvider.clearUserProperties as any).calls.any()).toEqual(false);
        });
    });

    describe('log', () => {
        it("should call registered logger provider's 'log' method", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'log');

            const logLevel = LogLevel.Info;
            const msg = 'This is a message.';
            const logInfo = { properties: { key1: 'value1' } };
            logService.log(logLevel, msg, logInfo);

            // eslint-disable-next-line @typescript-eslint/unbound-method
            void expect(loggerProvider.log).toHaveBeenCalledWith(logLevel, msg, logInfo);
        });

        it("should not call registered logger provider's 'log' method if disabled", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'log');

            logService.log(LogLevel.None, 'This message does not log.');
            logService.setConfig({
                minLevel: 'warn'
            });
            logService.log(LogLevel.Info, 'This message does not log.');

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
            void expect((loggerProvider.log as any).calls.any()).toEqual(false);
        });
    });

    describe('startTrackPage', () => {
        it("should call registered logger provider's 'startTrackPage' method", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'startTrackPage');

            const name = 'page1';
            logService.startTrackPage(name);

            void expect(loggerProvider.startTrackPage).toHaveBeenCalledWith(name);
        });

        it("should not call registered logger provider's 'startTrackPage' method if disabled", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'startTrackPage');

            logService.setConfig({
                pageView: false
            });
            logService.startTrackPage('page1');

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
            void expect((loggerProvider.startTrackPage as any).calls.any()).toEqual(false);
        });
    });

    describe('stopTrackPage', () => {
        it("should call registered logger provider's 'stopTrackPage' method", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'stopTrackPage');

            const name = 'page1';
            const pageViewInfo = { uri: '/page1' };
            logService.stopTrackPage(name, pageViewInfo);

            void expect(loggerProvider.stopTrackPage).toHaveBeenCalledWith(name, pageViewInfo);
        });

        it("should not call registered logger provider's 'stopTrackPage' method if disabled", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'stopTrackPage');

            logService.setConfig({
                pageView: false
            });
            logService.stopTrackPage('page1');

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
            void expect((loggerProvider.stopTrackPage as any).calls.any()).toEqual(false);
        });
    });

    describe('trackPageView', () => {
        it("should call registered logger provider's 'trackPageView' method", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'trackPageView');

            const pageViewInfo = { name: 'page1', uri: '/page1' };
            logService.trackPageView(pageViewInfo);

            void expect(loggerProvider.trackPageView).toHaveBeenCalledWith(pageViewInfo);
        });

        it("should not call registered logger provider's 'trackPageView' method if disabled", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'trackPageView');

            logService.setConfig({
                pageView: false
            });
            logService.trackPageView({ name: 'page1', uri: '/page1' });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
            void expect((loggerProvider.trackPageView as any).calls.any()).toEqual(false);
        });
    });

    describe('startTrackEvent', () => {
        it("should call registered logger provider's 'startTrackEvent' method", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'startTrackEvent');

            const name = 'event1';
            logService.startTrackEvent(name);

            void expect(loggerProvider.startTrackEvent).toHaveBeenCalledWith(name);

            logService.setConfig({
                event: {
                    event2: false
                }
            });
            logService.startTrackEvent(name);

            void expect(loggerProvider.startTrackEvent).toHaveBeenCalledWith(name);
        });

        it("should not call registered logger provider's 'startTrackEvent' method if disabled", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'startTrackEvent');

            logService.setConfig({
                event: {
                    event1: false
                }
            });

            logService.startTrackEvent('event1');

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
            void expect((loggerProvider.startTrackEvent as any).calls.any()).toEqual(false);
        });
    });

    describe('stopTrackEvent', () => {
        it("should call registered logger provider's 'stopTrackEvent' method", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'stopTrackEvent');

            const name = 'event1';
            const eventInfo = { properties: { prop1: 'value1' } };
            logService.stopTrackEvent(name, eventInfo);

            void expect(loggerProvider.stopTrackEvent).toHaveBeenCalledWith(name, eventInfo);

            logService.setConfig({
                event: {
                    event2: false
                }
            });
            logService.stopTrackEvent(name, eventInfo);

            void expect(loggerProvider.stopTrackEvent).toHaveBeenCalledWith(name, eventInfo);
        });

        it("should not call registered logger provider's 'stopTrackEvent' method if disabled", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'stopTrackEvent');

            logService.setConfig({
                event: {
                    event1: false
                }
            });
            logService.stopTrackEvent('event1');

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
            void expect((loggerProvider.stopTrackEvent as any).calls.any()).toEqual(false);
        });
    });

    describe('trackEvent', () => {
        it("should call registered logger provider's 'trackEvent' method", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'trackEvent');

            const eventInfo = { name: 'event1', eventCategory: 'test' };
            logService.trackEvent(eventInfo);

            void expect(loggerProvider.trackEvent).toHaveBeenCalledWith(eventInfo);

            logService.setConfig({
                event: {
                    event2: false
                }
            });
            logService.trackEvent(eventInfo);

            void expect(loggerProvider.trackEvent).toHaveBeenCalledWith(eventInfo);
        });

        it("should not call registered logger provider's 'trackEvent' method if disabled", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'trackEvent');

            logService.setConfig({
                event: {
                    event1: false
                }
            });
            logService.trackEvent({ name: 'event1' });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
            void expect((loggerProvider.trackEvent as any).calls.any()).toEqual(false);
        });
    });

    describe('flush', () => {
        it("should call registered logger provider's 'flush' method", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider1,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'flush');

            logService.flush();

            void expect(loggerProvider.flush).toHaveBeenCalled();
        });
    });
});

describe('DefaultLogger', () => {
    let logService: LogService;
    let logger: DefaultLogger;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LogService,
                {
                    provide: LOGGER_PROVIDER,
                    useClass: MockLoggerProvider1,
                    multi: true
                }
            ]
        });

        logService = TestBed.get<LogService>(LogService) as LogService;
        logger = logService.createLogger('test') as DefaultLogger;
    });

    it("should call registered logger's 'log' method if enabled", () => {
        logService.setConfig({
            minLevel: 'trace'
        });
        const loggerInformation = logger.loggerInformations[0];

        const msg = 'This is a message.';
        const params = {
            properties: {
                key1: 'value1'
            }
        };

        spyOn(loggerInformation.logger, 'log');

        logger.log(LogLevel.Trace, msg, params);
        void expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Trace, msg, params);

        logger.log(LogLevel.Debug, msg, params);
        void expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Debug, msg, params);

        logger.log(LogLevel.Info, msg, params);
        void expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Info, msg, params);

        logger.log(LogLevel.Warn, msg, params);
        void expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Warn, msg, params);

        logger.log(LogLevel.Error, msg, params);
        void expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Error, msg, params);

        logger.log(LogLevel.Critical, msg, params);
        expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Critical, msg, params);

        logger.log(LogLevel.None, msg, params);
        void expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.None, msg, params);

        logService.setConfig({
            logLevel: {
                default: 'info'
            }
        });
        logger.log(LogLevel.Info, msg, params);
        void expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Info, msg, params);

        logService.setConfig({
            mock: {
                logLevel: 'warn'
            }
        });
        logger.log(LogLevel.Warn, msg, params);
        void expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Warn, msg, params);
    });

    it("should not call registered logger's 'log' method if not enabled", () => {
        const loggerInformation = logger.loggerInformations[0];

        spyOn(loggerInformation.logger, 'log');

        logService.setConfig({
            minLevel: 'info'
        });
        logger.log(LogLevel.Debug, 'This is a message.');

        logService.setConfig({
            mock: {
                logLevel: 'warn'
            }
        });
        logger.log(LogLevel.Info, 'This is a message.');

        logService.setConfig({
            logLevel: {
                angular: 'debug',
                test: 'info'
            }
        });
        logger.log(LogLevel.Debug, 'This is a message.');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        void expect((loggerInformation.logger.log as any).calls.any()).toEqual(false);
    });

    it("should call registered loggers's 'startTrackPage' method", () => {
        const loggerInformation = logger.loggerInformations[0];
        spyOn(loggerInformation.logger, 'startTrackPage');

        const pageName = 'home';

        logger.startTrackPage(pageName);

        void expect(loggerInformation.logger.startTrackPage).toHaveBeenCalledWith(pageName);
    });

    it("should not call registered loggers's 'startTrackPage' method if disabled", () => {
        const loggerInformation = logger.loggerInformations[0];
        logService.setConfig({
            pageView: false
        });

        spyOn(loggerInformation.logger, 'startTrackPage');

        logger.startTrackPage('home');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        void expect((loggerInformation.logger.startTrackPage as any).calls.any()).toEqual(false);
    });

    it("should call registered loggers's 'stopTrackPage' method", () => {
        const loggerInformation = logger.loggerInformations[0];

        spyOn(loggerInformation.logger, 'stopTrackPage');

        const pageName = 'home';
        const props = {
            uri: '/home'
        };

        logger.startTrackPage(pageName);
        logger.stopTrackPage(pageName, props);

        void expect(loggerInformation.logger.stopTrackPage).toHaveBeenCalledWith(pageName, props);
    });

    it("should not call registered loggers's 'stopTrackPage' method if disabled", () => {
        const loggerInformation = logger.loggerInformations[0];
        logService.setConfig({
            pageView: false
        });

        spyOn(loggerInformation.logger, 'stopTrackPage');

        logger.startTrackPage('home');
        logger.stopTrackPage('home');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        void expect((loggerInformation.logger.stopTrackPage as any).calls.any()).toEqual(false);
    });

    it("should call registered loggers's 'trackPageView' method", () => {
        const loggerInformation = logger.loggerInformations[0];

        spyOn(loggerInformation.logger, 'trackPageView');

        const props = {
            name: 'home',
            uri: '/home'
        };

        logger.trackPageView(props);

        void expect(loggerInformation.logger.trackPageView).toHaveBeenCalledWith(props);
    });

    it("should not call registered loggers's 'trackPageView' method if disabled", () => {
        const loggerInformation = logger.loggerInformations[0];
        logService.setConfig({
            pageView: false
        });

        spyOn(loggerInformation.logger, 'trackPageView');

        logger.trackPageView({
            name: 'home',
            uri: '/home'
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        void expect((loggerInformation.logger.trackPageView as any).calls.any()).toEqual(false);
    });

    it("should call registered loggers's 'startTrackEvent' method", () => {
        const loggerInformation = logger.loggerInformations[0];

        spyOn(loggerInformation.logger, 'startTrackEvent');

        const eventName = 'event1';

        logger.startTrackEvent(eventName);

        void expect(loggerInformation.logger.startTrackEvent).toHaveBeenCalledWith(eventName);
    });

    it("should not call registered loggers's 'startTrackEvent' method if disabled", () => {
        const loggerInformation = logger.loggerInformations[0];
        logService.setConfig({
            event: {
                event1: false
            }
        });

        spyOn(loggerInformation.logger, 'startTrackEvent');

        logger.startTrackEvent('event1');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        void expect((loggerInformation.logger.startTrackEvent as any).calls.any()).toEqual(false);
    });

    it("should call registered loggers's 'stopTrackEvent' method", () => {
        const loggerInformation = logger.loggerInformations[0];

        spyOn(loggerInformation.logger, 'stopTrackEvent');

        const eventName = 'event1';
        const eventInfo = { properties: { prop1: 'value1' } };

        logger.startTrackEvent(eventName);
        logger.stopTrackEvent(eventName, eventInfo);

        void expect(loggerInformation.logger.stopTrackEvent).toHaveBeenCalledWith(eventName, eventInfo);
    });

    it("should not call registered loggers's 'stopTrackEvent' method if disabled", () => {
        const loggerInformation = logger.loggerInformations[0];
        logService.setConfig({
            event: {
                event1: false
            }
        });

        spyOn(loggerInformation.logger, 'stopTrackEvent');

        logger.startTrackEvent('event1');
        logger.stopTrackEvent('event1');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        void expect((loggerInformation.logger.stopTrackEvent as any).calls.any()).toEqual(false);
    });

    it("should call registered loggers's 'trackEvent' method", () => {
        const loggerInformation = logger.loggerInformations[0];

        spyOn(loggerInformation.logger, 'trackEvent');

        const props = {
            name: 'event1',
            eventCategory: 'test'
        };

        logger.trackEvent(props);

        void expect(loggerInformation.logger.trackEvent).toHaveBeenCalledWith(props);
    });

    it("should not call registered loggers's 'trackEvent' method if disabled", () => {
        const loggerInformation = logger.loggerInformations[0];
        logService.setConfig({
            event: {
                event1: false
            }
        });

        spyOn(loggerInformation.logger, 'trackEvent');

        logger.trackEvent({ name: 'event1' });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        void expect((loggerInformation.logger.trackEvent as any).calls.any()).toEqual(false);
    });

    it("should call registered loggers's 'flush' method", () => {
        const loggerInformation = logger.loggerInformations[0];
        spyOn(loggerInformation.logger, 'flush');

        logger.flush();

        void expect(loggerInformation.logger.flush).toHaveBeenCalled();
    });
});
