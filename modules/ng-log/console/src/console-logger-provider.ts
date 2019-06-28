/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import {
    EventInfo,
    EventTimingInfo,
    Logger,
    LoggerBase,
    LoggerProvider,
    LogInfo,
    LogLevel,
    PageViewInfo,
    PageViewTimingInfo
} from '@dagonmetric/ng-log';

import { ConsoleLogger } from './console-logger';

export interface ConsoleLoggerOptions {
    enableDebug: boolean;
}

export const CONSOLE_LOGGER_OPTIONS = new InjectionToken<ConsoleLoggerOptions>('ConsoleLoggerOptions');

/**
 * Logger provider implementation for `ConsoleLogger`.
 */
@Injectable({
    providedIn: 'root'
})
export class ConsoleLoggerProvider extends LoggerBase implements LoggerProvider {
    private readonly _loggers: { [key: string]: ConsoleLogger | null } = {};
    private readonly _options: ConsoleLoggerOptions;

    private _userId: string | undefined;
    private _accountId: string | undefined;
    private _currentLogger: ConsoleLogger | undefined;

    get name(): string {
        return 'console';
    }

    constructor(
        @Optional() @Inject(CONSOLE_LOGGER_OPTIONS) options?: ConsoleLoggerOptions) {
        super();
        this._options = options || { enableDebug: false };
    }

    createLogger(category: string): Logger {
        const logger = this._loggers[category];
        if (logger) {
            return logger;
        }

        const newLogger = new ConsoleLogger(this._options.enableDebug);

        this._loggers[category] = newLogger;

        return newLogger;
    }

    setUserProperties(userId: string, accountId?: string): void {
        this._userId = userId;
        this._accountId = accountId;

        if (this._options.enableDebug) {
            // tslint:disable-next-line: no-console
            console.log(`SET_USER_PROPERTIES: userId: ${userId}, accountId: ${accountId}`);
        }
    }

    clearUserProperties(): void {
        if (this._options.enableDebug) {
            // tslint:disable-next-line: no-console
            console.log(`CLEAR_USER_PROPERTIES: userId: ${this._userId}, accountId: ${this._accountId}`);
        }

        this._userId = undefined;
        this._accountId = undefined;
    }

    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void {
        this.currentLogger.log(logLevel, message, logInfo);
    }

    startTrackPage(name?: string): void {
        this.currentLogger.startTrackPage(name);
    }

    stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void {
        this.currentLogger.stopTrackPage(name, pageViewInfo);
    }

    trackPageView(pageViewInfo?: PageViewInfo): void {
        this.currentLogger.trackPageView(pageViewInfo);
    }

    startTrackEvent(name: string): void {
        this.currentLogger.startTrackEvent(name);
    }

    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void {
        this.currentLogger.stopTrackEvent(name, eventInfo);
    }

    trackEvent(eventInfo: EventInfo): void {
        this.currentLogger.trackEvent(eventInfo);
    }

    flush(): void {
        this.currentLogger.flush();
    }

    private get currentLogger(): ConsoleLogger {
        if (this._currentLogger) {
            return this._currentLogger;
        }

        this._currentLogger = new ConsoleLogger(this._options.enableDebug);

        return this._currentLogger;
    }
}
