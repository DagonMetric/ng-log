/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable:no-any

import { LogLevel } from './log-level';

import { TrackEventRequest } from './track-event-request';
import { TrackPageViewRequest } from './track-page-view-request';

/**
 * The logger interface.
 */
export interface Logger {
    /**
     * Logs message or error with severity level.
     * @param logLevel The log level.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    log(logLevel: LogLevel, message?: string | Error, ...optionalParams: any[]): void;

    /**
     * Logs that contain the most detailed messages.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    trace(message?: string, ...optionalParams: any[]): void;

    /**
     * Logs that are used for interactive investigation during development.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    debug(message: string, ...optionalParams: any[]): void;

    /**
     * Logs that track the general flow of the application. These logs should have long-term value.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    info(message: string, ...optionalParams: any[]): void;

    /**
     * Logs that highlight an abnormal or unexpected event in the application flow.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    warn(message: string, ...optionalParams: any[]): void;

    /**
     * Logs that highlight when the current flow of execution is stopped due to a failure.
     * @param message Error description or exception object to log.
     * @param optionalParams Optional parameters.
     */
    error(message: string | Error, ...optionalParams: any[]): void;

    /**
     * Logs that describe an unrecoverable application or system crash.
     * @param message Error description or exception object to log.
     * @param optionalParams Optional parameters.
     */
    fatal(message: string | Error, ...optionalParams: any[]): void;

    /**
     * Starts timing how long the user views a page. Call this when the page opens.
     * @param name A string that idenfities this item, unique within this HTML document. Defaults to the document title.
     */
    startTrackPage(name?: string): void;

    /**
     * Logs how long a page was visible, after `startTrackPage`. Call this when the page closes.
     * @param name The string you used as the name in `startTrackPage`. Defaults to the document title.
     * @param properties Additional data used to filter pages and metrics.
     */
    stopTrackPage(name?: string, properties?: TrackPageViewRequest): void;

    /**
     * Logs that a page was viewed.
     * @param name The page's title. Defaults to the document title.
     * @param properties Additional data used to filter pages and metrics.
     */
    trackPageView(name?: string, properties?: TrackPageViewRequest): void;

    /**
     * Start timing an extended event. Call `stopTrackEvent` to log the event when it ends.
     * @param name A string that identifies this event uniquely within the document.
     */
    startTrackEvent(name: string): void;

    /**
     * Log an extended event that you started timing with `startTrackEvent`.
     * @param name The string you used to identify this event in `startTrackEvent`.
     * @param properties Additional data for event.
     */
    stopTrackEvent(name: string, properties?: TrackEventRequest): void;

    /**
     * Log a user action or other occurrence.
     * @param name A string to identify this event.
     * @param properties Additional data for event.
     */
    trackEvent(name: string, properties?: TrackEventRequest): void;

    /**
     * Sets the authenticated user id and the account id in this session.
     * @param authenticatedUserId The authenticated user id.
     * @param accountId An optional string to represent the account associated with the authenticated user.
     */
    setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string): void;

    /**
     * Clears the authenticated user id and the account id from the user context.
     */
    clearAuthenticatedUserContext(): void;

    /**
     * Flush to send data immediately.
     */
    flush(): void;
}
