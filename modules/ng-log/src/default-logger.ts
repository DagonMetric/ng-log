/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { EventInfo, EventTimingInfo } from './event-info';
import { LogInfo } from './log-info';
import { LogLevel } from './log-level';
import { Logger } from './logger';
import { LoggerInformation } from './logger-information';
import { PageViewInfo, PageViewTimingInfo } from './page-view-info';

/**
 * Internal logging implementation for `Logger`.
 */
export class DefaultLogger extends Logger {
    loggerInformations: LoggerInformation[] = [];

    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isLogLevelEnabled(loggerInformation, logLevel)) {
                continue;
            }

            loggerInformation.logger.log(logLevel, message, logInfo);
        }
    }

    startTrackPage(name?: string): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isPageViewEnabled(loggerInformation)) {
                continue;
            }

            loggerInformation.logger.startTrackPage(name);
        }
    }

    stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isPageViewEnabled(loggerInformation)) {
                continue;
            }

            loggerInformation.logger.stopTrackPage(name, pageViewInfo);
        }
    }

    trackPageView(pageViewInfo?: PageViewInfo): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isPageViewEnabled(loggerInformation)) {
                continue;
            }

            loggerInformation.logger.trackPageView(pageViewInfo);
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

    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isEventEnabled(loggerInformation, name)) {
                continue;
            }

            loggerInformation.logger.stopTrackEvent(name, eventInfo);
        }
    }

    trackEvent(eventInfo: EventInfo): void {
        for (const loggerInformation of this.loggerInformations) {
            if (!this.isEventEnabled(loggerInformation, eventInfo.name)) {
                continue;
            }

            loggerInformation.logger.trackEvent(eventInfo);
        }
    }

    flush(): void {
        for (const loggerInformation of this.loggerInformations) {
            loggerInformation.logger.flush();
        }
    }

    private isLogLevelEnabled(loggerInformation: LoggerInformation, level: LogLevel): boolean {
        if (loggerInformation.minLevel != null && level < loggerInformation.minLevel) {
            return false;
        }

        return true;
    }

    private isPageViewEnabled(loggerInformation: LoggerInformation): boolean {
        if (loggerInformation.pageView != null) {
            return loggerInformation.pageView;
        }

        return true;
    }

    private isEventEnabled(loggerInformation: LoggerInformation, eventName: string): boolean {
        if (loggerInformation.event) {
            const evtOptions = loggerInformation.event;

            return Object.keys(evtOptions).find((key) => key === eventName && evtOptions[key] === false) == null;
        }

        return true;
    }
}
