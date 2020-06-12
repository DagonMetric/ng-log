/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable, Optional } from '@angular/core';

import {
    EventInfo,
    EventTimingInfo,
    LogInfo,
    LogLevel,
    Logger,
    LoggerProvider,
    PageViewInfo,
    PageViewTimingInfo
} from '@dagonmetric/ng-log';

import { CONSOLE_LOGGER_OPTIONS, ConsoleLogger, ConsoleLoggerOptions } from './console-logger';

/**
 * Logger provider implementation for `ConsoleLogger`.
 */
@Injectable({
    providedIn: 'root'
})
export class ConsoleLoggerProvider extends Logger implements LoggerProvider {
    private readonly options: ConsoleLoggerOptions;

    private userId?: string;
    private accountId?: string;
    private currentLoggerInternal?: ConsoleLogger;

    get name(): string {
        return 'console';
    }

    get currentLogger(): ConsoleLogger {
        if (this.currentLoggerInternal) {
            return this.currentLoggerInternal;
        }

        this.currentLoggerInternal = new ConsoleLogger('', this.options);

        return this.currentLoggerInternal;
    }

    constructor(@Optional() @Inject(CONSOLE_LOGGER_OPTIONS) options?: ConsoleLoggerOptions) {
        super();
        this.options = options || { enableDebug: false };
    }

    createLogger(category: string): Logger {
        return new ConsoleLogger(category, this.options);
    }

    destroyLogger(category: string): void {
        // Do nothing
        if (this.options.enableDebug) {
            // eslint-disable-next-line no-console
            console.log(`Destroying logger: ${category}`);
        }
    }

    setUserProperties(userId: string, accountId?: string): void {
        this.userId = userId;
        this.accountId = accountId;

        if (this.options.enableDebug) {
            // eslint-disable-next-line no-console
            console.log(`SET_USER_PROPERTIES: userId: ${userId}, accountId: ${accountId || ''}.`);
        }
    }

    clearUserProperties(): void {
        if (this.options.enableDebug) {
            // eslint-disable-next-line no-console
            console.log(`CLEAR_USER_PROPERTIES: userId: ${this.userId || ''}, accountId: ${this.accountId || ''}.`);
        }

        this.userId = undefined;
        this.accountId = undefined;
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
}
