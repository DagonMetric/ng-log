/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable: no-any

import { LogLevel } from './log-level';
import { Logger } from './logger';
import { LoggerInformation } from './logger-information';

import { TrackEventRequest } from './track-event-request';
import { TrackPageViewRequest } from './track-page-view-request';

/**
 * Internal default logger implementation for `Logger`.
 */
export class DefaultLogger implements Logger {
    private _loggerInformations: LoggerInformation[] | undefined;

    get loggerInformations(): LoggerInformation[] {
        return this._loggerInformations || [];
    }

    set loggerInformations(value: LoggerInformation[]) {
        this._loggerInformations = value;
    }

    log(logLevel: LogLevel, message?: string | Error, ...optionalParams: any[]): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isLogEnabledInternal(logLevel, loggerInformation)) {
                continue;
            }

            loggerInformation.logger.log(logLevel, message, ...optionalParams);
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
        for (const loggerInformation of this.loggerInformations) {
            loggerInformation.logger.startTrackPage(name);
        }
    }

    stopTrackPage(name?: string, properties?: TrackPageViewRequest): void {
        for (const loggerInformation of this.loggerInformations) {
            loggerInformation.logger.stopTrackPage(name, properties);
        }
    }

    trackPageView(name?: string, properties?: TrackPageViewRequest): void {
        for (const loggerInformation of this.loggerInformations) {
            loggerInformation.logger.trackPageView(name, properties);
        }
    }

    startTrackEvent(name: string): void {
        for (const loggerInformation of this.loggerInformations) {
            loggerInformation.logger.startTrackEvent(name);
        }
    }

    stopTrackEvent(name: string, properties?: TrackEventRequest): void {
        for (const loggerInformation of this.loggerInformations) {
            loggerInformation.logger.stopTrackEvent(name, properties);
        }
    }

    trackEvent(name: string, properties?: TrackEventRequest): void {
        for (const loggerInformation of this.loggerInformations) {
            loggerInformation.logger.trackEvent(name, properties);
        }
    }

    setAuthenticatedUserContext(userId: string, accountId?: string): void {
        for (const loggerInformation of this.loggerInformations) {
            loggerInformation.logger.setAuthenticatedUserContext(userId, accountId);
        }
    }

    clearAuthenticatedUserContext(): void {
        for (const loggerInformation of this.loggerInformations) {
            loggerInformation.logger.clearAuthenticatedUserContext();
        }
    }

    flush(): void {
        for (const loggerInformation of this.loggerInformations) {
            loggerInformation.logger.flush();
        }
    }

    private isLogEnabledInternal(level: LogLevel, loggerInformation: LoggerInformation): boolean {
        if (loggerInformation.minLevel != null &&
            level < loggerInformation.minLevel) {
            return false;
        }

        if (loggerInformation.filter) {
            return loggerInformation.filter(loggerInformation.providerType, loggerInformation.category, level);
        }

        return true;
    }
}
