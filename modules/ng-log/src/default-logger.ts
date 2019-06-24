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

import { EventInfo } from './event-info';
import { PageViewInfo } from './page-view-info';

/**
 * Internal default logger implementation for `Logger`.
 */
export class DefaultLogger extends Logger {
    private _loggerInformations?: LoggerInformation[];

    get loggerInformations(): LoggerInformation[] {
        return this._loggerInformations || [];
    }

    set loggerInformations(value: LoggerInformation[]) {
        this._loggerInformations = value;
    }

    log(logLevel: LogLevel, message?: string | Error, ...optionalParams: any[]): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isLogLevelEnabled(loggerInformation, logLevel)) {
                continue;
            }

            loggerInformation.logger.log(logLevel, message, ...optionalParams);
        }
    }

    startTrackPage(name: string): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isPageViewEnabled(loggerInformation)) {
                continue;
            }

            loggerInformation.logger.startTrackPage(name);
        }
    }

    stopTrackPage(name: string, properties?: PageViewInfo): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isPageViewEnabled(loggerInformation)) {
                continue;
            }

            loggerInformation.logger.stopTrackPage(name, properties);
        }
    }

    trackPageView(name: string, properties?: PageViewInfo): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isPageViewEnabled(loggerInformation)) {
                continue;
            }

            loggerInformation.logger.trackPageView(name, properties);
        }
    }

    startTrackEvent(name: string): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isEventEnabled(loggerInformation, name)) {
                continue;
            }

            loggerInformation.logger.startTrackEvent(name);
        }
    }

    stopTrackEvent(name: string, properties?: EventInfo): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isEventEnabled(loggerInformation, name)) {
                continue;
            }

            loggerInformation.logger.stopTrackEvent(name, properties);
        }
    }

    trackEvent(name: string, properties?: EventInfo): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isEventEnabled(loggerInformation, name)) {
                continue;
            }

            loggerInformation.logger.trackEvent(name, properties);
        }
    }

    flush(): void {
        for (const loggerInformation of this.loggerInformations) {
            loggerInformation.logger.flush();
        }
    }

    private isLogLevelEnabled(loggerInformation: LoggerInformation, level: LogLevel): boolean {
        if (loggerInformation.minLevel != null &&
            level < loggerInformation.minLevel) {
            return false;
        }

        return true;
    }

    private isEventEnabled(loggerInformation: LoggerInformation, eventName: string): boolean {
        if (loggerInformation.event) {
            const evtOptions = loggerInformation.event;
            const foundDisabled = Object.keys(evtOptions).find(key => key === eventName && evtOptions[key] === false);

            return foundDisabled == null;
        }

        return true;
    }

    private isPageViewEnabled(loggerInformation: LoggerInformation): boolean {
        if (loggerInformation.pageView != null) {
            return loggerInformation.pageView;
        }

        return true;
    }
}
