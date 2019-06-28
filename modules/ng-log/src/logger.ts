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

export interface Logger {
    /**
     * Logs message or error with severity level.
     * @param logLevel The log level.
     * @param message Message string to log.
     * @param logInfo Optional parameters.
     */
    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void;

    /**
     * Logs that contain the most detailed messages.
     * @param message Message string to log.
     * @param logInfo Optional parameters.
     */
    trace(message: string | Error, logInfo?: LogInfo): void;

    /**
     * Logs that are used for interactive investigation during development.
     * @param message Message string to log.
     * @param logInfo Optional parameters.
     */
    debug(message: string, logInfo?: LogInfo): void;

    /**
     * Logs that track the general flow of the application. These logs should have long-term value.
     * @param message Message string to log.
     * @param logInfo Optional parameters.
     */
    info(message: string, logInfo?: LogInfo): void;

    /**
     * Logs that highlight an abnormal or unexpected event in the application flow.
     * @param message Message string to log.
     * @param logInfo Optional parameters.
     */
    warn(message: string, logInfo?: LogInfo): void;

    /**
     * Logs that highlight when the current flow of execution is stopped due to a failure.
     * @param message Error description or exception object to log.
     * @param logInfo Optional parameters.
     */
    error(message: string | Error, logInfo?: LogInfo): void;

    /**
     * Logs that describe an unrecoverable application or system crash.
     * @param message Error description or exception object to log.
     * @param logInfo Optional parameters.
     */
    fatal(message: string | Error, logInfo: LogInfo): void;

    /**
     * Starts timing how long the user views a page. Call this when the page opens.
     * @param name A string that idenfities this item, unique within this HTML document. Default to document title.
     */
    startTrackPage(name?: string): void;

    /**
     * Logs how long a page was visible, after `startTrackPage`. Call this when the page closes.
     * @param name The string you used as the name in `startTrackPage`. Default to document title.
     * @param pageViewInfo Additional data for page view.
     */
    stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void;

    /**
     * Logs that a page was viewed.
     * @param pageViewInfo Data for page view.
     */
    trackPageView(pageViewInfo?: PageViewInfo): void;

    /**
     * Start timing an extended event. Call `stopTrackEvent` to log the event when it ends.
     * @param name A string that identifies this event uniquely within the document.
     */
    startTrackEvent(name: string): void;

    /**
     * Log an extended event that you started timing with `startTrackEvent`.
     * @param name The string you used to identify this event in `startTrackEvent`.
     * @param eventInfo Additional data for event.
     */
    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void;

    /**
     * Log a user action or other occurrence.
     * @param eventInfo Data for event.
     */
    trackEvent(eventInfo: EventInfo): void;

    /**
     * Flush to log/send data immediately.
     */
    flush(): void;
}

/**
 * The logger abstract class.
 */
export abstract class LoggerBase implements Logger {
    /**
     * Logs message or error with severity level.
     * @param logLevel The log level.
     * @param message Message string to log.
     * @param logInfo Optional parameters.
     */
    abstract log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void;

    /**
     * Logs that contain the most detailed messages.
     * @param message Message string to log.
     * @param logInfo Optional parameters.
     */
    trace(message: string | Error, logInfo?: LogInfo): void {
        this.log(LogLevel.Trace, message, logInfo);
    }

    /**
     * Logs that are used for interactive investigation during development.
     * @param message Message string to log.
     * @param logInfo Optional parameters.
     */
    debug(message: string, logInfo?: LogInfo): void {
        this.log(LogLevel.Debug, message, logInfo);
    }

    /**
     * Logs that track the general flow of the application. These logs should have long-term value.
     * @param message Message string to log.
     * @param logInfo Optional parameters.
     */
    info(message: string, logInfo?: LogInfo): void {
        this.log(LogLevel.Info, message, logInfo);
    }

    /**
     * Logs that highlight an abnormal or unexpected event in the application flow.
     * @param message Message string to log.
     * @param logInfo Optional parameters.
     */
    warn(message: string, logInfo?: LogInfo): void {
        this.log(LogLevel.Warn, message, logInfo);
    }

    /**
     * Logs that highlight when the current flow of execution is stopped due to a failure.
     * @param message Error description or exception object to log.
     * @param logInfo Optional parameters.
     */
    error(message: string | Error, logInfo?: LogInfo): void {
        this.log(LogLevel.Error, message, logInfo);
    }

    /**
     * Logs that describe an unrecoverable application or system crash.
     * @param message Error description or exception object to log.
     * @param logInfo Optional parameters.
     */
    fatal(message: string | Error, logInfo: LogInfo): void {
        this.log(LogLevel.Critical, message, logInfo);
    }

    /**
     * Starts timing how long the user views a page. Call this when the page opens.
     * @param name A string that idenfities this item, unique within this HTML document. Default to document title.
     */
    abstract startTrackPage(name?: string): void;

    /**
     * Logs how long a page was visible, after `startTrackPage`. Call this when the page closes.
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
     * Start timing an extended event. Call `stopTrackEvent` to log the event when it ends.
     * @param name A string that identifies this event uniquely within the document.
     */
    abstract startTrackEvent(name: string): void;

    /**
     * Log an extended event that you started timing with `startTrackEvent`.
     * @param name The string you used to identify this event in `startTrackEvent`.
     * @param eventInfo Additional data for event.
     */
    abstract stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void;

    /**
     * Log a user action or other occurrence.
     * @param eventInfo Data for event.
     */
    abstract trackEvent(eventInfo: EventInfo): void;

    /**
     * Flush to log/send data immediately.
     */
    abstract flush(): void;
}
