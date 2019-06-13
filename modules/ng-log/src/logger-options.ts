/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { InjectionToken } from '@angular/core';

import { LogLevel, LogLevelString } from './log-level';
import { LoggerFilterRule } from './logger-filter-rule';

export interface LogLevelSection {
    [key: string]: string | number | null;
}

export interface LoggerSection {
    logLevel: LogLevelSection;
}

export interface LoggerConfig {
    minLevel?: LogLevel | LogLevelString | null;
    logLevel?: LogLevelSection | null;
    [key: string]: LogLevel | LogLevelString | LogLevelSection | LoggerSection | null | undefined;
}

export interface LoggerFilterOptions {
    minLevel?: LogLevel | null;
    rules: LoggerFilterRule[];
}

export const LOGGER_CONFIG = new InjectionToken<LoggerConfig | LoggerFilterOptions>('LoggerConfig');
