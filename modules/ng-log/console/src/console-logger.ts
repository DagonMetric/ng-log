/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable:no-console

import { EventInfo, EventTimingInfo, Logger, LogInfo, LogLevel, PageViewInfo, PageViewTimingInfo } from '@dagonmetric/ng-log';

/**
 * Console logging implementation for `Logger`.
 */
export class ConsoleLogger extends Logger {
    private readonly _eventTiming: Map<string, number> = new Map<string, number>();

    constructor(readonly name?: string, public enableDebug?: boolean) {
        super();
    }

    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void {
        if (logLevel === LogLevel.None) {
            return;
        }

        if (logLevel === LogLevel.Trace) {
            logInfo ? console.trace(message, logInfo) : console.trace(message);
        } else if (logLevel === LogLevel.Debug) {
            logInfo ? console.debug(message, logInfo) : console.debug(message);
        } else if (logLevel === LogLevel.Info) {
            logInfo ? console.info(message, logInfo) : console.info(message);
        } else if (logLevel === LogLevel.Warn) {
            logInfo ? console.warn(message, logInfo) : console.warn(message);
        } else if (logLevel === LogLevel.Error || logLevel === LogLevel.Critical) {
            logInfo ? console.error(message, logInfo) : console.error(message);
        }
    }

    startTrackPage(name?: string): void {
        if (name == null && typeof window === 'object' && window.document) {
            name = window.document.title;
        }

        if (!name) {
            console.error('Could not detect document title, please provide name parameter.');

            return;
        }

        if (this._eventTiming.get(name) != null) {
            console.error(`The 'startTrackPage' was called more than once for this event without calling stop, name: ${name}.`);

            return;
        }

        const start = +new Date();
        this._eventTiming.set(name, start);

        if (this.enableDebug) {
            console.log(`START_TRACK_PAGE_VIEW: ${name}, start: ${start}.`);
        }
    }

    stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void {
        if (name == null && typeof window === 'object' && window.document) {
            name = window.document.title;
        }

        if (!name) {
            console.error('Could not detect document title, please provide name parameter.');

            return;
        }

        const start = this._eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackPage' was called without a corresponding start, name: ${name}.`);

            return;
        }

        if (this.enableDebug) {
            const duration = Math.max(+new Date() - start, 0);
            const msg = `STOP_TRACK_PAGE_VIEW: ${name}, start: ${start}, duration: ${duration}.`;
            pageViewInfo ? console.log(msg, pageViewInfo) : console.log(msg);
        }

        this._eventTiming.delete(name);
    }

    trackPageView(pageViewInfo?: PageViewInfo): void {
        let name = pageViewInfo && pageViewInfo.name ? pageViewInfo.name : undefined;
        if (name == null && typeof window === 'object' && window.document) {
            name = window.document.title;
        }

        if (!name) {
            console.error('Could not detect document title, please provide name parameter.');

            return;
        }

        if (this.enableDebug) {
            const msg = `TRACK_PAGE_VIEW: ${name}.`;
            console.log(msg, pageViewInfo);
        }
    }

    startTrackEvent(name: string): void {
        if (this._eventTiming.get(name) != null) {
            console.error(`The 'startTrackEvent' was called more than once for this event without calling stop, name: ${name}.`);

            return;
        }

        const start = +new Date();

        this._eventTiming.set(name, start);

        if (this.enableDebug) {
            console.log(`START_TRACK_EVENT: ${name}, start: ${start}.`);
        }
    }

    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void {
        const start = this._eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackEvent' was called without a corresponding start, name: ${name}.`);

            return;
        }

        if (this.enableDebug) {
            const duration = Math.max(+new Date() - start, 0);
            const msg = `STOP_TRACK_EVENT: ${name}, start: ${start}, duration: ${duration}.`;
            eventInfo ? console.log(msg, eventInfo) : console.log(msg);
        }

        this._eventTiming.delete(name);
    }

    trackEvent(eventInfo: EventInfo): void {
        if (this.enableDebug) {
            console.log(`TRACK_EVENT: ${eventInfo.name}.`, eventInfo);
        }
    }

    flush(): void {
        if (this.enableDebug) {
            console.log('FLUSH');
        }
    }
}
