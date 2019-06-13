/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

/**
 * Defines logging severity levels.
 */
export enum LogLevel {
    /**
     * Logs that contain the most detailed messages.
     */
    Trace = 0,
    /**
     * Logs that are used for interactive investigation during development.
     */
    Debug = 1,
    /**
     * Logs that track the general flow of the application. These logs should have long-term value.
     */
    Info = 2,
    /**
     * Logs that highlight an abnormal or unexpected event in the application flow.
     */
    Warn = 3,
    /**
     * Logs that highlight when the current flow of execution is stopped due to a failure.
     */
    Error = 4,
    /**
     * Logs that describe an unrecoverable application or system crash.
     */
    Critical = 5,
    /**
     * Not used for writing log messages.
     */
    None = 6
}

/**
 * logging level string representation.
 */
export type LogLevelString = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'critical' | 'none';
