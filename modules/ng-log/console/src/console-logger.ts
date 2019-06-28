/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable:no-console

import { EventInfo, EventTimingInfo, LoggerBase, LogInfo, LogLevel, PageViewInfo, PageViewTimingInfo } from '@dagonmetric/ng-log';

/**
 * Console logging implementation for `Logger`.
 */
export class ConsoleLogger extends LoggerBase {
    private readonly _eventTiming: Map<string, number> = new Map<string, number>();

    constructor(public enableDebug?: boolean) {
        super();
    }

    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void {
        if (logLevel === LogLevel.None) {
            return;
        }

        if (logLevel === LogLevel.Trace) {
            console.trace(message, logInfo);
        } else if (logLevel === LogLevel.Debug) {
            console.debug(message, logInfo);
        } else if (logLevel === LogLevel.Info) {
            console.info(message, logInfo);
        } else if (logLevel === LogLevel.Warn) {
            console.warn(message, logInfo);
        } else if (logLevel === LogLevel.Error || logLevel === LogLevel.Critical) {
            console.error(message, logInfo);
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
        this._eventTiming.set(`page_view_${name}`, start);

        if (this.enableDebug) {
            console.log(`START_TRACK_PAGE_VIEW: ${name}, start: ${start}`);
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

        const start = this._eventTiming.get(`page_view_${name}`);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackPage' was called without a corresponding start, name: ${name}.`);

            return;
        }

        if (this.enableDebug) {
            const duration = ConsoleLogger.getDuration(start);
            const suffix = pageViewInfo != null ? ', properties: ' : '.';
            console.log(`STOP_TRACK_PAGE_VIEW: ${name}, start: ${start}, duration: ${duration}${suffix}`, pageViewInfo);
        }

        this._eventTiming.delete(`page_view_${name}`);
    }

    trackPageView(pageViewInfo?: PageViewInfo): void {
        let name = pageViewInfo && pageViewInfo.name ? pageViewInfo.name : undefined;
        if (name == null && typeof window === 'object' && window.document) {
            name = window.document.title;
            if (pageViewInfo) {
                pageViewInfo.name = name;
            }
        }

        if (!name) {
            console.error('Could not detect document title, please provide name parameter.');

            return;
        }

        if (this.enableDebug) {
            const suffix = pageViewInfo != null ? ', properties: ' : '.';
            console.log(`TRACK_PAGE_VIEW: ${name}${suffix}`, pageViewInfo);
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
            console.log(`START_TRACK_EVENT: ${name}, start: ${start}`);
        }
    }

    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void {
        const start = this._eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackEvent' was called without a corresponding start, name: ${name}.`);

            return;
        }

        if (this.enableDebug) {
            const duration = ConsoleLogger.getDuration(start);
            const suffix = eventInfo != null ? ', properties: ' : '.';
            console.log(`STOP_TRACK_EVENT: ${name}, start: ${start}, duration: ${duration}${suffix}`, eventInfo);
        }

        this._eventTiming.delete(name);
    }

    trackEvent(eventInfo: EventInfo): void {
        if (this.enableDebug) {
            const suffix = eventInfo != null ? ', properties: ' : '.';
            console.log(`TRACK_EVENT: ${eventInfo.name}${suffix}`, eventInfo);
        }
    }

    flush(): void {
        if (this.enableDebug) {
            console.log('FLUSH');
        }
    }

    private static getDuration(start: number): number | undefined {
        const end = +new Date();

        let duration: number | undefined;

        if (!(isNaN(start) || isNaN(end))) {
            duration = Math.max(end - start, 0);
        }

        return duration;
    }
}
