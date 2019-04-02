import { InjectionToken } from '@angular/core';

import { LogLevel, LogLevelString } from './log-level';
import { LoggerFilterRule } from './logger-filter-rule';

export interface LoggerConfig {
    minLevel?: LogLevel | LogLevelString | null;
    [key: string]: LogLevel | LogLevelString | object | null | undefined;
}

export interface LoggerFilterOptions {
    minLevel?: LogLevel | null;
    rules: LoggerFilterRule[];
}

export const LOGGER_CONFIG = new InjectionToken<LoggerConfig>('LoggerConfig');
export const LOGGER_FILTER_OPTIONS = new InjectionToken<LoggerFilterOptions>('LoggerFilterOptions');
