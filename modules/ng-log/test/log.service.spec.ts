// tslint:disable: no-floating-promises
// tslint:disable: no-console

import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DefaultLogger } from '../src/default-logger';
import { LOG_CONFIG, LogConfig } from '../src/log-config';
import { LogLevel } from '../src/log-level';
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
 * Mock logger provider implementation.
 */
@Injectable({
    providedIn: 'root'
})
export class MockLoggerProvider extends Logger implements LoggerProvider {
    get name(): string {
        return 'mock';
    }

    createLogger(category: string): Logger {
        return new MockLogger(category);
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
            providers: [
                LogService
            ]
        });

        const logService = TestBed.get<LogService>(LogService);

        expect(logService).toBeDefined();
    });

    describe('createLogger', () => {
        it("should create 'DefaultLogger' without 'LOGGER_PROVIDER' registration", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const logger = logService.createLogger('test');

            expect(logger).toBeDefined();
            expect(logger instanceof DefaultLogger).toBeTruthy();
        });

        it("should create 'DefaultLogger' with 'LOGGER_PROVIDER' and 'LOG_CONFIG'", () => {
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
                        useClass: MockLoggerProvider,
                        multi: true
                    },
                    {
                        provide: LOG_CONFIG,
                        useValue: config
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const logger = logService.createLogger('test') as DefaultLogger;

            expect(logger).toBeDefined();
            expect(logger.loggerInformations.length).toBe(1);
            expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Info);
            expect(logger.loggerInformations[0].pageView).toBe(true);
            expect((logger.loggerInformations[0].event as { [name: string]: boolean }).payment).toBeTruthy();
            expect((logger.loggerInformations[0].event as { [name: string]: boolean }).add_to_cart).toBeTruthy();
        });

        it("should create same 'DefaultLogger' instance if same category name is passed", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const logger1 = logService.createLogger('test');
            const logger2 = logService.createLogger('test');

            expect(logger1).toEqual(logger2);
        });

        it("should create unique 'DefaultLogger' instances if unique category name is passed", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const logger1 = logService.createLogger('test1');
            const logger2 = logService.createLogger('test2');

            expect(logger1 === logger2).toBeFalsy();
        });
    });

    describe('setConfig', () => {
        it('should be able to call with empty config value', () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const logger = logService.createLogger('test') as DefaultLogger;

            logService.setConfig({});

            expect(logger.loggerInformations[0].minLevel).toBeUndefined();
            expect(logger.loggerInformations[0].pageView).toBeUndefined();
            expect(logger.loggerInformations[0].event).toBeUndefined();
        });

        it("should be able to set config 'minLevel' values", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const logger = logService.createLogger('test') as DefaultLogger;

            logService.setConfig({
                minLevel: 'trace'
            });
            expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Trace);

            logService.setConfig({
                minLevel: 'debug'
            });
            expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Debug);

            logService.setConfig({
                minLevel: 'info'
            });
            expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Info);

            logService.setConfig({
                minLevel: 'warn'
            });
            expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Warn);

            logService.setConfig({
                minLevel: 'error'
            });
            expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Error);

            logService.setConfig({
                minLevel: 'critical'
            });
            expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Critical);

            logService.setConfig({
                minLevel: 'none'
            });
            expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.None);
        });

        it("should log an error when invalid 'minLevel' is provided", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;

            spyOn(console, 'error');

            logService.setConfig({
                // Invalid log level
                // tslint:disable-next-line: no-any
                minLevel: 'important' as any
            });

            expect(console.error).toHaveBeenCalledWith("Invalid logging configuration, minLevel value 'important' is not supported.");
        });

        it("should be able to set config 'logLevel' value", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
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
            expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Info);

            logService.setConfig({
                mock: {
                    logLevel: 'error'
                },
                logLevel: {
                    default: 'critical'
                }
            });
            expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Error);

            logService.setConfig({
                mock: {
                    logLevel: {
                        default: 'error',
                        'ng-log*test': 'critical'
                    }
                }
            });
            expect(logger.loggerInformations[0].minLevel).toBe(LogLevel.Critical);
        });

        it("should log an error when invalid 'logLevel' value is provided", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
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
                    // tslint:disable-next-line: no-any
                    default: 'important' as any
                }
            });
            logService.setConfig({
                logLevel: {
                    // Invalid log level
                    // tslint:disable-next-line: no-any
                    test: 100 as any
                }
            });
            logService.setConfig({
                console: {
                    logLevel: {
                        'angular*unit*test': 'error'
                    }
                },
                debug: {
                    // tslint:disable-next-line: no-any
                    logLevel: 'important' as any
                },
                test: {
                    logLevel: false
                },
                invalid: 'info'
            });

            expect(console.error)
                .toHaveBeenCalledWith('Invalid logging configuration, only one wildcard character is allowed in category name.');
            expect(console.error).toHaveBeenCalledWith("Invalid logging configuration, logLevel value 'important' is not supported.");
            expect(console.error).toHaveBeenCalledWith("Invalid logging configuration, logLevel value '100' is not supported.");
            expect(console.error)
                .toHaveBeenCalledWith('Invalid logging configuration, only one wildcard character is allowed in category name.');
            expect(console.error).toHaveBeenCalledWith("Invalid logging configuration, logLevel value 'important' is not supported.");
            expect(console.error).toHaveBeenCalledWith("Invalid logging configuration, logLevel value 'false' is not supported.");
        });

        it("should be able to set config 'pageView' value", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const logger = logService.createLogger('test') as DefaultLogger;

            logService.setConfig({
                pageView: true
            });
            expect(logger.loggerInformations[0].pageView).toBeTruthy();

            logService.setConfig({
                pageView: {
                    default: false,
                    test: true
                }
            });
            expect(logger.loggerInformations[0].pageView).toBeTruthy();

            logService.setConfig({
                // With provider name
                mock: {
                    pageView: true
                },
                // Without provider name
                pageView: false
            });
            expect(logger.loggerInformations[0].pageView).toBeTruthy();

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
            expect(logger.loggerInformations[0].pageView === false).toBeTruthy();
        });

        it("should log an error when invalid 'pageView' value is provided", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
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
                // tslint:disable-next-line: no-any
                pageView: 'info' as any
            });
            logService.setConfig({
                // tslint:disable-next-line: no-any
                pageView: 0 as any
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
                        // tslint:disable-next-line: no-any
                        default: 0 as any
                    }
                }
            });

            expect(console.error)
                .toHaveBeenCalledWith('Invalid logging configuration, only one wildcard character is allowed in category name.');
            expect(console.error).toHaveBeenCalledWith("Invalid logging configuration, pageView value 'info' is not supported.");
            expect(console.error).toHaveBeenCalledWith("Invalid logging configuration, pageView value '0' is not supported.");

            expect(console.error)
                .toHaveBeenCalledWith('Invalid logging configuration, only one wildcard character is allowed in category name.');
            expect(console.error).toHaveBeenCalledWith("Invalid logging configuration, pageView value 'info' is not supported.");
            expect(console.error).toHaveBeenCalledWith("Invalid logging configuration, pageView value '0' is not supported.");
        });

        it("should be able to set config 'event' value", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
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
            expect((logger.loggerInformations[0].event as { [name: string]: boolean }).payment).toBeTruthy();
            expect((logger.loggerInformations[0].event as { [name: string]: boolean }).add_to_cart === false).toBeTruthy();

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
            expect((logger.loggerInformations[0].event as { [name: string]: boolean }).payment === false).toBeTruthy();
            expect((logger.loggerInformations[0].event as { [name: string]: boolean }).add_to_cart).toBeTruthy();

            // event object in logger section
            logService.setConfig({
                mock: {
                    event: {
                        payment: true
                    }
                }
            });
            expect((logger.loggerInformations[0].event as { [name: string]: boolean }).payment).toBeTruthy();

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
            expect((logger.loggerInformations[0].event as { [name: string]: boolean }).payment).toBeTruthy();
        });

        it("should log an error when invalid 'event' value is provided", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
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
                // tslint:disable-next-line: no-any
                event: 'info' as any
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
                        // tslint:disable-next-line: no-any
                        test: 'info' as any
                    }
                },
                debug: {
                    // Invalid event value
                    event: 'info'
                }
            });

            expect(console.error)
                .toHaveBeenCalledWith('Invalid logging configuration, only one wildcard character is allowed in category name.');
            expect(console.error).toHaveBeenCalledWith("Invalid logging configuration, event value 'info' is not supported.");
            expect(console.error)
                .toHaveBeenCalledWith('Invalid logging configuration, only one wildcard character is allowed in category name.');
            expect(console.error).toHaveBeenCalledWith("Invalid logging configuration, event value 'info' is not supported.");
            expect(console.error).toHaveBeenCalledWith("Invalid logging configuration, event value 'info' is not supported.");
        });
    });

    describe('setUserProperties', () => {
        it("should call registered logger provider's 'setUserProperties' method", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'setUserProperties');

            const userId = 'test_user';
            const accountId = 'test_account';

            logService.setUserProperties(userId, accountId);
            expect(loggerProvider.setUserProperties).toHaveBeenCalledWith(userId, accountId);
        });

        it("should not call registered logger provider's 'setUserProperties' method if userId is disabled", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];
            logService.setConfig({
                userId: false
            });

            spyOn(loggerProvider, 'setUserProperties');

            const userId = 'test_user';
            const accountId = 'test_account';

            logService.setUserProperties(userId, accountId);

            // tslint:disable: no-unsafe-any no-any
            expect((loggerProvider.setUserProperties as any).calls.any()).toEqual(false);
            // tslint:enable: no-unsafe-any no-any
        });
    });

    describe('clearUserProperties', () => {
        it("should call registered logger provider's 'clearUserProperties' method if userId is set", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'clearUserProperties');

            const userId = 'test_user';
            const accountId = 'test_account';

            logService.setUserProperties(userId, accountId);
            logService.clearUserProperties();

            expect(loggerProvider.clearUserProperties).toHaveBeenCalled();
        });

        it("should call registered logger provider's 'clearUserProperties' method after setting user properties", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];

            spyOn(loggerProvider, 'clearUserProperties');

            const userId = 'test_user';
            const accountId = 'test_account';

            logService.setUserProperties(userId, accountId);
            logService.setConfig({
                userId: false
            });
            logService.clearUserProperties();

            expect(loggerProvider.clearUserProperties).toHaveBeenCalled();
        });

        it("should not call registered logger provider's 'clearUserProperties' method if userId is disabled", () => {
            TestBed.configureTestingModule({
                providers: [
                    LogService,
                    {
                        provide: LOGGER_PROVIDER,
                        useClass: MockLoggerProvider,
                        multi: true
                    }
                ]
            });

            const logService = TestBed.get<LogService>(LogService) as LogService;
            const loggerProviders = TestBed.get<LoggerProvider[]>(LOGGER_PROVIDER) as LoggerProvider[];
            const loggerProvider = loggerProviders[0];
            logService.setConfig({
                userId: false
            });

            spyOn(loggerProvider, 'clearUserProperties');

            logService.clearUserProperties();

            // tslint:disable: no-unsafe-any no-any
            expect((loggerProvider.clearUserProperties as any).calls.any()).toEqual(false);
            // tslint:enable: no-unsafe-any no-any
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
                    useClass: MockLoggerProvider,
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
        expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Trace, msg, params);

        logger.log(LogLevel.Debug, msg, params);
        expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Debug, msg, params);

        logger.log(LogLevel.Info, msg, params);
        expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Info, msg, params);

        logger.log(LogLevel.Warn, msg, params);
        expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Warn, msg, params);

        logger.log(LogLevel.Error, msg, params);
        expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Error, msg, params);

        logger.log(LogLevel.Critical, msg, params);
        expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Critical, msg, params);

        logger.log(LogLevel.None, msg, params);
        expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.None, msg, params);

        logService.setConfig({
            logLevel: {
                default: 'info'
            }
        });
        logger.log(LogLevel.Info, msg, params);
        expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Info, msg, params);

        logService.setConfig({
            mock: {
                logLevel: 'warn'
            }
        });
        logger.log(LogLevel.Warn, msg, params);
        expect(loggerInformation.logger.log).toHaveBeenCalledWith(LogLevel.Warn, msg, params);

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

        // tslint:disable: no-unsafe-any no-any
        expect((loggerInformation.logger.log as any).calls.any()).toEqual(false);
        // tslint:enable: no-unsafe-any no-any
    });

    it("should call registered loggers's 'startTrackPage' method", () => {
        const loggerInformation = logger.loggerInformations[0];
        spyOn(loggerInformation.logger, 'startTrackPage');

        const pageName = 'home';

        logger.startTrackPage(pageName);
        expect(loggerInformation.logger.startTrackPage).toHaveBeenCalledWith(pageName);
    });

    it("should not call registered loggers's 'startTrackPage' method if disabled", () => {
        const loggerInformation = logger.loggerInformations[0];
        logService.setConfig({
            pageView: false
        });

        spyOn(loggerInformation.logger, 'startTrackPage');

        logger.startTrackPage('home');

        // tslint:disable: no-unsafe-any no-any
        expect((loggerInformation.logger.startTrackPage as any).calls.any()).toEqual(false);
        // tslint:enable: no-unsafe-any no-any
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
        expect(loggerInformation.logger.stopTrackPage).toHaveBeenCalledWith(pageName, props);
    });

    it("should not call registered loggers's 'stopTrackPage' method if disabled", () => {
        const loggerInformation = logger.loggerInformations[0];
        logService.setConfig({
            pageView: false
        });

        spyOn(loggerInformation.logger, 'stopTrackPage');

        logger.startTrackPage('home');
        logger.stopTrackPage('home');

        // tslint:disable: no-unsafe-any no-any
        expect((loggerInformation.logger.stopTrackPage as any).calls.any()).toEqual(false);
        // tslint:enable: no-unsafe-any no-any
    });

    it("should call registered loggers's 'trackPageView' method", () => {
        const loggerInformation = logger.loggerInformations[0];

        spyOn(loggerInformation.logger, 'trackPageView');

        const props = {
            name: 'home',
            uri: '/home'
        };

        logger.trackPageView(props);
        expect(loggerInformation.logger.trackPageView).toHaveBeenCalledWith(props);
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

        // tslint:disable: no-unsafe-any no-any
        expect((loggerInformation.logger.trackPageView as any).calls.any()).toEqual(false);
        // tslint:enable: no-unsafe-any no-any
    });

    it("should call registered loggers's 'startTrackEvent' method", () => {
        const loggerInformation = logger.loggerInformations[0];

        spyOn(loggerInformation.logger, 'startTrackEvent');

        const eventName = 'event1';

        logger.startTrackEvent(eventName);
        expect(loggerInformation.logger.startTrackEvent).toHaveBeenCalledWith(eventName);
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
        // tslint:disable: no-unsafe-any no-any
        expect((loggerInformation.logger.startTrackEvent as any).calls.any()).toEqual(false);
        // tslint:enable: no-unsafe-any no-any
    });

    it("should call registered loggers's 'stopTrackEvent' method", () => {
        const loggerInformation = logger.loggerInformations[0];

        spyOn(loggerInformation.logger, 'stopTrackEvent');

        const eventName = 'event1';
        const props = { eventCategory: 'test' };

        logger.startTrackEvent(eventName);
        logger.stopTrackEvent(eventName, props);
        expect(loggerInformation.logger.stopTrackEvent).toHaveBeenCalledWith(eventName, props);
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

        // tslint:disable: no-unsafe-any no-any
        expect((loggerInformation.logger.stopTrackEvent as any).calls.any()).toEqual(false);
        // tslint:enable: no-unsafe-any no-any
    });

    it("should call registered loggers's 'trackEvent' method", () => {
        const loggerInformation = logger.loggerInformations[0];

        spyOn(loggerInformation.logger, 'trackEvent');

        const props = {
            name: 'event1',
            eventCategory: 'test'
        };

        logger.trackEvent(props);
        expect(loggerInformation.logger.trackEvent).toHaveBeenCalledWith(props);
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

        // tslint:disable: no-unsafe-any no-any
        expect((loggerInformation.logger.trackEvent as any).calls.any()).toEqual(false);
        // tslint:enable: no-unsafe-any no-any
    });

    it("should call registered loggers's 'flush' method", () => {
        const loggerInformation = logger.loggerInformations[0];
        spyOn(loggerInformation.logger, 'flush');

        logger.flush();
        expect(loggerInformation.logger.flush).toHaveBeenCalled();
    });

    it("should return empty 'loggerInformations' array if it is null", () => {
        // tslint:disable-next-line: no-any
        logger.loggerInformations = null as unknown as any;

        expect(Array.isArray(logger.loggerInformations)).toBeTruthy();
    });
});
