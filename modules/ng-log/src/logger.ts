/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable:no-any

import { LogLevel } from './log-level';

/**
 * The logger interface.
 */
export interface Logger {
    isEnabled(logLevel: LogLevel): boolean;
    log(logLevel: LogLevel, message?: string | Error, ...optionalParams: any[]): void;
    trace(message?: string, ...optionalParams: any[]): void;
    debug(message: string, ...optionalParams: any[]): void;
    info(message: string, ...optionalParams: any[]): void;
    warn(message: string, ...optionalParams: any[]): void;
    error(message: string | Error, ...optionalParams: any[]): void;
}
