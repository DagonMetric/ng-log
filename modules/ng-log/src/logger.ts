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
import { PageViewInfo, PageViewTimingInfo } from './page-view-info';

export interface LoggingApi {
    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void;
    trace(message: string | Error, logInfo?: LogInfo): void;
    debug(message: string, logInfo?: LogInfo): void;
    info(message: string, logInfo?: LogInfo): void;
    warn(message: string, logInfo?: LogInfo): void;
    error(message: string | Error, logInfo?: LogInfo): void;
    fatal(message: string | Error, logInfo: LogInfo): void;
    startTrackPage(name?: string): void;
    stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void;
    trackPageView(pageViewInfo?: PageViewInfo): void;
    startTrackEvent(name: string): void;
    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void;
    trackEvent(eventInfo: EventInfo): void;
    flush(): void;
}

/**
 * The logger abstract class.
 */
export abstract class Logger implements LoggingApi {
    /**
     * Logs message or error with log level.
     * @param logLevel The log level.
     * @param message Message string or error object to log.
     * @param logInfo Optional log telemetry info parameter.
     */
    abstract log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void;

    /**
     * Logs that contain the most detailed messages.
     * @param message Message string or error object to log.
     * @param logInfo Optional log telemetry info parameter.
     */
    trace(message: string | Error, logInfo?: LogInfo): void {
        this.log(LogLevel.Trace, message, logInfo);
    }

    /**
     * Logs that are used for interactive investigation during development.
     * @param message Message string to log.
     * @param logInfo Optional log telemetry info parameter.
     */
    debug(message: string, logInfo?: LogInfo): void {
        this.log(LogLevel.Debug, message, logInfo);
    }

    /**
     * Logs that track the general flow of the application. These logs should have long-term value.
     * @param message Message string to log.
     * @param logInfo Optional log telemetry info parameter.
     */
    info(message: string, logInfo?: LogInfo): void {
        this.log(LogLevel.Info, message, logInfo);
    }

    /**
     * Logs that highlight an abnormal or unexpected event in the application flow.
     * @param message Message string to log.
     * @param logInfo Optional log telemetry info parameter.
     */
    warn(message: string, logInfo?: LogInfo): void {
        this.log(LogLevel.Warn, message, logInfo);
    }

    /**
     * Logs that highlight when the current flow of execution is stopped due to a failure.
     * @param message Error description string or object to log.
     * @param logInfo Optional log telemetry info parameter.
     */
    error(message: string | Error, logInfo?: LogInfo): void {
        this.log(LogLevel.Error, message, logInfo);
    }

    /**
     * Logs that describe an unrecoverable application or system crash.
     * @param message Error description string or object to log.
     * @param logInfo Optional log telemetry info parameter.
     */
    fatal(message: string | Error, logInfo: LogInfo): void {
        this.log(LogLevel.Critical, message, logInfo);
    }

    /**
     * Starts timing how long the user views a page. Calls this when the page opens.
     * @param name A string that idenfities this item, unique within the HTML document. Default to document title.
     */
    abstract startTrackPage(name?: string): void;

    /**
     * Logs how long a page was visible, after `startTrackPage`. Calls this when the page closes.
     * @param name The string you used as the name in `startTrackPage`. Default to document title.
     * @param pageViewInfo Additional data for page view.
     */
    abstract stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void;

    /**
     * Logs that a page was viewed.
     * @param pageViewInfo Data for page view.
     */
    abstract trackPageView(pageViewInfo?: PageViewInfo): void;

    /**
     * Starts timing an event. Calls `stopTrackEvent` to log the event when it ends.
     * @param name A string that identifies this event uniquely within the HTML document.
     */
    abstract startTrackEvent(name: string): void;

    /**
     * Logs an event that you started timing with `startTrackEvent`.
     * @param name The string you used to identify this event in `startTrackEvent`.
     * @param eventInfo Additional data for event.
     */
    abstract stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void;

    /**
     * Logs a user action or other occurrence.
     * @param eventInfo Data for event.
     */
    abstract trackEvent(eventInfo: EventInfo): void;

    /**
     * Flushes to send or log data immediately.
     */
    abstract flush(): void;
}
