/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { LogLevel } from './log-level';
import { LoggerConfig, LoggerFilterOptions, LogLevelSection } from './logger-options';

export function parseConfig(config: LoggerFilterOptions | LoggerConfig): LoggerFilterOptions {
    const options: LoggerFilterOptions = { rules: [] };

    if (config.minLevel != null) {
        if (typeof config.minLevel === 'string') {
            options.minLevel = getSwitch(config.minLevel);
        } else if (typeof config.minLevel === 'number') {
            options.minLevel = config.minLevel;
        } else {
            throw new Error(`Invalid logging configuration, minLevel value '${config.minLevel}' is not supported.`);
        }
    }

    // If LoggerFilterOptions
    if (config.rules) {
        if (!Array.isArray(config.rules)) {
            throw new Error('Invalid logging configuration.');
        }

        return config as LoggerFilterOptions;
    }

    const loggerConfig = config as LoggerConfig;
    if (loggerConfig.logLevel) {
        loadRules(options, loggerConfig.logLevel, null);
    } else {
        Object.keys(loggerConfig)
            .forEach(key => {
                const section = loggerConfig[key];
                if (section != null && typeof section === 'object' && section.logLevel != null) {
                    const logLevelSection = section.logLevel;

                    if (typeof logLevelSection !== 'object') {
                        throw new Error('Invalid logging configuration.');
                    }

                    // Load logger specific rules
                    const loggerName = key;
                    loadRules(options, logLevelSection, loggerName);
                }
            });
    }

    return options;
}

function loadRules(
    options: LoggerFilterOptions,
    section: LogLevelSection,
    loggerName: string | null): void {
    Object.keys(section)
        .forEach(key => {
            const category = key === 'default' ? undefined : key;
            let logLevel: LogLevel | null | undefined;
            const value = section[key];
            if (value != null) {
                if (typeof value === 'string') {
                    logLevel = getSwitch(value);
                } else if (typeof value === 'number') {
                    logLevel = value;
                } else {
                    throw new Error(`Invalid logging configuration, logLevel value '${value}' is not supported.`);
                }
            }

            if (logLevel != null) {
                const newRule = { providerName: loggerName, categoryName: category, logLevel: logLevel };
                options.rules.push(newRule);
            }
        });
}

function getSwitch(value: string): LogLevel {
    switch (value) {
        case 'trace':
        case 'Trace':
            return LogLevel.Trace;
        case 'debug':
        case 'Debug':
            return LogLevel.Debug;
        case 'info':
        case 'Info':
            return LogLevel.Info;
        case 'warn':
        case 'Warn':
            return LogLevel.Warn;
        case 'error':
        case 'Error':
            return LogLevel.Error;
        case 'critical':
        case 'Critical':
            return LogLevel.Critical;
        case 'none':
        case 'None':
            return LogLevel.None;
        default:
            throw new Error(`Invalid logging configuration, logLevel value '${value}' is not supported.`);
    }
}
