/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Injectable, InjectionToken } from '@angular/core';

import { EventInfo } from './event-info';
import { LogLevel } from './log-level';
import { LoggingApi } from './logging-api';
import { LoggingInfo } from './logging-info';
import { PageViewInfo } from './page-view-info';
import { TrackingApi } from './tracking-api';

export const LOGGER_CATEGORY_NAME = new InjectionToken<string>('LoggerCategoryName');

/**
 * The logger abstract class.
 */
@Injectable()
export abstract class Logger implements LoggingApi, TrackingApi {
    /**
     * Logs message or error with severity level.
     * @param logLevel The log level.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    abstract log(logLevel: LogLevel, message: string | Error, optionalParams?: LoggingInfo): void;

    /**
     * Logs that contain the most detailed messages.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    trace(message: string | Error, optionalParams?: LoggingInfo): void {
        this.log(LogLevel.Trace, message, optionalParams);
    }

    /**
     * Logs that are used for interactive investigation during development.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    debug(message: string, optionalParams?: LoggingInfo): void {
        this.log(LogLevel.Debug, message, optionalParams);
    }

    /**
     * Logs that track the general flow of the application. These logs should have long-term value.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    info(message: string, optionalParams?: LoggingInfo): void {
        this.log(LogLevel.Info, message, optionalParams);
    }

    /**
     * Logs that highlight an abnormal or unexpected event in the application flow.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    warn(message: string, optionalParams?: LoggingInfo): void {
        this.log(LogLevel.Warn, message, optionalParams);
    }

    /**
     * Logs that highlight when the current flow of execution is stopped due to a failure.
     * @param message Error description or exception object to log.
     * @param optionalParams Optional parameters.
     */
    error(message: string | Error, optionalParams?: LoggingInfo): void {
        this.log(LogLevel.Error, message, optionalParams);
    }

    /**
     * Logs that describe an unrecoverable application or system crash.
     * @param message Error description or exception object to log.
     * @param optionalParams Optional parameters.
     */
    fatal(message: string | Error, optionalParams: LoggingInfo): void {
        this.log(LogLevel.Critical, message, optionalParams);
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
    abstract stopTrackPage(name?: string, pageViewInfo?: PageViewInfo): void;

    /**
     * Logs that a page was viewed.
     * @param name The page's title. Default to document title.
     * @param pageViewInfo Data for page view.
     */
    abstract trackPageView(pageViewInfo: PageViewInfo & { name: string }): void;

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
    abstract stopTrackEvent(name: string, eventInfo?: EventInfo): void;

    /**
     * Log a user action or other occurrence.
     * @param name A string to identify this event.
     * @param eventInfo Data for event.
     */
    abstract trackEvent(eventInfo: EventInfo & { name: string }): void;

    /**
     * Flush to log/send data immediately.
     */
    abstract flush(): void;
}
