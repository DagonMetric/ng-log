/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { LogInfo } from './log-info';
import { LogLevel } from './log-level';

/**
 * The logging interface.
 */
export interface LoggingApi {
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
    fatal(message: string | Error, logInfo?: LogInfo): void;
}
