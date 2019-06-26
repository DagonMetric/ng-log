/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { LogLevel } from './log-level';
import { LoggingInfo } from './logging-info';

/**
 * The logging interface.
 */
export interface LoggingApi {
    /**
     * Logs message or error with severity level.
     * @param logLevel The log level.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    log(logLevel: LogLevel, message: string | Error, optionalParams?: LoggingInfo): void;

    /**
     * Logs that contain the most detailed messages.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    trace(message: string | Error, optionalParams?: LoggingInfo): void;

    /**
     * Logs that are used for interactive investigation during development.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    debug(message: string, optionalParams?: LoggingInfo): void;

    /**
     * Logs that track the general flow of the application. These logs should have long-term value.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    info(message: string, optionalParams?: LoggingInfo): void;

    /**
     * Logs that highlight an abnormal or unexpected event in the application flow.
     * @param message Message string to log.
     * @param optionalParams Optional parameters.
     */
    warn(message: string, optionalParams?: LoggingInfo): void;

    /**
     * Logs that highlight when the current flow of execution is stopped due to a failure.
     * @param message Error description or exception object to log.
     * @param optionalParams Optional parameters.
     */
    error(message: string | Error, optionalParams?: LoggingInfo): void;

    /**
     * Logs that describe an unrecoverable application or system crash.
     * @param message Error description or exception object to log.
     * @param optionalParams Optional parameters.
     */
    fatal(message: string | Error, optionalParams?: LoggingInfo): void;
}
