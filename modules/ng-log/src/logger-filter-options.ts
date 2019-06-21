/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { LogLevel } from './log-level';

/**
 * Rule used to filter log.
 */
export interface LoggerFilterRule {
    /**
     * The logger provider type.
     */
    providerName?: string;
    /**
     * The logger category this rule applies to.
     */
    categoryName?: string;
    /**
     * The minimum log level.
     */
    logLevel?: LogLevel;
    /**
     * The event tracking options.
     */
    event?: { [name: string]: boolean };
    /**
     * Enables or disables tracking page view.
     */
    pageView?: boolean;
}

/**
 * The logger filter options interface.
 */
export interface LoggerFilterOptions {
    /**
     * The minimum log level.
     */
    minLevel?: LogLevel;
    /**
     * The event tracking options.
     */
    event?: { [name: string]: boolean };
    /**
     * Enables or disables tracking page view.
     */
    pageView?: boolean;
    /**
     * Enables or disables setting authenticated user id.
     */
    userId?: boolean;
    /**
     * Rules used to filter log.
     */
    rules: LoggerFilterRule[];
}
