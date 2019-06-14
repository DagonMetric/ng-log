/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable:no-console
// tslint:disable: no-any

import { LogLevel } from './log-level';
import { Logger } from './logger';
import { TrackEventRequest } from './track-event-request';
import { TrackPageViewRequest } from './track-page-view-request';

/**
 * Console logger implementation for `Logger`.
 */
export class ConsoleLogger implements Logger {
    private readonly _eventTimingMap: Map<string, number> = new Map<string, number>();
    private _currentUser?: string;

    constructor(readonly name: string) { }

    log(logLevel: LogLevel, message?: string | Error, ...optionalParams: any[]): void {
        if (logLevel === LogLevel.None) {
            return;
        }

        switch (logLevel) {
            case LogLevel.Trace: {
                if (typeof console.trace === 'function') {
                    console.trace(message, ...optionalParams);
                } else if (typeof console.debug === 'function') {
                    console.debug(message, ...optionalParams);
                } else {
                    console.log(message, ...optionalParams);
                }
                break;
            }
            case LogLevel.Debug: {
                if (typeof console.debug === 'function') {
                    console.debug(message, ...optionalParams);
                } else {
                    console.log(message, ...optionalParams);
                }
                break;
            }
            case LogLevel.Info: {
                console.info(message, ...optionalParams);
                break;
            }
            case LogLevel.Warn: {
                console.warn(message, ...optionalParams);
                break;
            }
            case LogLevel.Error: {
                console.error(message, ...optionalParams);
                break;
            }
            case LogLevel.Critical: {
                console.error(message, ...optionalParams);
                break;
            }
            default: {
                console.log(message, ...optionalParams);
            }
        }
    }

    trace(message?: string, ...optionalParams: any[]): void {
        this.log(LogLevel.Trace, message, ...optionalParams);
    }

    debug(message: string, ...optionalParams: any[]): void {
        this.log(LogLevel.Debug, message, ...optionalParams);
    }

    info(message: string, ...optionalParams: any[]): void {
        this.log(LogLevel.Info, message, ...optionalParams);
    }

    warn(message: string, ...optionalParams: any[]): void {
        this.log(LogLevel.Warn, message, ...optionalParams);
    }

    error(message: string | Error, ...optionalParams: any[]): void {
        this.log(LogLevel.Error, message, ...optionalParams);
    }

    fatal(message: string | Error, ...optionalParams: any[]): void {
        this.log(LogLevel.Critical, message, ...optionalParams);
    }

    startTrackPage(name?: string): void {
        if (name) {
            this._eventTimingMap.set(`page_view_${name}`, Date.now());
        }
    }

    stopTrackPage(name?: string, properties?: TrackPageViewRequest): void {
        const start = this._eventTimingMap.get(`page_view_${name}`);
        if (name && start != null) {
            this._eventTimingMap.delete(`page_view_${name}`);
            const duration = Date.now() - start;
            const suffix = properties != null ? ', properties: ' : '';
            this.log(LogLevel.Debug, `PAGE_VIEW: ${name}, duration: ${duration}${suffix}`, properties);
        }
    }

    trackPageView(name?: string, properties?: TrackPageViewRequest): void {
        const suffix = properties != null ? ', properties: ' : '';
        this.log(LogLevel.Debug, `PAGE_VIEW: ${name}${suffix}`, properties);
    }

    startTrackEvent(name: string): void {
        this._eventTimingMap.set(`${name}`, Date.now());
    }

    stopTrackEvent(name: string, properties?: TrackEventRequest): void {
        const start = this._eventTimingMap.get(`${name}`);
        if (start != null) {
            this._eventTimingMap.delete(name);
            const duration = Date.now() - start;
            const suffix = properties != null ? ', properties: ' : '';
            this.log(LogLevel.Debug, `EVENT: ${name}, duration: ${duration}${suffix}`, properties);
        }
    }

    trackEvent(name: string, properties?: TrackEventRequest): void {
        const suffix = properties != null ? ', properties: ' : '';
        this.log(LogLevel.Debug, `EVENT: ${name}${suffix}`, properties);
    }

    setAuthenticatedUserContext(userId: string, accountId?: string): void {
        this.log(LogLevel.Debug, `Setting authenticated user context, userId: ${userId}, accountId: ${accountId}.`);
        this._currentUser = userId;
    }

    clearAuthenticatedUserContext(): void {
        if (this._currentUser) {
            this.log(LogLevel.Debug, `Clearing authenticated user context for userId: ${this._currentUser}.`);
            this._currentUser = undefined;
        }
    }

    flush(): void {
        // this.log(LogLevel.Debug, "The 'flush' method is called.");
    }
}
