/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable:no-console
// tslint:disable: no-any

import { Logger, LogLevel, TrackEventRequest, TrackPageViewRequest } from '@dagonmetric/ng-log';

/**
 * Console logger implementation for `Logger`.
 */
export class ConsoleLogger extends Logger {
    private readonly _eventTimingMap: Map<string, number> = new Map<string, number>();

    constructor(readonly name: string) {
        super();
    }

    log(logLevel: LogLevel, message?: string | Error, ...optionalParams: any[]): void {
        if (logLevel === LogLevel.None) {
            return;
        }

        if (logLevel === LogLevel.Trace) {
            console.trace(message, ...optionalParams);
        } else if (logLevel === LogLevel.Debug) {
            console.debug(message, ...optionalParams);
        } else if (logLevel === LogLevel.Info) {
            console.info(message, ...optionalParams);
        } else if (logLevel === LogLevel.Warn) {
            console.warn(message, ...optionalParams);
        } else if (logLevel === LogLevel.Error || logLevel === LogLevel.Critical) {
            console.error(message, ...optionalParams);
        }
    }

    startTrackPage(name?: string): void {
        if (name) {
            this._eventTimingMap.set(`page_view_${name}`, Date.now());
        }
    }

    stopTrackPage(name?: string, properties?: TrackPageViewRequest): void {
        if (!name) {
            return;
        }

        const start = this._eventTimingMap.get(`page_view_${name}`);
        if (start != null) {
            this._eventTimingMap.delete(`page_view_${name}`);
            const duration = Date.now() - start;
            const suffix = properties != null ? ', properties: ' : '.';
            console.log(`PAGE_VIEW: ${name}, duration: ${duration}${suffix}`, properties);
        }
    }

    trackPageView(name?: string, properties?: TrackPageViewRequest): void {
        if (!name) {
            return;
        }

        const suffix = properties != null ? ', properties: ' : '.';
        console.log(`PAGE_VIEW: ${name}${suffix}`, properties);
    }

    startTrackEvent(name: string): void {
        this._eventTimingMap.set(`${name}`, Date.now());
    }

    stopTrackEvent(name: string, properties?: TrackEventRequest): void {
        const start = this._eventTimingMap.get(`${name}`);
        if (start != null) {
            this._eventTimingMap.delete(name);
            const duration = Date.now() - start;
            const suffix = properties != null ? ', properties: ' : '.';
            console.log(`EVENT: ${name}, duration: ${duration}${suffix}`, properties);
        }
    }

    trackEvent(name: string, properties?: TrackEventRequest): void {
        const suffix = properties != null ? ', properties: ' : '.';
        console.log(`EVENT: ${name}${suffix}`, properties);
    }

    flush(): void {
        // Do nothing
    }
}
