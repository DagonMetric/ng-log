/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable:no-console

import { EventInfo, Logger, LogLevel, PageViewInfo } from '@dagonmetric/ng-log';

/**
 * Console logging implementation for `Logger`.
 */
export class ConsoleLogger extends Logger {
    private readonly _eventTiming: Map<string, number> = new Map<string, number>();

    constructor(readonly name: string, public verboseLogging?: boolean) {
        super();
    }

    // tslint:disable-next-line: no-any
    log(logLevel: LogLevel, message?: string | Error, optionalParams?: any): void {
        if (logLevel === LogLevel.None) {
            return;
        }

        if (logLevel === LogLevel.Trace) {
            console.trace(message, optionalParams);
        } else if (logLevel === LogLevel.Debug) {
            console.debug(message, optionalParams);
        } else if (logLevel === LogLevel.Info) {
            console.info(message, optionalParams);
        } else if (logLevel === LogLevel.Warn) {
            console.warn(message, optionalParams);
        } else if (logLevel === LogLevel.Error || logLevel === LogLevel.Critical) {
            console.error(message, optionalParams);
        }
    }

    startTrackPage(name?: string): void {
        if (name == null && typeof window === 'object' && window.document) {
            name = window.document && window.document.title || '';
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

        if (this.verboseLogging) {
            console.log(`START_TRACK_PAGE_VIEW: ${name}, start: ${start}`);
        }
    }

    stopTrackPage(name?: string, properties?: PageViewInfo): void {
        if (name == null && typeof window === 'object' && window.document) {
            name = window.document && window.document.title || '';
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

        if (this.verboseLogging) {
            const duration = ConsoleLogger.getDuration(start);
            const suffix = properties != null ? ', properties: ' : '.';
            console.log(`STOP_TRACK_PAGE_VIEW: ${name}, start: ${start}, duration: ${duration}${suffix}`, properties);
        }

        this._eventTiming.delete(`page_view_${name}`);
    }

    trackPageView(name?: string, properties?: PageViewInfo): void {
        if (name == null && typeof window === 'object' && window.document) {
            name = window.document && window.document.title || '';
        }

        if (!name) {
            console.error('Could not detect document title, please provide name parameter.');

            return;
        }

        if (this.verboseLogging) {
            const suffix = properties != null ? ', properties: ' : '.';
            console.log(`TRACK_PAGE_VIEW: ${name}${suffix}`, properties);
        }
    }

    startTrackEvent(name: string): void {
        if (this._eventTiming.get(name) != null) {
            console.error(`The 'startTrackEvent' was called more than once for this event without calling stop, name: ${name}.`);

            return;
        }

        const start = +new Date();

        this._eventTiming.set(name, start);

        if (this.verboseLogging) {
            console.log(`START_TRACK_EVENT: ${name}, start: ${start}`);
        }
    }

    stopTrackEvent(name: string, properties?: EventInfo): void {
        const start = this._eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackEvent' was called without a corresponding start, name: ${name}.`);

            return;
        }

        if (this.verboseLogging) {
            const duration = ConsoleLogger.getDuration(start);
            const suffix = properties != null ? ', properties: ' : '.';
            console.log(`STOP_TRACK_EVENT: ${name}, start: ${start}, duration: ${duration}${suffix}`, properties);
        }

        this._eventTiming.delete(name);
    }

    trackEvent(name: string, properties?: EventInfo): void {
        if (this.verboseLogging) {
            const suffix = properties != null ? ', properties: ' : '.';
            console.log(`TRACK_EVENT: ${name}${suffix}`, properties);
        }
    }

    flush(): void {
        if (this.verboseLogging) {
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
