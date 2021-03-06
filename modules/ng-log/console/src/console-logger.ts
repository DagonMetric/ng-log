/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-console */

import { InjectionToken } from '@angular/core';

import {
    EventInfo,
    EventTimingInfo,
    LogInfo,
    LogLevel,
    Logger,
    PageViewInfo,
    PageViewTimingInfo
} from '@dagonmetric/ng-log';

export interface ConsoleLoggerOptions {
    enableDebug: boolean;
}

export const CONSOLE_LOGGER_OPTIONS = new InjectionToken<ConsoleLoggerOptions>('ConsoleLoggerOptions');

/**
 * Console logging implementation for `Logger`.
 */
export class ConsoleLogger extends Logger {
    private readonly eventTiming: Map<string, number> = new Map<string, number>();

    constructor(readonly name: string, public options: ConsoleLoggerOptions) {
        super();
    }

    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void {
        if (logLevel === LogLevel.None) {
            return;
        }

        if (logLevel === LogLevel.Trace) {
            if (logInfo) {
                // eslint-disable-next-line no-restricted-syntax
                console.trace(message, logInfo);
            } else {
                // eslint-disable-next-line no-restricted-syntax
                console.trace(message);
            }
        } else if (logLevel === LogLevel.Debug) {
            if (logInfo) {
                // eslint-disable-next-line no-restricted-syntax
                console.debug(message, logInfo);
            } else {
                // eslint-disable-next-line no-restricted-syntax
                console.debug(message);
            }
        } else if (logLevel === LogLevel.Info) {
            if (logInfo) {
                // eslint-disable-next-line no-restricted-syntax
                console.info(message, logInfo);
            } else {
                // eslint-disable-next-line no-restricted-syntax
                console.info(message);
            }
        } else if (logLevel === LogLevel.Warn) {
            if (logInfo) {
                console.warn(message, logInfo);
            } else {
                console.warn(message);
            }
        } else if (logLevel === LogLevel.Error || logLevel === LogLevel.Critical) {
            if (logInfo) {
                console.error(message, logInfo);
            } else {
                console.error(message);
            }
        }
    }

    startTrackPage(name?: string): void {
        if (!name) {
            return;
        }

        if (this.eventTiming.get(name) != null) {
            console.error(
                `The 'startTrackPage' was called more than once for this event without calling stop, name: ${name}.`
            );

            return;
        }

        const start = +new Date();
        this.eventTiming.set(name, start);

        if (this.options.enableDebug) {
            console.log(`START_TRACK_PAGE_VIEW: ${name}, start: ${start}.`);
        }
    }

    stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void {
        if (!name) {
            return;
        }

        const start = this.eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackPage' was called without a corresponding start, name: ${name}.`);

            return;
        }

        if (this.options.enableDebug) {
            const duration = Math.max(+new Date() - start, 0);
            const msg = `STOP_TRACK_PAGE_VIEW: ${name}, start: ${start}, duration: ${duration}.`;
            if (pageViewInfo) {
                console.log(msg, pageViewInfo);
            } else {
                console.log(msg);
            }
        }

        this.eventTiming.delete(name);
    }

    trackPageView(pageViewInfo?: PageViewInfo): void {
        const name = pageViewInfo && pageViewInfo.name ? pageViewInfo.name : undefined;

        if (!name) {
            return;
        }

        if (this.options.enableDebug) {
            const msg = `TRACK_PAGE_VIEW: ${name}.`;
            console.log(msg, pageViewInfo);
        }
    }

    startTrackEvent(name: string): void {
        if (this.eventTiming.get(name) != null) {
            console.error(
                `The 'startTrackEvent' was called more than once for this event without calling stop, name: ${name}.`
            );

            return;
        }

        const start = +new Date();

        this.eventTiming.set(name, start);

        if (this.options.enableDebug) {
            console.log(`START_TRACK_EVENT: ${name}, start: ${start}.`);
        }
    }

    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void {
        const start = this.eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackEvent' was called without a corresponding start, name: ${name}.`);

            return;
        }

        if (this.options.enableDebug) {
            const duration = Math.max(+new Date() - start, 0);
            const msg = `STOP_TRACK_EVENT: ${name}, start: ${start}, duration: ${duration}.`;
            if (eventInfo) {
                console.log(msg, eventInfo);
            } else {
                console.log(msg);
            }
        }

        this.eventTiming.delete(name);
    }

    trackEvent(eventInfo: EventInfo): void {
        if (this.options.enableDebug) {
            console.log(`TRACK_EVENT: ${eventInfo.name}.`, eventInfo);
        }
    }

    flush(): void {
        if (this.options.enableDebug) {
            console.log('FLUSH');
        }
    }
}
